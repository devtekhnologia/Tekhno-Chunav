# # working code 

from rest_framework import serializers
from .models import Voterlist, Town, Cast, Booth, User, LiveStatus, Religion

class VoterlistSerializer(serializers.ModelSerializer):
    town_name = serializers.SerializerMethodField()
    booth_name = serializers.SerializerMethodField()
    booth_id = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    voter_cast_name = serializers.SerializerMethodField()
    voter_updated_date = serializers.DateField(format='%Y-%m-%d', required=False, allow_null=True)
    live_status_type = serializers.SerializerMethodField()
    voter_religion_name = serializers.SerializerMethodField()
    booth_name_mar = serializers.SerializerMethodField()
    town_name_mar = serializers.SerializerMethodField()
    
    class Meta:
        model = Voterlist
        fields = [
            'voter_id', 'voter_name', 'voter_parent_name', 'voter_house_number', 'voter_age', 'voter_gender', 
            'town_name', 'booth_id', 'booth_name', 'voter_contact_number', 'voter_cast_id', 'voter_cast_name', 
            'voter_favour_id', 'voter_constituency_id', 'voter_dob', 'voter_marital_status_id', 'voter_updated_by', 
            'user_name', 'voter_updated_date', 'voter_live_status_id', 'live_status_type', 'voter_religion_name', 
            'voter_dead_year', 'voter_vote_confirmation_id', 'voter_in_city_id', 'voter_current_location', 
            'booth_name_mar', 'town_name_mar', 'voter_name_mar'  # Include voter_name_mar directly as a field
        ]

        extra_kwargs = {
            'voter_house_number': {'allow_null': True, 'required': False},
            'voter_parent_name': {'allow_null': True, 'required': False},
            'voter_age': {'allow_null': True, 'required': False},
            'voter_gender': {'allow_null': True, 'required': False},
            'voter_contact_number': {'allow_null': True, 'required': False},
            'voter_cast_id': {'allow_null': True, 'required': False},
            'voter_favour_id': {'allow_null': True, 'required': False},
            'voter_constituency_id': {'allow_null': True, 'required': False},
            'voter_dob': {'allow_null': True, 'required': False},
            'voter_marital_status_id': {'allow_null': True, 'required': False},
            'voter_updated_by': {'allow_null': True, 'required': False},
            'voter_updated_date': {'allow_null': True, 'required': False},
            'voter_live_status_id': {'allow_null': True, 'required': False},
            'voter_dead_year': {'allow_null': True, 'required': False},
            'vote_confirmation_type': {'allow_null': True, 'required': False},
            'voter_in_city_id': {'allow_null': True, 'required': False},
            'voter_current_location': {'allow_null': True, 'required': False},
            'booth_name_mar': {'allow_null': True, 'required': False},
            'town_name_mar': {'allow_null': True, 'required': False},
            'voter_name_mar': {'allow_null': True, 'required': False},
        }

    def get_town_name(self, obj):
        if obj.voter_town_id:
            try:
                town = Town.objects.get(town_id=obj.voter_town_id)
                return town.town_name
            except Town.DoesNotExist:
                return None
        return None

    def get_voter_cast_name(self, obj):
        if obj.voter_cast_id:
            try:
                cast = Cast.objects.get(cast_id=obj.voter_cast_id)
                return cast.cast_name
            except Cast.DoesNotExist:
                return None
        return None

    def get_booth_name(self, obj):
        if obj.voter_booth_id:
            try:
                booth = Booth.objects.get(booth_id=obj.voter_booth_id)
                return booth.booth_name
            except Booth.DoesNotExist:
                return None
        return None

    def get_booth_id(self, obj):
        return obj.voter_booth_id

    def get_user_name(self, obj):
        try:
            user = User.objects.get(user_id=obj.voter_updated_by)
            return user.user_name
        except User.DoesNotExist:
            return None

    def get_live_status_type(self, obj):
        if obj.voter_live_status_id:
            try:
                live_status = LiveStatus.objects.get(live_status_id=obj.voter_live_status_id)
                return live_status.live_status_type
            except LiveStatus.DoesNotExist:
                return None
        return None

    def get_voter_religion_name(self, obj):
        if obj.voter_religion_id:
            try:
                religion = Religion.objects.get(religion_id=obj.voter_religion_id)
                return religion.religion_name
            except Religion.DoesNotExist:
                return None
        return None

    def get_booth_name_mar(self, obj):
        if obj.voter_booth_id:
            try:
                booth = Booth.objects.get(booth_id=obj.voter_booth_id)
                return booth.booth_name_mar 
            except Booth.DoesNotExist:
                return None
        return None

    def get_town_name_mar(self, obj):
        if obj.voter_town_id:
            try:
                town = Town.objects.get(town_id=obj.voter_town_id)
                return town.town_name_mar  
            except Town.DoesNotExist:
                return None
        return None


   

