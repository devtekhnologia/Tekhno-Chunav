# import fitz
# from PIL import Image
# import io
# import re
# import pandas as pd
# from django.http import HttpResponse
# from django.shortcuts import render
# from collections import Counter
# import cv2
# import numpy as np
# import time

# from azure.cognitiveservices.vision.computervision import ComputerVisionClient
# from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
# from msrest.authentication import CognitiveServicesCredentials


# # Azure Credentials
# API_KEY = "AjGQ2JgRB5o3yCD2T32I4FuUbD5kb5NqEMaDvYb5q2fLUoWVcQCuJQQJ99ALACGhslBXJ3w3AAAEACOGERCw"
# ENDPOINT = "https://election-ai.cognitiveservices.azure.com/"

# computervision_client = ComputerVisionClient(ENDPOINT, CognitiveServicesCredentials(API_KEY))

# def preprocess_image(image):
#     gray = cv2.cvtColor(np.array(image), cv2.COLOR_BGR2GRAY)
#     blur = cv2.GaussianBlur(gray, (5, 5), 0)
#     # Apply adaptive thresholding
#     thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
#     return thresh

# def azure_ocr(image_data):
#     # Perform OCR using Azure Computer Vision API
#     response = computervision_client.read_in_stream(io.BytesIO(image_data), raw=True)
#     operation_location = response.headers["Operation-Location"]
#     operation_id = operation_location.split("/")[-1]

#     # Poll for the result
#     while True:
#         result = computervision_client.get_read_result(operation_id)
#         if result.status not in [OperationStatusCodes.running, OperationStatusCodes.not_started]:
#             break
#         time.sleep(1)

#     # Extract text from the response
#     extracted_text = ""
#     if result.status == OperationStatusCodes.succeeded:
#         for page in result.analyze_result.read_results:
#             for line in page.lines:
#                 extracted_text += line.text + "\n"

#     return extracted_text

# def process_pdf_page(page, pdf_document):
#     images = page.get_images(full=True)
#     all_extracted_text = []
#     page_text = ""

#     for img_index, img in enumerate(images):
#         xref = img[0]
#         base_image = pdf_document.extract_image(xref)
#         image_data = base_image['image']

#         # Resize and preprocess image
#         image = Image.open(io.BytesIO(image_data))
#         image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)
#         processed_image = preprocess_image(image)

#         # Convert processed image back to bytes
#         _, buffer = cv2.imencode('.jpg', processed_image)
#         processed_image_bytes = buffer.tobytes()

#         # Use Azure OCR
#         extracted_text = azure_ocr(processed_image_bytes)
#         all_extracted_text.append(extracted_text)
#         page_text += extracted_text

#     return all_extracted_text, page_text

# def process_text(all_extracted_text):
#     combined_text = '\n'.join(all_extracted_text)
#     replacements = {
#         "Gender ;": "Gender:",
#         "Nam:": "Name:",
#         "amo:": "Name:",
#         "Tamo:": "Name:",
#         "Narme:": "Name:",
#         "Narme": "Name:",
#         "Tamo": "Name:",
#         "Nama:": "Name:",
#         "Name": "Name:",
#         "Namo": "Name:",
#         "Nomo": "Name:",
#         "Nome": "Name:",
#         "Photo": ""
#     }
#     # Perform the replacements
#     modified_text = combined_text
#     for old, new in replacements.items():
#         modified_text = modified_text.replace(old, new)

#     cleaned_text = re.sub(r"[^\w\s:’,#]", "", modified_text)

#     pattern = r"((Name:\s*|Father's Name:\s*|Husband's Name:\s*|Mother's Name:\s*|Others:\s*|House Number:\s*|Age:\s*|Name:\s*).*?)(?=(Name:\s*|Father's Name:\s*|Husband's Name:\s*|Mother's Name:\s*|Others:\s*|House Number:\s*|Age:\s*|Name:|$))"
#     result_text = re.sub(pattern, r'\1\n', cleaned_text)
#     # print('result_text', result_text)
#     return result_text


# def process_names(result_text):
#     regex_name = r"(?i)^[‘']?\s*(?:Name|Nam|Name:|Name\s*:|amo\s*:)#?\s*[‘']?\s*:?[\W_]*\s*([^‘']+?)(?:\s*[‘']|$)"
#     name_matches = re.findall(regex_name, result_text, re.MULTILINE)

#     # Initialize the extracted names list
#     extracted_names = []
#     lines = result_text.splitlines()

#     # To track the last two lines for "Husbands Name" and "Mothers Name"
#     previous_lines = []

#     for line in lines:
#         # Track only the last lines for checking specific names
#         previous_lines.append(line)
#         if len(previous_lines) > 2:
#             previous_lines.pop(0)

#         # Check if any of the previous lines contain "Fathers Name", "Mothers Name", etc.
#         if any(
#             re.search(r"(Husband'?s?|Father'?s?|Mother'?s?|Other'?s?)\s*Name?", prev_line, re.IGNORECASE)
#             for prev_line in previous_lines
#         ):
#             continue  # Skip processing if condition is met in any previous line

#         # Check if "Father" or "Mother" appears in any of the previous lines
#         if any(re.search(r"\b(Father|Mother)\b", prev_line, re.IGNORECASE) for prev_line in previous_lines):
#             continue  # Skip processing this line if the condition is met

#         # Process lines that contain "Name:" or "Name"
#         if "Name:" in line or "Name" in line or "Nama" in line or "Nama:" in line or "Nam:" in line or "Nam" in line or "amo:" in line or "amo" in line:
#             # Match and extract names from the current line
#             for name in name_matches:
#                 if name in line:
#                     # Split name on double spaces, commas, or # symbol
#                     split_names = re.split(r"\s{2,}|,\s*|#", name)
#                     for split_name in split_names:
#                         split_name = split_name.strip()
#                         # Check if the split_name is not a substring of any previously added names
#                         if split_name and not any(split_name in existing_name or existing_name in split_name for existing_name in extracted_names):
#                             extracted_names.append(split_name)

#     return extracted_names


# def upload_file(request):
#     if request.method == 'POST' and request.FILES.getlist('pdf_files'):
#         pdf_files = request.FILES.getlist('pdf_files')

#         state_list = [
#             'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
#             'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
#             'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
#             'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR', 'CHHATTISGARH', 'GOA', 'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH',
#             'JHARKHAND', 'KARNATAKA', 'KERALA', 'MADHYA PRADESH', 'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND', 'ODISHA',
#             'PUNJAB', 'RAJASTHAN', 'SIKKIM', 'TAMIL NADU', 'TELANGANA', 'TRIPURA', 'UTTAR PRADESH', 'UTTARAKHAND', 'WEST BENGAL',
#             'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 
#             'Puducherry', 'Ladakh', 'Lakshadweep', 'Jammu and Kashmir'
#         ]


#         district_list = [
#             "Sangli", "Satara", "Solapur", "Kolhapur", "Pune", "Akola", "Amravati", "Buldhana",
#             "Yavatmal", "Washim", "Aurangabad", "Beed", "Jalna", "Dharashiv", "Nanded", "Latur",
#             "Parbhani", "Hingoli", "Bhandara", "Chandrapur", "Gadchiroli", "Gondia", "Nagpur",
#             "Wardha", "Ahmednagar", "Dhule", "Jalgaon", "Nandurbar", "Nashik", "Mumbai City",
#             "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg",
#             "SANGLI", "SATARA", "SOLAPUR", "KOLHAPUR", "PUNE", "AKOLA", "AMRAVATI", "BULDHANA",
#             "YAVATMAL", "WASHIM", "AURANGABAD", "BEED", "JALNA", "DHARASHIV", "NANDED", "LATUR",
#             "PARBHANI", "HINGOLI", "BHANDARA", "CHANDRAPUR", "GADCHIROLI", "GONDIA", "NAGPUR",
#             "WARDHA", "AHMEDNAGAR", "DHULE", "JALGAON", "NANDURBAR", "NASHIK", "MUMBAI CITY",
#             "MUMBAI SUBURBAN", "THANE", "PALGHAR", "RAIGAD", "RATNAGIRI", "SINDHUDURG",
#             "Bengaluru Urban", "Belagavi", "Bijapur", "Bagalkot", "Dakshina Kannada", "Chitradurga",
#             "Chikkamagaluru", "Tumakuru", "Hassan", "Udupi", "Kodagu", "Kolar", "Ramanagara", "Shivamogga", "Davanagere",
#             "Raichur", "Bagalkot", "Gadag", "Bidar", "Yadgir", "Koppal", "Chikkaballapura", "Chamarajanagar",
#             "Kalaburagi", "Mysuru", "Uttara Kannada", "Haveri", "Mandya", "Chandrapur", "East Godavari", "West Godavari",
#             "Visakhapatnam", "Srikakulam", "Vijayawada", "Guntur", "Krishna", "Prakasam", "Kurnool", "Anantapur",
#             "Chittoor", "Kadapa", "Nellore", "Mahabubnagar", "Khammam", "Warangal", "Nizamabad", "Medak",
#             "Hyderabad", "Karimnagar", "Adilabad", "Rangareddy", "Nalgonda", "Suryapet", "Miryalaguda", "Kurnool",
#             "Palakkad", "Kochi", "Ernakulam", "Alappuzha", "Idukki", "Pathanamthitta", "Kottayam", "Thrissur",
#             "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasargod", "Thiruvananthapuram", "Chennai", "Coimbatore",
#             "Tiruppur", "Trichy", "Madurai", "Erode", "Sivagangai", "Vellore", "Thanjavur", "Salem", "Ramanathapuram",
#             "Cuddalore", "Nagapattinam", "Dindigul", "Tirunelveli", "Virudhunagar", "Tiruppur", "Tiruvannamalai",
#             "Kanchipuram", "Ramanathapuram", "Nagapattinam", "Sivagangai", "Vellore", "Puducherry", "Andaman and Nicobar Islands",
#             "Lakshadweep", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Jammu", "Srinagar", "Kashmir",
#             "Leh", "Ladakh", "Puducherry"
#         ]


