# working code

# from django.db import models

# class Voterlist(models.Model):
#     voter_id = models.AutoField(primary_key=True)
#     voter_name = models.CharField(max_length=255)
#     voter_parent_name = models.CharField(max_length=255)
#     voter_house_number = models.CharField(max_length=255)
#     voter_age = models.CharField(max_length=255)
#     voter_gender = models.CharField(max_length=255)
#     voter_town_id = models.IntegerField()
#     voter_booth_id = models.IntegerField()
#     voter_contact_number = models.BigIntegerField()
#     voter_cast_id = models.IntegerField()
#     voter_favour_id = models.IntegerField()
#     voter_constituency_id = models.IntegerField()
#     voter_dob = models.DateField()
#     voter_marital_status_id = models.IntegerField()
#     voter_updated_by = models.IntegerField(null=True, blank=True)  # Store user_id as an integer
#     voter_updated_date = models.DateField(auto_now=True, null=True, blank=True)
#     voter_live_status_id = models.IntegerField(null=True, blank=True)
#     voter_religion_id = models.IntegerField(null=True, blank=True)
#     voter_dead_year = models.IntegerField(null=True, blank=True)
#     voter_vote_confirmation_id = models.IntegerField(null=True, blank=True)
#     voter_in_city_id =  models.IntegerField(null=True, blank=True)
#     voter_current_location = models.CharField(max_length=1000)
#     voter_name_mar = models.CharField(max_length=255)
#     voter_serial_number = models.BigIntegerField(null=True, blank=True)
#     voter_id_card_number = models.CharField(max_length=255, null=True, blank=True)


#     class Meta:
#         db_table = 'tbl_voter'


from django.db import models

class Voterlist(models.Model):
    voter_id = models.AutoField(primary_key=True)
    voter_serial_number = models.IntegerField(null=True, blank=True)
    voter_id_card_number = models.CharField(max_length=255, null=True, blank=True)
    voter_name = models.CharField(max_length=255)
    voter_parent_name = models.CharField(max_length=255, null=True, blank=True)
    voter_house_number = models.CharField(max_length=255, null=True, blank=True)
    voter_age = models.CharField(max_length=255, null=True, blank=True)
    voter_gender = models.CharField(max_length=255, null=True, blank=True)
    voter_contact_number = models.BigIntegerField(null=True, blank=True)
    voter_current_location = models.CharField(max_length=1000, null=True, blank=True)
    voter_booth_id = models.IntegerField(null=True, blank=True)
    voter_town_id = models.IntegerField(null=True, blank=True)
    voter_cast_id = models.IntegerField(null=True, blank=True)
    voter_religion_id = models.IntegerField(null=True, blank=True)
    voter_favour_id = models.IntegerField(null=True, blank=True)
    voter_constituency_id = models.IntegerField(null=True, blank=True)
    voter_dob = models.DateField(null=True, blank=True)
    voter_marital_status_id = models.IntegerField(null=True, blank=True)
    voter_updated_by = models.IntegerField(null=True, blank=True)  # Stores user_id
    voter_updated_date = models.DateField(auto_now=True, null=True, blank=True)
    voter_live_status_id = models.IntegerField(null=True, blank=True)
    voter_dead_year = models.IntegerField(null=True, blank=True)
    voter_vote_confirmation_id = models.IntegerField(null=True, blank=True)
    voter_group_id = models.IntegerField(null=True, blank=True)
    voter_in_city_id = models.IntegerField(null=True, blank=True)
    voter_name_mar = models.CharField(max_length=255, null=True, blank=True)
    voter_parent_name_mar = models.CharField(max_length=255, null=True, blank=True)
    voter_gender_mar = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'tbl_voter'

class Cast(models.Model):
    cast_id = models.AutoField(primary_key=True)
    cast_name = models.CharField(max_length=255)
    cast_religion_id = models.IntegerField()
    
    class Meta:
        db_table = 'tbl_cast'


class Booth(models.Model):
    booth_id = models.AutoField(primary_key=True)
    booth_name = models.CharField(max_length=255)
    booth_town_id = models.IntegerField()
    booth_name_mar = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_booth'
        unique_together = ('booth_name', 'booth_town_id')

class Town(models.Model):
    town_id = models.AutoField(primary_key=True)
    town_name = models.CharField(max_length=255)
    town_panchayat_samiti_id = models.IntegerField()
    town_panchayat_samiti_circle_id = models.IntegerField()
    town_name_mar = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_town'
        unique_together = ('town_name', 'town_panchayat_samiti_id')





# # register api

from django.contrib.auth.hashers import make_password

