# from django.db import models

# class Voter(models.Model):
#     name = models.CharField(max_length=255)
#     parent_name = models.CharField(max_length=255, blank=True, null=True)
#     house_number = models.CharField(max_length=255, blank=True, null=True)
#     age = models.CharField(max_length=255, blank=True, null=True)
#     gender = models.CharField(max_length=255, blank=True, null=True)
#     town = models.CharField(max_length=255, blank=True, null=True)
#     booth = models.CharField(max_length=255, blank=True, null=True)

#     def __str__(self):
#         return self.name



# from django.db import models

# class Voter(models.Model):
#     name = models.CharField(max_length=255)
#     parent_name = models.CharField(max_length=255, blank=True, null=True)
#     house_number = models.CharField(max_length=255, blank=True, null=True)
#     age = models.CharField(max_length=255, blank=True, null=True)
#     gender = models.CharField(max_length=255, blank=True, null=True)
#     town = models.CharField(max_length=255, blank=True, null=True)
#     booth = models.CharField(max_length=255, blank=True, null=True)

#     def __str__(self):
#         return self.name





# # this taluka list from views.py 

        # taluka_list = [
        #     "Kankavli", "Vaibhavwadi", "Devgad", "Malwan", "Sawantwadi", "Kudal", "Vengurla", "Dodamarg", "Ratnagiri",
        #     "Sangameshwar", "Lanja", "Rajapur", "Chiplun", "Guhagar", "Dapoli", "Mandangad", "Khed", "Pen", "Alibag",
        #     "Murud", "Panvel", "Uran", "Karjat", "Khalapur", "Mangaon", "Tala", "Roha", "Sudhagad-Pali", "Mahad",
        #     "Poladpur", "Shrivardhan", "Mhasala", "Kurla", "Andheri", "Borivali", "Thane", "Kalyan", "Murbad", "Bhiwandi",
        #     "Shahapur", "Ulhasnagar", "Ambarnath", "Palghar", "Vasai", "Dahanu", "Talasari", "Jawhar", "Mokhada", "Vada",
        #     "Vikramgad", "Nashik", "Igatpuri", "Dindori", "Peth", "Trimbakeshwar", "Kalwan", "Deola", "Surgana", "Baglan",
        #     "Malegaon", "Nandgaon", "Chandwad", "Niphad", "Sinnar", "Yeola", "Nandurbar", "Navapur", "Shahada", "Talode",
        #     "Akkalkuwa", "Dhadgaon", "Dhule", "Sakri", "Sindkheda", "Shirpur", "Jalgaon", "Jamner", "Erandol", "Dharangaon",
        #     "Bhusawal", "Raver", "Muktainagar", "Bodwad", "Yawal", "Amalner", "Parola", "Chopda", "Pachora", "Bhadgaon",
        #     "Chalisgaon", "Buldhana", "Chikhli", "Deulgaon Raja", "Jalgaon Jamod", "Sangrampur", "Malkapur", "Motala",
        #     "Nandura", "Khamgaon", "Shegaon", "Mehkar", "Sindkhed Raja", "Lonar", "Akola", "Akot", "Telhara", "Balapur",
        #     "Patur", "Murtajapur", "Barshitakli", "Washim", "Malegaon", "Risod", "Mangrulpir", "Karanja", "Manora",
        #     "Amravati", "Bhatukali", "Nandgaon Khandeshwar", "Dharni", "Chikhaldara", "Achalpur", "Chandurbazar", "Morshi",
        #     "Warud", "Daryapur", "Anjangaon-Surji", "Chandur", "Dhamangaon", "Tiosa", "Wardha", "Deoli", "Seloo", "Arvi",
        #     "Ashti", "Karanja", "Hinganghat", "Samudrapur", "Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Katol",
        #     "Narkhed", "Savner", "Kalameshwar", "Ramtek", "Mouda", "Parseoni", "Umred", "Kuhi", "Bhiwapur", "Bhandara",
        #     "Tumsar", "Pauni", "Mohadi", "Sakoli", "Lakhani", "Lakhandur", "Gondia", "Goregaon", "Salekasa", "Tiroda",
        #     "Amgaon", "Deori", "Arjuni-Morgaon", "Sadak-Arjuni", "Gadchiroli", "Dhanora", "Chamorshi", "Mulchera",
        #     "Desaiganj", "Armori", "Kurkheda", "Korchi", "Aheri", "Etapalli", "Bhamragad", "Sironcha", "Chandrapur",
        #     "Saoli", "Mul", "Ballarpur", "Pombhurna", "Gondpimpri", "Warora", "Chimur", "Bhadravati", "Bramhapuri",
        #     "Nagbhid", "Sindewahi", "Rajura", "Korpana", "Jiwati", "Yavatmal", "Arni", "Babhulgaon", "Kalamb", "Darwha",
        #     "Digras", "Ner", "Pusad", "Umarkhed", "Mahagaon", "Kelapur", "Ralegaon", "Ghatanji", "Wani", "Maregaon",
        #     "Zari Jamani", "Nanded", "Ardhapur", "Mudkhed", "Bhokar", "Umri", "Loha", "Kandhar", "Kinwat", "Himayatnagar",
        #     "Hadgaon", "Mahur", "Deglur", "Mukhed", "Dharmabad", "Biloli", "Naigaon", "Hingoli", "Sengaon", "Kalamnuri",
        #     "Basmath", "Aundha Nagnath", "Parbhani", "Sonpeth", "Gangakhed", "Palam", "Purna", "Sailu", "Jintur", "Manwath",
        #     "Pathri", "Jalna", "Bhokardan", "Jafrabad", "Badnapur", "Ambad", "Ghansawangi", "Partur", "Mantha", "Aurangabad",
        #     "Kannad", "Soegaon", "Sillod", "Phulambri", "Khuldabad", "Vaijapur", "Gangapur", "Paithan", "Beed", "Ashti",
        #     "Patoda", "Shirur-Kasar", "Georai", "Majalgaon", "Wadwani", "Kaij", "Dharur", "Parli", "Ambajogai", "Latur",
        #     "Renapur", "Ausa", "Ahmedpur", "Jalkot", "Chakur", "Shirur Anantpal", "Nilanga", "Deoni", "Udgir", "Osmanabad",
        #     "Tuljapur", "Bhum", "Paranda", "Washi", "Kalamb", "Lohara", "Umarga", "Solapur North", "Barshi", "Solapur South",
        #     "Akkalkot", "Madha", "Karmala", "Pandharpur", "Mohol", "Malshiras", "Sangole", "Mangalvedhe", "Nagar", "Shevgaon",
        #     "Pathardi", "Parner", "Sangamner", "Kopargaon", "Akole", "Shrirampur", "Nevasa", "Rahata", "Rahuri", "Shrigonda",
        #     "Karjat", "Jamkhed", "Pune City", "	Haveli", "Khed", "Junnar", "Ambegaon", "Maval", "Mulshi", "Shirur", "Purandhar",
        #     "Velhe", "Bhor", "Baramati", "Indapur", "Daund", "Satara", "Jaoli", "Koregaon", "Wai", "Mahabaleshwar", "Khandala",
        #     "Phaltan", "Maan", "Khatav", "Patan", "Karad", "Miraj", "Kavathemahankal", "Tasgaon", "Jat", "Walwa", "	Shirala", 
        #     "Khanapur", "Atpadi", "Palus", "Kadegaon", "	Karvir","Panhala", "Shahuwadi", "Kagal", "Hatkanangale", "	Shirol",
        #     "Radhanagari", "Gaganbawada", "Bhudargad", "Gadhinglaj", "Chandgad", "Ajra"]