#         taluka_list = [
#             "KANKAVLI", "VAIBHAVWADI", "DEVGAD", "MALWAN", "SAWANTWADI", "KUDAL", "VENGURLA", "DODAMARG", "RATNAGIRI",
#             "SANGAMESHWAR", "LANJA", "RAJAPUR", "CHIPLUN", "GUHAGAR", "DAPOLI", "MANDANGAD", "PEN", "ALIBAG",
#             "MURUD", "PANVEL", "URAN", "KARJAT", "KHALAPUR", "MANGAON", "TALA", "ROHA", "SUDHAGAD-PALI",
#             "POLADPUR", "SHRIVARDHAN", "MHASALA", "KURLA", "ANDHERI", "BORIVALI", "THANE", "KALYAN", "MURBAD", "BHIWANDI",
#             "SHAHAPUR", "ULHASNAGAR", "AMBARNATH", "PALGHAR", "VASAI", "DAHANU", "TALASARI", "JAWHAR", "MOKHADA", "VADA",
#             "VIKRAMGAD", "NASHIK", "IGATPURI", "DINDORI", "TRIMBAKESHWAR", "KALWAN", "DEOLA", "SURGANA", "BAGLAN",
#             "MALEGAON", "NANDGAON", "CHANDWAD", "NIPHAD", "SINNAR", "YEOLA", "NANDURBAR", "NAVAPUR", "SHAHADA", "TALODE",
#             "AKKALKUWA", "DHADGAON", "DHULE", "SAKRI", "SINDKHEDA", "SHIRPUR", "JALGAON", "JAMNER", "ERANDOL", "DHARANGAON",
#             "BHUSAWAL", "RAVER", "MUKTAINAGAR", "BODWAD", "YAWAL", "AMALNER", "PAROLA", "CHOPDA", "PACHORA", "BHADGAON",
#             "CHALISGAON", "BULDHANA", "CHIKHLI", "DEULGAON RAJA", "JALGAON JAMOD", "SANGRAMPUR", "MALKAPUR", "MOTALA",
#             "NANDURA", "KHAMGAON", "SHEGAON", "MEHKAR", "SINDKHED RAJA", "LONAR", "AKOLA", "AKOT", "TELHARA", "BALAPUR",
#             "PATUR", "MURTAJAPUR", "BARSHITAKLI", "WASHIM", "MALEGAON", "RISOD", "MANGRULPIR", "KARANJA", "MANORA",
#             "AMRAVATI", "BHATUKALI", "NANDGAON KHANDESHWAR", "DHARNI", "CHIKHALDARA", "ACHALPUR", "CHANDURBAZAR", "MORSHI",
#             "WARUD", "DARYAPUR", "ANJANGAON-SURJI", "CHANDUR", "DHAMANGAON", "TIOSA", "WARDHA", "DEOLI", "SELOO", "ARVI",
#             "ASHTI", "KARANJA", "HINGANGHAT", "SAMUDRAPUR", "NAGPUR URBAN", "NAGPUR RURAL", "KAMPTEE", "HINGNA", "KATOL",
#             "NARKHED", "SAVNER", "KALAMESHWAR", "RAMTEK", "MOUDA", "PARSEONI", "UMRED", "KUHI", "BHIWAPUR", "BHANDARA",
#             "TUMSAR", "PAUNI", "MOHADI", "SAKOLI", "LAKHANI", "LAKHANDUR", "GONDIA", "GOREGAON", "SALEKASA", "TIRODA",
#             "AMGAON", "DEORI", "ARJUNI-MORGAON", "SADAK-ARJUNI", "GADCHIROLI", "DHANORA", "CHAMORSHI", "MULCHERA",
#             'DESAIGANJ', 'ARMORI', 'KURKHEDA', 'KORCHI', 'AHERI', 'ETAPALLI', 'BHAMRAGAD', 'SIRONCHA', 'CHANDRAPUR',
#             'SAOLI', 'MUL', 'BALLARPUR', 'POMBHURNA', 'GONDPIMPRI', 'WARORA', 'CHIMUR', 'BHADRAVATI', 'BRAMHAPURI',
#             'NAGBHID', 'SINDEWAHI', 'RAJURA', 'KORPANA', 'JIWATI', 'YAVATMAL', 'ARNI', 'BABHULGAON', 'KALAMB', 'DARWHA',
#             'DIGRAS', 'NER', 'PUSAD', 'UMARKHED', 'MAHAGAON', 'KELAPUR', 'RALEGAON', 'GHATANJI', 'WANI', 'MAREGAON',
#             'ZARI JAMANI', 'NANDED', 'ARDHAPUR', 'MUDKHED', 'BHOKAR', 'UMRI', 'LOHA', 'KANDHAR', 'KINWAT', 'HIMAYATNAGAR',
#             "HADGAON", "MAHUR", "DEGLUR", "MUKHED", "DHARMABAD", "BILOLI", "NAIGAON", "HINGOLI", "SENGAON", "KALAMNURI",
#             "BASMATH", "AUNDHA NAGNATH", "PARBHANI", "SONPETH", "GANGAKHED", "PALAM", "PURNA", "SAILU", "JINTUR", "MANWATH",
#             "PATHRI", "JALNA", "BHOKARDAN", "JAFRABAD", "BADNAPUR", "AMBAD", "GHANSAWANGI", "PARTUR", "MANTHA", "AURANGABAD",
#             "KANNAD", "SOEGAON", "SILLOD", "PHULAMBRI", "KHULDABAD", "VAIJAPUR", "GANGAPUR", "PAITHAN", "BEED", "ASHTI",
#             "PATODA", "SHIRUR-KASAR", "GEORAI", "MAJALGAON", "WADWANI", "KAIJ", "DHARUR", "PARLI", "AMBAJOGAI", "LATUR",
#             "RENAPUR", "AUSA", "AHMEDPUR", "JALKOT", "CHAKUR", "SHIRUR ANANTPAL", "NILANGA", "DEONI", "UDGIR", "OSMANABAD",
#             "TULJAPUR", "BHUM", "PARANDA", "WASHI", "KALAMB", "LOHARA", "UMARGA", "SOLAPUR NORTH", "BARSHI", "SOLAPUR SOUTH",
#             "AKKALKOT", "MADHA", "KARMALA", "PANDHARPUR", "MOHOL", "MALSHIRAS", "SANGOLE", "MANGALVEDHE", "NAGAR", "SHEVGAON",
#             "PATHARDI", "PARNER", "SANGAMNER", "KOPARGAON", "AKOLE", "SHRIRAMPUR", "NEVASA", "RAHATA", "RAHURI", "SHRIGONDA",
#             "KARJAT", "JAMKHED", "PUNE CITY", "HAVELI", "KHED", "JUNNAR", "AMBEGAON", "MAVAL", "MULSHI", "SHIRUR", "PURANDHAR",
#             "VELHE", "BHOR", "BARAMATI", "INDAPUR", "DAUND", "SATARA", "JAOLI", "KOREGAON", "WAI", "MAHABALESHWAR", "KHANDALA",
#             "PHALTAN", "MAAN", "KHATAV", "PATAN", "KARAD", "MIRAJ", "KAVATHEMAHANKAL", "TASGAON", "JAT", "WALWA", "SHIRALA",
#             "KHANAPUR", "ATPADI", "PALUS", "KADEGAON", "KARVIR", "PANHALA", "SHAHUWADI", "KAGAL", "HATKANANGALE", "SHIROL",
#             "RADHANAGARI", "GAGANBAWADA", "BHUDARGAD", "GADHINGLAJ", "CHANDGAD", "AJRA", "PETH", "KHED", "MAHAD", "JALANA"]


#         filtered_taluka_list = [taluka for taluka in taluka_list if taluka not in district_list]

#         try:
#             all_data = []
#             district_count = {district: 0 for district in district_list}

#             for pdf_file in pdf_files:
#                 with open(f'uploaded_{pdf_file.name}', 'wb+') as destination:
#                     for chunk in pdf_file.chunks():
#                         destination.write(chunk)

#                 pdf_file_path = f'uploaded_{pdf_file.name}'

#                 pdf_document = fitz.open(pdf_file_path)

#                 all_extracted_text = []
#                 polling_station = ""
#                 address_station = ""
#                 taluka = ""
#                 district = ""
#                 state = ""
#                 extracted_district = ""
#                 constituency_name = ""
#                 part_no = ""
#                 page_text = ""


#                 for page_num in range(pdf_document.page_count):
#                     page = pdf_document[page_num]

#                     page_extracted_text, full_page_text = process_pdf_page(page, pdf_document)

#                     # print('extracted', page_extracted_text)
#                     # print('page_text', full_page_text)

#                     all_extracted_text.extend(page_extracted_text)
#                     page_text += full_page_text

#                     if page_num == 0:

#                         constituency_pattern = r"Assembly Constituency\s*:\s*(\d+\s*-\s*[A-Z\s]+)(?=\s*\()"
#                         match = re.search(constituency_pattern, page_text)
#                         if match:
#                             constituency_name = match.group(1).strip()
#                         else:
#                             print('Constituency name not found in the first page')
                        
#                         district = None

#                         for district_name in district_list:
#                             count = page_text.count(district_name)
#                             if count > district_count[district_name]:
#                                 district_count[district_name] = count
#                                 district = district_name

#                         pattern = r"No\. and Name of Polling Station\s*:\s*(.*?)\s*Address of Polling Station\s*:\s*(.*?)(?=(Number of Auxiliary Polling|4, NUMBER OF ELECTORS|$))"
#                         match = re.search(pattern, page_text, re.DOTALL)
#                         if match:
#                             polling_station = match.group(1).strip()
#                             address_station = match.group(2).strip()

#                         pattern_details = (
#                             r"Main Town or Village\s*:\s*(.*?)\s*"
#                             r"Police Station\s*:\s*(.*?)\s*"
#                             r"Taluka\s*:\s*(.*?)\s*"
#                             r"District\s*:\s*(.*?)(?=(Main Town or Village|Police Station|Taluka|District|$))"
#                         )
#                         match_details = re.search(pattern_details, page_text, re.DOTALL)
#                         if match_details:
#                             main_town_village = match_details.group(1).strip()
#                             police_station = match_details.group(2).strip()
#                             taluka = match_details.group(3).strip()
#                             extracted_district = match_details.group(4).strip()

#                             if not district:
#                                 district = extracted_district

#                         district_pattern = r"District\s*:\s*(\w+)"

#                         district_match = re.search(district_pattern, page_text)

#                         if district_match:
#                             district_name_after_district_word = district_match.group(1).strip()
#                             if district_name_after_district_word in district_list:
#                                 district = district_name_after_district_word
#                         else:
#                             district_counts = Counter()
#                             for district_name in district_list:
#                                 district_counts[district_name] = page_text.count(district_name)

#                             if district_counts:
#                                 district = district_counts.most_common(1)[0][0]
#                             else:
#                                 district = None

#                         for taluka_name in filtered_taluka_list:
#                             pattern = r'\b' + re.escape(taluka_name) + r'\b'
#                             if re.search(pattern, page_text):
#                                 taluka = taluka_name
#                                 break

#                         if not taluka:
#                             taluka = extracted_district
#                             if not district and extracted_district in district_list:
#                                 district = extracted_district

#                         state = None
#                         for state_name in state_list:
#                             if state_name in page_text:
#                                 state = state_name
#                                 break

#                     # Extract part number from the second page (page_num == 1)
#                     if page_num == 1:
#                         # part_no_pattern = r"Part No\.?:\s*(\d+)"
#                         part_no_pattern = r"Part No\.?\s*:\s*(\d+)"
#                         match = re.search(part_no_pattern, full_page_text)
#                         if match:
#                             part_no = match.group(1).strip()
#                             print("Part No:", part_no)
#                         else:
#                             print('Part number not found on the second page')

#                 result_text = process_text(all_extracted_text)
#                 print('result', result_text)

#                 extracted_names = process_names(result_text)

#                 print('extracted names',extracted_names)

#                 # regex_father_name = r"(Father's|Fathers|Father|Fathors|Husband's|Husbands|Husband|Mother's|Mothers|Mother|Others :) Name:(.*?)\n"
#                 # father_name_matches = re.findall(regex_father_name, result_text)
#                 # father_name = [match[1].strip() for match in father_name_matches]

#                 # regex_house_number = r'House Number :(.*?)\n'
#                 # house_number = re.findall(regex_house_number, result_text)

#                 # regex_age = r'Age :(.*?)\n'
#                 # age = re.findall(regex_age, result_text)

#                 # regex_gender = r'Gender:\s*(Male|Melo|Malo|Female|Femelo|Femalo|Fomale|)\n'
#                 # gender = re.findall(regex_gender, result_text)

#                 # max_length = max(len(father_name), len(extracted_names), len(house_number), len(age), len(gender))

#                 # father_name += [""] * (max_length - len(father_name))
#                 # # name += [""] * (max_length - len(name))
#                 # house_number += [""] * (max_length - len(house_number))
#                 # age += [None] * (max_length - len(age))
#                 # gender += [None] * (max_length - len(gender))

#                 # cleaned_names = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers)\b', '', fn).strip() for fn in extracted_names]
#                 # cleaned_names = [re.sub(r'[^a-zA-Z\s]', '', n).strip() for n in cleaned_names]

#                 # cleaned_father_name = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers|Others)\b', '', fn).strip() for fn in father_name]
#                 # cleaned_father_name = [re.sub(r'[^a-zA-Z\s]', '', fn).strip() for fn in cleaned_father_name]

#                 # unwanted_phrases = [
#                 #     "Type of Polling Station General",
#                 #     "(Male/Female/General)",
#                 #     "Number of Auxiliary Polling 0",
#                 #     "Stations in this part :",
#                 #     "Stations in this pai",
#                 #     "Stations in this pari"
#                 # ]

#                 # def remove_unwanted_phrases(text, phrases):
#                 #     for phrase in phrases:
#                 #         text = text.replace(phrase, "").strip()
#                 #     return text

#                 # def remove_unwanted_words(text, words):
#                 #     words_in_text = text.split()
#                 #     filtered_words = [word for word in words_in_text if word not in words]
#                 #     return " ".join(filtered_words)

#                 # def clean_town_or_village(text):
#                 #     text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
#                 #     return text.strip()

#                 # polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
#                 # address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

#                 # unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

#                 # polling_station = remove_unwanted_words(polling_station, unwanted_words)
#                 # address_station = remove_unwanted_words(address_station, unwanted_words)

#                 # polling_station = clean_town_or_village(polling_station)

#                 # if part_no:
#                 #     address_station = f"{part_no} - {address_station}"

#                 # result_array = polling_station.split(" - ")

#                 # if len(result_array) > 1:
#                 #     string_part = result_array[1]
#                 # else:
#                 #     string_part = result_array[0]  