# # # register api
# api for multiple booth asign to user

from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
   class Meta:
       model = User
       fields = ['user_id', 'user_name', 'user_phone', 'user_password']

from .models import UserBooth

class UserBoothSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBooth
        fields = ['user_booth_user_id', 'user_booth_booth_id']

class UserRegistrationSerializer(serializers.Serializer):
    user_name = serializers.CharField(max_length=255)
    user_password = serializers.CharField(max_length=255)
    user_phone = serializers.CharField(max_length=15)
    booth_ids = serializers.ListField(
        child=serializers.IntegerField()
    )


# # login api

class LoginSerializer(serializers.Serializer):
    user_phone = serializers.CharField()
    # user_booth_id = serializers.CharField()
    user_password = serializers.CharField()


# # Town api

from .models import Town

class TownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Town
        fields = ['town_id', 'town_name','town_name_mar']


# # Booth api

from .models import Booth
class BoothSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booth
        fields = ['booth_id', 'booth_name','booth_name_mar']


# # Panchayat_samiti api

from .models import PanchayatSamiti

class PanchayatSamitiSerializer(serializers.ModelSerializer):
    class Meta:
        model = PanchayatSamiti
        fields = ['panchayat_samiti_id', 'panchayat_samiti_name']


# # ZP api

from .models import ZP

class ZPSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZP
        fields = ['zp_id', 'zp_name']


# # Vidhansabha api 

from .models import Vidhansabha

class VidhansabhaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vidhansabha
        fields = ['vidhansabha_id', 'vidhansabha_name']


# # State api

from .models import State

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['state_id', 'state_name']



# from .models import Voter
# class VoterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Voter
#         fields = '__all__'
 


class VoterlistSerializerWithCast(serializers.ModelSerializer):
    class Meta:
        model = Voterlist
        fields = ['voter_name', 'voter_cast_id']


# Politician register

from .models import Politician

class PoliticianSerializer(serializers.ModelSerializer):
    politician_about = serializers.CharField(required=False, allow_blank=True)  

    class Meta:
        model = Politician
        fields = ['politician_id', 'politician_name', 'politician_contact_number', 'politician_password', 'politician_about']

        extra_kwargs = {
            'politician_name': {'required': False},
            'politician_contact_number': {'required': False},
            'politician_password': {'write_only': True, 'required': False},
            'politician_about': {'required': False}
        }


# Politician login

from rest_framework import serializers

class PoliticianLoginSerializer(serializers.Serializer):
    politician_name = serializers.CharField()
    politician_password = serializers.CharField(write_only=True)

# Cast API

from .models import Cast

class CastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cast
        fields = ['cast_id', 'cast_name', 'cast_religion_id']


# # Religion api

from .models import Religion
class ReligionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Religion
        fields = ['religion_id', 'religion_name']


# Favour non-favour api

from .models import Favour_non_favour

class Favour_non_favourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voterlist
        fields = ['voter_id', 'voter_favour_id']


# town_user login

from .models import Town_user

class Town_userLoginSerializer(serializers.Serializer):
    town_user_contact_number  = serializers.IntegerField()
    town_user_password = serializers.CharField()


# town_user register

# from .models import Town_user

# class Town_userSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Town_user
#         fields = [ 'town_user_name', 'town_user_contact_number', 'town_user_password', 'town_user_town_id']


from .models import Town_user, UserTown

class TownUserSerializer(serializers.ModelSerializer):
   class Meta:
       model = Town_user
       fields = ['user_town_town_user_id', 'town_user_name', 'town_user_contact_number', 'town_user_password']

class UserTownSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTown
        fields = ['user_town_town_user_id', 'user_town_town_id']

class TownUserRegistrationSerializer(serializers.Serializer):
    town_user_name = serializers.CharField(max_length=255)
    town_user_password = serializers.CharField(max_length=255)
    town_user_contact_number = serializers.CharField(max_length=15)
    town_ids = serializers.ListField(
        child=serializers.IntegerField()
    )