class User(models.Model):
    user_id = models.AutoField(primary_key=True)  
    user_name = models.CharField(max_length=100)
    user_phone = models.CharField(max_length=20)
    user_password = models.CharField(max_length=256)
    user_town_town_user_id = models.IntegerField()
    user_booth_id = models.IntegerField()
    user_is_logged_in = models.BooleanField(default=False) 
    user_prabhag_user_id = models.IntegerField() 

    def save(self, *args, **kwargs):        
        
        if self.user_password:
            self.user_password = make_password(self.user_password)
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'tbl_user'



# # Get_voters api

class Voter(models.Model):
    voter_id = models.AutoField(primary_key=True)
    voter_name = models.CharField(max_length=100)
    # voter_contact_number = models.CharField(max_length=20)
    # voter_cast = models.CharField(max_length=255)
    booth_name = models.CharField(max_length=100)
    town_name = models.CharField(max_length=100)
    voter_contact_number = models.CharField(max_length=20)
    booth_id = models.IntegerField()  


    class Meta:
        managed = False 



# # Panchayat_samiti api

class PanchayatSamiti(models.Model):
    panchayat_samiti_id = models.AutoField(primary_key=True)
    panchayat_samiti_name = models.CharField(max_length=255)
    panchayat_samiti_zp_id = models.IntegerField()
    panchayat_samiti_name_mar = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_panchayat_samiti'
        unique_together = ('panchayat_samiti_name', 'panchayat_samiti_zp_id')



# # ZP api

class ZP(models.Model):
    zp_id = models.AutoField(primary_key=True)
    zp_name = models.CharField(max_length=255)
    zp_state_id = models.IntegerField()
    zp_name_mar = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_zp'
        unique_together = ('zp_name', 'zp_state_id')


# # vidhansabha api

class Vidhansabha(models.Model):
    vidhansabha_id = models.AutoField(primary_key=True)
    vidhansabha_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_vidhansabha'


# # state api

class State(models.Model):
    state_id = models.AutoField(primary_key=True)
    state_name = models.CharField(max_length=255)
    state_name_mar = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_state'



# politician login and politician register

from django.contrib.auth.hashers import make_password

class Politician(models.Model):
    politician_id = models.AutoField(primary_key=True)
    politician_name = models.CharField(max_length=255, unique=True)
    politician_contact_number = models.CharField(max_length=15)
    politician_password = models.CharField(max_length=255)
    politician_about = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'tbl_politician'

    def save(self, *args, **kwargs):
        self.politician_password = make_password(self.politician_password)
        super(Politician, self).save(*args, **kwargs)

        

# Religion api

class Religion(models.Model):
    religion_id = models.AutoField(primary_key=True)
    religion_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_religion'
        

# Favour non-favour api

class Favour_non_favour(models.Model):
    favour_id = models.AutoField(primary_key=True)
    favour_type = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_favour'
        unique_together = ('favour_id', 'favour_type')


# user_town login and user_town register

class Town_user(models.Model):
    town_user_id = models.AutoField(primary_key=True)
    town_user_name = models.CharField(max_length=255, unique=True)
    town_user_contact_number = models.BigIntegerField(unique=True)
    town_user_password = models.CharField(max_length=255)
    town_user_town_id = models.IntegerField()
    town_user_politician_id = models.IntegerField()

    class Meta:
        db_table = 'tbl_town_user'

    def save(self, *args, **kwargs):
        self.town_user_password = make_password(self.town_user_password)  # Ensure you hash the password correctly
        super().save(*args, **kwargs) 


class UserTown(models.Model):
    user_town_town_user_id =  models.IntegerField()
    user_town_town_id = models.IntegerField()

    class Meta:
        db_table = 'tbl_user_town' 

        
# constituency wise voter api

class Constituency(models.Model):
    constituency_id = models.AutoField(primary_key=True)
    constituency_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_constituency'

# Marital statues api

class MaritalStatus(models.Model):
    marital_status_id = models.AutoField(primary_key=True)
    marital_status_type = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_marital_status'


 # api for multiple booth asign to user

class UserBooth(models.Model):
    user_booth_user_id =  models.IntegerField()
    user_booth_booth_id = models.IntegerField()

    class Meta:
        db_table = 'tbl_user_booth'  


# voter Live status

class LiveStatus(models.Model):
    live_status_id = models.AutoField(primary_key=True)
    live_status_type = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_live_status'


# religion api

class Religion(models.Model):
    religion_id = models.AutoField(primary_key=True)
    religion_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'tbl_religion'


# Panchayat Samiti Circle 

class PanchayatSamitiCircle(models.Model):
    panchayat_samiti_circle_id = models.AutoField(primary_key=True)
    panchayat_samiti_circle_name = models.CharField(max_length=255)
    panchayat_samiti_circle_zp_circle_id = models.IntegerField()

    def __str__(self):
        return self.panchayat_samiti_circle_name
    
    class Meta:
        db_table = 'tbl_panchayat_samiti_circle' 