#                 # voter_id_pattern = r"(\w+)\s+(?:Available|Avaliable|Availablo|Avallable)" # Example pattern for voter IDs
#                 # voter_ids = re.findall(voter_id_pattern, result_text)

#                 # # Pad voter_ids to match max_length
#                 # voter_ids += [""] * (max_length - len(voter_ids))

#                 # df = pd.DataFrame({
#                 #     'Name': cleaned_names,
#                 #     'Parent Name': cleaned_father_name,
#                 #     'House Number': house_number,
#                 #     'Age': age,
#                 #     'Gender': gender,
#                 #     'Town or Village': [string_part] * max_length,
#                 #     'Address of Polling Station': [address_station] * max_length,
#                 #     'Taluka': [taluka] * max_length,
#                 #     'District': [district] * max_length,
#                 #     'State': [state] * max_length,
#                 #     'Constituency Name': [constituency_name] * max_length,
#                 #     'Voter Id': voter_ids
#                 # })


#                 # Functions for text processing and cleaning
#                 def clean_text(text, unwanted_phrases):
#                     for phrase in unwanted_phrases:
#                         text = text.replace(phrase, "").strip()
#                     return text

#                 def normalize_gender(gender_text):
#                     mapping = {"Malo": "Male", "Melo": "Male", "Femalo": "Female", "Fomale": "Female"}
#                     return mapping.get(gender_text.strip(), gender_text)

#                 # Process result_text
#                 unwanted_phrases = [
#                     "Type of Polling Station General",
#                     "(Male/Female/General)",
#                     "Number of Auxiliary Polling 0",
#                     "Stations in this part :",
#                     "Stations in this pai",
#                     "Stations in this pari"
#                 ]

#                 def remove_unwanted_phrases(text, phrases):
#                     for phrase in phrases:
#                         text = text.replace(phrase, "").strip()
#                     return text

#                 def remove_unwanted_words(text, words):
#                     words_in_text = text.split()
#                     filtered_words = [word for word in words_in_text if word not in words]
#                     return " ".join(filtered_words)

#                 def clean_town_or_village(text):
#                     text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
#                     return text.strip()

#                 # Extract details using regex
#                 regex_name = r"Name: :(.*?)\n"
#                 names = [name.strip() for name in re.findall(regex_name, result_text)]

#                 regex_father_name = r"(?:Father's|Fathers|Husband's|Husbands|Mother's|Mothers|Others): Name: (.*?)\n"
#                 parent_names = [name.strip() for name in re.findall(regex_father_name, result_text)]

#                 regex_house_number = r"House Number :(.*?)\n"
#                 house_numbers = [hn.strip() for hn in re.findall(regex_house_number, result_text)]

#                 regex_age = r"Age : (\d+)"
#                 ages = [age.strip() for age in re.findall(regex_age, result_text)]

#                 regex_gender = r"Gender : (Male|Malo|Melo|Female|Femalo|Fomale)"
#                 genders = [normalize_gender(gender) for gender in re.findall(regex_gender, result_text)]

#                 regex_voter_id = r"(\w+)\s+(?:Available|Avaliable|Availablo|Avallable)"
#                 voter_ids = [vid.strip() for vid in re.findall(regex_voter_id, result_text)]

#                 polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
#                 address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

#                 unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

#                 polling_station = remove_unwanted_words(polling_station, unwanted_words)
#                 address_station = remove_unwanted_words(address_station, unwanted_words)

#                 polling_station = clean_town_or_village(polling_station)

#                 if part_no:
#                     address_station = f"{part_no} - {address_station}"

#                 result_array = polling_station.split(" - ")

#                 if len(result_array) > 1:
#                     string_part = result_array[1]
#                 else:
#                     string_part = result_array[0]  

#                 # Ensure all lists have the same length
#                 max_length = max(len(names), len(parent_names), len(house_numbers), len(ages), len(genders), len(voter_ids))
#                 names += [""] * (max_length - len(names))
#                 parent_names += [""] * (max_length - len(parent_names))
#                 house_numbers += [""] * (max_length - len(house_numbers))
#                 ages += [""] * (max_length - len(ages))
#                 genders += [""] * (max_length - len(genders))
#                 voter_ids += [""] * (max_length - len(voter_ids))

#                 # Create DataFrame
#                 df = pd.DataFrame({
#                     'Name': names,
#                     'Parent Name': parent_names,
#                     'House Number': house_numbers,
#                     'Age': ages,
#                     'Gender': genders,
#                     'Town or Village': [string_part] * max_length,
#                     'Address of Polling Station': [address_station] * max_length,
#                     'Taluka': [taluka] * max_length,
#                     'District': [district] * max_length,
#                     'State': [state] * max_length,
#                     'Constituency Name': [constituency_name] * max_length,
#                     'Voter Id': voter_ids
#                 })

#                 all_data.append(df)

#             combined_df = pd.concat(all_data, ignore_index=True)
#             combined_df.index = range(1, len(combined_df) + 1)
#             combined_df['Age'] = pd.to_numeric(combined_df['Age'], errors='coerce')

#             response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
#             response['Content-Disposition'] = 'attachment; filename="extracted_data.xlsx"'
#             combined_df.to_excel(response, index_label='Record_ID')

#             return response
        
#         except Exception as e:
#             import traceback
#             error_message = f"Error processing PDFs: {e}\n{traceback.format_exc()}"
#             return render(request, 'upload_file.html', {'error_message': error_message})

#     return render(request, 'upload_file.html')



# # # azure blob storage

# # import fitz
# # from PIL import Image
# # import io
# # import re
# # import pandas as pd
# # from django.http import HttpResponse
# # from django.shortcuts import render
# # from collections import Counter
# # import cv2
# # import numpy as np
# # import time
# # from azure.cognitiveservices.vision.computervision import ComputerVisionClient
# # from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
# # from msrest.authentication import CognitiveServicesCredentials

# # from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
# # import os
# # import fitz
# # import re
# # import pandas as pd
# # from collections import Counter
# # from django.http import HttpResponse
# # from django.shortcuts import render

# # # Azure Credentials
# # API_KEY = "AjGQ2JgRB5o3yCD2T32I4FuUbD5kb5NqEMaDvYb5q2fLUoWVcQCuJQQJ99ALACGhslBXJ3w3AAAEACOGERCw"
# # ENDPOINT = "https://election-ai.cognitiveservices.azure.com/"

# # computervision_client = ComputerVisionClient(ENDPOINT, CognitiveServicesCredentials(API_KEY))

# # def preprocess_image(image):
# #     """Preprocess the image for better OCR accuracy using OpenCV."""
# #     gray = cv2.cvtColor(np.array(image), cv2.COLOR_BGR2GRAY)
# #     blur = cv2.GaussianBlur(gray, (5, 5), 0)
# #     # Apply adaptive thresholding
# #     thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
# #     return thresh

# # def azure_ocr(image_data):
# #     """Use Azure OCR to extract text from an image."""
# #     response = computervision_client.read_in_stream(io.BytesIO(image_data), raw=True)
# #     operation_location = response.headers["Operation-Location"]
# #     operation_id = operation_location.split("/")[-1]

# #     # Poll for the result
# #     while True:
# #         result = computervision_client.get_read_result(operation_id)
# #         if result.status not in [OperationStatusCodes.running, OperationStatusCodes.not_started]:
# #             break
# #         time.sleep(1)

# #     # Extract text from the response
# #     extracted_text = ""
# #     if result.status == OperationStatusCodes.succeeded:
# #         for page in result.analyze_result.read_results:
# #             for line in page.lines:
# #                 extracted_text += line.text + "\n"

# #     return extracted_text

# # def process_pdf_page(page, pdf_document):
# #     """Process each page of the PDF, extract images, and perform OCR."""
# #     images = page.get_images(full=True)
# #     all_extracted_text = []
# #     page_text = ""

# #     for img_index, img in enumerate(images):
# #         xref = img[0]
# #         base_image = pdf_document.extract_image(xref)
# #         image_data = base_image['image']

# #         # Resize and preprocess image
# #         image = Image.open(io.BytesIO(image_data))
# #         image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)
# #         processed_image = preprocess_image(image)

# #         # Convert processed image back to bytes
# #         _, buffer = cv2.imencode('.jpg', processed_image)
# #         processed_image_bytes = buffer.tobytes()

# #         # Use Azure OCR
# #         extracted_text = azure_ocr(processed_image_bytes)
# #         all_extracted_text.append(extracted_text)
# #         page_text += extracted_text

# #     return all_extracted_text, page_text

# # def process_text(all_extracted_text):
# #     """Clean and process the extracted OCR text."""
# #     combined_text = '\n'.join(all_extracted_text)
# #     replacements = {
# #         "Gender ;": "Gender:",
# #         "Nam:": "Name:",
# #         "amo:": "Name:",
# #         "Tamo:": "Name:",
# #         "Narme:": "Name:",
# #         "Narme": "Name:",
# #         "Tamo": "Name:",
# #         "Nama:": "Name:",
# #         "Name": "Name:",
# #         "Namo": "Name:",
# #         "Nomo": "Name:",
# #         "Nome": "Name:",
# #         "Photo": ""
# #     }
# #     # Perform the replacements
# #     modified_text = combined_text
# #     for old, new in replacements.items():
# #         modified_text = modified_text.replace(old, new)

# #     cleaned_text = re.sub(r"[^\w\s:’,#]", "", modified_text)

# #     pattern = r"((Name:\s*|Father's Name:\s*|Husband's Name:\s*|Mother's Name:\s*|Others:\s*|House Number:\s*|Age:\s*|Name:\s*).*?)(?=(Name:\s*|Father's Name:\s*|Husband's Name:\s*|Mother's Name:\s*|Others:\s*|House Number:\s*|Age:\s*|Name:|$))"
# #     result_text = re.sub(pattern, r'\1\n', cleaned_text)
# #     return result_text

# # def process_names(result_text):
# #     """Extract names from the OCR text."""
# #     regex_name = r"(?i)^[‘']?\s*(?:Name|Nam|Name:|Name\s*:|amo\s*:)#?\s*[‘']?\s*:?[\W_]*\s*([^‘']+?)(?:\s*[‘']|$)"
# #     name_matches = re.findall(regex_name, result_text, re.MULTILINE)

# #     # Initialize the extracted names list
# #     extracted_names = []
# #     lines = result_text.splitlines()

# #     # To track the last two lines for "Husbands Name" and "Mothers Name"
# #     previous_lines = []

# #     for line in lines:
# #         # Track only the last lines for checking specific names
# #         previous_lines.append(line)
# #         if len(previous_lines) > 2:
# #             previous_lines.pop(0)

# #         # Check if any of the previous lines contain "Fathers Name", "Mothers Name", etc.
# #         if any(
# #             re.search(r"(Husband'?s?|Father'?s?|Mother'?s?|Other'?s?)\s*Name?", prev_line, re.IGNORECASE)
# #             for prev_line in previous_lines
# #         ):
# #             continue  # Skip processing if condition is met in any previous line

# #         # Check if "Father" or "Mother" appears in any of the previous lines
# #         if any(re.search(r"\b(Father|Mother)\b", prev_line, re.IGNORECASE) for prev_line in previous_lines):
# #             continue  # Skip processing this line if the condition is met

# #         # Process lines that contain "Name:" or "Name"
# #         if "Name:" in line or "Name" in line or "Nama" in line or "Nama:" in line or "Nam:" in line or "Nam" in line or "amo:" in line or "amo" in line:
# #             # Match and extract names from the current line
# #             for name in name_matches:
# #                 if name in line:
# #                     # Split name on double spaces, commas, or # symbol
# #                     split_names = re.split(r"\s{2,}|,\s*|#", name)
# #                     for split_name in split_names:
# #                         split_name = split_name.strip()
# #                         # Check if the split_name is not a substring of any previously added names
# #                         if split_name and not any(split_name in existing_name or existing_name in split_name for existing_name in extracted_names):
# #                             extracted_names.append(split_name)

# #     return extracted_names


# # # Replace these with your actual Azure Blob Storage connection details
# # AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=electiontool;AccountKey=9IO+FmwP6UISA3uF9qdfBqgr2VaPmGtKBlqLwb7GyOYyjNKwAu8HsUDDBajHFY4xvinUmwmL07yK+AStrxLm3w==;EndpointSuffix=core.windows.net"
# # CONTAINER_NAME = 'your_container_name'

# # # Initialize the Azure Blob Service client
# # blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
# # container_client = blob_service_client.get_container_client(CONTAINER_NAME)

