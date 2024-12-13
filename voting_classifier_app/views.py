# extraction vertically 
import fitz
from PIL import Image
import io
import re
import pandas as pd
from django.http import HttpResponse
from django.shortcuts import render
from collections import Counter
import cv2
import numpy as np
import time

from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials

# Azure Credentials
API_KEY = "AjGQ2JgRB5o3yCD2T32I4FuUbD5kb5NqEMaDvYb5q2fLUoWVcQCuJQQJ99ALACGhslBXJ3w3AAAEACOGERCw"
ENDPOINT = "https://election-ai.cognitiveservices.azure.com/"

computervision_client = ComputerVisionClient(ENDPOINT, CognitiveServicesCredentials(API_KEY))

def preprocess_image(image):
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    return thresh

def segment_image_into_columns(image, num_columns=3):
    """
    Splits the image into a specified number of vertical columns.
    Args:
        image: Input preprocessed image as a numpy array.
        num_columns: Number of vertical columns to divide the image into.
    Returns:
        List of image segments corresponding to each column.
    """
    height, width = image.shape[:2]
    column_width = width // num_columns
    segments = []

    for i in range(num_columns):
        segment = image[:, i * column_width:(i + 1) * column_width]
        segments.append(segment)

    return segments

def azure_ocr(image_data):
    # Perform OCR using Azure Computer Vision API
    response = computervision_client.read_in_stream(io.BytesIO(image_data), raw=True)
    operation_location = response.headers["Operation-Location"]
    operation_id = operation_location.split("/")[-1]

    # Poll for the result
    while True:
        result = computervision_client.get_read_result(operation_id)
        if result.status not in [OperationStatusCodes.running, OperationStatusCodes.not_started]:
            break
        time.sleep(1)

    # Extract text from the response
    extracted_text = ""
    if result.status == OperationStatusCodes.succeeded:
        for page in result.analyze_result.read_results:
            for line in page.lines:
                extracted_text += line.text + "\n"

    return extracted_text

def process_pdf_page(page, pdf_document):
    images = page.get_images(full=True)
    all_extracted_text = []
    page_text = ""

    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = pdf_document.extract_image(xref)
        image_data = base_image['image']

        # Resize and preprocess image
        image = Image.open(io.BytesIO(image_data))
        image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)
        processed_image = preprocess_image(image)

        # Convert processed image back to bytes
        _, buffer = cv2.imencode('.jpg', processed_image)
        processed_image_bytes = buffer.tobytes()

        # Use Azure OCR
        extracted_text = azure_ocr(processed_image_bytes)
        all_extracted_text.append(extracted_text)
        page_text += extracted_text

    return all_extracted_text, page_text

# extraction from left (top to bottom) to right (top to bottom) format
def process_pdf_page_column(page, pdf_document, num_columns=3):
    images = page.get_images(full=True)
    all_extracted_text = []
    page_text = ""

    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = pdf_document.extract_image(xref)
        image_data = base_image['image']

        # Resize and preprocess image
        image = Image.open(io.BytesIO(image_data))
        image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)
        processed_image = preprocess_image(image)

        # Segment the image into columns
        columns = segment_image_into_columns(processed_image, num_columns)

        # Extract text from each column in order (left, middle, right)
        for column in columns:
            _, buffer = cv2.imencode('.jpg', column)
            column_image_bytes = buffer.tobytes()
            extracted_text = azure_ocr(column_image_bytes)
            all_extracted_text.append(extracted_text)
            page_text += extracted_text + "\n"

    return all_extracted_text, page_text

def process_text(all_extracted_text):
    combined_text = '\n'.join(all_extracted_text)
    replacements = {
        "Gender ;": "Gender:",
        "Nam:": "Name:",
        "amo:": "Name:",
        "Tamo:": "Name:",
        "Narme:": "Name:",
        "Narme": "Name:",
        "Tamo": "Name:",
        "Nama:": "Name:",
        "Name": "Name:",
        "Namo": "Name:",
        "Nomo": "Name:",
        "Nome": "Name:",
        "Photo": ""
    }
    # Perform the replacements
    modified_text = combined_text
    for old, new in replacements.items():
        modified_text = modified_text.replace(old, new)

    cleaned_text = re.sub(r"[^\w\s:’,#]", "", modified_text)

    pattern = r"((Name:\s*|Father's Name:\s*|Husband's Name:\s*|Mother's Name:\s*|Others:\s*|House Number:\s*|Age:\s*|Name:\s*).*?)(?=(Name:\s*|Father's Name:\s*|Husband's Name:\s*|Mother's Name:\s*|Others:\s*|House Number:\s*|Age:\s*|Name:|$))"
    result_text = re.sub(pattern, r'\1\n', cleaned_text)
    return result_text