# constituency wise voter api

from .models import Voterlist, Constituency

class ConstituencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Constituency
        fields = ['constituency_id', 'constituency_name']


# Marital status api

from .models import MaritalStatus

class MaritalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaritalStatus
        fields = ['marital_status_id', 'marital_status_type']


# Panchayat Samiti Circle

from .models import PanchayatSamitiCircle

class PanchayatSamitiCircleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PanchayatSamitiCircle
        fields = ['panchayat_samiti_circle_id', 'panchayat_samiti_circle_name']

# ZP Circle 

from .models import ZpCircle

class ZpCircleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZpCircle
        fields = ['zp_circle_id', 'zp_circle_name']



# voter vote confirmation

from .models import Vote_confirmation

class vote_confirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote_confirmation
        fields = ['vote_confirmation_id', 'vote_confirmation_type']




# panchayat samiti circle user registration

from .models import Panchayat_samiti_circle_user, User_panchayat_samiti_circle

class Panchayat_samiti_circle_userSerializer(serializers.ModelSerializer):
   class Meta:
       model = Panchayat_samiti_circle_user
       fields = [ 'panchayat_samiti_circle_user_name', 'panchayat_samiti_circle_user_contact_number', 'panchayat_samiti_circle_user_password']

class User_panchayat_samiti_circleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_panchayat_samiti_circle
        fields = ['user_panchayat_samiti_circle_id', 'user_panchayat_samiti_circle_panchayat_samiti_circle_id']

class Panchayat_samiti_circle_userRegistrationSerializer(serializers.Serializer):
    panchayat_samiti_circle_user_name = serializers.CharField(max_length=255)
    panchayat_samiti_circle_user_password = serializers.CharField(max_length=255)
    panchayat_samiti_circle_user_contact_number = serializers.IntegerField()
    panchayat_samiti_circle_ids = serializers.ListField(
        child=serializers.IntegerField()
    )


# zp circle user registration

from .models import Zp_circle_user, User_zp_circle

class Zp_circle_userSerializer(serializers.ModelSerializer):
   class Meta:
       model = Zp_circle_user
       fields = [ 'zp_circle_user_name', 'zp_circle_user_contact_number', 'zp_circle_user_password']

class User_zp_circleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_zp_circle
        fields = ['user_zp_circle_id', 'user_zp_circle_panchayat_zp_circle_id']

class Zp_circle_userRegistrationSerializer(serializers.Serializer):
    zp_circle_user_name = serializers.CharField(max_length=255)
    zp_circle_user_password = serializers.CharField(max_length=255)
    zp_circle_user_contact_number = serializers.IntegerField()
    zp_circle_ids = serializers.ListField(
        child=serializers.IntegerField()
    )

# # PS Circle User Login API

from rest_framework import serializers

class Panchayat_samiti_circle_userLoginSerializer(serializers.Serializer):
    panchayat_samiti_circle_user_name = serializers.CharField(max_length=100)
    panchayat_samiti_circle_user_password = serializers.CharField(max_length=100)


# # ZP Circle User Login API

from .models import Zp_circle_user

class Zp_circle_userLoginSerializer(serializers.ModelSerializer):
    zp_circle_user_name = serializers.CharField()
    zp_circle_user_password = serializers.CharField()

    class Meta:
        model = Zp_circle_user
        fields = ['zp_circle_user_name', 'zp_circle_user_password']


# vote confirmation

from .models import Voter, VoteConfirmation

class VoteConfirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteConfirmation
        fields = ['vote_confirmation_id', 'vote_confirmation_type']



# #

# class BoothDetailsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Booth,Town
#         fields = ['booth_id', 'booth_name', 'town_id', 'town_name']


class NewVoterlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voterlist
        fields = [
            'voter_name', 
            'voter_parent_name', 
            'voter_house_number', 
            'voter_age', 
            'voter_gender', 
            'voter_booth_id', 
            'voter_contact_number', 
            'voter_cast_id', 
            'voter_dob', 
            'voter_marital_status_id', 
            'voter_live_status_id', 
            'voter_dead_year', 
            'voter_vote_confirmation_id'
        ]

    def __init__(self, *args, **kwargs):
        super(NewVoterlistSerializer, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            field.required = False

from .models import PrabhagUser

class PrabhagUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrabhagUser
        fields = ['prabhag_user_name', 'prabhag_user_contact_number', 'prabhag_user_password', 'prabhag_user_prabhag_id']