# # def upload_file(request):
# #     if request.method == 'POST' and request.FILES.getlist('pdf_files'):
# #         pdf_files = request.FILES.getlist('pdf_files')

# #         state_list = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh']
# #         district_list = ["Sangli", "Satara", "Solapur", "Kolhapur", "Pune", "Akola", "Amravati", "Buldhana"]
# #         taluka_list = ["RADHANAGARI", "GAGANBAWADA", "BHUDARGAD", "GADHINGLAJ", "CHANDGAD", "AJRA", "PETH", "KHED", "MAHAD", "JALANA"]
# #         filtered_taluka_list = [taluka for taluka in taluka_list if taluka not in district_list]

# #         try:
# #             all_data = []
# #             district_count = {district: 0 for district in district_list}

# #             for pdf_file in pdf_files:
# #                 # Upload the PDF file to Azure Blob Storage
# #                 blob_client = container_client.get_blob_client(pdf_file.name)
# #                 blob_client.upload_blob(pdf_file, overwrite=True)

# #                 # Construct the Blob URL to download the file
# #                 blob_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{CONTAINER_NAME}/{pdf_file.name}"
                
# #                 # Download the file from Azure Blob Storage to process
# #                 downloaded_pdf = blob_client.download_blob()
# #                 pdf_file_path = f'/tmp/{pdf_file.name}'  # Temporary location to store the file locally
# #                 with open(pdf_file_path, 'wb') as f:
# #                     f.write(downloaded_pdf.readall())

# #                 pdf_document = fitz.open(pdf_file_path)
# #                 all_extracted_text = []
# #                 page_text = ""

# #                 for page_num in range(pdf_document.page_count):
# #                     page = pdf_document[page_num]
# #                     page_extracted_text, full_page_text = process_pdf_page(page, pdf_document)
# #                     all_extracted_text.extend(page_extracted_text)
# #                     page_text += full_page_text

# #                     if page_num == 0:
# #                         constituency_pattern = r"Assembly Constituency\s*:\s*(\d+\s*-\s*[A-Z\s]+)(?=\s*\()"
# #                         match = re.search(constituency_pattern, page_text)
# #                         if match:
# #                             constituency_name = match.group(1).strip()
# #                         else:
# #                             print('Constituency name not found in the first page')
                        
# #                         district = None
# #                         for district_name in district_list:
# #                             count = page_text.count(district_name)
# #                             if count > district_count[district_name]:
# #                                 district_count[district_name] = count
# #                                 district = district_name

# #                         pattern = r"No\. and Name of Polling Station\s*:\s*(.*?)\s*Address of Polling Station\s*:\s*(.*?)(?=(Number of Auxiliary Polling|4, NUMBER OF ELECTORS|$))"
# #                         match = re.search(pattern, page_text, re.DOTALL)
# #                         if match:
# #                             polling_station = match.group(1).strip()
# #                             address_station = match.group(2).strip()

# #                         pattern_details = (
# #                             r"Main Town or Village\s*:\s*(.*?)\s*"
# #                             r"Police Station\s*:\s*(.*?)\s*"
# #                             r"Taluka\s*:\s*(.*?)\s*"
# #                             r"District\s*:\s*(.*?)(?=(Main Town or Village|Police Station|Taluka|District|$))"
# #                         )
# #                         match_details = re.search(pattern_details, page_text, re.DOTALL)
# #                         if match_details:
# #                             main_town_village = match_details.group(1).strip()
# #                             police_station = match_details.group(2).strip()
# #                             taluka = match_details.group(3).strip()
# #                             extracted_district = match_details.group(4).strip()

# #                             if not district:
# #                                 district = extracted_district

# #                         district_pattern = r"District\s*:\s*(\w+)"

# #                         district_match = re.search(district_pattern, page_text)

# #                         if district_match:
# #                             district_name_after_district_word = district_match.group(1).strip()
# #                             if district_name_after_district_word in district_list:
# #                                 district = district_name_after_district_word
# #                         else:
# #                             district_counts = Counter()
# #                             for district_name in district_list:
# #                                 district_counts[district_name] = page_text.count(district_name)

# #                             if district_counts:
# #                                 district = district_counts.most_common(1)[0][0]
# #                             else:
# #                                 district = None

# #                         for taluka_name in filtered_taluka_list:
# #                             pattern = r'\b' + re.escape(taluka_name) + r'\b'
# #                             if re.search(pattern, page_text):
# #                                 taluka = taluka_name
# #                                 break

# #                         if not taluka:
# #                             taluka = extracted_district
# #                             if not district and extracted_district in district_list:
# #                                 district = extracted_district

# #                         state = None
# #                         for state_name in state_list:
# #                             if state_name in page_text:
# #                                 state = state_name
# #                                 break

# #                     # Extract part number from the second page (page_num == 1)
# #                     if page_num == 1:
# #                         # part_no_pattern = r"Part No\.?:\s*(\d+)"
# #                         part_no_pattern = r"Part No\.?\s*:\s*(\d+)"
# #                         match = re.search(part_no_pattern, full_page_text)
# #                         if match:
# #                             part_no = match.group(1).strip()
# #                             print("Part No:", part_no)
# #                         else:
# #                             print('Part number not found on the second page')

# #                 result_text = process_text(all_extracted_text)
# #                 extracted_names = process_names(result_text)

# #                 regex_father_name = r"(Father's|Fathers|Father|Fathors|Husband's|Husbands|Husband|Mother's|Mothers|Mother|Others :) Name:(.*?)\n"
# #                 father_name_matches = re.findall(regex_father_name, result_text)
# #                 father_name = [match[1].strip() for match in father_name_matches]

# #                 regex_house_number = r'House Number :(.*?)\n'
# #                 house_number = re.findall(regex_house_number, result_text)

# #                 regex_age = r'Age :(.*?)\n'
# #                 age = re.findall(regex_age, result_text)

# #                 regex_gender = r'Gender:\s*(Male|Melo|Malo|Female|Femelo|Femalo|Fomale|)\n'
# #                 gender = re.findall(regex_gender, result_text)

# #                 max_length = max(len(father_name), len(extracted_names), len(house_number), len(age), len(gender))

# #                 father_name += [""] * (max_length - len(father_name))
# #                 # name += [""] * (max_length - len(name))
# #                 house_number += [""] * (max_length - len(house_number))
# #                 age += [None] * (max_length - len(age))
# #                 gender += [None] * (max_length - len(gender))

# #                 cleaned_names = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers)\b', '', fn).strip() for fn in extracted_names]
# #                 cleaned_names = [re.sub(r'[^a-zA-Z\s]', '', n).strip() for n in cleaned_names]

# #                 cleaned_father_name = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers|Others)\b', '', fn).strip() for fn in father_name]
# #                 cleaned_father_name = [re.sub(r'[^a-zA-Z\s]', '', fn).strip() for fn in cleaned_father_name]

# #                 unwanted_phrases = [
# #                     "Type of Polling Station General",
# #                     "(Male/Female/General)",
# #                     "Number of Auxiliary Polling 0",
# #                     "Stations in this part :",
# #                     "Stations in this pai",
# #                     "Stations in this pari"
# #                 ]

# #                 def remove_unwanted_phrases(text, phrases):
# #                     for phrase in phrases:
# #                         text = text.replace(phrase, "").strip()
# #                     return text

# #                 def remove_unwanted_words(text, words):
# #                     words_in_text = text.split()
# #                     filtered_words = [word for word in words_in_text if word not in words]
# #                     return " ".join(filtered_words)

# #                 def clean_town_or_village(text):
# #                     text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
# #                     return text.strip()

# #                 polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
# #                 address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

# #                 unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

# #                 polling_station = remove_unwanted_words(polling_station, unwanted_words)
# #                 address_station = remove_unwanted_words(address_station, unwanted_words)

# #                 polling_station = clean_town_or_village(polling_station)

# #                 if part_no:
# #                     address_station = f"{part_no} - {address_station}"

# #                 result_array = polling_station.split(" - ")

# #                 if len(result_array) > 1:
# #                     string_part = result_array[1]
# #                 else:
# #                     string_part = result_array[0]  

# #                 voter_id_pattern = r"(\w+)\s+(?:Available|Avaliable|Availablo|Avallable)" # Example pattern for voter IDs
# #                 voter_ids = re.findall(voter_id_pattern, result_text)

# #                 # Pad voter_ids to match max_length
# #                 voter_ids += [""] * (max_length - len(voter_ids))

# #                 df = pd.DataFrame({
# #                     'Name': cleaned_names,
# #                     'Parent Name': cleaned_father_name,
# #                     'House Number': house_number,
# #                     'Age': age,
# #                     'Gender': gender,
# #                     'Town or Village': [string_part] * max_length,
# #                     'Address of Polling Station': [address_station] * max_length,
# #                     'Taluka': [taluka] * max_length,
# #                     'District': [district] * max_length,
# #                     'State': [state] * max_length,
# #                     'Constituency Name': [constituency_name] * max_length,
# #                     'Voter Id': voter_ids
# #                 })

# #                 all_data.append(df)

# #             # Combine all data frames and prepare the response
# #             combined_df = pd.concat(all_data, ignore_index=True)
# #             combined_df.index = range(1, len(combined_df) + 1)
# #             combined_df['Age'] = pd.to_numeric(combined_df['Age'], errors='coerce')

# #             response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
# #             response['Content-Disposition'] = 'attachment; filename="extracted_data.xlsx"'
# #             combined_df.to_excel(response, index_label='Record_ID')

# #             return response
        
# #         except Exception as e:
# #             import traceback
# #             error_message = f"Error processing PDFs: {e}\n{traceback.format_exc()}"
# #             return render(request, 'upload_file.html', {'error_message': error_message})

# #     return render(request, 'upload_file.html')





# # from io import BytesIO
# # import fitz  # PyMuPDF
# # import pandas as pd
# # import re
# # import traceback
# # from django.http import HttpResponse
# # from django.shortcuts import render

# # def upload_file(request):
# #     if request.method == 'POST' and request.FILES.getlist('pdf_files'):
# #         pdf_files = request.FILES.getlist('pdf_files')

# #         state_list = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh']
# #         district_list = ["Sangli", "Satara", "Solapur", "Kolhapur", "Pune", "Akola", "Amravati", "Buldhana"]
# #         taluka_list = ["RADHANAGARI", "GAGANBAWADA", "BHUDARGAD", "GADHINGLAJ", "CHANDGAD", "AJRA", "PETH", "KHED", "MAHAD", "JALANA"]
# #         filtered_taluka_list = [taluka for taluka in taluka_list if taluka not in district_list]

# #         try:
# #             all_data = []
# #             district_count = {district: 0 for district in district_list}

# #             for pdf_file in pdf_files:
# #                 # Use BytesIO to handle the file in memory without saving it to disk
# #                 pdf_file_bytes = pdf_file.read()
# #                 pdf_document = fitz.open(stream=pdf_file_bytes, filetype="pdf")

# #                 all_extracted_text = []
# #                 polling_station = ""
# #                 address_station = ""
# #                 taluka = ""
# #                 district = ""
# #                 state = ""
# #                 extracted_district = ""
# #                 constituency_name = ""
# #                 part_no = ""
# #                 page_text = ""

# #                 for page_num in range(pdf_document.page_count):
# #                     page = pdf_document[page_num]
# #                     page_extracted_text, full_page_text = process_pdf_page(page, pdf_document)

# #                     all_extracted_text.extend(page_extracted_text)
# #                     page_text += full_page_text

# #                     if page_num == 0:
# #                         constituency_pattern = r"Assembly Constituency\s*:\s*(\d+\s*-\s*[A-Z\s]+)(?=\s*\()"
# #                         match = re.search(constituency_pattern, page_text)
# #                         if match:
# #                             constituency_name = match.group(1).strip()
                        
# #                         district = None
# #                         for district_name in district_list:
# #                             count = page_text.count(district_name)
# #                             if count > district_count[district_name]:
# #                                 district_count[district_name] = count
# #                                 district = district_name

# #                         pattern = r"No\. and Name of Polling Station\s*:\s*(.*?)\s*Address of Polling Station\s*:\s*(.*?)(?=(Number of Auxiliary Polling|4, NUMBER OF ELECTORS|$))"
# #                         match = re.search(pattern, page_text, re.DOTALL)
# #                         if match:
# #                             polling_station = match.group(1).strip()
# #                             address_station = match.group(2).strip()