# zp_circle

class ZpCircle(models.Model):
    zp_circle_id = models.AutoField(primary_key=True)
    zp_circle_name = models.CharField(max_length=255)
    zp_circle_zp_id = models.IntegerField()

    def __str__(self):
        return self.zp_circle_name
    
    class Meta:
        db_table = 'tbl_zp_circle' 


# voter vote confirmation

class Vote_confirmation(models.Model):
    vote_confirmation_id = models.AutoField(primary_key=True)
    vote_confirmation_type = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'tbl_vote_confirmation' 



# # Panchayat samiti circle user

class Panchayat_samiti_circle_user(models.Model):
    panchayat_samiti_circle_user_id = models.AutoField(primary_key=True)
    panchayat_samiti_circle_user_name = models.CharField(max_length=255, unique=True)
    panchayat_samiti_circle_user_contact_number = models.BigIntegerField()
    panchayat_samiti_circle_user_password = models.CharField(max_length=255)
    panchayat_samiti_circle_user_politician_id = models.IntegerField()

    class Meta:
        db_table = 'tbl_panchayat_samiti_circle_user'
        
    def save(self, *args, **kwargs):        
        if self.panchayat_samiti_circle_user_password:
            self.panchayat_samiti_circle_user_password = make_password(self.panchayat_samiti_circle_user_password)
        super().save(*args, **kwargs)


class User_panchayat_samiti_circle(models.Model):
    user_panchayat_samiti_circle_id =  models.IntegerField()
    user_panchayat_samiti_circle_panchayat_samiti_circle_id = models.IntegerField()

    class Meta:
        db_table = 'tbl_user_panchayat_samiti_circle'  


# Zp circle user

class Zp_circle_user(models.Model):
    zp_circle_user_id = models.AutoField(primary_key=True)
    zp_circle_user_name = models.CharField(max_length=255, unique=True)
    zp_circle_user_contact_number = models.BigIntegerField()
    zp_circle_user_password = models.CharField(max_length=255)
    zp_circle_user_politician_id = models.IntegerField()

    class Meta:
        db_table = 'tbl_zp_circle_user'

    def save(self, *args, **kwargs):        
        if self.zp_circle_user_password:
            self.zp_circle_user_password = make_password(self.zp_circle_user_password)
        super().save(*args, **kwargs)
        
        
class User_zp_circle(models.Model):
    user_zp_circle_id =  models.IntegerField()
    user_zp_circle_zp_circle_id = models.IntegerField()

    class Meta:
        db_table = 'tbl_user_zp_circle'    



# vote confirmation

class VoteConfirmation(models.Model):
    vote_confirmation_id = models.AutoField(primary_key=True)
    vote_confirmation_type = models.CharField(max_length=50)

    def __str__(self):
        return self.vote_confirmation_type

from django.contrib.auth.hashers import make_password, check_password

class PrabhagUser(models.Model):
    prabhag_user_id = models.AutoField(primary_key=True) 
    prabhag_user_name = models.CharField(max_length=100)
    prabhag_user_contact_number = models.BigIntegerField()
    prabhag_user_password = models.CharField(max_length=100)  # Consider hashing this for security
    prabhag_user_prabhag_id = models.IntegerField()
    prabhag_user_politician_id = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'tbl_prabhag_user'

    def set_password(self, password):
        self.prabhag_user_password = make_password(password)

    def check_password(self, password):
        return check_password(password, self.prabhag_user_password)



class VoterGroup(models.Model):
    voter_group_id = models.AutoField(primary_key=True)
    voter_group_name = models.CharField(max_length=255)
    voter_group_voter_group_user_id = models.IntegerField()
 
    def __str__(self):
        return self.voter_group_name
   
    class Meta:
        db_table = 'tbl_voter_group'
 
 
 
class VoterGroupUser(models.Model):
    voter_group_user_id = models.AutoField(primary_key=True)
    voter_group_user_name = models.CharField(max_length=255, unique=True)
    voter_group_user_contact_number = models.BigIntegerField()
    voter_group_user_password = models.CharField(max_length=255)
 
    class Meta:
        db_table = 'tbl_voter_group_user'
 
    def save(self, *args, **kwargs):        
        if self.voter_group_user_password:
            self.voter_group_user_password = make_password(self.voter_group_user_password)
        super().save(*args, **kwargs)
 
 
class UserVoterGroup(models.Model):
    user_voter_group_id = models.AutoField(primary_key=True)
    user_voter_group_voter_id = models.IntegerField()
    user_voter_group_voter_group_id = models.IntegerField()
 
    class Meta:
        db_table = 'tbl_user_voter_group'