# def clean_town_or_village(text):
#                     text = re.sub(r'\d+', '', text)  
#                     text = text.strip()  
#                     text = re.sub(r'^[^\w]+', '', text)  
#                     return text



                # def remove_unwanted_phrases(text, phrases):
                #     for phrase in phrases:
                #         text = text.replace(phrase, "").strip()
                #     return text

                # def remove_unwanted_words(text, words):
                #     words_in_text = text.split()
                #     filtered_words = [word for word in words_in_text if word not in words]
                #     return " ".join(filtered_words)
                
                # def clean_town_or_village(text):
                #     text = re.sub(r'\d+', '', text)  # Remove digits
                #     text = text.strip()  # Remove leading and trailing whitespace
                #     text = re.sub(r'^\s+', '', text)  # Ensure it starts with a word
                    # text = re.sub(r'^[^\w]+', '', text)  # Ensure it starts with a word
                #     return text

                # polling_station = remove_unwanted_phrases(polling_station, unwanted_phrases)
                # address_station = remove_unwanted_phrases(address_station, unwanted_phrases)

                # unwanted_words = set(word for phrase in unwanted_phrases for word in phrase.split())

                # polling_station = remove_unwanted_words(polling_station, unwanted_words)
                # address_station = remove_unwanted_words(address_station, unwanted_words)

                # polling_station = clean_town_or_village(polling_station)

                # df = pd.DataFrame({
                #     'Name': cleaned_names,