# #                         pattern_details = (
# #                             r"Main Town or Village\s*:\s*(.*?)\s*"
# #                             r"Police Station\s*:\s*(.*?)\s*"
# #                             r"Taluka\s*:\s*(.*?)\s*"
# #                             r"District\s*:\s*(.*?)(?=(Main Town or Village|Police Station|Taluka|District|$))"
# #                         )
# #                         match_details = re.search(pattern_details, page_text, re.DOTALL)
# #                         if match_details:
# #                             main_town_village = match_details.group(1).strip()
# #                             police_station = match_details.group(2).strip()
# #                             taluka = match_details.group(3).strip()
# #                             extracted_district = match_details.group(4).strip()

# #                             if not district:
# #                                 district = extracted_district

# #                         district_pattern = r"District\s*:\s*(\w+)"
# #                         district_match = re.search(district_pattern, page_text)
# #                         if district_match:
# #                             district_name_after_district_word = district_match.group(1).strip()
# #                             if district_name_after_district_word in district_list:
# #                                 district = district_name_after_district_word
# #                         else:
# #                             district_counts = Counter()
# #                             for district_name in district_list:
# #                                 district_counts[district_name] = page_text.count(district_name)

# #                             if district_counts:
# #                                 district = district_counts.most_common(1)[0][0]
# #                             else:
# #                                 district = None

# #                         for taluka_name in filtered_taluka_list:
# #                             pattern = r'\b' + re.escape(taluka_name) + r'\b'
# #                             if re.search(pattern, page_text):
# #                                 taluka = taluka_name
# #                                 break

# #                         if not taluka:
# #                             taluka = extracted_district
# #                             if not district and extracted_district in district_list:
# #                                 district = extracted_district

# #                         state = None
# #                         for state_name in state_list:
# #                             if state_name in page_text:
# #                                 state = state_name
# #                                 break

# #                     # Extract part number from the second page (page_num == 1)
# #                     if page_num == 1:
# #                         part_no_pattern = r"Part No\.?\s*:\s*(\d+)"
# #                         match = re.search(part_no_pattern, full_page_text)
# #                         if match:
# #                             part_no = match.group(1).strip()

# #                 result_text = process_text(all_extracted_text)
# #                 extracted_names = process_names(result_text)

# #                 regex_father_name = r"(Father's|Fathers|Father|Fathors|Husband's|Husbands|Husband|Mother's|Mothers|Mother|Others :) Name:(.*?)\n"
# #                 father_name_matches = re.findall(regex_father_name, result_text)
# #                 father_name = [match[1].strip() for match in father_name_matches]

# #                 regex_house_number = r'House Number :(.*?)\n'
# #                 house_number = re.findall(regex_house_number, result_text)

# #                 regex_age = r'Age :(.*?)\n'
# #                 age = re.findall(regex_age, result_text)

# #                 regex_gender = r'Gender:\s*(Male|Melo|Malo|Female|Femelo|Femalo|Fomale|)\n'
# #                 gender = re.findall(regex_gender, result_text)

# #                 max_length = max(len(father_name), len(extracted_names), len(house_number), len(age), len(gender))

# #                 father_name += [""] * (max_length - len(father_name))
# #                 house_number += [""] * (max_length - len(house_number))
# #                 age += [None] * (max_length - len(age))
# #                 gender += [None] * (max_length - len(gender))

# #                 cleaned_names = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers)\b', '', fn).strip() for fn in extracted_names]
# #                 cleaned_names = [re.sub(r'[^a-zA-Z\s]', '', n).strip() for n in cleaned_names]

# #                 cleaned_father_name = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers|Others)\b', '', fn).strip() for fn in father_name]
# #                 cleaned_father_name = [re.sub(r'[^a-zA-Z\s]', '', fn).strip() for fn in cleaned_father_name]

# #                 unwanted_phrases = [
# #                     "Type of Polling Station General",
# #                     "(Male/Female/General)",
# #                     "Number of Auxiliary Polling 0",
# #                     "Stations in this part :",
# #                     "Stations in this pai",
# #                     "Stations in this pari"
# #                 ]

# #                 def remove_unwanted_phrases(text, phrases):
# #                     for phrase in phrases:
# #                         text = text.replace(phrase, "").strip()
# #                     return text

# #                 def remove_unwanted_words(text, words):
# #                     words_in_text = text.split()
# #                     filtered_words = [word for word in words_in_text if word not in words]
# #                     return " ".join(filtered_words)

# #                 def clean_town_or_village(text):
# #                     text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
# #                     return text.strip()

# #                 polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
# #                 address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

# #                 unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())
# #                 polling_station = remove_unwanted_words(polling_station, unwanted_words)
# #                 address_station = remove_unwanted_words(address_station, unwanted_words)
# #                 polling_station = clean_town_or_village(polling_station)

# #                 if part_no:
# #                     address_station = f"{part_no} - {address_station}"

# #                 result_array = polling_station.split(" - ")
# #                 if len(result_array) > 1:
# #                     string_part = result_array[1]
# #                 else:
# #                     string_part = result_array[0]  

# #                 voter_id_pattern = r"(\w+)\s+(?:Available|Avaliable|Availablo|Avallable)"
# #                 voter_ids = re.findall(voter_id_pattern, result_text)

# #                 voter_ids += [""] * (max_length - len(voter_ids))

# #                 df = pd.DataFrame({
# #                     'Name': cleaned_names,
# #                     'Parent Name': cleaned_father_name,
# #                     'House Number': house_number,
# #                     'Age': age,
# #                     'Gender': gender,
# #                     'Town or Village': [string_part] * max_length,
# #                     'Address of Polling Station': [address_station] * max_length,
# #                     'Taluka': [taluka] * max_length,
# #                     'District': [district] * max_length,
# #                     'State': [state] * max_length,
# #                     'Voter ID': voter_ids,
# #                 })

# #                 buffer = BytesIO()
# #                 with pd.ExcelWriter(buffer, engine='xlsxwriter') as writer:
# #                     df.to_excel(writer, index=False, sheet_name="Data")
# #                     writer.save()

# #                 buffer.seek(0)

# #                 response = HttpResponse(buffer, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
# #                 response['Content-Disposition'] = 'attachment; filename=generated_excel.xlsx'

# #                 return response

# #         except Exception as e:
# #             print(f"Error occurred: {e}")
# #             traceback.print_exc()
# #             return render(request, "upload_file.html", {"error": "An error occurred while processing the files."})





























# import fitz
# from PIL import Image
# import io
# import re
# import pandas as pd
# from django.http import HttpResponse
# from django.shortcuts import render
# from collections import Counter
# import cv2
# import numpy as np
# import time

# from azure.cognitiveservices.vision.computervision import ComputerVisionClient
# from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
# from msrest.authentication import CognitiveServicesCredentials


# # Azure Credentials
# API_KEY = "AjGQ2JgRB5o3yCD2T32I4FuUbD5kb5NqEMaDvYb5q2fLUoWVcQCuJQQJ99ALACGhslBXJ3w3AAAEACOGERCw"
# ENDPOINT = "https://election-ai.cognitiveservices.azure.com/"

# computervision_client = ComputerVisionClient(ENDPOINT, CognitiveServicesCredentials(API_KEY))

# def preprocess_image(image):
#     gray = cv2.cvtColor(np.array(image), cv2.COLOR_BGR2GRAY)
#     blur = cv2.GaussianBlur(gray, (5, 5), 0)
#     # Apply adaptive thresholding
#     thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
#     return thresh

# def azure_ocr(image_data):
#     # Perform OCR using Azure Computer Vision API
#     response = computervision_client.read_in_stream(io.BytesIO(image_data), raw=True)
#     operation_location = response.headers["Operation-Location"]
#     operation_id = operation_location.split("/")[-1]

#     # Poll for the result
#     while True:
#         result = computervision_client.get_read_result(operation_id)
#         if result.status not in [OperationStatusCodes.running, OperationStatusCodes.not_started]:
#             break
#         time.sleep(1)

#     # Extract text from the response
#     extracted_text = ""
#     if result.status == OperationStatusCodes.succeeded:
#         for page in result.analyze_result.read_results:
#             for line in page.lines:
#                 extracted_text += line.text + "\n"

#     return extracted_text

# def process_pdf_page(page, pdf_document):
#     images = page.get_images(full=True)
#     all_extracted_text = []
#     page_text = ""

#     for img_index, img in enumerate(images):
#         xref = img[0]
#         base_image = pdf_document.extract_image(xref)
#         image_data = base_image['image']

#         # Resize and preprocess image
#         image = Image.open(io.BytesIO(image_data))
#         image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)
#         processed_image = preprocess_image(image)

#         # Convert processed image back to bytes
#         _, buffer = cv2.imencode('.jpg', processed_image)
#         processed_image_bytes = buffer.tobytes()

#         # Use Azure OCR
#         extracted_text = azure_ocr(processed_image_bytes)
#         all_extracted_text.append(extracted_text)
#         page_text += extracted_text

#     return all_extracted_text, page_text

# def process_text(all_extracted_text):
#     combined_text = '\n'.join(all_extracted_text)
#     replacements = {
#         "Gender ;": "Gender:",
#         "Nam:": "Name:",
#         "amo:": "Name:",
#         "Tamo:": "Name:",
#         "Narme:": "Name:",
#         "Narme": "Name:",
#         "Tamo": "Name:",
#         "Nama:": "Name:",
#         "Name": "Name:",
#         "Namo": "Name:",
#         "Nomo": "Name:",
#         "Nome": "Name:",
#         "Photo": ""
#     }
#     # Perform the replacements
#     modified_text = combined_text
#     for old, new in replacements.items():
#         modified_text = modified_text.replace(old, new)

#     cleaned_text = re.sub(r"[^\w\s:’,#]", "", modified_text)

#     pattern = r"((Name:\s*|Father's Name:\s*|Husband's Name:\s*|Mother's Name:\s*|Others:\s*|House Number:\s*|Age:\s*|Name:\s*).*?)(?=(Name:\s*|Father's Name:\s*|Husband's Name:\s*|Mother's Name:\s*|Others:\s*|House Number:\s*|Age:\s*|Name:|$))"
#     result_text = re.sub(pattern, r'\1\n', cleaned_text)
#     # print('result_text', result_text)
#     return result_text


# def process_names(result_text):
#     regex_name = r"(?i)^[‘']?\s*(?:Name|Nam|Name:|Name\s*:|amo\s*:)#?\s*[‘']?\s*:?[\W_]*\s*([^‘']+?)(?:\s*[‘']|$)"
#     name_matches = re.findall(regex_name, result_text, re.MULTILINE)

#     # Initialize the extracted names list
#     extracted_names = []
#     lines = result_text.splitlines()

#     # To track the last two lines for "Husbands Name" and "Mothers Name"
#     previous_lines = []

#     for line in lines:
#         # Track only the last lines for checking specific names
#         previous_lines.append(line)
#         if len(previous_lines) > 2:
#             previous_lines.pop(0)

#         # Check if any of the previous lines contain "Fathers Name", "Mothers Name", etc.
#         if any(
#             re.search(r"(Husband'?s?|Father'?s?|Mother'?s?|Other'?s?)\s*Name?", prev_line, re.IGNORECASE)
#             for prev_line in previous_lines
#         ):
#             continue  # Skip processing if condition is met in any previous line

#         # Check if "Father" or "Mother" appears in any of the previous lines
#         if any(re.search(r"\b(Father|Mother)\b", prev_line, re.IGNORECASE) for prev_line in previous_lines):
#             continue  # Skip processing this line if the condition is met

#         # Process lines that contain "Name:" or "Name"
#         if "Name:" in line or "Name" in line or "Nama" in line or "Nama:" in line or "Nam:" in line or "Nam" in line or "amo:" in line or "amo" in line:
#             # Match and extract names from the current line
#             for name in name_matches:
#                 if name in line:
#                     # Split name on double spaces, commas, or # symbol
#                     split_names = re.split(r"\s{2,}|,\s*|#", name)
#                     for split_name in split_names:
#                         split_name = split_name.strip()
#                         # Check if the split_name is not a substring of any previously added names
#                         if split_name and not any(split_name in existing_name or existing_name in split_name for existing_name in extracted_names):
#                             extracted_names.append(split_name)

#     return extracted_names


# def upload_file(request):
#     if request.method == 'POST' and request.FILES.getlist('pdf_files'):
#         pdf_files = request.FILES.getlist('pdf_files')