def process_names(result_text):
    regex_name = r"(?i)^[‘']?\s*(?:Name|Nam|Name:|Name\s*:|amo\s*:)#?\s*[‘']?\s*:?[\W_]*\s*([^‘']+?)(?:\s*[‘']|$)"
    name_matches = re.findall(regex_name, result_text, re.MULTILINE)

    # Initialize the extracted names list
    extracted_names = []
    lines = result_text.splitlines()

    # To track the last two lines for "Husbands Name" and "Mothers Name"
    previous_lines = []

    for line in lines:
        # Track only the last lines for checking specific names
        previous_lines.append(line)
        if len(previous_lines) > 2:
            previous_lines.pop(0)

        # Check if any of the previous lines contain "Fathers Name", "Mothers Name", etc.
        if any(
            re.search(r"(Husband'?s?|Father'?s?|Mother'?s?|Other'?s?)\s*Name?", prev_line, re.IGNORECASE)
            for prev_line in previous_lines
        ):
            continue  # Skip processing if condition is met in any previous line

        # Check if "Father" or "Mother" appears in any of the previous lines
        if any(re.search(r"\b(Father|Mother)\b", prev_line, re.IGNORECASE) for prev_line in previous_lines):
            continue  # Skip processing this line if the condition is met

        # Process lines that contain "Name:" or "Name"
        if "Name:" in line or "Name" in line or "Nama" in line or "Nama:" in line or "Nam:" in line or "Nam" in line or "amo:" in line or "amo" in line:
            # Match and extract names from the current line
            for name in name_matches:
                if name in line:
                    # Split name on double spaces, commas, or # symbol
                    split_names = re.split(r"\s{2,}|,\s*|#", name)
                    for split_name in split_names:
                        split_name = split_name.strip()
                        # Check if the split_name is not a substring of any previously added names
                        if split_name and not any(split_name in existing_name or existing_name in split_name for existing_name in extracted_names):
                            extracted_names.append(split_name)

    return extracted_names