#         state_list = [
#             'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
#             'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
#             'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
#             'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR', 'CHHATTISGARH', 'GOA', 'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH',
#             'JHARKHAND', 'KARNATAKA', 'KERALA', 'MADHYA PRADESH', 'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND', 'ODISHA',
#             'PUNJAB', 'RAJASTHAN', 'SIKKIM', 'TAMIL NADU', 'TELANGANA', 'TRIPURA', 'UTTAR PRADESH', 'UTTARAKHAND', 'WEST BENGAL',
#             'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 
#             'Puducherry', 'Ladakh', 'Lakshadweep', 'Jammu and Kashmir'
#         ]


#         district_list = [
#             "Sangli", "Satara", "Solapur", "Kolhapur", "Pune", "Akola", "Amravati", "Buldhana",
#             "Yavatmal", "Washim", "Aurangabad", "Beed", "Jalna", "Dharashiv", "Nanded", "Latur",
#             "Parbhani", "Hingoli", "Bhandara", "Chandrapur", "Gadchiroli", "Gondia", "Nagpur",
#             "Wardha", "Ahmednagar", "Dhule", "Jalgaon", "Nandurbar", "Nashik", "Mumbai City",
#             "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg",
#             "SANGLI", "SATARA", "SOLAPUR", "KOLHAPUR", "PUNE", "AKOLA", "AMRAVATI", "BULDHANA",
#             "YAVATMAL", "WASHIM", "AURANGABAD", "BEED", "JALNA", "DHARASHIV", "NANDED", "LATUR",
#             "PARBHANI", "HINGOLI", "BHANDARA", "CHANDRAPUR", "GADCHIROLI", "GONDIA", "NAGPUR",
#             "WARDHA", "AHMEDNAGAR", "DHULE", "JALGAON", "NANDURBAR", "NASHIK", "MUMBAI CITY",
#             "MUMBAI SUBURBAN", "THANE", "PALGHAR", "RAIGAD", "RATNAGIRI", "SINDHUDURG",
#             "Bengaluru Urban", "Belagavi", "Bijapur", "Bagalkot", "Dakshina Kannada", "Chitradurga",
#             "Chikkamagaluru", "Tumakuru", "Hassan", "Udupi", "Kodagu", "Kolar", "Ramanagara", "Shivamogga", "Davanagere",
#             "Raichur", "Bagalkot", "Gadag", "Bidar", "Yadgir", "Koppal", "Chikkaballapura", "Chamarajanagar",
#             "Kalaburagi", "Mysuru", "Uttara Kannada", "Haveri", "Mandya", "Chandrapur", "East Godavari", "West Godavari",
#             "Visakhapatnam", "Srikakulam", "Vijayawada", "Guntur", "Krishna", "Prakasam", "Kurnool", "Anantapur",
#             "Chittoor", "Kadapa", "Nellore", "Mahabubnagar", "Khammam", "Warangal", "Nizamabad", "Medak",
#             "Hyderabad", "Karimnagar", "Adilabad", "Rangareddy", "Nalgonda", "Suryapet", "Miryalaguda", "Kurnool",
#             "Palakkad", "Kochi", "Ernakulam", "Alappuzha", "Idukki", "Pathanamthitta", "Kottayam", "Thrissur",
#             "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasargod", "Thiruvananthapuram", "Chennai", "Coimbatore",
#             "Tiruppur", "Trichy", "Madurai", "Erode", "Sivagangai", "Vellore", "Thanjavur", "Salem", "Ramanathapuram",
#             "Cuddalore", "Nagapattinam", "Dindigul", "Tirunelveli", "Virudhunagar", "Tiruppur", "Tiruvannamalai",
#             "Kanchipuram", "Ramanathapuram", "Nagapattinam", "Sivagangai", "Vellore", "Puducherry", "Andaman and Nicobar Islands",
#             "Lakshadweep", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Jammu", "Srinagar", "Kashmir",
#             "Leh", "Ladakh", "Puducherry"
#         ]


#         taluka_list = [
#             "KANKAVLI", "VAIBHAVWADI", "DEVGAD", "MALWAN", "SAWANTWADI", "KUDAL", "VENGURLA", "DODAMARG", "RATNAGIRI",
#             "SANGAMESHWAR", "LANJA", "RAJAPUR", "CHIPLUN", "GUHAGAR", "DAPOLI", "MANDANGAD", "PEN", "ALIBAG",
#             "MURUD", "PANVEL", "URAN", "KARJAT", "KHALAPUR", "MANGAON", "TALA", "ROHA", "SUDHAGAD-PALI",
#             "POLADPUR", "SHRIVARDHAN", "MHASALA", "KURLA", "ANDHERI", "BORIVALI", "THANE", "KALYAN", "MURBAD", "BHIWANDI",
#             "SHAHAPUR", "ULHASNAGAR", "AMBARNATH", "PALGHAR", "VASAI", "DAHANU", "TALASARI", "JAWHAR", "MOKHADA", "VADA",
#             "VIKRAMGAD", "NASHIK", "IGATPURI", "DINDORI", "TRIMBAKESHWAR", "KALWAN", "DEOLA", "SURGANA", "BAGLAN",
#             "MALEGAON", "NANDGAON", "CHANDWAD", "NIPHAD", "SINNAR", "YEOLA", "NANDURBAR", "NAVAPUR", "SHAHADA", "TALODE",
#             "AKKALKUWA", "DHADGAON", "DHULE", "SAKRI", "SINDKHEDA", "SHIRPUR", "JALGAON", "JAMNER", "ERANDOL", "DHARANGAON",
#             "BHUSAWAL", "RAVER", "MUKTAINAGAR", "BODWAD", "YAWAL", "AMALNER", "PAROLA", "CHOPDA", "PACHORA", "BHADGAON",
#             "CHALISGAON", "BULDHANA", "CHIKHLI", "DEULGAON RAJA", "JALGAON JAMOD", "SANGRAMPUR", "MALKAPUR", "MOTALA",
#             "NANDURA", "KHAMGAON", "SHEGAON", "MEHKAR", "SINDKHED RAJA", "LONAR", "AKOLA", "AKOT", "TELHARA", "BALAPUR",
#             "PATUR", "MURTAJAPUR", "BARSHITAKLI", "WASHIM", "MALEGAON", "RISOD", "MANGRULPIR", "KARANJA", "MANORA",
#             "AMRAVATI", "BHATUKALI", "NANDGAON KHANDESHWAR", "DHARNI", "CHIKHALDARA", "ACHALPUR", "CHANDURBAZAR", "MORSHI",
#             "WARUD", "DARYAPUR", "ANJANGAON-SURJI", "CHANDUR", "DHAMANGAON", "TIOSA", "WARDHA", "DEOLI", "SELOO", "ARVI",
#             "ASHTI", "KARANJA", "HINGANGHAT", "SAMUDRAPUR", "NAGPUR URBAN", "NAGPUR RURAL", "KAMPTEE", "HINGNA", "KATOL",
#             "NARKHED", "SAVNER", "KALAMESHWAR", "RAMTEK", "MOUDA", "PARSEONI", "UMRED", "KUHI", "BHIWAPUR", "BHANDARA",
#             "TUMSAR", "PAUNI", "MOHADI", "SAKOLI", "LAKHANI", "LAKHANDUR", "GONDIA", "GOREGAON", "SALEKASA", "TIRODA",
#             "AMGAON", "DEORI", "ARJUNI-MORGAON", "SADAK-ARJUNI", "GADCHIROLI", "DHANORA", "CHAMORSHI", "MULCHERA",
#             'DESAIGANJ', 'ARMORI', 'KURKHEDA', 'KORCHI', 'AHERI', 'ETAPALLI', 'BHAMRAGAD', 'SIRONCHA', 'CHANDRAPUR',
#             'SAOLI', 'MUL', 'BALLARPUR', 'POMBHURNA', 'GONDPIMPRI', 'WARORA', 'CHIMUR', 'BHADRAVATI', 'BRAMHAPURI',
#             'NAGBHID', 'SINDEWAHI', 'RAJURA', 'KORPANA', 'JIWATI', 'YAVATMAL', 'ARNI', 'BABHULGAON', 'KALAMB', 'DARWHA',
#             'DIGRAS', 'NER', 'PUSAD', 'UMARKHED', 'MAHAGAON', 'KELAPUR', 'RALEGAON', 'GHATANJI', 'WANI', 'MAREGAON',
#             'ZARI JAMANI', 'NANDED', 'ARDHAPUR', 'MUDKHED', 'BHOKAR', 'UMRI', 'LOHA', 'KANDHAR', 'KINWAT', 'HIMAYATNAGAR',
#             "HADGAON", "MAHUR", "DEGLUR", "MUKHED", "DHARMABAD", "BILOLI", "NAIGAON", "HINGOLI", "SENGAON", "KALAMNURI",
#             "BASMATH", "AUNDHA NAGNATH", "PARBHANI", "SONPETH", "GANGAKHED", "PALAM", "PURNA", "SAILU", "JINTUR", "MANWATH",
#             "PATHRI", "JALNA", "BHOKARDAN", "JAFRABAD", "BADNAPUR", "AMBAD", "GHANSAWANGI", "PARTUR", "MANTHA", "AURANGABAD",
#             "KANNAD", "SOEGAON", "SILLOD", "PHULAMBRI", "KHULDABAD", "VAIJAPUR", "GANGAPUR", "PAITHAN", "BEED", "ASHTI",
#             "PATODA", "SHIRUR-KASAR", "GEORAI", "MAJALGAON", "WADWANI", "KAIJ", "DHARUR", "PARLI", "AMBAJOGAI", "LATUR",
#             "RENAPUR", "AUSA", "AHMEDPUR", "JALKOT", "CHAKUR", "SHIRUR ANANTPAL", "NILANGA", "DEONI", "UDGIR", "OSMANABAD",
#             "TULJAPUR", "BHUM", "PARANDA", "WASHI", "KALAMB", "LOHARA", "UMARGA", "SOLAPUR NORTH", "BARSHI", "SOLAPUR SOUTH",
#             "AKKALKOT", "MADHA", "KARMALA", "PANDHARPUR", "MOHOL", "MALSHIRAS", "SANGOLE", "MANGALVEDHE", "NAGAR", "SHEVGAON",
#             "PATHARDI", "PARNER", "SANGAMNER", "KOPARGAON", "AKOLE", "SHRIRAMPUR", "NEVASA", "RAHATA", "RAHURI", "SHRIGONDA",
#             "KARJAT", "JAMKHED", "PUNE CITY", "HAVELI", "KHED", "JUNNAR", "AMBEGAON", "MAVAL", "MULSHI", "SHIRUR", "PURANDHAR",
#             "VELHE", "BHOR", "BARAMATI", "INDAPUR", "DAUND", "SATARA", "JAOLI", "KOREGAON", "WAI", "MAHABALESHWAR", "KHANDALA",
#             "PHALTAN", "MAAN", "KHATAV", "PATAN", "KARAD", "MIRAJ", "KAVATHEMAHANKAL", "TASGAON", "JAT", "WALWA", "SHIRALA",
#             "KHANAPUR", "ATPADI", "PALUS", "KADEGAON", "KARVIR", "PANHALA", "SHAHUWADI", "KAGAL", "HATKANANGALE", "SHIROL",
#             "RADHANAGARI", "GAGANBAWADA", "BHUDARGAD", "GADHINGLAJ", "CHANDGAD", "AJRA", "PETH", "KHED", "MAHAD", "JALANA"]


#         filtered_taluka_list = [taluka for taluka in taluka_list if taluka not in district_list]

#         try:
#             all_data = []
#             district_count = {district: 0 for district in district_list}

#             for pdf_file in pdf_files:
#                 with open(f'uploaded_{pdf_file.name}', 'wb+') as destination:
#                     for chunk in pdf_file.chunks():
#                         destination.write(chunk)

#                 pdf_file_path = f'uploaded_{pdf_file.name}'

#                 pdf_document = fitz.open(pdf_file_path)

#                 all_extracted_text = []
#                 polling_station = ""
#                 address_station = ""
#                 taluka = ""
#                 district = ""
#                 state = ""
#                 extracted_district = ""
#                 constituency_name = ""
#                 part_no = ""
#                 page_text = ""
#                 countPage = 0

#                 for page_num in range(pdf_document.page_count):
#                     page = pdf_document[page_num]

#                     page_extracted_text, full_page_text = process_pdf_page(page, pdf_document)

#                     # print('extracted', page_extracted_text)
#                     # print('page_text', full_page_text)

#                     all_extracted_text.extend(page_extracted_text)
#                     page_text += full_page_text

#                     if page_num == 0:

#                         constituency_pattern = r"Assembly Constituency\s*:\s*(\d+\s*-\s*[A-Z\s]+)(?=\s*\()"
#                         match = re.search(constituency_pattern, page_text)
#                         if match:
#                             constituency_name = match.group(1).strip()
#                         else:
#                             print('Constituency name not found in the first page')
                        
#                         district = None

#                         for district_name in district_list:
#                             count = page_text.count(district_name)
#                             if count > district_count[district_name]:
#                                 district_count[district_name] = count
#                                 district = district_name

#                         pattern = r"No\. and Name of Polling Station\s*:\s*(.*?)\s*Address of Polling Station\s*:\s*(.*?)(?=(Number of Auxiliary Polling|4, NUMBER OF ELECTORS|$))"
#                         match = re.search(pattern, page_text, re.DOTALL)
#                         if match:
#                             polling_station = match.group(1).strip()
#                             address_station = match.group(2).strip()

#                         pattern_details = (
#                             r"Main Town or Village\s*:\s*(.*?)\s*"
#                             r"Police Station\s*:\s*(.*?)\s*"
#                             r"Taluka\s*:\s*(.*?)\s*"
#                             r"District\s*:\s*(.*?)(?=(Main Town or Village|Police Station|Taluka|District|$))"
#                         )
#                         match_details = re.search(pattern_details, page_text, re.DOTALL)
#                         if match_details:
#                             main_town_village = match_details.group(1).strip()
#                             police_station = match_details.group(2).strip()
#                             taluka = match_details.group(3).strip()
#                             extracted_district = match_details.group(4).strip()

#                             if not district:
#                                 district = extracted_district

#                         district_pattern = r"District\s*:\s*(\w+)"

#                         district_match = re.search(district_pattern, page_text)

#                         if district_match:
#                             district_name_after_district_word = district_match.group(1).strip()
#                             if district_name_after_district_word in district_list:
#                                 district = district_name_after_district_word
#                         else:
#                             district_counts = Counter()
#                             for district_name in district_list:
#                                 district_counts[district_name] = page_text.count(district_name)

#                             if district_counts:
#                                 district = district_counts.most_common(1)[0][0]
#                             else:
#                                 district = None

#                         for taluka_name in filtered_taluka_list:
#                             pattern = r'\b' + re.escape(taluka_name) + r'\b'
#                             if re.search(pattern, page_text):
#                                 taluka = taluka_name
#                                 break

#                         if not taluka:
#                             taluka = extracted_district
#                             if not district and extracted_district in district_list:
#                                 district = extracted_district

#                         state = None
#                         for state_name in state_list:
#                             if state_name in page_text:
#                                 state = state_name
#                                 break

#                         part_no_pattern = r"Part No\.?\s*:\s*(\d+)"
#                         match = re.search(part_no_pattern, full_page_text)
#                         if match:
#                             part_no = match.group(1).strip()
#                             print("Part No:", part_no)
#                         else:
#                             countPage = 1

#                     # Extract part number from the second page (page_num == 1)
#                     if page_num == 1:
#                         if countPage == 1 :
#                             # part_no_pattern = r"Part No\.?:\s*(\d+)"
#                             part_no_pattern = r"Part No\.?\s*:\s*(\d+)"
#                             match = re.search(part_no_pattern, full_page_text)
#                             if match:
#                                 part_no = match.group(1).strip()
#                                 print("Part No:", part_no)
#                             else:
#                                 print('Part number not found on the second page')

#                 result_text = process_text(all_extracted_text)
#                 print('result', result_text)

#                 # extracted_names = process_names(result_text)


#                 # regex_father_name = r"(Father's|Fathers|Father|Fathors|Husband's|Husbands|Husband|Mother's|Mothers|Mother|Others :) Name:(.*?)\n"
#                 # father_name_matches = re.findall(regex_father_name, result_text)
#                 # father_name = [match[1].strip() for match in father_name_matches]

#                 # regex_house_number = r'House Number :(.*?)\n'
#                 # house_number = re.findall(regex_house_number, result_text)

#                 # regex_age = r'Age :(.*?)\n'
#                 # age = re.findall(regex_age, result_text)

#                 # regex_gender = r'Gender:\s*(Male|Melo|Malo|Female|Femelo|Femalo|Fomale|)\n'
#                 # gender = re.findall(regex_gender, result_text)

#                 # max_length = max(len(father_name), len(extracted_names), len(house_number), len(age), len(gender))

#                 # father_name += [""] * (max_length - len(father_name))
#                 # # name += [""] * (max_length - len(name))
#                 # house_number += [""] * (max_length - len(house_number))
#                 # age += [None] * (max_length - len(age))
#                 # gender += [None] * (max_length - len(gender))

#                 # cleaned_names = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers)\b', '', fn).strip() for fn in extracted_names]
#                 # cleaned_names = [re.sub(r'[^a-zA-Z\s]', '', n).strip() for n in cleaned_names]

#                 # cleaned_father_name = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers|Others)\b', '', fn).strip() for fn in father_name]
#                 # cleaned_father_name = [re.sub(r'[^a-zA-Z\s]', '', fn).strip() for fn in cleaned_father_name]

#                 # unwanted_phrases = [
#                 #     "Type of Polling Station General",
#                 #     "(Male/Female/General)",
#                 #     "Number of Auxiliary Polling 0",
#                 #     "Stations in this part :",
#                 #     "Stations in this pai",
#                 #     "Stations in this pari"
#                 # ]

#                 # def remove_unwanted_phrases(text, phrases):
#                 #     for phrase in phrases:
#                 #         text = text.replace(phrase, "").strip()
#                 #     return text

#                 # def remove_unwanted_words(text, words):
#                 #     words_in_text = text.split()
#                 #     filtered_words = [word for word in words_in_text if word not in words]
#                 #     return " ".join(filtered_words)

#                 # def clean_town_or_village(text):
#                 #     text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
#                 #     return text.strip()

#                 # polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
#                 # address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

#                 # unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

#                 # polling_station = remove_unwanted_words(polling_station, unwanted_words)
#                 # address_station = remove_unwanted_words(address_station, unwanted_words)

#                 # polling_station = clean_town_or_village(polling_station)

#                 # if part_no:
#                 #     address_station = f"{part_no} - {address_station}"

#                 # result_array = polling_station.split(" - ")

#                 # if len(result_array) > 1:
#                 #     string_part = result_array[1]
#                 # else:
#                 #     string_part = result_array[0]  

#                 # voter_id_pattern = r"(\w+)\s+(?:Available|Avaliable|Availablo|Avallable)" # Example pattern for voter IDs
#                 # voter_ids = re.findall(voter_id_pattern, result_text)

#                 # # Pad voter_ids to match max_length
#                 # voter_ids += [""] * (max_length - len(voter_ids))

#                 # df = pd.DataFrame({
#                 #     'Name': cleaned_names,
#                 #     'Parent Name': cleaned_father_name,
#                 #     'House Number': house_number,
#                 #     'Age': age,
#                 #     'Gender': gender,
#                 #     'Town or Village': [string_part] * max_length,
#                 #     'Address of Polling Station': [address_station] * max_length,
#                 #     'Taluka': [taluka] * max_length,
#                 #     'District': [district] * max_length,
#                 #     'State': [state] * max_length,
#                 #     'Constituency Name': [constituency_name] * max_length,
#                 #     'Voter Id': voter_ids
#                 # })


#                 # Functions for text processing and cleaning
#                 def clean_text(text, unwanted_phrases):
#                     for phrase in unwanted_phrases:
#                         text = text.replace(phrase, "").strip()
#                     return text

#                 def normalize_gender(gender_text):
#                     mapping = {"Malo": "Male", "Melo": "Male", "Femalo": "Female", "Fomale": "Female"}
#                     return mapping.get(gender_text.strip(), gender_text)

#                 # Process result_text
#                 unwanted_phrases = [
#                     "Type of Polling Station General",
#                     "(Male/Female/General)",
#                     "Number of Auxiliary Polling 0",
#                     "Stations in this part :",
#                     "Stations in this pai",
#                     "Stations in this pari"
#                 ]

#                 def remove_unwanted_phrases(text, phrases):
#                     for phrase in phrases:
#                         text = text.replace(phrase, "").strip()
#                     return text

#                 def remove_unwanted_words(text, words):
#                     words_in_text = text.split()
#                     filtered_words = [word for word in words_in_text if word not in words]
#                     return " ".join(filtered_words)

#                 def clean_town_or_village(text):
#                     text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
#                     return text.strip()

#                 # Extract details using regex
                
#                 # regex_serial_voter_id = r"(\d+)\s+(\w{10})"

#                 # regex_name = r"Name: :(.*?)\n"
#                 # regex_name = r"(?<!and )Name: :(.*?)\n"
#                 # names = [name.strip() for name in re.findall(regex_name, result_text)]

#                 regex_father_name = r"(?:Father's|Fathers|Husband's|Husbands|Mother's|Mothers|Others): Name: (.*?)\n"
#                 parent_names = [name.strip() for name in re.findall(regex_father_name, result_text)]

#                 regex_house_number = r"House Number :(.*?)\n"
#                 house_numbers = [hn.strip() for hn in re.findall(regex_house_number, result_text)]

#                 regex_age = r"Age : (\d+)"
#                 ages = [age.strip() for age in re.findall(regex_age, result_text)]

#                 regex_gender = r"Gender : (Male|Malo|Melo|Female|Femalo|Fomale)"
#                 genders = [normalize_gender(gender) for gender in re.findall(regex_gender, result_text)]

#                 # regex_voter_id = r"(\w+)\s+(?:Available|Avaliable|Availablo|Avallable)"
#                 # voter_ids = [vid.strip() for vid in re.findall(regex_voter_id, result_text)]

#                 # serial_voter_ids = re.findall(regex_serial_voter_id, result_text)
#                 # serial_numbers = [int(serial) for serial, _ in serial_voter_ids]
#                 # voter_ids = [voter_id for _, voter_id in serial_voter_ids]

#                 # serial_voter_ids = re.findall(regex_serial_voter_id, result_text)

#                 # # Skipping the first 3 entries
#                 # serial_voter_ids = serial_voter_ids[3:]

#                 # serial_numbers = [int(serial) for serial, _ in serial_voter_ids]
#                 # voter_ids = [voter_id for _, voter_id in serial_voter_ids]

#                 # # Regex for serial number and voter ID
#                 # regex_serial_voter_id = r"(\d+)\s+(\w{10})"
#                 # serial_voter_ids = re.findall(regex_serial_voter_id, result_text)

#                 # # Skipping the first 3 entries
#                 # serial_voter_ids = serial_voter_ids[3:]

#                 # # Extracting serial numbers and voter IDs
#                 # serial_numbers = [int(serial) for serial, _ in serial_voter_ids]
#                 # voter_ids = [voter_id for _, voter_id in serial_voter_ids]

#                 # # Regex for names (ignoring the "and" in "Name: :")
#                 # regex_name = r"(?<!and )Name: :(.*?)(?=\n|$)"
#                 # names = [name.strip() for name in re.findall(regex_name, result_text)]

#                 # # Regex for serial number and voter ID
#                 # regex_serial_voter_id = r"(\d+)\s+(\w{10})"
#                 # serial_voter_ids = re.findall(regex_serial_voter_id, result_text)

#                 # # Skipping the first 3 entries (if needed)
#                 # serial_voter_ids = serial_voter_ids[3:]

#                 # # Extracting serial numbers and voter IDs
#                 # serial_numbers = [int(serial) for serial, _ in serial_voter_ids]
#                 # voter_ids = [voter_id for _, voter_id in serial_voter_ids]

#                 # # Regex for names (ignoring the "and" in "Name: :")
#                 # regex_name = r"(?<!and )Name: :(.*?)(?=\n|$)"
#                 # names = [name.strip() for name in re.findall(regex_name, result_text)]

#                 # Regex for serial numbers and voter IDs
#                 regex_serial_voter_id = r"(\d+)\s+([A-Z0-9]{10})"
#                 serial_voter_ids = re.findall(regex_serial_voter_id, result_text)

#                 # Extracting serial numbers and voter IDs
#                 serial_numbers = [int(serial) for serial, _ in serial_voter_ids]
#                 voter_ids = [voter_id for _, voter_id in serial_voter_ids]

#                 # Regex for names
#                 regex_name = r"(?<!and )Name: :\s*(.*?)(?=\n|$)"
#                 names = [name.strip() for name in re.findall(regex_name, result_text)]