def upload_file(request):
    if request.method == 'POST' and request.FILES.getlist('pdf_files'):
        pdf_files = request.FILES.getlist('pdf_files')

        state_list = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
            'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
            'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
            'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR', 'CHHATTISGARH', 'GOA', 'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH',
            'JHARKHAND', 'KARNATAKA', 'KERALA', 'MADHYA PRADESH', 'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND', 'ODISHA',
            'PUNJAB', 'RAJASTHAN', 'SIKKIM', 'TAMIL NADU', 'TELANGANA', 'TRIPURA', 'UTTAR PRADESH', 'UTTARAKHAND', 'WEST BENGAL',
            'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 
            'Puducherry', 'Ladakh', 'Lakshadweep', 'Jammu and Kashmir'
        ]


        district_list = [
            "Sangli", "Satara", "Solapur", "Kolhapur", "Pune", "Akola", "Amravati", "Buldhana",
            "Yavatmal", "Washim", "Aurangabad", "Beed", "Jalna", "Dharashiv", "Nanded", "Latur",
            "Parbhani", "Hingoli", "Bhandara", "Chandrapur", "Gadchiroli", "Gondia", "Nagpur",
            "Wardha", "Ahmednagar", "Dhule", "Jalgaon", "Nandurbar", "Nashik", "Mumbai City",
            "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg",
            "SANGLI", "SATARA", "SOLAPUR", "KOLHAPUR", "PUNE", "AKOLA", "AMRAVATI", "BULDHANA",
            "YAVATMAL", "WASHIM", "AURANGABAD", "BEED", "JALNA", "DHARASHIV", "NANDED", "LATUR",
            "PARBHANI", "HINGOLI", "BHANDARA", "CHANDRAPUR", "GADCHIROLI", "GONDIA", "NAGPUR",
            "WARDHA", "AHMEDNAGAR", "DHULE", "JALGAON", "NANDURBAR", "NASHIK", "MUMBAI CITY",
            "MUMBAI SUBURBAN", "THANE", "PALGHAR", "RAIGAD", "RATNAGIRI", "SINDHUDURG",
            "Bengaluru Urban", "Belagavi", "Bijapur", "Bagalkot", "Dakshina Kannada", "Chitradurga",
            "Chikkamagaluru", "Tumakuru", "Hassan", "Udupi", "Kodagu", "Kolar", "Ramanagara", "Shivamogga", "Davanagere",
            "Raichur", "Bagalkot", "Gadag", "Bidar", "Yadgir", "Koppal", "Chikkaballapura", "Chamarajanagar",
            "Kalaburagi", "Mysuru", "Uttara Kannada", "Haveri", "Mandya", "Chandrapur", "East Godavari", "West Godavari",
            "Visakhapatnam", "Srikakulam", "Vijayawada", "Guntur", "Krishna", "Prakasam", "Kurnool", "Anantapur",
            "Chittoor", "Kadapa", "Nellore", "Mahabubnagar", "Khammam", "Warangal", "Nizamabad", "Medak",
            "Hyderabad", "Karimnagar", "Adilabad", "Rangareddy", "Nalgonda", "Suryapet", "Miryalaguda", "Kurnool",
            "Palakkad", "Kochi", "Ernakulam", "Alappuzha", "Idukki", "Pathanamthitta", "Kottayam", "Thrissur",
            "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasargod", "Thiruvananthapuram", "Chennai", "Coimbatore",
            "Tiruppur", "Trichy", "Madurai", "Erode", "Sivagangai", "Vellore", "Thanjavur", "Salem", "Ramanathapuram",
            "Cuddalore", "Nagapattinam", "Dindigul", "Tirunelveli", "Virudhunagar", "Tiruppur", "Tiruvannamalai",
            "Kanchipuram", "Ramanathapuram", "Nagapattinam", "Sivagangai", "Vellore", "Puducherry", "Andaman and Nicobar Islands",
            "Lakshadweep", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Jammu", "Srinagar", "Kashmir",
            "Leh", "Ladakh", "Puducherry"
        ]


        taluka_list = [
            "KANKAVLI", "VAIBHAVWADI", "DEVGAD", "MALWAN", "SAWANTWADI", "KUDAL", "VENGURLA", "DODAMARG", "RATNAGIRI",
            "SANGAMESHWAR", "LANJA", "RAJAPUR", "CHIPLUN", "GUHAGAR", "DAPOLI", "MANDANGAD", "PEN", "ALIBAG",
            "MURUD", "PANVEL", "URAN", "KARJAT", "KHALAPUR", "MANGAON", "TALA", "ROHA", "SUDHAGAD-PALI",
            "POLADPUR", "SHRIVARDHAN", "MHASALA", "KURLA", "ANDHERI", "BORIVALI", "THANE", "KALYAN", "MURBAD", "BHIWANDI",
            "SHAHAPUR", "ULHASNAGAR", "AMBARNATH", "PALGHAR", "VASAI", "DAHANU", "TALASARI", "JAWHAR", "MOKHADA", "VADA",
            "VIKRAMGAD", "NASHIK", "IGATPURI", "DINDORI", "TRIMBAKESHWAR", "KALWAN", "DEOLA", "SURGANA", "BAGLAN",
            "MALEGAON", "NANDGAON", "CHANDWAD", "NIPHAD", "SINNAR", "YEOLA", "NANDURBAR", "NAVAPUR", "SHAHADA", "TALODE",
            "AKKALKUWA", "DHADGAON", "DHULE", "SAKRI", "SINDKHEDA", "SHIRPUR", "JALGAON", "JAMNER", "ERANDOL", "DHARANGAON",
            "BHUSAWAL", "RAVER", "MUKTAINAGAR", "BODWAD", "YAWAL", "AMALNER", "PAROLA", "CHOPDA", "PACHORA", "BHADGAON",
            "CHALISGAON", "BULDHANA", "CHIKHLI", "DEULGAON RAJA", "JALGAON JAMOD", "SANGRAMPUR", "MALKAPUR", "MOTALA",
            "NANDURA", "KHAMGAON", "SHEGAON", "MEHKAR", "SINDKHED RAJA", "LONAR", "AKOLA", "AKOT", "TELHARA", "BALAPUR",
            "PATUR", "MURTAJAPUR", "BARSHITAKLI", "WASHIM", "MALEGAON", "RISOD", "MANGRULPIR", "KARANJA", "MANORA",
            "AMRAVATI", "BHATUKALI", "NANDGAON KHANDESHWAR", "DHARNI", "CHIKHALDARA", "ACHALPUR", "CHANDURBAZAR", "MORSHI",
            "WARUD", "DARYAPUR", "ANJANGAON-SURJI", "CHANDUR", "DHAMANGAON", "TIOSA", "WARDHA", "DEOLI", "SELOO", "ARVI",
            "ASHTI", "KARANJA", "HINGANGHAT", "SAMUDRAPUR", "NAGPUR URBAN", "NAGPUR RURAL", "KAMPTEE", "HINGNA", "KATOL",
            "NARKHED", "SAVNER", "KALAMESHWAR", "RAMTEK", "MOUDA", "PARSEONI", "UMRED", "KUHI", "BHIWAPUR", "BHANDARA",
            "TUMSAR", "PAUNI", "MOHADI", "SAKOLI", "LAKHANI", "LAKHANDUR", "GONDIA", "GOREGAON", "SALEKASA", "TIRODA",
            "AMGAON", "DEORI", "ARJUNI-MORGAON", "SADAK-ARJUNI", "GADCHIROLI", "DHANORA", "CHAMORSHI", "MULCHERA",
            'DESAIGANJ', 'ARMORI', 'KURKHEDA', 'KORCHI', 'AHERI', 'ETAPALLI', 'BHAMRAGAD', 'SIRONCHA', 'CHANDRAPUR',
            'SAOLI', 'MUL', 'BALLARPUR', 'POMBHURNA', 'GONDPIMPRI', 'WARORA', 'CHIMUR', 'BHADRAVATI', 'BRAMHAPURI',
            'NAGBHID', 'SINDEWAHI', 'RAJURA', 'KORPANA', 'JIWATI', 'YAVATMAL', 'ARNI', 'BABHULGAON', 'KALAMB', 'DARWHA',
            'DIGRAS', 'NER', 'PUSAD', 'UMARKHED', 'MAHAGAON', 'KELAPUR', 'RALEGAON', 'GHATANJI', 'WANI', 'MAREGAON',
            'ZARI JAMANI', 'NANDED', 'ARDHAPUR', 'MUDKHED', 'BHOKAR', 'UMRI', 'LOHA', 'KANDHAR', 'KINWAT', 'HIMAYATNAGAR',
            "HADGAON", "MAHUR", "DEGLUR", "MUKHED", "DHARMABAD", "BILOLI", "NAIGAON", "HINGOLI", "SENGAON", "KALAMNURI",
            "BASMATH", "AUNDHA NAGNATH", "PARBHANI", "SONPETH", "GANGAKHED", "PALAM", "PURNA", "SAILU", "JINTUR", "MANWATH",
            "PATHRI", "JALNA", "BHOKARDAN", "JAFRABAD", "BADNAPUR", "AMBAD", "GHANSAWANGI", "PARTUR", "MANTHA", "AURANGABAD",
            "KANNAD", "SOEGAON", "SILLOD", "PHULAMBRI", "KHULDABAD", "VAIJAPUR", "GANGAPUR", "PAITHAN", "BEED", "ASHTI",
            "PATODA", "SHIRUR-KASAR", "GEORAI", "MAJALGAON", "WADWANI", "KAIJ", "DHARUR", "PARLI", "AMBAJOGAI", "LATUR",
            "RENAPUR", "AUSA", "AHMEDPUR", "JALKOT", "CHAKUR", "SHIRUR ANANTPAL", "NILANGA", "DEONI", "UDGIR", "OSMANABAD",
            "TULJAPUR", "BHUM", "PARANDA", "WASHI", "KALAMB", "LOHARA", "UMARGA", "SOLAPUR NORTH", "BARSHI", "SOLAPUR SOUTH",
            "AKKALKOT", "MADHA", "KARMALA", "PANDHARPUR", "MOHOL", "MALSHIRAS", "SANGOLE", "MANGALVEDHE", "NAGAR", "SHEVGAON",
            "PATHARDI", "PARNER", "SANGAMNER", "KOPARGAON", "AKOLE", "SHRIRAMPUR", "NEVASA", "RAHATA", "RAHURI", "SHRIGONDA",
            "KARJAT", "JAMKHED", "PUNE CITY", "HAVELI", "KHED", "JUNNAR", "AMBEGAON", "MAVAL", "MULSHI", "SHIRUR", "PURANDHAR",
            "VELHE", "BHOR", "BARAMATI", "INDAPUR", "DAUND", "SATARA", "JAOLI", "KOREGAON", "WAI", "MAHABALESHWAR", "KHANDALA",
            "PHALTAN", "MAAN", "KHATAV", "PATAN", "KARAD", "MIRAJ", "KAVATHEMAHANKAL", "TASGAON", "JAT", "WALWA", "SHIRALA",
            "KHANAPUR", "ATPADI", "PALUS", "KADEGAON", "KARVIR", "PANHALA", "SHAHUWADI", "KAGAL", "HATKANANGALE", "SHIROL",
            "RADHANAGARI", "GAGANBAWADA", "BHUDARGAD", "GADHINGLAJ", "CHANDGAD", "AJRA", "PETH", "KHED", "MAHAD", "JALANA"]


        filtered_taluka_list = [taluka for taluka in taluka_list if taluka not in district_list]

        try:
            all_data = []
            district_count = {district: 0 for district in district_list}

            for pdf_file in pdf_files:
                with open(f'uploaded_{pdf_file.name}', 'wb+') as destination:
                    for chunk in pdf_file.chunks():
                        destination.write(chunk)

                pdf_file_path = f'uploaded_{pdf_file.name}'

                pdf_document = fitz.open(pdf_file_path)

                all_extracted_text = []
                polling_station = ""
                address_station = ""
                taluka = ""
                district = ""
                state = ""
                extracted_district = ""
                constituency_name = ""
                part_no = ""
                page_text = ""
                countPage = 0

                for page_num in range(pdf_document.page_count):
                    page = pdf_document[page_num]

                    if page_num < 2:  # First two pages (0-indexed: page 0 and 1)
                        page_extracted_text, full_page_text = process_pdf_page(page, pdf_document)
                    else:  # From the 3rd page onward
                        page_extracted_text, full_page_text = process_pdf_page_column(page, pdf_document, num_columns=3)

                    all_extracted_text.extend(page_extracted_text)
                    page_text += full_page_text

                    if page_num == 0:

                        constituency_pattern = r"Assembly Constituency\s*:\s*(\d+\s*-\s*[A-Z\s]+)(?=\s*\()"
                        match = re.search(constituency_pattern, page_text)
                        if match:
                            constituency_name = match.group(1).strip()
                        # else:
                        #     print('Constituency name not found in the first page')
                        
                        district = None

                        for district_name in district_list:
                            count = page_text.count(district_name)
                            if count > district_count[district_name]:
                                district_count[district_name] = count
                                district = district_name

                        pattern = r"No\. and Name of Polling Station\s*:\s*(.*?)\s*Address of Polling Station\s*:\s*(.*?)(?=(Number of Auxiliary Polling|4, NUMBER OF ELECTORS|$))"
                        match = re.search(pattern, page_text, re.DOTALL)
                        if match:
                            polling_station = match.group(1).strip()
                            address_station = match.group(2).strip()

                        pattern_details = (
                            r"Main Town or Village\s*:\s*(.*?)\s*"
                            r"Police Station\s*:\s*(.*?)\s*"
                            r"Taluka\s*:\s*(.*?)\s*"
                            r"District\s*:\s*(.*?)(?=(Main Town or Village|Police Station|Taluka|District|$))"
                        )
                        match_details = re.search(pattern_details, page_text, re.DOTALL)
                        if match_details:
                            main_town_village = match_details.group(1).strip()
                            police_station = match_details.group(2).strip()
                            taluka = match_details.group(3).strip()
                            extracted_district = match_details.group(4).strip()

                            if not district:
                                district = extracted_district

                        district_pattern = r"District\s*:\s*(\w+)"

                        district_match = re.search(district_pattern, page_text)

                        if district_match:
                            district_name_after_district_word = district_match.group(1).strip()
                            if district_name_after_district_word in district_list:
                                district = district_name_after_district_word
                        else:
                            district_counts = Counter()
                            for district_name in district_list:
                                district_counts[district_name] = page_text.count(district_name)

                            if district_counts:
                                district = district_counts.most_common(1)[0][0]
                            else:
                                district = None

                        for taluka_name in filtered_taluka_list:
                            pattern = r'\b' + re.escape(taluka_name) + r'\b'
                            if re.search(pattern, page_text):
                                taluka = taluka_name
                                break

                        if not taluka:
                            taluka = extracted_district
                            if not district and extracted_district in district_list:
                                district = extracted_district

                        state = None
                        for state_name in state_list:
                            if state_name in page_text:
                                state = state_name
                                break

                        part_no_pattern = r"Part No\.?\s*:\s*(\d+)"
                        match = re.search(part_no_pattern, full_page_text)
                        if match:
                            part_no = match.group(1).strip()
                        else:
                            countPage = 1

                    # Extract part number from the second page (page_num == 1)
                    if page_num == 1:
                        if countPage == 1 :
                            part_no_pattern = r"Part No\.?\s*:\s*(\d+)"
                            match = re.search(part_no_pattern, full_page_text)
                            if match:
                                part_no = match.group(1).strip()
                            # else:
                            #     print('Part number not found on the second page')

                result_text = process_text(all_extracted_text)

                # Process result_text
                unwanted_phrases = [
                    "Type of Polling Station General",
                    "(Male/Female/General)",
                    "Number of Auxiliary Polling 0",
                    "Stations in this part :",
                    "Stations in this pai",
                    "Stations in this pari"
                ]

                def remove_unwanted_phrases(text, phrases):
                    for phrase in phrases:
                        text = text.replace(phrase, "").strip()
                    return text

                def remove_unwanted_words(text, words):
                    words_in_text = text.split()
                    filtered_words = [word for word in words_in_text if word not in words]
                    return " ".join(filtered_words)

                def remove_after_number_of(text):
                    # Find the index where "Number OF" appears
                    index = text.find("4. NUMBER OF")
                    if index != -1:
                        # Keep the text before "Number OF"
                        text = text[:index].strip()
                    return text

                def clean_town_or_village(text):
                    text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
                    return text.strip()

                # Extract details using regex
                regex_parent_name = r"(?:Father's|Fathers|Fathors|Husband's|Husbands|Mother's|Mothers) (?:Name|NName)[: ]+([\w\s]+)|Others[: ]+([\w\s]+)"
                parent_names = [name.strip().split('House')[0].split('Houso')[0] for match in re.findall(regex_parent_name, result_text) for name in match if name]

                pattern_house_till_available = r"H[oa0]us[e3o]? [Nn]um[b8][eo]r.*?[Aa4]va[il]l[ao]b[il][oe]"

                house_till_available = re.findall(pattern_house_till_available, result_text, re.DOTALL)

                # Regular expressions to extract house number, age, and gender
                house_number_pattern = r"[Hh]o?u?s?[e3o]?[-\s]*[Nn]um[b8][eo]r\s*[:\-]?\s*([\w\s,]+)"
                age_pattern = r"Ag[eo]\s*[:\-]?\s*(\d+)"  # Match age
                gender_pattern = r"G[aeo]nd[aeo]r\s*[:\-]?\s*(\w+)"  # Match gender

                house_numbers = []
                ages = []
                genders = []

                # Extract the house number, age, and gender from each match
                for match in house_till_available:
                    house_number = re.search(house_number_pattern, match)
                    age = re.search(age_pattern, match)
                    gender = re.search(gender_pattern, match)
                    
                    # Append the found data or empty string if not found
                    if house_number:
                        extracted_house_number = house_number.group(1)
                        cleaned_house_number = re.sub(r'\b(Age|Ago)\b', '', extracted_house_number).strip()
                        house_numbers.append(cleaned_house_number)
                    else:
                        house_numbers.append("")

                    ages.append(age.group(1) if age else "")
                    # genders.append(gender.group(1) if gender else "")
                        # Check gender and map accordingly
                    if gender:
                        gender_str = gender.group(1)
                        if gender_str.startswith("M"):
                            genders.append("Male")
                        elif gender_str.startswith("F"):
                            genders.append("Female")
                        else:
                            genders.append(gender_str)
                    else:
                        genders.append("")

                regex_name = r"(?<!Husbands\s)(?<!Fathers\s)(?<!Mothers\s)(Name: :|Vame :)\s*(.*?)(?=\n|$)"

                names = [
                    match[1].strip()
                    for match in re.findall(regex_name, result_text)
                    if not match[1].strip()[0].isdigit()  # Skip if the first character is a digit
                ]
                
                # Adjusted regex to handle spaces within voter IDs
                regex_serial_voter_id = r"(?:(\d+)\s+)?((?:[A-Z]+\s?\d{1,12})|(?:\d[A-Z]+\d+))"

                serial_voter_ids = re.findall(regex_serial_voter_id, result_text)
                valid_serial_voter_ids = [
                    (serial.strip() if serial else '', voter_id.replace(" ", ""))
                    for serial, voter_id in serial_voter_ids
                    if re.search(r'[A-Za-z]', voter_id)  # Contains alphabets
                    and re.search(r'\d', voter_id)       # Contains numbers
                    and len(voter_id.replace(" ", "")) >= 8  # Length >= 8
                    and len(re.findall(r'[A-Za-z]', voter_id)) <= 4  # Max 3 alphabets
                    and len(re.findall(r'\d', voter_id)) > 4 # Min 5 digits
                    and not re.match(r'NO\s+\d+', voter_id)  # Skip "NO <number>"
                    and len(re.findall(r'[A-Za-z]', voter_id)) != len(re.findall(r'\d', voter_id))  # Skip if alphabets == digits
                ]

                # Extracting serial numbers and voter IDs
                serial_numbers = [serial for serial, _ in valid_serial_voter_ids]
                voter_ids = [voter_id for _, voter_id in valid_serial_voter_ids]

                polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
                address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

                unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

                polling_station = remove_unwanted_words(polling_station, unwanted_words)
                address_station = remove_unwanted_words(address_station, unwanted_words)
                
                address_station = remove_after_number_of(address_station)

                polling_station = clean_town_or_village(polling_station)

                if part_no:
                    address_station = f"{part_no} - {address_station}"

                result_array = polling_station.split(" - ")

                if len(result_array) > 1:
                    string_part = result_array[1]
                else:
                    string_part = result_array[0]  

                # Ensure lists have the same length
                max_length = max(len(serial_numbers), len(voter_ids), len(names), len(parent_names), len(house_numbers), len(ages), len(genders))

                serial_numbers += [""] * (max_length - len(serial_numbers))
                voter_ids += [""] * (max_length - len(voter_ids))
                names += [""] * (max_length - len(names))
                parent_names += [""] * (max_length - len(parent_names))
                house_numbers += [""] * (max_length - len(house_numbers))
                ages += [""] * (max_length - len(ages))
                genders += [""] * (max_length - len(genders))

                # Create DataFrame
                df = pd.DataFrame({
                    'Serial No': serial_numbers,
                    'Voter Id': voter_ids,
                    'Name': names,
                    'Parent Name': parent_names,
                    'House Number': house_numbers,
                    'Age': ages,
                    'Gender': genders,
                    'Town or Village': [string_part] * max_length,
                    'Address of Polling Station': [address_station] * max_length,
                    'Taluka': [taluka] * max_length,
                    'District': [district] * max_length,
                    'State': [state] * max_length,
                    'Constituency Name': [constituency_name] * max_length,
                })

                all_data.append(df)

            combined_df = pd.concat(all_data, ignore_index=True)
            combined_df.index = range(1, len(combined_df) + 1)
            combined_df['Age'] = pd.to_numeric(combined_df['Age'], errors='coerce')

            response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename="extracted_data.xlsx"'
            combined_df.to_excel(response, index_label='Record_ID')

            return response
        
        except Exception as e:
            import traceback
            error_message = f"Error processing PDFs: {e}\n{traceback.format_exc()}"
            return render(request, 'upload_file.html', {'error_message': error_message})

    return render(request, 'upload_file.html')