#                 # # Combine the extracted data
#                 # combined_data = list(zip(serial_numbers, voter_ids, names))

#                 polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
#                 address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

#                 unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

#                 polling_station = remove_unwanted_words(polling_station, unwanted_words)
#                 address_station = remove_unwanted_words(address_station, unwanted_words)

#                 polling_station = clean_town_or_village(polling_station)

#                 if part_no:
#                     address_station = f"{part_no} - {address_station}"

#                 result_array = polling_station.split(" - ")

#                 if len(result_array) > 1:
#                     string_part = result_array[1]
#                 else:
#                     string_part = result_array[0]  

#                 # Ensure all lists have the same length
#                 # max_length = max(len(names), len(parent_names), len(house_numbers), len(ages), len(genders), len(voter_ids))
#                 # names += [""] * (max_length - len(names))
#                 # parent_names += [""] * (max_length - len(parent_names))
#                 # house_numbers += [""] * (max_length - len(house_numbers))
#                 # ages += [""] * (max_length - len(ages))
#                 # genders += [""] * (max_length - len(genders))
#                 # voter_ids += [""] * (max_length - len(voter_ids))

#                 # max_length = max(len(serial_numbers), len(voter_ids), len(names), len(parent_names), len(house_numbers), len(ages), len(genders))

#                 # serial_numbers += [""] * (max_length - len(serial_numbers))
#                 # voter_ids += [""] * (max_length - len(voter_ids))
#                 # names += [""] * (max_length - len(names))
#                 # parent_names += [""] * (max_length - len(parent_names))
#                 # house_numbers += [""] * (max_length - len(house_numbers))
#                 # ages += [""] * (max_length - len(ages))
#                 # genders += [""] * (max_length - len(genders))

#                 # Ensure lists have the same length
#                 max_length = max(len(serial_numbers), len(voter_ids), len(names), len(parent_names), len(house_numbers), len(ages), len(genders))

#                 serial_numbers += [""] * (max_length - len(serial_numbers))
#                 voter_ids += [""] * (max_length - len(voter_ids))
#                 names += [""] * (max_length - len(names))
#                 parent_names += [""] * (max_length - len(parent_names))
#                 house_numbers += [""] * (max_length - len(house_numbers))
#                 ages += [""] * (max_length - len(ages))
#                 genders += [""] * (max_length - len(genders))

#                 # Create DataFrame
#                 df = pd.DataFrame({
#                     'Serial No': serial_numbers,
#                     'Voter Id': voter_ids,
#                     'Name': names,
#                     'Parent Name': parent_names,
#                     'House Number': house_numbers,
#                     'Age': ages,
#                     'Gender': genders,
#                     'Town or Village': [string_part] * max_length,
#                     'Address of Polling Station': [address_station] * max_length,
#                     'Taluka': [taluka] * max_length,
#                     'District': [district] * max_length,
#                     'State': [state] * max_length,
#                     'Constituency Name': [constituency_name] * max_length,
#                 })

#                 all_data.append(df)

#             combined_df = pd.concat(all_data, ignore_index=True)
#             combined_df.index = range(1, len(combined_df) + 1)
#             combined_df['Age'] = pd.to_numeric(combined_df['Age'], errors='coerce')

#             response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
#             response['Content-Disposition'] = 'attachment; filename="extracted_data.xlsx"'
#             combined_df.to_excel(response, index_label='Record_ID')

#             return response
        
#         except Exception as e:
#             import traceback
#             error_message = f"Error processing PDFs: {e}\n{traceback.format_exc()}"
#             return render(request, 'upload_file.html', {'error_message': error_message})

#     return render(request, 'upload_file.html')





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
    # print('result_text', result_text)
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

                    page_extracted_text, full_page_text = process_pdf_page(page, pdf_document)

                    # print('extracted', page_extracted_text)
                    # print('page_text', full_page_text)

                    all_extracted_text.extend(page_extracted_text)
                    page_text += full_page_text

                    if page_num == 0:

                        constituency_pattern = r"Assembly Constituency\s*:\s*(\d+\s*-\s*[A-Z\s]+)(?=\s*\()"
                        match = re.search(constituency_pattern, page_text)
                        if match:
                            constituency_name = match.group(1).strip()
                        else:
                            print('Constituency name not found in the first page')
                        
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
                            print("Part No:", part_no)
                        else:
                            countPage = 1

                    # Extract part number from the second page (page_num == 1)
                    if page_num == 1:
                        if countPage == 1 :
                            # part_no_pattern = r"Part No\.?:\s*(\d+)"
                            part_no_pattern = r"Part No\.?\s*:\s*(\d+)"
                            match = re.search(part_no_pattern, full_page_text)
                            if match:
                                part_no = match.group(1).strip()
                                print("Part No:", part_no)
                            else:
                                print('Part number not found on the second page')

                result_text = process_text(all_extracted_text)
                # print('result', result_text)

                # extracted_names = process_names(result_text)


                # regex_father_name = r"(Father's|Fathers|Father|Fathors|Husband's|Husbands|Husband|Mother's|Mothers|Mother|Others :) Name:(.*?)\n"
                # father_name_matches = re.findall(regex_father_name, result_text)
                # father_name = [match[1].strip() for match in father_name_matches]

                # regex_house_number = r'House Number :(.*?)\n'
                # house_number = re.findall(regex_house_number, result_text)

                # regex_age = r'Age :(.*?)\n'
                # age = re.findall(regex_age, result_text)

                # regex_gender = r'Gender:\s*(Male|Melo|Malo|Female|Femelo|Femalo|Fomale|)\n'
                # gender = re.findall(regex_gender, result_text)

                # max_length = max(len(father_name), len(extracted_names), len(house_number), len(age), len(gender))

                # father_name += [""] * (max_length - len(father_name))
                # # name += [""] * (max_length - len(name))
                # house_number += [""] * (max_length - len(house_number))
                # age += [None] * (max_length - len(age))
                # gender += [None] * (max_length - len(gender))

                # cleaned_names = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers)\b', '', fn).strip() for fn in extracted_names]
                # cleaned_names = [re.sub(r'[^a-zA-Z\s]', '', n).strip() for n in cleaned_names]

                # cleaned_father_name = [re.sub(r'\b(Fathers|Mothers|Husbands|Husoands|Feathers|Others)\b', '', fn).strip() for fn in father_name]
                # cleaned_father_name = [re.sub(r'[^a-zA-Z\s]', '', fn).strip() for fn in cleaned_father_name]

                # unwanted_phrases = [
                #     "Type of Polling Station General",
                #     "(Male/Female/General)",
                #     "Number of Auxiliary Polling 0",
                #     "Stations in this part :",
                #     "Stations in this pai",
                #     "Stations in this pari"
                # ]

                # def remove_unwanted_phrases(text, phrases):
                #     for phrase in phrases:
                #         text = text.replace(phrase, "").strip()
                #     return text

                # def remove_unwanted_words(text, words):
                #     words_in_text = text.split()
                #     filtered_words = [word for word in words_in_text if word not in words]
                #     return " ".join(filtered_words)

                # def clean_town_or_village(text):
                #     text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
                #     return text.strip()

                # polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
                # address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

                # unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

                # polling_station = remove_unwanted_words(polling_station, unwanted_words)
                # address_station = remove_unwanted_words(address_station, unwanted_words)

                # polling_station = clean_town_or_village(polling_station)

                # if part_no:
                #     address_station = f"{part_no} - {address_station}"

                # result_array = polling_station.split(" - ")

                # if len(result_array) > 1:
                #     string_part = result_array[1]
                # else:
                #     string_part = result_array[0]  

                # voter_id_pattern = r"(\w+)\s+(?:Available|Avaliable|Availablo|Avallable)" # Example pattern for voter IDs
                # voter_ids = re.findall(voter_id_pattern, result_text)

                # # Pad voter_ids to match max_length
                # voter_ids += [""] * (max_length - len(voter_ids))

                # df = pd.DataFrame({
                #     'Name': cleaned_names,
                #     'Parent Name': cleaned_father_name,
                #     'House Number': house_number,
                #     'Age': age,
                #     'Gender': gender,
                #     'Town or Village': [string_part] * max_length,
                #     'Address of Polling Station': [address_station] * max_length,
                #     'Taluka': [taluka] * max_length,
                #     'District': [district] * max_length,
                #     'State': [state] * max_length,
                #     'Constituency Name': [constituency_name] * max_length,
                #     'Voter Id': voter_ids
                # })


                # Functions for text processing and cleaning
                def clean_text(text, unwanted_phrases):
                    for phrase in unwanted_phrases:
                        text = text.replace(phrase, "").strip()
                    return text

                def normalize_gender(gender_text):
                    mapping = {"Malo": "Male", "Melo": "Male", "Femalo": "Female", "Fomale": "Female"}
                    return mapping.get(gender_text.strip(), gender_text)

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

                def clean_town_or_village(text):
                    text = re.sub(r"\bTaluka\b.*", "", text, flags=re.IGNORECASE)
                    return text.strip()

                # Extract details using regex

                # regex_father_name = r"(?:Father's|Fathers|Husband's|Husbands|Mother's|Mothers|Others): Name: (.*?)\n"
                # parent_names = [name.strip() for name in re.findall(regex_father_name, result_text)]

                # regex_house_number = r"House Number :(.*?)\n"
                # house_numbers = [hn.strip() for hn in re.findall(regex_house_number, result_text)]

                # regex_age = r"Age : (\d+)"
                # ages = [age.strip() for age in re.findall(regex_age, result_text)]

                # regex_gender = r"Gender : (Male|Malo|Melo|Female|Femalo|Fomale)"
                # genders = [normalize_gender(gender) for gender in re.findall(regex_gender, result_text)]

                # Regex to extract parent/father/husband/mother/other names
                
                regex_parent_name = r"(?:Father's|Fathers|Husband's|Husbands|Mother's|Mothers|Others) Name[: ]+(\w[\w\s]+)"
                parent_names = [name.strip() for name in re.findall(regex_parent_name, result_text)]

                # Regex to extract house numbers
                regex_house_number = r"House Number :\s*([\w\s]+)"
                house_numbers = [hn.strip() for hn in re.findall(regex_house_number, result_text)]

                # Regex to extract ages
                regex_age = r"Age : (\d+)"
                ages = [age.strip() for age in re.findall(regex_age, result_text)]

                # Regex to extract genders (normalize variants)
                regex_gender = r"Gender :\s*(Male|Malo|Melo|Female|Femalo|Fomale)"
                genders = [normalize_gender(gender) for gender in re.findall(regex_gender, result_text)]

                regex_serial_voter_id = r"(\d+)\s+(?:\d+\s+)?(\w{10})"
                serial_voter_ids = re.findall(regex_serial_voter_id, result_text)

                # Skipping the first 3 entries
                serial_voter_ids = serial_voter_ids[3:]

                # Extracting serial numbers and voter IDs
                serial_numbers = [int(serial) for serial, _ in serial_voter_ids]
                voter_ids = [voter_id for _, voter_id in serial_voter_ids]

                # Regex for names (ignoring the "and" in "Name: :")
                regex_name = r"(?<!and )Name: :(.*?)(?=\n|$)"
                names = [name.strip() for name in re.findall(regex_name, result_text)]

                # # Regex for serial numbers and voter IDs
                # regex_serial_voter_id = r"(\d+)\s+(?:\d+\s+)?(\w{10})"
                # serial_voter_ids = re.findall(regex_serial_voter_id, result_text)

                # # Skipping the first 3 entries
                # serial_voter_ids = serial_voter_ids[3:]

                # # Regex for names
                # regex_name = r"(?<!and )Name: :(.*?)(?=\n|$)"
                # names = [name.strip() for name in re.findall(regex_name, result_text)]

                # # Extracting valid entries
                # valid_entries = [
                #     (serial, name, voter_id)
                #     for (serial, voter_id), name in zip(serial_voter_ids, names)
                #     if not voter_id.isalpha()  # Skip if voter_id is only alphabets
                # ]

                # # Unpacking serial numbers, names, and voter IDs
                # serial_numbers = [int(serial) for serial, _, _ in valid_entries]
                # names = [name for _, name, _ in valid_entries]
                # voter_ids = [voter_id for _, _, voter_id in valid_entries]

                polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
                address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

                unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

                polling_station = remove_unwanted_words(polling_station, unwanted_words)
                address_station = remove_unwanted_words(address_station, unwanted_words)

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

