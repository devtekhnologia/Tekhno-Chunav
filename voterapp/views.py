from .models import Booth
from .models import Cast
from .models import MaritalStatus
from .models import PanchayatSamiti
from .models import PanchayatSamitiCircle
from .models import Panchayat_samiti_circle_user
from .models import Panchayat_samiti_circle_user, User_panchayat_samiti_circle
from .models import Politician
from .models import PrabhagUser
from .models import Religion
from .models import Religion, Voterlist
from .models import State
from .models import Town
from .models import Town_user
from .models import Town_user, UserTown
from .models import User
from .models import User, UserBooth
from .models import User_zp_circle, Zp_circle_user
from .models import Vidhansabha
from .models import Voterlist
from .models import ZP
from .models import ZpCircle
from .models import Zp_circle_user
from .serializers import BoothSerializer
from .serializers import CastSerializer
from .serializers import Favour_non_favourSerializer
from .serializers import LoginSerializer
from .serializers import MaritalStatusSerializer
from .serializers import NewVoterlistSerializer
from .serializers import PanchayatSamitiCircleSerializer
from .serializers import PanchayatSamitiSerializer
from .serializers import Panchayat_samiti_circle_userLoginSerializer
from .serializers import Panchayat_samiti_circle_userRegistrationSerializer
from .serializers import PoliticianLoginSerializer
from .serializers import PoliticianSerializer
from .serializers import PrabhagUserSerializer
from .serializers import ReligionSerializer
from .serializers import ReligionSerializer, VoterlistSerializer
from .serializers import StateSerializer
from .serializers import TownSerializer
from .serializers import TownUserRegistrationSerializer
from .serializers import Town_userLoginSerializer
from .serializers import UserRegistrationSerializer, UserSerializer
from .serializers import VidhansabhaSerializer
from .serializers import VoterlistSerializer
from .serializers import VoterlistSerializerWithCast
from .serializers import ZPSerializer
from .serializers import Zp_circle_userLoginSerializer
from .serializers import Zp_circle_userRegistrationSerializer
from datetime import datetime
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.hashers import make_password
from django.contrib.sessions.models import Session
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.db import connection
from django.db import connection, transaction
from django.db import transaction
from django.db.models import Q
from django.http import (HttpResponseBadRequest, HttpResponseNotAllowed)
from django.http import HttpResponse
from django.http import HttpResponse, HttpResponseBadRequest
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.http import HttpResponse, JsonResponse
from django.http import HttpResponseBadRequest, JsonResponse
from django.http import HttpResponseNotFound, JsonResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from fpdf import FPDF
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, SimpleDocTemplate
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table, TableStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from rest_framework import generics
from rest_framework import generics, status
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from twilio.base.exceptions import TwilioException
from twilio.rest import Client
from voterapp.models import Booth, Town, Voterlist
import io
import json
import jwt
import logging
import pandas as pd
import requests
import textwrap


def upload_file(request):
    if request.method == 'POST':
        if 'files' not in request.FILES:
            return HttpResponseBadRequest("No files uploaded")
        
        files = request.FILES.getlist('files')
        for file in files:
            import_excel_data(file)
        
        return HttpResponse("Files uploaded and data imported successfully")
    
    return render(request, 'upload_file.html')


# excel to DB


# @transaction.atomic
# def import_excel_data(file):
#     try:
#         df = pd.read_excel(file)
#     except Exception as e:
#         # logger.error(f"Error reading Excel file: {str(e)}")
#         return f"Error reading Excel file: {str(e)}"

#     successful_imports = 0
#     total_rows = len(df)

#     data_list = df.values.tolist()

#     booth_dict = {}
#     town_dict = {}
#     for rec in data_list:
#         state_name = rec[10]
#         district_name = rec[9]
#         taluka_name = rec[8]
#         town_name = rec[6]
#         booth_name = rec[7]
#         voter_name = rec[1]

        

#         booth_id = None
#         town_id = None
        

#         state, created = State.objects.get_or_create(state_name=state_name)

#         zp, created = ZP.objects.get_or_create(zp_name=district_name, zp_state_id=state.state_id)

#         panchayat_samiti, created = PanchayatSamiti.objects.get_or_create(panchayat_samiti_name=taluka_name, panchayat_samiti_zp_id=zp.zp_id)
        
#         if town_name not in town_dict:
#             town, created = Town.objects.get_or_create(town_name=town_name, town_panchayat_samiti_id=panchayat_samiti.panchayat_samiti_id)
#             town_dict[town_name] = town.town_id
#             town_id = town.town_id
#         else:
#             town_id = town_dict[town_name]

#         if booth_name not in booth_dict:
#             booth, created = Booth.objects.get_or_create(booth_name=booth_name, booth_town_id=town.town_id)
#             booth_dict[booth_name] = booth.booth_id
#             booth_id = booth.booth_id
#         else:
#             booth_id = booth_dict[booth_name]
        

#         #voter_name, created = Voterlist.objects.get_or_create(voter_name = voter_name, voter_town_id = town.town_id, voter_booth_id = booth.booth_id)

#         vote_obj = Voterlist(
            
#             voter_name = voter_name,
#             voter_parent_name = rec[2],
#             voter_house_number = rec[3],
#             voter_age = rec[4],
#             voter_gender = rec[5],
#             voter_town_id = town_id,
#             voter_booth_id = booth_id
#         )

#         vote_obj.save()


# # does not work on null values--------------------------------------------------------

# @transaction.atomic
# def import_excel_data(file):
#     try:
#         df = pd.read_excel(file)
#     except Exception as e:
#         # logger.error(f"Error reading Excel file: {str(e)}")
#         return f"Error reading Excel file: {str(e)}"

#     successful_imports = 0
#     total_rows = len(df)

#     data_list = df.values.tolist()

#     booth_dict = {}
#     town_dict = {}
#     for rec in data_list:
#         serial_no = rec[1]  # Assuming 'Serial No' is the first column
#         voter_id_card_number = rec[2]  # Assuming 'Voter Id' is the second column
#         voter_name = rec[3]
#         voter_parent_name = rec[4]
#         voter_house_number = rec[5]
#         voter_age = rec[6]
#         voter_gender = rec[7]
#         town_name = rec[8]
#         booth_name = rec[9]
#         taluka_name = rec[10]
#         district_name = rec[11]
#         state_name = rec[12]

#         booth_id = None
#         town_id = None

#         # State, ZP, and Panchayat Samiti creation
#         state, created = State.objects.get_or_create(state_name=state_name)
#         zp, created = ZP.objects.get_or_create(zp_name=district_name, zp_state_id=state.state_id)
#         panchayat_samiti, created = PanchayatSamiti.objects.get_or_create(
#             panchayat_samiti_name=taluka_name, 
#             panchayat_samiti_zp_id=zp.zp_id
#         )
        
#         # Town creation and caching
#         if town_name not in town_dict:
#             town, created = Town.objects.get_or_create(
#                 town_name=town_name, 
#                 town_panchayat_samiti_id=panchayat_samiti.panchayat_samiti_id
#             )
#             town_dict[town_name] = town.town_id
#             town_id = town.town_id
#         else:
#             town_id = town_dict[town_name]

#         # Booth creation and caching
#         if booth_name not in booth_dict:
#             booth, created = Booth.objects.get_or_create(
#                 booth_name=booth_name, 
#                 booth_town_id=town.town_id
#             )
#             booth_dict[booth_name] = booth.booth_id
#             booth_id = booth.booth_id
#         else:
#             booth_id = booth_dict[booth_name]

#         # Voter record creation
#         vote_obj = Voterlist(
#             voter_serial_number=serial_no,
#             voter_id_card_number=voter_id_card_number,
#             voter_name=voter_name,
#             voter_parent_name=voter_parent_name,
#             voter_house_number=voter_house_number,
#             voter_age=voter_age,
#             voter_gender=voter_gender,
#             voter_town_id=town_id,
#             voter_booth_id=booth_id
#         )

#         vote_obj.save()

#     return f"Successfully imported {successful_imports} out of {total_rows} rows."


#### work on null values 

@transaction.atomic
def import_excel_data(file):
    try:
        df = pd.read_excel(file)
    except Exception as e:
        return f"Error reading Excel file: {str(e)}"
 
    successful_imports = 0
    total_rows = len(df)
    data_list = df.values.tolist()
 
    booth_dict = {}
    town_dict = {}
 
    for rec in data_list:
        serial_no = rec[1]  # Assuming 'Serial No' is the second column
        voter_id_card_number = rec[2]  # Assuming 'Voter Id' is the third column
        voter_name = rec[3]
        voter_parent_name = rec[4]
        voter_house_number = rec[5]
        voter_age = rec[6]
        voter_gender = rec[7]
        town_name = rec[8]
        booth_name = rec[9]
        taluka_name = rec[10]
        district_name = rec[11]
        state_name = rec[12]
 
        # Handle null/empty values by replacing NaN with None
        if pd.isna(serial_no):
            serial_no = None
        if pd.isna(voter_id_card_number):
            voter_id_card_number = None
        if pd.isna(voter_name):
            voter_name = None
        if pd.isna(voter_parent_name):
            voter_parent_name = None
        if pd.isna(voter_house_number):
            voter_house_number = None
        if pd.isna(voter_age):
            voter_age = None
        if pd.isna(voter_gender):
            voter_gender = None
        if pd.isna(town_name):
            town_name = None
        if pd.isna(booth_name):
            booth_name = None
        if pd.isna(taluka_name):
            taluka_name = None
        if pd.isna(district_name):
            district_name = None
        if pd.isna(state_name):
            state_name = None
 
        booth_id = None
        town_id = None
 
        # State, ZP, and Panchayat Samiti creation
        state, created = State.objects.get_or_create(state_name=state_name)
        zp, created = ZP.objects.get_or_create(zp_name=district_name, zp_state_id=state.state_id)
        panchayat_samiti, created = PanchayatSamiti.objects.get_or_create(
            panchayat_samiti_name=taluka_name,
            panchayat_samiti_zp_id=zp.zp_id
        )
 
        # Town creation and caching
        if town_name not in town_dict:
            town, created = Town.objects.get_or_create(
                town_name=town_name,
                town_panchayat_samiti_id=panchayat_samiti.panchayat_samiti_id
            )
            town_dict[town_name] = town.town_id
            town_id = town.town_id
        else:
            town_id = town_dict[town_name]
 
        # Booth creation and caching
        if booth_name not in booth_dict:
            booth, created = Booth.objects.get_or_create(
                booth_name=booth_name,
                booth_town_id=town.town_id
            )
            booth_dict[booth_name] = booth.booth_id
            booth_id = booth.booth_id
        else:
            booth_id = booth_dict[booth_name]
 
        # Voter record creation
        vote_obj = Voterlist(
            voter_serial_number=serial_no,
            voter_id_card_number=voter_id_card_number,
            voter_name=voter_name,
            voter_parent_name=voter_parent_name,
            voter_house_number=voter_house_number,
            voter_age=voter_age,
            voter_gender=voter_gender,
            voter_town_id=town_id,
            voter_booth_id=booth_id
        )
 
        try:
            vote_obj.save()
            logger.info(f"Successfully saved voter: {vote_obj.voter_serial_number}")
            successful_imports += 1
        except ValidationError as e:
            logger.error(f"Validation error saving voter {serial_no}: {str(e)}")
        except Exception as e:
            logger.error(f"Error saving voter {serial_no}: {str(e)}")
 
    return f"Successfully imported {successful_imports} out of {total_rows} rows."
 


# # voter api



class VoterlistListCreate(generics.ListCreateAPIView):
    queryset = Voterlist.objects.all()
    serializer_class = VoterlistSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class VoterlistRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Voterlist.objects.all()
    serializer_class = VoterlistSerializer
    lookup_field = 'voter_id'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        instance.refresh_from_db()  # Refresh from database to ensure updated fields are fetched
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        user_id = self.request.session.get('user_id')
        print(user_id)
        serializer.save(voter_updated_by=user_id)
        


# # # user registration api             # api for multiple booth asign to user with registration


# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import User, UserBooth
# from .serializers import UserRegistrationSerializer, UserSerializer, UserBoothSerializer

# @api_view(['POST'])
# def register_user(request):
#     serializer = UserRegistrationSerializer(data=request.data)
    
#     if serializer.is_valid():
#         user_data = {
#             'user_name': serializer.validated_data['user_name'],
#             'user_password': serializer.validated_data['user_password'],
#             'user_phone': serializer.validated_data['user_phone']
#         }
        
#         user_serializer = UserSerializer(data=user_data)
        
#         if user_serializer.is_valid():
#             session_id = request.session.get('user_town_town_user_id')
#             user = user_serializer.save(user_town_town_user_id=session_id)
#             booth_ids = serializer.validated_data['booth_ids']
            
#             for booth_id in booth_ids:
#                 UserBooth.objects.create(user_booth_user_id=user.user_id, user_booth_booth_id=booth_id)
                
#             return Response({'status': 'User registered successfully'}, status=status.HTTP_201_CREATED)
#         else:
#             return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     else:
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# @method_decorator(csrf_exempt, name='dispatch')
# class UserListCreate(generics.ListCreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = UserRegistrationSerializer(data=request.data)
#         if serializer.is_valid():
#             user_data = {
#                 'user_name': serializer.validated_data['user_name'],
#                 'user_password': serializer.validated_data['user_password'],
#                 'user_phone': serializer.validated_data['user_phone']
#             }

#             user_serializer = UserSerializer(data=user_data)
#             if user_serializer.is_valid():
#                 session_id = request.session.get('user_town_town_user_id')
#                 user = user_serializer.save(user_town_town_user_id=session_id)
#                 booth_ids = serializer.validated_data['booth_ids']

#                 for booth_id in booth_ids:
#                     UserBooth.objects.create(user_booth_user_id=user.user_id, user_booth_booth_id=booth_id)

#                 return Response({'status': 'User registered successfully'}, status=status.HTTP_201_CREATED)
#             else:
#                 return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user_phone = serializer.validated_data['user_phone']
            
            # Check if the phone number already exists
            if User.objects.filter(user_phone=user_phone).exists():
                return Response(
                    {'error': 'This phone number is already in use. Please try another number.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user_data = {
                'user_name': serializer.validated_data['user_name'],
                'user_password': serializer.validated_data['user_password'],
                'user_phone': user_phone
            }

            user_serializer = UserSerializer(data=user_data)
            if user_serializer.is_valid():
                session_id = request.session.get('user_town_town_user_id')
                user = user_serializer.save(user_town_town_user_id=session_id)
                booth_ids = serializer.validated_data['booth_ids']

                for booth_id in booth_ids:
                    UserBooth.objects.create(user_booth_user_id=user.user_id, user_booth_booth_id=booth_id)

                return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @method_decorator(csrf_exempt, name='dispatch')
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# # login api

# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django.contrib.auth.hashers import check_password
# from .serializers import LoginSerializer
# from .models import User

# class UserLogin(APIView):
#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user_name = serializer.validated_data.get('user_name')
#             user_password = serializer.validated_data.get('user_password')

#             try:
#                 user = User.objects.get(user_name=user_name)
#             except User.DoesNotExist:
#                 return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#             if check_password(user_password, user.user_password):
#                 user_id = user.user_id
#                 response_data = {
#                     "message" : "Login Successful",
#                     "user_id" : user_id
#                 }
#                 request.session['user_id'] = user.user_id
#                 return Response(response_data, status=status.HTTP_200_OK)
#             else:
#                 return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # Booth user Logout API

# class UserLogout(APIView):
#     def post(self, request):
#         if 'user_id' in request.session:
#             del request.session['user_id']
#             return Response({"message": "Logout Successful"}, status=status.HTTP_200_OK)
#         else:
#             return Response({"message": "User not logged in"}, status=status.HTTP_400_BAD_REQUEST)


# from rest_framework import status
# from rest_framework.views import APIView
# from django.contrib.auth.hashers import check_password
# from .serializers import LoginSerializer
# from .models import User

# class UserLogin(APIView):
#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user_phone = serializer.validated_data.get('user_phone')
#             user_password = serializer.validated_data.get('user_password')

#             try:
#                 user = User.objects.get(user_phone=user_phone)
#             except User.DoesNotExist:
#                 return Response({"message": "First Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#             if not user.user_is_logged_in:
#                 print(user.user_is_logged_in)
#                 if check_password(user_password, user.user_password):
#                     # User.objects.filter(user_id=user.user_id).update(user_is_logged_in=True)

#                     user_id = user.user_id
#                     response_data = {
#                         "message": "Login Successful",
#                         "user_id": user_id
#                     }
#                     request.session['user_id'] = user.user_id  
#                     return Response(response_data, status=status.HTTP_200_OK)
#                 else:
#                     return Response({"message": "Second Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
#             else:
#                 return Response({"message": "User already logged in from another device"}, status=status.HTTP_403_FORBIDDEN)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user_phone = serializer.validated_data.get('user_phone')
            user_password = serializer.validated_data.get('user_password')

            try:
                user = User.objects.get(user_phone=user_phone)
            except User.DoesNotExist:
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            # if not user.user_is_logged_in:                                            # # # for multi login
            if check_password(user_password, user.user_password):
                user_id = user.user_id

                # Generate JWT token
                payload = {
                    "user_id": user_id,
                    "exp": datetime.utcnow() + timedelta(hours=24)  # Token valid for 24 hours
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

                response_data = {
                    "message": "Login Successful",
                    "user_id": user_id,
                    "token": token
                }

                request.session['user_id'] = user_id
                User.objects.filter(user_id=user_id).update(user_is_logged_in=True)
                
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            # else:
            #     return Response({"message": "User already logged in from another device"}, status=status.HTTP_403_FORBIDDEN)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# views.py

class UserLogout(APIView):
    def post(self, request, user_id):
        if 'user_id' in request.session:
            if request.session['user_id'] == user_id:
                try:
                    User.objects.filter(user_id=user_id).update(user_is_logged_in=False)
                except User.DoesNotExist:
                    return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

                del request.session['user_id']
                return Response({"message": "Logout Successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid user_id"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "User not logged in"}, status=status.HTTP_400_BAD_REQUEST)



# # Get users api

def get_voters(request, booth_id=None):
    state_id_param = request.GET.get('state_id')
    vidhansabha_id_param = request.GET.get('vidhansabha_id')
    zp_id_param = request.GET.get('zp_id')
    panchayat_samiti_id_param = request.GET.get('panchayat_samiti_id')
    town_id_param = request.GET.get('town_id')
    booth_id_param = request.GET.get('booth_id') if booth_id is None else booth_id

    cursor = connection.cursor()
    cursor.callproc('GetVoters', [state_id_param, vidhansabha_id_param, zp_id_param, panchayat_samiti_id_param, town_id_param, booth_id_param])
    results = cursor.fetchall()
    
    voters = []
    for row in results:
        voters.append({
            'voter_id': row[0],
            'voter_name': row[1],
            'booth_name': row[2], 
            'town_name': row[3]
        })
    
    return JsonResponse({'voters': voters})



# # Town api

class TownList(generics.ListAPIView):
    queryset = Town.objects.all()
    serializer_class = TownSerializer


# # Booth api




class BoothList(generics.ListAPIView):
    queryset = Booth.objects.all()
    serializer_class = BoothSerializer
    lookup_field = 'booth_id' 


# # Panchayat_samiti API




class PanchayatSamitiListCreate(generics.ListCreateAPIView):
    queryset = PanchayatSamiti.objects.all()
    serializer_class = PanchayatSamitiSerializer

class PanchayatSamitiRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = PanchayatSamiti.objects.all()
    serializer_class = PanchayatSamitiSerializer


# # ZP api




class ZPListCreate(generics.ListCreateAPIView):
    queryset = ZP.objects.all()
    serializer_class = ZPSerializer

class ZPRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = ZP.objects.all()
    serializer_class = ZPSerializer


# # vidhansabha api




class VidhansabhaListCreate(generics.ListCreateAPIView):
    queryset = Vidhansabha.objects.all()
    serializer_class = VidhansabhaSerializer

class VidhansabhaRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vidhansabha.objects.all()
    serializer_class = VidhansabhaSerializer


# # state api



class StateListCreate(generics.ListCreateAPIView):
    queryset = State.objects.all()
    serializer_class = StateSerializer

class StateRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = State.objects.all()
    serializer_class = StateSerializer



# # get_voters_by_booth wise api

# def get_voters_by_booth(request, booth_id):
#     with connection.cursor() as cursor:
#         cursor.execute("""
#             SELECT v.voter_id,voter_serial_number, voter_id_card_number, v.voter_name, b.booth_name, v.voter_contact_number, v.voter_cast_id, v.voter_favour_id, v.voter_booth_id,
#                        v.voter_town_id, v.voter_parent_name, v.voter_age, v.voter_gender, v.voter_marital_status_id, 
#                        v.voter_vote_confirmation_id, v.voter_in_city_id, v.voter_current_location, v.voter_name_mar
#             FROM tbl_voter v
#             JOIN tbl_booth b ON  b.booth_id = v.voter_booth_id 
#             WHERE v.voter_booth_id = %s
#         """, [booth_id])
#         results = cursor.fetchall()
    
#     voters = []
#     for row in results:
#         voters.append({
#             'voter_id': row[0],
#             'voter_serial_number': row[1],
#             'voter_id_card_number': row[2],
#             'voter_name': row[3],
#             'booth_name': row[4],
#             'voter_contact_number' : row[5],
#             'voter_cast_id' : row[6],
#             'voter_favour_id' : row[7],
#             'voter_booth_id' : row[8],
#             'voter_town_id' : row[9],
#             'voter_parent_name' : row[10],
#             'voter_age' : row[11],
#             'voter_gender' : row[12],
#             'voter_marital_status_id' : row[13],
#             'voter_vote_confirmation_id' : row[14],
#             'voter_in_city_id' : row[15],
#             'voter_current_location' : row[16],
#             'voter_name_mar' : row[17]

#         })
    
#     return JsonResponse(voters, safe= False)

def get_voters_by_booth(request, booth_id):
    with connection.cursor() as cursor:
        # Call the stored procedure
        cursor.callproc('get_voters_by_booth', [booth_id])
        results = cursor.fetchall()
    
    # Map the results to a dictionary
    voters = []
    for row in results:
        voters.append({
            'voter_id': row[0],
            'voter_serial_number': row[1],
            'voter_id_card_number': row[2],
            'voter_name': row[3],
            'booth_name': row[4],
            'voter_contact_number': row[5],
            'voter_cast_id': row[6],
            'voter_favour_id': row[7],
            'voter_booth_id': row[8],
            'voter_town_id': row[9],
            'voter_parent_name': row[10],
            'voter_age': row[11],
            'voter_gender': row[12],
            'voter_marital_status_id': row[13],
            'voter_vote_confirmation_id': row[14],
            'voter_in_city_id': row[15],
            'voter_current_location': row[16],
            'voter_name_mar': row[17],
        })
    
    # Return the response as JSON
    return JsonResponse(voters, safe=False)


# Get voters by cast wise

class GetVoterByCastView(View):
    def get(self, request, voter_cast_id):
        voters = Voterlist.objects.filter(voter_cast_id=voter_cast_id)
        voters_list = list(voters.values())
        return JsonResponse(voters_list, safe=False)
    

# Politician register




class PoliticianCreate(generics.ListCreateAPIView):
    queryset = Politician.objects.all()
    serializer_class = PoliticianSerializer

# class PoliticianDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Politician.objects.all()
#     serializer_class = PoliticianSerializer

class PoliticianDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Politician.objects.all()
    serializer_class = PoliticianSerializer

    def get_object(self):
        # Override the get_object method to fetch by mobile number
        politician_contact_number = self.kwargs.get('politician_contact_number')
        return Politician.objects.get(politician_contact_number=politician_contact_number)
    
# get politician by ID
class PoliticianGetView(View):
    def get(self, request, politician_id):
        with connection.cursor() as cursor:
            query = "SELECT * FROM tbl_politician WHERE politician_id = %s;"
            cursor.execute(query, [politician_id])
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
        
        results = [dict(zip(columns, row)) for row in rows]

        return JsonResponse(results, safe=False)




# Politician login

# from .serializers import PoliticianLoginSerializer
# from .models import Politician

# class PoliticianLoginView(APIView):
#     def post(self, request):
#         serializer = PoliticianLoginSerializer(data=request.data)
#         if serializer.is_valid():
#             username_or_contact = serializer.validated_data['politician_name']
#             password = serializer.validated_data['politician_password']

#             try:
#                 if username_or_contact.isdigit():
#                     politician = Politician.objects.get(politician_contact_number=username_or_contact)
#                 else:
#                     politician = Politician.objects.get(politician_name=username_or_contact)

#                 if check_password(password, politician.politician_password):
#                     request.session['politician_id'] = politician.politician_id
#                     response_data = {
#                         "message": "Login successful",
#                         "politician_id": politician.politician_id 
#                     }
#                     return Response(response_data, status=status.HTTP_200_OK)
#                 else:
#                     return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
#             except Politician.DoesNotExist:
#                 return Response({"error": "Politician not found"}, status=status.HTTP_404_NOT_FOUND)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class PoliticianLoginView(APIView):
    def post(self, request):
        serializer = PoliticianLoginSerializer(data=request.data)
        if serializer.is_valid():
            username_or_contact = serializer.validated_data['politician_name']
            password = serializer.validated_data['politician_password']

            try:
                if username_or_contact.isdigit():
                    politician = Politician.objects.get(politician_contact_number=username_or_contact)
                else:
                    politician = Politician.objects.get(politician_name=username_or_contact)

                if check_password(password, politician.politician_password):
                    request.session['politician_id'] = politician.politician_id
                    
                    payload = {
                        "politician_id": politician.politician_id,
                        "exp": datetime.utcnow() + timedelta(hours=24)  # Token valid for 24 hours
                    }
                    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

                    response_data = {
                        # "message": "Login successful",
                        # "politician_id": politician.politician_id,
                        "token": token
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
            except Politician.DoesNotExist:
                return Response({"error": "Politician not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

class PoliticianLogoutView(APIView):
    def post(self, request, politician_id):
        if 'politician_id' in request.session:
            if request.session['politician_id'] == politician_id:
                del request.session['politician_id']
                return Response({"message": "Logout Successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid politician_id"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "User not logged in"}, status=status.HTTP_400_BAD_REQUEST)


# Cast api 

class CastListView(generics.ListAPIView):
    queryset = Cast.objects.all()
    serializer_class = CastSerializer

class CastDetailView(generics.RetrieveAPIView):
    queryset = Cast.objects.all()
    serializer_class = CastSerializer
    lookup_field = 'cast_id'


# # Religion api

class ReligionListCreate(generics.ListCreateAPIView):
    queryset = Religion.objects.all()
    serializer_class = ReligionSerializer

class ReligionRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Religion.objects.all() 
    serializer_class = ReligionSerializer


# Favour non-favour api

# class Favour_non_favourRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Voterlist.objects.all()
#     serializer_class = Favour_non_favourSerializer

class Favour_non_favourRetriveUpdateDestroy(APIView):
    def post(self, request, *args, **kwargs):
        return self.handle_bulk_update(request)

    def put(self, request, *args, **kwargs):
        return self.handle_bulk_update(request)

    def handle_bulk_update(self, request):
        voter_ids = request.data.get('voter_ids', [])
        voter_favour_id = request.data.get('voter_favour_id', None)

        if not voter_ids or voter_favour_id is None:
            return Response(
                {"error": "voter_ids and voter_favour_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            updated_count = Voterlist.objects.filter(voter_id__in=voter_ids).update(voter_favour_id=voter_favour_id)
            
            return Response(
                {
                    "message": f"Successfully updated {updated_count} records.",
                    # "voter_ids": voter_ids,
                    # "voter_favour_id": voter_favour_id,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# town_user login

# from .serializers import Town_userLoginSerializer
# from .serializers import Town_userLoginSerializer
# from .models import Town_user 

# class Town_user_Login(APIView):
#     def post(self, request):
#         serializer = Town_userLoginSerializer(data=request.data)
#         if serializer.is_valid():
#             town_user_contact_number = serializer.validated_data.get('town_user_contact_number')
#             town_user_password = serializer.validated_data.get('town_user_password')

#             try:
#                 town_user = Town_user.objects.get(town_user_contact_number=town_user_contact_number)
#             except Town_user.DoesNotExist:
#                 return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#             if check_password(town_user_password, town_user.town_user_password):  
#                 request.session['user_town_town_user_id'] = town_user.town_user_id
#                 town_user_id = town_user.town_user_id
#                 response_data = {
#                     "message": "Login successful",
#                     "town_user_id": town_user_id
#                 }
#                 print(request.session.get('user_town_town_user_id'))
#                 return Response(response_data, status=status.HTTP_200_OK)
#             else:
#                 return Response({"message": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class Town_user_Login(APIView):
    def post(self, request):
        serializer = Town_userLoginSerializer(data=request.data)
        if serializer.is_valid():
            town_user_contact_number = serializer.validated_data.get('town_user_contact_number')
            town_user_password = serializer.validated_data.get('town_user_password')

            try:
                town_user = Town_user.objects.get(town_user_contact_number=town_user_contact_number)
            except Town_user.DoesNotExist:
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            if check_password(town_user_password, town_user.town_user_password):  
                town_user_id = town_user.town_user_id

                payload = {
                    "town_user_id": town_user_id,
                    "exp": datetime.utcnow() + timedelta(hours=24)  
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

                request.session['user_town_town_user_id'] = town_user_id
                response_data = {
                    "message": "Login successful",
                    "town_user_id": town_user_id,
                    "token": token
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# Town user Logout 

class Town_user_Logout(APIView):
    def post(self, request, user_town_town_user_id):
        if 'user_town_town_user_id' in request.session:
            if request.session['user_town_town_user_id'] == user_town_town_user_id:
                del request.session['user_town_town_user_id']
                return Response({"message": "Logout Successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid town_user_id"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "User not logged in"}, status=status.HTTP_400_BAD_REQUEST)

# # town user register

class Town_userCreate(generics.ListCreateAPIView):
    queryset = Town_user.objects.all()
    serializer_class = TownUserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            contact_number = serializer.validated_data['town_user_contact_number']
            
            if Town_user.objects.filter(town_user_contact_number=contact_number).exists():
                return Response(
                    {'error': 'This mobile number is already in use. Please try another number.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user_data = {
                'town_user_name': serializer.validated_data['town_user_name'],
                'town_user_password': serializer.validated_data['town_user_password'],
                'town_user_contact_number': contact_number,
                'town_user_politician_id': request.session.get('politician_id')
            }

            town_user = Town_user(**user_data)
            town_user.save()

            town_ids = serializer.validated_data['town_ids']
            for town_id in town_ids:
                UserTown.objects.create(user_town_town_user_id=town_user.town_user_id, user_town_town_id=town_id)

            return Response({'status': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
# update town user details

class Town_userUpdate(generics.RetrieveUpdateAPIView):
    queryset = Town_user.objects.all()
    serializer_class = TownUserRegistrationSerializer

    def update(self, request, *args, **kwargs):
        partial = True  
        town_user = self.get_object()  
        serializer = self.get_serializer(town_user, data=request.data, partial=partial)

        if serializer.is_valid():
            if 'town_user_name' in serializer.validated_data:
                town_user.town_user_name = serializer.validated_data['town_user_name']
            if 'town_user_password' in serializer.validated_data:
                town_user.town_user_password = serializer.validated_data['town_user_password']
            if 'town_user_contact_number' in serializer.validated_data:
                town_user.town_user_contact_number = serializer.validated_data['town_user_contact_number']
            town_user.town_user_politician_id = request.session.get('politician_id')  

            town_user.save()  

            town_ids = serializer.validated_data.get('town_ids')
            if town_ids is not None:
                UserTown.objects.filter(user_town_town_user_id=town_user.town_user_id).delete()
                for town_id in town_ids:
                    UserTown.objects.create(user_town_town_user_id=town_user.town_user_id, user_town_town_id=town_id)

            return Response({'status': 'User updated successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# get_town_voter

def get_town_voter_list(request, town_user_town_id):
    with connection.cursor() as cursor:
 
        cursor.callproc('get_town_voter_list',[town_user_town_id])
        results = cursor.fetchall()
 
    voters = []
    for row in results:
        voters.append({
            'voter_id': row[0],
            'voter_name': row[1],
            'booth_id': row[2],
            'booth_name': row[3],
            'town_id': row[4],
            'town_name': row[5],
            'voter_parent_name': row[6],
            'voter_house_number': row[7],
            'voter_age': row[8],
            'voter_gender': row[9],
            'voter_cast_id': row[10],
            'voter_contact_number': row[11],
            'voter_serial_number':row[12],
            'voter_id_card_number':row[13]
        })
 
    return JsonResponse({'voters': voters})
 


# get_taluka_voter_list

def get_taluka_voter_list(request, politician_taluka_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                v.voter_id, 
                v.voter_name, 
                b.booth_id, 
                b.booth_name, 
                t.town_id, 
                t.town_name,
                v.voter_parent_name,
                v.voter_house_number,
                v.voter_age,
                v.voter_gender,
                v.voter_cast_id,
                v.voter_contact_number
            FROM 
                tbl_voter v
            JOIN 
                tbl_booth b ON v.voter_booth_id = b.booth_id
            JOIN 
                tbl_town t ON b.booth_town_id = t.town_id
            JOIN 
                tbl_panchayat_samiti ps ON ps.panchayat_samiti_id = t.town_panchayat_samiti_id
            JOIN 
                tbl_politician p ON p.politician_taluka_id = ps.panchayat_samiti_id
            
            
            WHERE 
                p.politician_taluka_id = %s;
        """, [politician_taluka_id])
        results = cursor.fetchall()

    voters = []
    for row in results:
        voters.append({
            'voter_id': row[0],
            'voter_name': row[1],
            'booth_id': row[2],
            'booth_name': row[3],
            'town_id': row[4],
            'town_name': row[5],
            'voter_parent_name': row[6],
            'voter_house_number': row[7],
            'voter_age': row[8],
            'voter_gender': row[9],
            'voter_cast_id': row[10],
            'voter_contact_number': row[11]
        })

    return JsonResponse({'voters': voters})


# constituency wise voter api

class VotersByConstituencyView(generics.ListAPIView):
    serializer_class = VoterlistSerializer

    def get_queryset(self):
        constituency_id = self.kwargs['constituency_id']
        return Voterlist.objects.filter(voter_constituency_id=constituency_id)

# voter data updateed date and time

class MaritalStatusRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaritalStatus.objects.all()
    serializer_class = MaritalStatusSerializer


# Get voter list by constituency wise

def get_voters_by_constituency(request, constituency_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT v.voter_id, v.voter_name, c.constituency_name, v.voter_contact_number, v.voter_cast_id, 
                   v.voter_favour_id, v.voter_booth_id, v.voter_town_id, v.voter_parent_name, 
                   v.voter_age, v.voter_gender, v.voter_marital_status_id
            FROM tbl_voter v
            JOIN tbl_constituency c ON c.constituency_id = v.voter_constituency_id
            WHERE v.voter_constituency_id = %s
        """, [constituency_id])
        results = cursor.fetchall()
    
    voters = []
    for row in results:
        voters.append({
            'voter_id': row[0],
            'voter_name': row[1],
            'constituency_name': row[2],
            'voter_contact_number': row[3],
            'voter_cast_id': row[4],
            'voter_favour_id': row[5],
            'voter_booth_id': row[6],
            'voter_town_id': row[7],
            'voter_parent_name': row[8],
            'voter_age': row[9],
            'voter_gender': row[10],
            'voter_marital_status_id': row[11] 
        })
    
    return JsonResponse({'voters': voters})


# Get voters by user wise (assign by multi booth wise)

def get_voters_by_userwise(request, user_booth_user_id):
    with connection.cursor() as cursor:
 
        cursor.callproc('get_voters_by_userwise',[user_booth_user_id])
        results = cursor.fetchall()
 
    voters = []
    for row in results:
        voters.append({
            'voter_id': row[0],
            'voter_name': row[1],
            'voter_parent_name': row[2],
            'voter_age': row[3],
            'voter_gender': row[4],
            'voter_contact_number': row[5],
            'voter_date_of_birth': row[6],
            'voter_cast_id' : row[7],
            'town_name' : row[9],
            'booth_id' : row[10],
            'booth_name' : row[11],
            'voter_religion_name' : row[13],
            'voter_favour_id' : row[14],
            'voter_favour_type' : row[15],
            'voter_constituency' : row[17],
            'voter_data_edited_by': row[19],
            'voter_live_status_id' : row[20],
            'voter_live_status_type': row[21],
            'voter_marital_status_id' : row[22],
            'voter_cast_name' : row[23],
            'voter_vote_confirmation_id' : row[24],
            'voter_in_city_id' : row[25],
            'voter_current_location' : row[26],
            'voter_name_mar' : row[27],
            'voter_serial_number':row[28],
            'voter_id_card_number':row[29]
        })
   
    return JsonResponse({'voters': voters})
 
 

# get edited data with user wise

class EditedVoterlistList(generics.ListAPIView):
    serializer_class = VoterlistSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Voterlist.objects.filter(voter_updated_by=user_id)  

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


# get updated data date wise

from datetime import datetime

from rest_framework.exceptions import ValidationError


class EditedVoterlistByDate(generics.ListAPIView):
    serializer_class = VoterlistSerializer

    def get_queryset(self):
        date_str = self.kwargs.get('date')
        if date_str:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                raise ValidationError('Invalid date format. Use YYYY-MM-DD.')
            return Voterlist.objects.filter(voter_updated_date=date)
        return Voterlist.objects.none()  

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


# # get voters list by town wise

class VoterlistByTown(generics.ListAPIView):

    def get_queryset(self):
        town_id = self.kwargs['town_id']
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    voter_id,
                    voter_name,
                    voter_contact_number,
                    voter_vote_confirmation_id,
                    favour_id,
                    voter_in_city_id,
                    voter_current_location,
                    voter_name_mar,
                    voter_serial_number,
                    voter_id_card_number
                FROM 
                    vw_voter_list
                WHERE 
                    town_id = %s;
            """, [town_id])
            result = cursor.fetchall()

        return [
            {
                'voter_id': row[0],
                'voter_name': row[1],
                'voter_contact_number': row[2],
                'voter_vote_confirmation_id': row[3],
                'voter_favour_id': row[4],
                'voter_in_city_id' : row[5],
                'voter_current_location' : row[6],
                'voter_name_mar' : row[7],
                'voter_serial_number' : row[8],
                'voter_id_card_number' : row[9]
            }
            for row in result 
        ]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(queryset, status=status.HTTP_200_OK)
    

# voter count

class VoterCountView(APIView):
    def get(self, request, *args, **kwargs):
        sql_query = 'SELECT COUNT(*) AS count FROM tbl_voter;'

        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            row = cursor.fetchone()

        count = row[0] if row else 0

        data = {'count': count}

        return Response(data, status=status.HTTP_200_OK)
    

# voter count by booth wise

def VoterCountByBoothView(request, voter_booth_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT COUNT(*) FROM tbl_voter WHERE voter_booth_id = %s;
        """, [voter_booth_id])
        row = cursor.fetchone()  

    result = {
        'booth_wise_voter_count': row[0] if row else 0
    }

    return JsonResponse(result)


# Booth List By Town wise

class BoothListByTown(generics.ListAPIView):
    serializer_class = BoothSerializer

    def get_queryset(self):
        town_id = self.kwargs['town_id']
        return Booth.objects.filter(booth_town_id=town_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


# Total Voter List
@require_http_methods(["GET"])
@csrf_exempt
def total_voters(request):
    try:
        sql_query = "SELECT voter_id, voter_name, voter_favour_id, voter_name_mar, voter_serial_number, voter_id_card_number  FROM tbl_voter ; "
        
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            rows = cursor.fetchall()
        
        voter_list = [{'voter_id': row[0], 'voter_name': row[1], 'voter_favour_id': row[2], 'voter_name_mar': row[3], 'voter_serial_number': row[4], 'voter_id_card_number': row[5]} for row in rows]
        
        return JsonResponse(voter_list, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_all_voters(request):
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 50)  

    cursor = connection.cursor()
    cursor.callproc('sp_voter_list')
    results = cursor.fetchall()

    voters = [{
        'voter_id': row[0],
        'voter_name': row[1],
        'booth_name': row[2],
        'town_name' : row[3]
    } for row in results]

    paginator = Paginator(voters, page_size)
    paginated_voters = paginator.get_page(page)

    data = {
        'voters': list(paginated_voters),
        'page': paginated_voters.number,
        'pages': paginated_voters.paginator.num_pages,
    }

    return JsonResponse(data)
    

# Booth Count api

class BoothCountView(APIView):
    def get(self, request, *args, **kwargs):
        sql_query = 'SELECT COUNT(*) AS count FROM tbl_booth;'

        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            row = cursor.fetchone()

        count = row[0] if row else 0

        data = {'count': count}

        return Response(data, status=status.HTTP_200_OK)


# Town Count api

class TownCountView(APIView):
    def get(self, request, *args, **kwargs):
        sql_query = 'SELECT COUNT(*) AS count FROM tbl_town;'

        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            row = cursor.fetchone()

        count = row[0] if row else 0

        data = {'count': count}

        return Response(data, status=status.HTTP_200_OK)
    

# religion api

class ReligionListView(generics.ListAPIView):
    queryset = Religion.objects.all()
    serializer_class = ReligionSerializer

class VoterlistByReligion(APIView):
    def get(self, request, religion_id=None):
        if religion_id:
            try:
                religion = Religion.objects.get(religion_id=religion_id)
                voters = Voterlist.objects.filter(voter_religion_id=religion.religion_id)
                serializer = VoterlistSerializer(voters, many=True)
                return Response({
                    'religion_id': religion.religion_id,
                    'religion_name': religion.religion_name,
                    'voters': serializer.data
                })
            except Religion.DoesNotExist:
                return Response({'error': 'Religion not found'}, status=404)
        else:
            return Response({'error': 'Religion ID is required'}, status=400)
        
# Religion wise voter data 

class VoterlistByReligionView(APIView):
    def get(self, request, religion_id):
        try:
            religion = Religion.objects.get(religion_id=religion_id)
            voters = Voterlist.objects.filter(voter_religion_id=religion.religion_id)
            serializer = VoterlistSerializer(voters, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Religion.DoesNotExist:
            return Response({'error': 'Religion not found'}, status=status.HTTP_404_NOT_FOUND)



# Remove multi Booth API

class UserBoothDeleteView(APIView):
    def delete(self, request, user_booth_user_id):
        user_booth_booth_id = request.data.get('user_booth_booth_id')

        if not user_booth_booth_id:
            return Response({'error': 'user_booth_booth_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        sql_query = """
            DELETE FROM tbl_user_booth 
            WHERE user_booth_user_id = %s 
            AND user_booth_booth_id = %s
        """

        try:
            with connection.cursor() as cursor:
                cursor.execute(sql_query, [user_booth_user_id, user_booth_booth_id])
                if cursor.rowcount == 0:
                    return Response({'message': 'No records found to delete'}, status=status.HTTP_404_NOT_FOUND)

            return Response({'message': 'Record deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


# Remove multi town API

class TownUserTownDeleteView(APIView):
    def delete(self, request, user_town_town_user_id):
        user_town_town_id = request.data.get('user_town_town_id')

        if not user_town_town_id:
            return Response({'error': 'user_town_town_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        sql_query = """
            DELETE FROM tbl_user_town
            WHERE user_town_town_user_id = %s 
            AND user_town_town_id = %s
        """

        try:
            with connection.cursor() as cursor:
                cursor.execute(sql_query, [user_town_town_user_id, user_town_town_id])
                if cursor.rowcount == 0:
                    return Response({'message': 'No records found to delete'}, status=status.HTTP_404_NOT_FOUND)

            return Response({'message': 'Record deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


# Api for storing panchayat samiti circle and assigning to the town

@api_view(['POST'])
def update_town_panchayat(request):
    town_ids = request.data.get('town_ids')  
    panchayat_samiti_circle_name = request.data.get('panchayat_samiti_circle_name')
    
    if not town_ids or not isinstance(town_ids, list) or not panchayat_samiti_circle_name:
        return Response({'error': 'Both town_ids (as an array) and panchayat_samiti_circle_name are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        panchayat_circle, created = PanchayatSamitiCircle.objects.get_or_create(
            panchayat_samiti_circle_name=panchayat_samiti_circle_name
        )
        
        towns_updated = []
        for town_id in town_ids:
            try:
                town = Town.objects.get(town_id=town_id)
                town.town_panchayat_samiti_circle_id = panchayat_circle.panchayat_samiti_circle_id
                town.save()
                towns_updated.append(town_id)
            except Town.DoesNotExist:
                continue  
        
        if not towns_updated:
            return Response({'error': 'None of the provided town_ids were found.'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'success': 'Towns updated successfully.', 'updated_town_ids': towns_updated}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# API for get panchayat samiti circle

def get_panchayat_samiti_circle(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT panchayat_samiti_circle_id, panchayat_samiti_circle_name FROM tbl_panchayat_samiti_circle")
        rows = cursor.fetchall()
        
    result = [
        {
            "panchayat_samiti_circle_id": row[0],
            "panchayat_samiti_circle_name": row[1]
        }
        for row in rows
    ]
    
    return JsonResponse(result, safe=False)


# API for get ZP circle

@api_view(['POST'])
def update_panchayat_circle(request):
    panchayat_samiti_circle_ids = request.data.get('panchayat_samiti_circle_ids')  
    zp_circle_name = request.data.get('zp_circle_name')
    
    if not panchayat_samiti_circle_ids or not isinstance(panchayat_samiti_circle_ids, list) or not zp_circle_name:
        return Response({'error': 'Both town_ids (as an array) and panchayat_samiti_circle_name are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        zp_circle, created = ZpCircle.objects.get_or_create(
            zp_circle_name= zp_circle_name
        )
        
        panchayatsamiti_updated = []
        for panchayat_samiti_circle_id in panchayat_samiti_circle_ids:
            try:
                panchayatSamitiCircle = PanchayatSamitiCircle.objects.get(panchayat_samiti_circle_id = panchayat_samiti_circle_id)
                panchayatSamitiCircle.panchayat_samiti_circle_zp_circle_id = zp_circle.zp_circle_id
                panchayatSamitiCircle.save()
                panchayatsamiti_updated.append(panchayat_samiti_circle_id)
            except PanchayatSamitiCircle.DoesNotExist:
                continue  
        
        if not panchayatsamiti_updated:
            return Response({'error': 'None of the provided town_ids were found.'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'success': ' ZP Circle Created Successfully.', 'updated_town_ids': panchayatsamiti_updated}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# get voter list by zp circle wise

@require_http_methods(["GET"])
def get_voter_list_by_zpcircle(request, zp_circle_id):
    try:
        zp_circle_id = int(zp_circle_id)
    except ValueError:
        return JsonResponse({'error': 'zp_circle_id must be an integer'}, status=400)

    with connection.cursor() as cursor:
        cursor.callproc('sp_vw_GetVoterListByZpCircleId', [zp_circle_id])
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

    results_list = [dict(zip(columns, row)) for row in results]

    return JsonResponse(results_list, safe=False)


# get voter list by panchayat samiti circle

@require_http_methods(["GET"])
def get_voter_list_by_panchayat_samiti_circle(request, panchayat_samiti_circle_id):
    try:
        panchayat_samiti_circle_id = int(panchayat_samiti_circle_id)
    except ValueError:
        return JsonResponse({'error': 'zp_circle_id must be an integer'}, status=400)

    with connection.cursor() as cursor:
        cursor.callproc('sp_vw_GetVoterListByPanchayatSamitiCircleId', [panchayat_samiti_circle_id])
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

    results_list = [dict(zip(columns, row)) for row in results]

    return JsonResponse(results_list, safe=False)


# activity log

class VoterUpdatedBy(View):
    def get(self, request, *args, **kwargs):
        voter_updated_by = kwargs.get('voter_updated_by')
        
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT voter_id, voter_name
                FROM tbl_voter
                WHERE voter_updated_by = %s
            """, [voter_updated_by])
            rows = cursor.fetchall()
        
        result = [{'voter_id': row[0], 'voter_name': row[1]} for row in rows]
        
        return JsonResponse(result, safe=False)


# get zp circle names

@require_http_methods(["GET"])
def get_zp_circle_names(request, zp_circle_id=None):
    try:
        with connection.cursor() as cursor:
            if zp_circle_id:
                cursor.execute("SELECT zp_circle_id, zp_circle_name FROM tbl_zp_circle WHERE zp_circle_id = %s", [zp_circle_id])
            else:
                cursor.execute("SELECT zp_circle_id, zp_circle_name FROM tbl_zp_circle")
                
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]

        zp_circle_list = [dict(zip(columns, row)) for row in results]
        return JsonResponse(zp_circle_list, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

# get PS circle names
    
@require_http_methods(["GET"])
def get_panchayat_samiti_circle_names(request, panchayat_samiti_circle_id=None):
    try:
        with connection.cursor() as cursor:
            if panchayat_samiti_circle_id:
                cursor.execute("SELECT panchayat_samiti_circle_id, panchayat_samiti_circle_name FROM tbl_panchayat_samiti_circle WHERE panchayat_samiti_circle_id = %s", [panchayat_samiti_circle_id])
            else:
                cursor.execute("SELECT panchayat_samiti_circle_id, panchayat_samiti_circle_name FROM tbl_panchayat_samiti_circle")
                
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]

        psc_circle_list = [dict(zip(columns, row)) for row in results]
        return JsonResponse(psc_circle_list, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# get town user info 

def get_town_user_info(request):
    with connection.cursor() as cursor:
        cursor.callproc('GetTownUserInfo')
        result = cursor.fetchall()
        
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

    return JsonResponse(data, safe=False)


def get_town_user_info_with_id(request, user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return HttpResponseBadRequest("Invalid 'id' parameter")

    with connection.cursor() as cursor:
        cursor.callproc('GetTownUserInfoWithId', [user_id])
        result = cursor.fetchall()
        
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

    return JsonResponse(data, safe=False)



# get booth user info 

def get_booth_user_info(request):
    with connection.cursor() as cursor:
        cursor.callproc('GetBoothUserInfo')
        result = cursor.fetchall()
       
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]
        for row in data:
            row['booth_ids'] = row['booth_ids'].split(", ")
 
            for i in range(len(row['booth_ids'])):
                row['booth_ids'][i] = int(row['booth_ids'][i])
               
            row['town_names'] = row['town_names'].split(", ")
 
    return JsonResponse(data, safe=False)


def get_booth_user_info_with_id(request, user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return HttpResponseBadRequest("Invalid 'id' parameter")

    with connection.cursor() as cursor:
        cursor.callproc('GetBoothUserInfoWithId', [user_id])
        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]
        
        data = [
            {
                **dict(zip(column_names, row)),
                'booth_ids': row[column_names.index('booth_ids')].split(', '),
                'booth_names': row[column_names.index('booth_names')].split(', ')
            }
            for row in result
        ]

    return JsonResponse(data, safe=False)


# Get Town user wise voter data

def get_voter_list_by_town_user(request, user_town_town_user_id):
    try:
        user_id = int(user_town_town_user_id)
    except ValueError:
        return HttpResponseBadRequest("Invalid 'user_id' parameter")

    with connection.cursor() as cursor:
        cursor.callproc('sp_GetVoterListByTownUser', [user_town_town_user_id])
        result = cursor.fetchall()

        columns = [desc[0] for desc in cursor.description]
        columns = ["voter_favour_id" if col == "favour_id" else col for col in columns]
        
        data = [dict(zip(columns, row)) for row in result]

    return JsonResponse(data, safe=False)




# API to get user booth wise

def get_user_by_booth_id(request, user_booth_booth_id):
   
    with connection.cursor() as cursor:
        
        cursor.callproc('sp_GetUserByBoothId', [user_booth_booth_id])
        
        
        rows = cursor.fetchall()
        
       
        columns = [col[0] for col in cursor.description]
        
       
        results = [dict(zip(columns, row)) for row in rows]
    
    return JsonResponse(results, safe=False)


# Api to get user town usr wise voter list

def get_town_users_by_town_id(request, user_town_town_id):
    try:
        
        with connection.cursor() as cursor:
            
            cursor.callproc('sp_GetTownUsersByTownId', [user_town_town_id])
            
            
            rows = cursor.fetchall()
            
            
            columns = [col[0] for col in cursor.description]
            
            
            results = [dict(zip(columns, row)) for row in rows]
            
        return JsonResponse(results, safe=False)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    
# Booth Vote summery

def booth_votes_summary(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                serial_number,
                booth_id,
                booth_name,
                voter_count,
                booth_users_info,
                town_id,  
                town_name,
                panchayat_samiti_name,
                prabhag_id,
                prabhag_name,
                booth_name_mar,
                town_name_mar
            FROM (
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY b.booth_id) AS serial_number,
                    b.booth_id,
                    b.booth_name,
                    COUNT(v.voter_id) AS voter_count,
                    GROUP_CONCAT(DISTINCT CONCAT(u.user_name, '|', u.user_phone, '|', u.user_id) SEPARATOR ', ') AS booth_users_info,
                    t.town_id,  
                    t.town_name,
                    ps.panchayat_samiti_name,
                    p.prabhag_id AS prabhag_id,
                    p.prabhag_name AS prabhag_name,
                    b.booth_name_mar,
                    t.town_name_mar
                FROM 
                    vw_voter_list v
                LEFT JOIN 
                    tbl_user_booth ub ON v.booth_id = ub.user_booth_booth_id
                LEFT JOIN 
                    tbl_user u ON ub.user_booth_user_id = u.user_id
                LEFT JOIN 
                    tbl_booth b ON v.booth_id = b.booth_id
                INNER JOIN 
                    tbl_town t ON v.town_id = t.town_id  
                LEFT JOIN 
                    tbl_panchayat_samiti ps ON t.town_panchayat_samiti_id = ps.panchayat_samiti_id
                LEFT JOIN
                    tbl_prabhag p ON b.booth_prabhag_id = p.prabhag_id
                GROUP BY 
                    b.booth_id, b.booth_name, b.booth_name_mar, t.town_id, t.town_name, t.town_name_mar, ps.panchayat_samiti_name, p.prabhag_id, p.prabhag_name
            ) AS subquery
            ORDER BY 
                booth_id;
        """)
        rows = cursor.fetchall()
        
    result = []
    for row in rows:
        booth_users_info = row[4].split(', ') if row[4] else []
        user_names = []
        user_phones = []
        user_ids = []

        for info in booth_users_info:
            if info:
                parts = info.split('|')
                if len(parts) == 3:  
                    name, phone, user_id = parts
                    user_names.append(name)
                    user_phones.append(phone)
                    user_ids.append(int(user_id))
                else:
                    continue  
        
        result.append({
            'sr no': row[0],
            'booth_id': row[1],
            'booth_name': row[2],
            'user_name': ', '.join(user_names),
            'user_phone': ', '.join(user_phones),
            'mycount': row[3],
            'user_id': user_ids,
            'town_id': row[5],
            'town_name': row[6],
            'taluka_name': row[7],
            'prabagh_id': row[8],
            'prabagh_name': row[9],
            'booth_name_mar': row[10],  
            'town_name_mar': row[11]  
        })
    
    return JsonResponse(result, safe=False)


# export in pdf

def wrap_text(text, max_length):
    """Wrap text without breaking words."""
    return textwrap.fill(text, width=max_length)

def generate_pdf(request):
    # Fetch constituency name from the database
    with connection.cursor() as cursor:
        cursor.execute("SELECT constituency_name FROM tbl_constituency;")
        constituency_name_row = cursor.fetchone()
        constituency_name = constituency_name_row[0] if constituency_name_row else "Unknown Constituency"

    api_url = request.build_absolute_uri(reverse('booth_votes_summary'))
    response = requests.get(api_url)
    data = response.json()

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="booth_details.pdf"'

    buffer = BytesIO()
    pdf = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=0.1*inch, rightMargin=0.1*inch, 
                            topMargin=0.5*inch, bottomMargin=0.5*inch)

    constituency_name_text = f"Constituency Name: {constituency_name}"
    styles = getSampleStyleSheet()
    custom_style = ParagraphStyle(name='CustomStyle', parent=styles['Normal'], fontSize=14, spaceAfter=14)
    paragraph = Paragraph(constituency_name_text, custom_style)

    table_data = [
        ['Index', 'Booth Name', 'Town Name', 'Taluka Name', 'Voter Count', 'Booth Users']
    ]

    for index, item in enumerate(data, start=1):
        booth_name = wrap_text(item['booth_name'], max_length=48)  
        town_name = wrap_text(item['town_name'], max_length=13) 
        taluka_name = wrap_text(item['taluka_name'], max_length=14)  
        
        booth_users = ', '.join(item['user_name']) if isinstance(item['user_name'], list) else item['user_name']
        booth_users = wrap_text(booth_users, max_length=15)  
        
        table_data.append([index, booth_name, town_name, taluka_name, str(item['mycount']), booth_users])

    col_widths = [0.5 * inch, 3.5 * inch, 1.2 * inch, 1.1 * inch, 0.7 * inch, 1.1    * inch]

    table = Table(table_data, colWidths=col_widths, hAlign='LEFT')

    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),  
        ('ALIGN', (2, 1), (2, -1), 'LEFT'),  
        ('ALIGN', (3, 1), (3, -1), 'LEFT'),  
        ('LEFTPADDING', (0, 1), (-1, -1), 10),
        ('RIGHTPADDING', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
    ]))

    elements = [paragraph, table]
    pdf.build(elements)
    
    pdf_data = buffer.getvalue()
    buffer.close()

    response.write(pdf_data)
    return response



# # Panchayat samiti circle user Registration

class Panchayat_samiti_circle_userCreate(generics.ListCreateAPIView):
    queryset = Panchayat_samiti_circle_user.objects.all()
    serializer_class = Panchayat_samiti_circle_userRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            panchayat_samiti_circle_user_name = serializer.validated_data['panchayat_samiti_circle_user_name']
            panchayat_samiti_circle_user_password = serializer.validated_data['panchayat_samiti_circle_user_password']
            panchayat_samiti_circle_user_contact_number = serializer.validated_data['panchayat_samiti_circle_user_contact_number']
            panchayat_samiti_circle_ids = serializer.validated_data['panchayat_samiti_circle_ids']
            
            panchayat_samiti_circle_user = Panchayat_samiti_circle_user(
                panchayat_samiti_circle_user_name=panchayat_samiti_circle_user_name,
                panchayat_samiti_circle_user_password=panchayat_samiti_circle_user_password,
                panchayat_samiti_circle_user_contact_number=panchayat_samiti_circle_user_contact_number
            )
            
            panchayat_samiti_circle_user.panchayat_samiti_circle_user_politician_id = request.session.get('politician_id')
            
            panchayat_samiti_circle_user.save()
            
            for panchayat_samiti_circle_id in panchayat_samiti_circle_ids:
                User_panchayat_samiti_circle.objects.create(
                    user_panchayat_samiti_circle_id=panchayat_samiti_circle_user.panchayat_samiti_circle_user_id,
                    user_panchayat_samiti_circle_panchayat_samiti_circle_id=panchayat_samiti_circle_id
                )
            
            return Response({'status': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# zp circle user registration

class Zp_circle_userCreate(generics.ListCreateAPIView):
    queryset = Zp_circle_user.objects.all()
    serializer_class = Zp_circle_userRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            zp_circle_user_name = serializer.validated_data['zp_circle_user_name']
            zp_circle_user_password = serializer.validated_data['zp_circle_user_password']
            zp_circle_user_contact_number = serializer.validated_data['zp_circle_user_contact_number']
            zp_circle_user_ids = serializer.validated_data['zp_circle_ids']
            
            zp_circle_user = Zp_circle_user(
                zp_circle_user_name= zp_circle_user_name,
                zp_circle_user_password=zp_circle_user_password,
                zp_circle_user_contact_number= zp_circle_user_contact_number
            )
            
            zp_circle_user.zp_circle_user_politician_id = request.session.get('politician_id')
            
            zp_circle_user.save()
            
            for zp_circle_user_id in zp_circle_user_ids:
                User_zp_circle.objects.create(
                    user_zp_circle_id = zp_circle_user.zp_circle_user_id,
                    user_zp_circle_zp_circle_id = zp_circle_user_id
                )
            
            return Response({'status': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

def get_panchayat_samiti_user_info(request):
    with connection.cursor() as cursor:
        cursor.callproc('sp_GetPanchayatSamitiCircleUserDetails')
        result = cursor.fetchall()
        
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

    return JsonResponse(data, safe=False)


def get_panchayat_samiti_user_info_with_id(request, panchayat_samiti_user_id):
    try:
        panchayat_samiti_user_id = int(panchayat_samiti_user_id)
    except ValueError:
        return HttpResponseBadRequest("Invalid 'id' parameter")

    with connection.cursor() as cursor:
        cursor.callproc('sp_GetPanchayatSamitiCircleUserDetailsWithId', [panchayat_samiti_user_id])
        result = cursor.fetchall()
        
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

    return JsonResponse(data, safe=False)

# zp circle

def get_zp_user_info(request):
    with connection.cursor() as cursor:
        cursor.callproc('sp_GetZpCircleUserDetails')
        result = cursor.fetchall()
        
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

    return JsonResponse(data, safe=False)


def get_zp_user_info_with_id(request, zp_user_id):
    try:
        zp_user_id = int(zp_user_id)
    except ValueError:
        return HttpResponseBadRequest("Invalid 'id' parameter")

    with connection.cursor() as cursor:
        cursor.callproc('sp_GetZpCircleUserDetailsWithId', [zp_user_id])
        result = cursor.fetchall()
        
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

    return JsonResponse(data, safe=False)


# # PS Circle User Login API

class Panchayat_samiti_circle_userLogin(APIView):
    def post(self, request):
        serializer = Panchayat_samiti_circle_userLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['panchayat_samiti_circle_user_name']
            password = serializer.validated_data['panchayat_samiti_circle_user_password']
            
            try:
                user = Panchayat_samiti_circle_user.objects.get(panchayat_samiti_circle_user_name=username)
                
                if password == user.panchayat_samiti_circle_user_password:
                    request.session['panchayat_samiti_circle_user_id'] = user.panchayat_samiti_circle_user_id
                    return Response({'status': 'Login successful'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
            
            except Panchayat_samiti_circle_user.DoesNotExist:
                return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# # PS Circle User Logout API
 
class Panchayat_samiti_circle_userLogout(APIView):
    def post(self, request):
        try:
            del request.session['panchayat_samiti_circle_user_id']
        except KeyError:
            pass
        
        return Response({'status': 'Logout successful'}, status=status.HTTP_200_OK)


# # ZP Circle User Login API

class Zp_circle_userLogin(APIView):
    def post(self, request):
        serializer = Zp_circle_userLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['zp_circle_user_name']
            password = serializer.validated_data['zp_circle_user_password']
            
            try:
                user = Zp_circle_user.objects.get(zp_circle_user_name=username)
                
                # Directly compare the plain text password
                if password == user.zp_circle_user_password:
                    request.session['zp_circle_user_id'] = user.zp_circle_user_id
                    return Response({'status': 'Login successful'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
            
            except Zp_circle_user.DoesNotExist:
                return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # ZP Circle User Logout API

class Zp_circle_userLogout(APIView):
    def post(self, request):
        if 'zp_circle_user_id' in request.session:
            del request.session['zp_circle_user_id']
            return Response({'status': 'Logout successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User is not logged in'}, status=status.HTTP_400_BAD_REQUEST)


# # get voter list by panchayat samiti circle user wise

@require_http_methods(["GET"])
def get_voter_list_by_user_panchayat_samiti_circle(request, user_panchayat_samiti_circle_id):
    try:
        user_panchayat_samiti_circle_id = int(user_panchayat_samiti_circle_id)
    except ValueError:
        return JsonResponse({'error': 'user_panchayat_samiti_circle_id must be an integer'}, status=400)

    with connection.cursor() as cursor:
        cursor.callproc('sp_vw_GetVoterListByUserPanchayatSamitiCircleId', [user_panchayat_samiti_circle_id])
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

    results_list = [dict(zip(columns, row)) for row in results]

    return JsonResponse(results_list, safe=False)


# # get voter list by ZP circle user wise

@require_http_methods(["GET"])
def get_voter_list_by_user_zp_circle(request, user_zp_circle_id):
    try:
        user_zp_circle_id = int(user_zp_circle_id)
    except ValueError:
        return JsonResponse({'error': 'user_zp_circle_id must be an integer'}, status=400)

    with connection.cursor() as cursor:
        cursor.callproc('sp_vw_GetVoterListByUserZPCircleId', [user_zp_circle_id])
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

    results_list = [dict(zip(columns, row)) for row in results]

    return JsonResponse(results_list, safe=False)


# vote confirmation (voted non voted)  but not applicable for null 


class VoterlistByVoteConfirmationView(generics.ListAPIView):
    serializer_class = VoterlistSerializer

    def get_queryset(self):
        vote_confirmation_id = self.kwargs.get('vote_confirmation_id')
        return Voterlist.objects.filter(voter_vote_confirmation_id=vote_confirmation_id)
    



# voted non voted by booth wise

def get_voters_by_booth_and_vote_confirmation(request, booth_id, vote_confirmation_id):
    if vote_confirmation_id == 2:
        vote_confirmation_id = None
    
    with connection.cursor() as cursor:
        # If vote_confirmation_id is None, we need to adjust our query
        if vote_confirmation_id is None:
            cursor.execute("""
                SELECT v.voter_id, v.voter_name, b.booth_name, v.voter_contact_number, v.voter_cast_id, v.voter_favour_id, v.voter_booth_id,
                       v.voter_town_id, v.voter_parent_name, v.voter_age, v.voter_gender, v.voter_marital_status_id, v.voter_vote_confirmation_id
                FROM tbl_voter v
                JOIN tbl_booth b ON b.booth_id = v.voter_booth_id 
                WHERE v.voter_booth_id = %s AND v.voter_vote_confirmation_id IS NULL
            """, [booth_id])
        else:
            cursor.execute("""
                SELECT v.voter_id, v.voter_name, b.booth_name, v.voter_contact_number, v.voter_cast_id, v.voter_favour_id, v.voter_booth_id,
                       v.voter_town_id, v.voter_parent_name, v.voter_age, v.voter_gender, v.voter_marital_status_id, v.voter_vote_confirmation_id
                FROM tbl_voter v
                JOIN tbl_booth b ON b.booth_id = v.voter_booth_id 
                WHERE v.voter_booth_id = %s AND v.voter_vote_confirmation_id = 1
            """, [booth_id])

        results = cursor.fetchall()
    
    voters = []
    for row in results:
        voters.append({
            'voter_id': row[0],
            'voter_name': row[1],
            'booth_name': row[2],
            'voter_contact_number': row[3],
            'voter_cast_id': row[4],
            'voter_favour_id': row[5],
            'voter_booth_id': row[6],
            'voter_town_id': row[7],
            'voter_parent_name': row[8],
            'voter_age': row[9],
            'voter_gender': row[10],
            'voter_marital_status_id': row[11],
            'voter_vote_confirmation_id' : row[12]
        })
    
    return JsonResponse({'voters': voters})


# voted non voted by town wise

def get_voters_by_town_and_vote_confirmation(request, town_id, vote_confirmation_id):
    if vote_confirmation_id == 2:
        vote_confirmation_id = None
    
    with connection.cursor() as cursor:
        if vote_confirmation_id is None:
            cursor.execute("""
                SELECT v.voter_id, v.voter_name, b.booth_name, v.voter_contact_number, v.voter_cast_id, v.voter_favour_id, v.voter_booth_id,
                       v.voter_town_id, v.voter_parent_name, v.voter_age, v.voter_gender, v.voter_marital_status_id, v.voter_vote_confirmation_id
                FROM tbl_voter v
                JOIN tbl_booth b ON b.booth_id = v.voter_booth_id 
                WHERE v.voter_town_id = %s AND v.voter_vote_confirmation_id IS NULL
            """, [town_id])
        else:
            cursor.execute("""
                SELECT v.voter_id, v.voter_name, b.booth_name, v.voter_contact_number, v.voter_cast_id, v.voter_favour_id, v.voter_booth_id,
                       v.voter_town_id, v.voter_parent_name, v.voter_age, v.voter_gender, v.voter_marital_status_id, v.voter_vote_confirmation_id
                FROM tbl_voter v
                JOIN tbl_booth b ON b.booth_id = v.voter_booth_id 
                WHERE v.voter_town_id = %s AND v.voter_vote_confirmation_id = %s
            """, [town_id, vote_confirmation_id])

        results = cursor.fetchall()
    
    voters = []
    for row in results:
        voters.append({
            'voter_id': row[0],
            'voter_name': row[1],
            'booth_name': row[2],
            'voter_contact_number': row[3],
            'voter_cast_id': row[4],
            'voter_favour_id': row[5],
            'voter_booth_id': row[6],
            'voter_town_id': row[7],
            'voter_parent_name': row[8],
            'voter_age': row[9],
            'voter_gender': row[10],
            'voter_marital_status_id': row[11],
            'voter_vote_confirmation_id' : row[12]
        })
    
    return JsonResponse({'voters': voters})


# whats app integration

import json

ACCESS_TOKEN = 'EAAGZCJwDqMnwBO1tOt351H45HWgrkjZAPHWIGzyJ5vyrlJOoagNqM4lsBhB3Y2sUm1UwOjrqjUz1ZBTV7H9msrdKeS8vV3ZAZArvM8BIU1DJUuZB1LEvGsITRfZC0ubjBaQ9esZBO2yIHswbydiHLzDnnDbb4PBeBii9nEhRNPqVFsSCoSCGKNFxKpIS7T9vEHO10kODaM9y5fpoxlaoYfyyJbC71HAZD'
PHONE_NUMBER_ID = '306082309265432'
@csrf_exempt
def send_whatsapp_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        voter_ids = data.get('voter_ids', [])
        template_name = data.get('template_name', 'voting1')
        language_code = data.get('language_code', 'en')

        results = []

        for voter_id in voter_ids:
            voter_data = fetch_voter_data(voter_id)

            if not voter_data:
                results.append({'voter_id': voter_id, 'status': 'error', 'message': 'Voter data not found'})
                continue

            contact_number = str(voter_data['voter_contact_number'])
            if not contact_number.startswith('+'):
                contact_number = '+' + contact_number
         
            voter_name = voter_data['voter_name']
            booth_name = voter_data['booth_name']
            town_name = voter_data['town_name']

            

            # Send WhatsApp message
            try:
                response = send_whatsapp_message_to_number(contact_number, voter_name, booth_name, town_name, template_name, language_code)
                results.append({'voter_id': voter_id, 'status': 'success', 'response': response})
            except requests.exceptions.RequestException as e:
                results.append({'voter_id': voter_id, 'status': 'error', 'message': str(e)})

        return JsonResponse({'results': results})

    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

def fetch_voter_data(voter_id):
    with connection.cursor() as cursor:
        query = """
        SELECT voter_id, voter_name, booth_name, voter_contact_number, town_name
        FROM vw_voter_list
        WHERE voter_id = %s
        """
        cursor.execute(query, [voter_id])
        row = cursor.fetchone()

    if row:
        return {
            'voter_id': row[0],
            'voter_name': row[1],
            'booth_name': row[2],
            'voter_contact_number': row[3],
            'town_name' : row[4]
        }
    return None

def send_whatsapp_message_to_number(to, voter_name, booth_name, town_name, template_name, language_code):
    url = f'https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages'
    headers = {
        'Authorization': f'Bearer {ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }
    payload = {
        'messaging_product': 'whatsapp',
        'to': to,
        'type': 'template',
        'template': {
            'name': 'voting1',
            'language': {
                'code': 'en'
            },
            'components': [
                 {
                     'type': 'body',
                     'parameters': [
                         {'type': 'text', 'text': voter_name},
                         {'type': 'text', 'text': booth_name},
                         {'type': 'text', 'text': town_name},
                     ]
                 }
             ]
        }
    }
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()


# send SMS to multiple mobile number

@api_view(['POST'])
def send_voter_data(request):
    voter_ids = request.data.get('voter_ids', [])

    if not isinstance(voter_ids, list) or not all(isinstance(id, int) for id in voter_ids):
        return Response({'error': 'voter_ids must be a list of integers'}, status=status.HTTP_400_BAD_REQUEST)

    if not voter_ids:
        return Response({'error': 'At least one voter_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    messages_sent = []
    for voter_id in voter_ids:
        voter_data = fetch_voter_data(voter_id)

        if not voter_data:
            messages_sent.append({'voter_id': voter_id, 'status': 'Voter data not found'})
            continue

        contact_number = str(voter_data['voter_contact_number'])  
        if not contact_number.startswith('+'):
            contact_number = '+' + contact_number

        message_body = (
            "Tekhno चुनाव\n"
            "Politician Name : ABC,\n"
            "Party Name: XYZ,\n"
            "Party Symbol : PQR\n"
            "\n"
            f"Voter Name: {voter_data['voter_name']}\n"
            f"Booth Name: {voter_data['booth_name']}\n"
            f"Town Name : {voter_data['town_name']}"
        )

        if send_sms_message(contact_number, message_body):
            messages_sent.append({'voter_id': voter_id, 'status': 'Message sent'})
        else:
            messages_sent.append({'voter_id': voter_id, 'status': 'The number is not registered or not available'})

    return Response({'messages': messages_sent}, status=status.HTTP_200_OK)

def fetch_voter_data(voter_id):
    with connection.cursor() as cursor:
        query = """
        SELECT voter_id, voter_name, booth_name, voter_contact_number, town_name
        FROM vw_voter_list
        WHERE voter_id = %s
        """
        cursor.execute(query, [voter_id])
        row = cursor.fetchone()

    if row:
        return {
            'voter_id': row[0],
            'voter_name': row[1],
            'booth_name': row[2],
            'voter_contact_number': row[3],  
            'town_name' : row[4]
        }
    return None


def send_sms_message(to, body):
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        client.messages.create(
            body=body,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to
        )
        return True
    except TwilioException as e:
        print(f"Error sending SMS to {to}: {e}")
        return False



# voter data pdf


@csrf_exempt
def generate_voter_pdf(request, voter_id):
    query = "SELECT voter_id, voter_name, voter_parent_name, voter_age, voter_gender, booth_name, town_name FROM vw_voter_list WHERE voter_id = %s"
    
    with connection.cursor() as cursor:
        cursor.execute(query, [voter_id])
        row = cursor.fetchone()
    
    if row is None:
        return HttpResponse("Voter not found", status=404)
    
    voter_id, voter_name, voter_parent_name, voter_age, voter_gender, booth_name, town_name = row
    
    buffer = io.BytesIO()
    
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    
    style = ParagraphStyle(
        name='CustomStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=14,  
        spaceAfter=12
    )
    
    text = (
        f"<b>Voter ID:</b> {voter_id}<br/>"
        f"<b>Name:</b> {voter_name}<br/>"
        f"<b>Parent Name:</b> {voter_parent_name}<br/>"
        f"<b>Age:</b> {voter_age}<br/>"
        f"<b>Gender:</b> {voter_gender}<br/>"
        f"<b>Booth Name:</b> {booth_name}<br/>"
        f"<b>Town Name:</b> {town_name}"
    )
    
    p = Paragraph(text, style)
    elements.append(p)
    
    doc.build(elements)
    
    pdf = buffer.getvalue()
    buffer.close()
    
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{voter_id}_voter_info.pdf"'
    
    return response


# # favour , non-favour, against, chocolate

def get_voter_favour_counts(request):
    result = {
        'Favourable': 0,
        'Non_Favourable': 0,
        'Not_Confirmed': 0,
        'chocolate':0,
        'Pending' : 0,
        'Total_Voters': 0
        
    }

    with connection.cursor() as cursor:
        cursor.callproc('GetVoterFavourCounts')
        
        rows = cursor.fetchall()

        for row in rows:
            voter_favour_id = row[0]
            count = row[1]
            if voter_favour_id == 1:
                result['Favourable'] = count
            elif voter_favour_id == 2:
                result['Non_Favourable'] = count
            elif voter_favour_id == 3:
                result['Not_Confirmed'] = count
            elif voter_favour_id == 4:
                result['chocolate'] = count

        cursor.execute('SELECT COUNT(*) FROM tbl_voter')
        total_voters = cursor.fetchone()[0]
        result['Total_Voters'] = total_voters

        pending = result['Total_Voters'] - (result['Favourable'] + result['Non_Favourable'] + result['Not_Confirmed'] + result['chocolate'])
        result['Pending'] = pending

    return JsonResponse(result)


# # Cast by religion wise




class CastByReligionView(generics.ListAPIView):
    serializer_class = CastSerializer

    def get_queryset(self):
        religion_id = self.kwargs['religion_id']
        return Cast.objects.filter(cast_religion_id=religion_id)


# Updated Count from total voter

def get_voter_counts(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM tbl_voter")
        total_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_updated_by IS NOT NULL")
        updated_count = cursor.fetchone()[0]

    remaining_count = total_count - updated_count

    response_data = {
        'updated_count': updated_count,
        'remaining_count': remaining_count
    }
    return JsonResponse(response_data)


# get voter list by cast wise in a perticular booth

class GetVoterByCastAndBoothView(View):
    def get(self, request, voter_cast_id, voter_booth_id):
        voters = Voterlist.objects.filter(voter_cast_id=voter_cast_id, voter_booth_id=voter_booth_id)
        voters_list = list(voters.values())
        return JsonResponse(voters_list, safe=False)
    

# get voter list by cast wise in a perticular town

class GetVoterByCastAndTownView(View):
    def get(self, request, voter_cast_id, voter_town_id):
        voters = Voterlist.objects.filter(voter_cast_id=voter_cast_id, voter_town_id=voter_town_id)
        voters_list = list(voters.values())
        return JsonResponse(voters_list, safe=False)


# get voter list by religion wise in a perticular booth



# class GetVoterByReligionBoothView(generics.ListAPIView):
#     serializer_class = VoterlistSerializer

#     def get_queryset(self):
#         religion_id = self.kwargs['religion_id']
#         booth_id = self.kwargs['booth_id']

#         return Voterlist.objects.filter(
#             Q(voter_cast_id__in=Cast.objects.filter(cast_religion_id=religion_id)),
#             voter_booth_id=booth_id
#         )


class GetVoterByReligionBoothView(generics.ListAPIView):

    def get(self, request, *args, **kwargs):
        religion_id = self.kwargs['religion_id']
        booth_id = self.kwargs['booth_id']

        query = """
            SELECT * FROM tbl_voter 
            WHERE voter_booth_id = %s AND voter_religion_id = %s
        """
        
        with connection.cursor() as cursor:
            cursor.execute(query, [booth_id, religion_id])
            rows = cursor.fetchall()

        result = []
        for row in rows:
            result.append({
                'voter_id': row[0],
                'voter_name': row[1],
            })

        return Response(result)



# get voter list by religion wise in a perticular town

class GetVoterByReligionTownView(generics.ListAPIView):
    serializer_class = VoterlistSerializer

    def get_queryset(self):
        religion_id = self.kwargs['religion_id']
        town_id = self.kwargs['town_id']

        return Voterlist.objects.filter(
            Q(voter_cast_id__in=Cast.objects.filter(cast_religion_id=religion_id)),
            voter_town_id=town_id
        )


# voter list by cast wise

class VotersByCastView(generics.ListAPIView):
    serializer_class = VoterlistSerializer

    def get_queryset(self):
        cast_id = self.kwargs['cast_id']
        return Voterlist.objects.filter(voter_cast_id=cast_id)
    

# religion wise voter count
@csrf_exempt
def religion_count_api(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                # Query to get the religion and the count of voters for each religion
                cursor.execute("""
                    SELECT
                        r.religion_name,
                        COUNT(v.voter_id) AS total_voter_count
                    FROM tbl_religion r
                    LEFT JOIN tbl_cast c ON r.religion_id = c.cast_religion_id
                    LEFT JOIN tbl_voter v ON c.cast_id = v.voter_cast_id
                    GROUP BY r.religion_name
                    ORDER BY r.religion_name
                """)
               
                # Fetch all rows from the query result
                religion_voter_counts = cursor.fetchall()
 
                # Query to get the count of voters without a caste
                cursor.execute("""
                    SELECT COUNT(voter_id)
                    FROM tbl_voter
                    WHERE voter_cast_id IS NULL
                """)
               
                no_caste_count = cursor.fetchone()[0]
 
            response = {}
 
            for row in religion_voter_counts:
                religion_name = row[0]
                total_voter_count = row[1]
                response[religion_name] = total_voter_count
 
            if no_caste_count is not None:
                response["not defined"] = no_caste_count
 
            return JsonResponse(response, status=200)
 
        except Exception as e:
            logging.error(f"Error fetching voter religion counts: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)
 

# get voters by religion wise
def get_voters_by_religion(request, religion_id):
    try:
        religion_id = int(religion_id)
    except ValueError:
        return HttpResponseNotFound("Invalid 'religion_id' parameter")

    query = """
    SELECT 
    v.voter_id,          
    v.voter_name,
    v.voter_contact_number,  
    c.cast_name,
    r.religion_name,
    v.voter_favour_id
FROM 
    vw_voter_list v
JOIN 
    tbl_cast c ON v.voter_cast_id = c.cast_id
JOIN 
    tbl_religion r ON c.cast_religion_id = r.religion_id
WHERE 
    r.religion_id = %s;


    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, [religion_id])
        rows = cursor.fetchall()
        
    result = [
        {
            'voter_id': row[0],
            'voter_name': row[1],
            'voter_contact_number': row[2],
            'voter_cast_name' : row[3],
            'voter_religion_name' : row[4],
            'voter_favour_id' : row[5]
        }
        for row in rows
    ]
    
    return JsonResponse(result, safe=False)





def get_voters_town_religion_cast(request, town_id, cast_id):
    
    try:
        
        town_id = int(town_id)
        #religion_id = int(religion_id)
        cast_id = int(cast_id)
    except ValueError:
        return HttpResponseBadRequest("All parameters (town_id, religion_id, cast_id) must be integers")

    query = """
   SELECT 
            voter_id,
            voter_name,
            voter_contact_number,
            cast_name,
            favour_id,
            voter_vote_confirmation_id
        FROM vw_voter_list
        WHERE town_id = %s 
        AND cast_id = %s 
        AND cast_id IS NOT NULL 
        ORDER BY cast_name, voter_name;
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, [town_id, cast_id])
        rows = cursor.fetchall()
        
    result = [
        {
            'voter_id': str(row[0]),  
            'voter_name': str(row[1]),
            'voter_contact_number': str(row[2]),
            'cast_name': str(row[3]),
            'favour_id' : str(row[4]),
            'voter_vote_confirmation_id' : row[5]
        }
        for row in rows
    ]
    
    return JsonResponse(result, safe=False)



def get_voters_booth_religion_cast(request, booth_id, cast_id):
    try:
        booth_id = int(booth_id)
        #religion_id = int(religion_id)
        cast_id = int(cast_id)
    except ValueError:
        return HttpResponseBadRequest("All parameters (town_id, religion_id, cast_id) must be integers")

    query = """
    SELECT 
            voter_id,
            voter_name,
            voter_contact_number,
            cast_name,
            favour_id,
            voter_vote_confirmation_id,
            voter_name_mar,
            voter_serial_number,
            voter_id_card_number
        FROM vw_voter_list
        WHERE booth_id = %s
        AND cast_id = %s
        AND cast_id IS NOT NULL 
        ORDER BY cast_name, voter_name;
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, [booth_id, cast_id])
        rows = cursor.fetchall()
        
    result = [
        {
            'voter_id': str(row[0]),  
            'voter_name': str(row[1]),
            'voter_contact_number': str(row[2]),
            'cast_name': str(row[3]),
            'favour_id' : str(row[4]),
            'voter_vote_confirmation_id' : row[5],
            'voter_name_mar' : str(row[6]),
            'voter_serial_number' : str(row[7]),
            'voter_id_card_number' : str(row[8])
        }
        for row in rows
    ]
    
    return JsonResponse(result, safe=False)




def get_voters_booth_religion_wise(request, booth_id, religion_id):
    try:
        # Ensure booth_id and religion_id are integers
        booth_id = int(booth_id)
        religion_id = int(religion_id)
       
    except ValueError:
        # Return an error if either booth_id or religion_id are not integers
        return HttpResponseBadRequest("Both booth_id and religion_id must be integers")
 
    # SQL query to fetch voters based on booth_id and religion_id
    query = """
    SELECT
        ROW_NUMBER() OVER (ORDER BY c.cast_name, v.voter_name) AS serial_no,
        v.voter_id,
        v.voter_name,
        v.voter_contact_number,
        v.voter_name_mar,
        c.cast_name,
        v.voter_vote_confirmation_id,
        v.voter_favour_id
    FROM tbl_voter v
    INNER JOIN tbl_cast c ON v.voter_cast_id = c.cast_id
    INNER JOIN tbl_religion r ON c.cast_religion_id = r.religion_id
    WHERE v.voter_booth_id = %s
    AND r.religion_id = %s
    AND v.voter_cast_id IS NOT NULL
    ORDER BY c.cast_name, v.voter_name;
    """
 
    try:
        # Execute the query and fetch the results
        with connection.cursor() as cursor:
            cursor.execute(query, [booth_id, religion_id])
            rows = cursor.fetchall()
 
        # Convert the result to a list of dictionaries
        result = [
            {
                'voter_id': row[1],  # Correcting index for voter_id
                'voter_name': row[2],
                'voter_contact_number': row[3],
                'voter_name_mar': row[4],
                'cast_name': row[5],
                'voter_vote_confirmation_id': row[6],
                'voter_favour_id': row[7],
                
            }
            for row in rows
        ]
 
        # Return the result as a JSON response
        return JsonResponse(result, safe=False)
 
    except Exception as e:
        logging.error(f"Error fetching voter details: {str(e)}")
        return JsonResponse({'error': 'Error fetching data','actual error':str(e)}, status=500)
 



def get_voters_town_religion_wise(request, town_id, religion_id):
    try:
        town_id = int(town_id)
        religion_id = int(religion_id)
    except ValueError:
        return HttpResponseBadRequest("All parameters (town_id, religion_id, ) must be integers")

    query = """
    SELECT 
    voter_id,
    voter_name,
    voter_contact_number,
    cast_name,
    favour_id,
    voter_vote_confirmation_id
FROM 
    vw_voter_list
WHERE 
    town_id = 1
  --   AND religion_id = 1
    AND cast_id IN (SELECT cast_id FROM tbl_cast WHERE cast_religion_id = %s and cast_id = %s)  
--     AND cast_id  = 1
    and cast_id is not null -- Ensure cast_id is not NULL
ORDER BY 
    cast_name, voter_name;
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [town_id, religion_id])
        rows = cursor.fetchall()
        
    result = [
        {
            'voter_id': row[0],
            'voter_name': row[1],
            'voter_contact_number': row[2],
            'cast_name' : row[3],
            'favour_id' : row[4],
            'voter_vote_confirmation_id' : row[5]
        }
        for row in rows
    ]
    
    return JsonResponse(result, safe=False)



# Get voters by booth user and cast

def get_voters_by_booth_user_and_cast(request, user_booth_id, cast_id):
    try:
        user_booth_id = int(user_booth_id)
        cast_id = int(cast_id)

        with connection.cursor() as cursor:
            cursor.callproc('sp_GetVoterListByBoothUserAndCast', [user_booth_id, cast_id])
            rows = cursor.fetchall()
        
        columns = ['voter_id', 'voter_name', 'voter_contact_number', 'cast_name', 'voter_name_mar','voter_serial_number', 'voter_id_card_number']

        results = [dict(zip(columns, row)) for row in rows]
        
        return JsonResponse(results, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# Get voters by town user and cast

def get_voters_by_town_user_and_cast(request, user_town_id, cast_id):
    try:
        user_town_id = int(user_town_id)
        cast_id = int(cast_id)

        with connection.cursor() as cursor:
            cursor.callproc('sp_GetVoterListByTownUserAndCast', [user_town_id, cast_id])
            rows = cursor.fetchall()
        
        columns = ['voter_id', 'voter_name', 'voter_contact_number', 'cast_name']

        results = [dict(zip(columns, row)) for row in rows]
        
        return JsonResponse(results, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

# Get booth name by town user wise

def get_booth_names_by_town_user(request, town_user_id):
    try:
        with connection.cursor() as cursor:
            cursor.callproc('sp_GetBoothNamesByTownUser', [town_user_id])
            rows = cursor.fetchall()

        columns = ['booth_id', 'booth_name', 'booth_name_mar']

        results = [dict(zip(columns, row)) for row in rows]

        return JsonResponse(results, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


def get_all_religion(request):
    query = """
   Select religion_id, religion_name from tbl_religion;
    """
    with connection.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        
    result = [
        {
            'religion_id': row[0],
            'religion_name': row[1],
        }
        for row in rows
    ]
    
    return JsonResponse(result, safe=False)



def get_all_cast(request):
    query = """
   Select cast_id, cast_name from tbl_cast;
    """
    with connection.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        
    result = [
        {
            'cast_id': row[0],
            'cast_name': row[1],
        }
        for row in rows
    ]
    
    return JsonResponse(result, safe=False)


# Age Wise sort




def age_wise_voter(request, age_from, age_to):
    try:
        age_from = int(age_from)
        age_to = int(age_to)
    except ValueError:
        return HttpResponseBadRequest("Invalid age range parameters")

    query = """
    SELECT voter_id, voter_serial_number,voter_id_card_number, voter_name, voter_name_mar, voter_age 
    FROM tbl_voter 
    WHERE voter_age BETWEEN %s AND %s;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, [age_from, age_to])
        rows = cursor.fetchall()

        result = [
            {
                'voter_id': row[0],
                'voter_serial_number': row[1],
                'voter_id_card_number': row[2],
                'voter_name': row[3],
                'voter_name_mar': row[4],
                'voter_age': row[5]
            }
            for row in rows
        ]
    
    return JsonResponse(result, safe=False)


# Delete Booth User
@csrf_exempt
def delete_user(request, user_id):
    if request.method == 'DELETE':
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM tbl_user WHERE user_id = %s", [user_id])
                rows_affected = cursor.rowcount

                if rows_affected == 0:
                    return JsonResponse({'message': 'User not found'}, status=404)

                return JsonResponse({'message': 'User deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)



# Delete Town User

@csrf_exempt
def delete_town_user(request, town_user_id):
    if request.method == 'DELETE':
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM tbl_town_user WHERE town_user_id = %s", [town_user_id])
                rows_affected = cursor.rowcount

                if rows_affected == 0:
                    return JsonResponse({'message': 'User not found'}, status=404)

                return JsonResponse({'message': 'User deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


# # delete booth user

@csrf_exempt
def delete_booth_user(request, booth_user_id):
    if request.method == 'DELETE':
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM tbl_user WHERE user_id = %s", [booth_user_id])
                rows_affected = cursor.rowcount

                if rows_affected == 0:
                    return JsonResponse({'message': 'User not found'}, status=404)

                return JsonResponse({'message': 'User deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


# Get Booth User Info Town User Wise

def get_booth_user_info_town_user_wise(request, town_user_id):
    try:
        town_user_id = int(town_user_id)
    except ValueError:
        return HttpResponseBadRequest("Invalid 'id' parameter")

    with connection.cursor() as cursor:
        cursor.callproc('GetBoothUserInfoTownUserWise', [town_user_id])
        result = cursor.fetchall()
        
        data = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

    return JsonResponse(data, safe=False)


# Booth wise vote confirmation

class VoterByBoothConfirmationView(APIView):
    def get(self, request, booth_id, confirmation_id):
        if confirmation_id == 2:
            confirmation_id = None

            sql = """
                SELECT v.voter_id, v.voter_name, v.voter_booth_id, v.voter_vote_confirmation_id
                FROM tbl_voter v
                WHERE v.voter_booth_id = %s AND v.voter_vote_confirmation_id IS NULL
            """
            
            with connection.cursor() as cursor:
                cursor.execute(sql, [booth_id])
                rows = cursor.fetchall()
        else:
            sql = """
                SELECT v.voter_id, v.voter_name, v.voter_booth_id, v.voter_vote_confirmation_id
                FROM tbl_voter v
                WHERE v.voter_booth_id = %s AND v.voter_vote_confirmation_id = %s
            """
            
            with connection.cursor() as cursor:
                cursor.execute(sql, [booth_id, confirmation_id])
                rows = cursor.fetchall()

        voters = [
            {
                'voter_id': row[0],
                'voter_name': row[1],
                'voter_booth_id': row[2],
                'voter_vote_confirmation_id': row[3]
            }
            for row in rows
        ]

        return Response(voters)


# Town wise vote confirmation

class VoterByTownConfirmationView(APIView):
    def get(self, request, town_id, confirmation_id):
        if confirmation_id == 2:
            confirmation_id = None

            sql = """
                SELECT v.voter_id, v.voter_name, v.voter_town_id, v.voter_vote_confirmation_id
                FROM tbl_voter v
                WHERE v.voter_town_id = %s AND v.voter_vote_confirmation_id IS NULL
            """
            
            with connection.cursor() as cursor:
                cursor.execute(sql, [town_id])
                rows = cursor.fetchall()
        else:
            sql = """
                SELECT v.voter_id, v.voter_name, v.voter_town_id, v.voter_vote_confirmation_id
                FROM tbl_voter v
                WHERE v.voter_town_id = %s AND v.voter_vote_confirmation_id = %s
            """
            
            with connection.cursor() as cursor:
                cursor.execute(sql, [town_id, confirmation_id])
                rows = cursor.fetchall()

        voters = [
            {
                'voter_id': row[0],
                'voter_name': row[1],
                'voter_town_id': row[2],
                'voter_vote_confirmation_id': row[3]
            }
            for row in rows
        ]

        return Response(voters)
    
    
# Booth User wise vote confirmation

class VoterByBoothUserConfirmationView(APIView):
    def get(self, request, user_id, confirmation_id):
        if confirmation_id == 2:
            confirmation_id = None

            sql = """
                select v.voter_id, v.voter_name, v.voter_vote_confirmation_id, v.voter_name_mar, v.voter_favour_id FROM tbl_voter v where voter_booth_id IN 
                (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s) AND v.voter_vote_confirmation_id IS NULL;
            """
            
            with connection.cursor() as cursor:
                cursor.execute(sql, [user_id])
                rows = cursor.fetchall()
        else:
            sql = """
                select v.voter_id, v.voter_name, v.voter_vote_confirmation_id, v.voter_name_mar, v.voter_favour_id FROM tbl_voter v where voter_booth_id IN 
                (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s) AND v.voter_vote_confirmation_id = %s;
            """
            
            with connection.cursor() as cursor:
                cursor.execute(sql, [user_id, confirmation_id])
                rows = cursor.fetchall()

        voters = [
            {
                'voter_id': row[0],
                'voter_name': row[1],
                'voter_vote_confirmation_id': row[2],
                'voter_name_mar': row[3],
                'voter_favour_id': row[4]
            }
            for row in rows
        ]

        return Response(voters)
    

# Town User wise vote confirmation

class VoterByTownUserConfirmationView(APIView):
    """
    API View to fetch voters by town user ID and vote confirmation ID.
    """
    def get(self, request, town_user_id, confirmation_id):
        try:
            params = [town_user_id, confirmation_id]
 
            with connection.cursor() as cursor:
                cursor.callproc('GetVotersByConfirmation', params)
                rows = cursor.fetchall()
 
            voters = [
                {
                    'voter_id': row[0],
                    'voter_name': row[1],
                    'voter_vote_confirmation_id': row[2],
                    'voter_name_mar': row[3],
                    'voter_favour_id': row[4]
                }
                for row in rows
            ]
 
            if not voters:
                return Response({"message": "No voters found."}, status=404)
           
            return Response(voters, status=200)
 
        except Exception as e:
            return Response(
                {"error": str(e), "message": "An error occurred while fetching voters."},
                status=500
            )
 


# API for get all group information created by booth user

@csrf_exempt
def get_family_groups_by_user(request, booth_user_id):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT f.family_group_id,
                    f.family_group_name,
                    f.family_group_head_name,
                    f.family_group_contact_no
                FROM tbl_family_group f
                LEFT JOIN tbl_voter v ON f.family_group_id = v.voter_group_id
                WHERE f.family_group_booth_user_id = %s
                GROUP BY f.family_group_id,
                        f.family_group_name,
                        f.family_group_head_name,
                        f.family_group_contact_no
                HAVING COUNT(v.voter_group_id) > 0;
                """,
                [booth_user_id]
            )
            rows = cursor.fetchall()

        family_groups = [
            {
                "family_group_id": row[0],
                "family_group_name": row[1],
                "family_group_head_name": row[2],
                "family_group_contact_no": row[3],
            }
            for row in rows
        ]

        return JsonResponse(family_groups, safe=False, status=200)

    return JsonResponse({'error': 'Invalid method'}, status=405)


# Create Family Group By booth User


logging.basicConfig(level=logging.DEBUG)

@csrf_exempt
def manage_family_group(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        voter_ids = data.get('voter_ids', [])
        single_voter_id = data.get('single_voter_id')
        login_user_id = data.get('login_user_id')
        
        if not voter_ids or not single_voter_id or login_user_id is None:
            logging.debug('Returning error: Invalid input')
            return JsonResponse({'error': 'Invalid input'}, status=400)

        with connection.cursor() as cursor:
            cursor.execute("SELECT voter_name, voter_contact_number, voter_group_id FROM tbl_voter WHERE voter_id = %s", [single_voter_id])
            single_voter = cursor.fetchone()
        
        if not single_voter:
            logging.debug('Returning error: Single voter not found')
            return JsonResponse({'error': 'Single voter not found'}, status=404)

        single_voter_name, single_voter_contact, single_voter_group_id = single_voter
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT voter_id, voter_group_id FROM tbl_voter WHERE voter_id IN %s", [tuple(voter_ids)])
            voter_groups = cursor.fetchall()

        group_ids = {voter_group_id for _, voter_group_id in voter_groups}
        print(group_ids)
        
        if not group_ids or None in group_ids:
            logging.debug('No groups assigned; creating a new family group')
            return create_family_group(single_voter_name, single_voter_contact, login_user_id, voter_ids)

        if len(group_ids) == 1:
            assigned_group_id = group_ids.pop()
            if assigned_group_id != single_voter_group_id:
                logging.debug('Different group assigned; creating a new family group')
                return create_family_group(single_voter_name, single_voter_contact, login_user_id, voter_ids)

        # If the condition above isn't met, create a new family group
        # logging.debug('Conditions not met for existing group; creating a new family group')
        # return create_family_group(single_voter_name, single_voter_contact, login_user_id, voter_ids)

    logging.debug('Returning error: Invalid method')
    return JsonResponse({'error': 'the group in already created'}, status=405)

def create_family_group(voter_name, voter_contact, login_user_id, voter_ids):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO tbl_family_group (family_group_name, family_group_head_name, family_group_contact_no, family_group_booth_user_id)
            VALUES (%s, %s, %s, %s)
            """,
            [voter_name, voter_name, voter_contact, login_user_id]
        )
        
        cursor.execute("SELECT LAST_INSERT_ID()")
        family_group_id = cursor.fetchone()[0]

    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE tbl_voter SET voter_group_id = %s WHERE voter_id IN %s",
            [family_group_id, tuple(voter_ids)]
        )

    return JsonResponse({'message': 'Family group created and voters updated', 'family_group_id': family_group_id}, status=201)



@csrf_exempt
def update_voter_group(request, voter_id):
    if request.method == 'PATCH':
        with connection.cursor() as cursor:
            cursor.execute("UPDATE tbl_voter SET voter_group_id = NULL WHERE voter_id = %s", [voter_id])
        
        logging.debug(f'Successfully updated voter_group_id to NULL for voter_id: {voter_id}')
        return JsonResponse({'message': 'Voter group ID updated to NULL'}, status=200)

    logging.debug('Returning error: Method not allowed')
    return JsonResponse({'error': 'Invalid method'}, status=405)


# Create family by town user

@csrf_exempt
def manage_family_group_by_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        voter_ids = data.get('voter_ids', [])
        single_voter_id = data.get('single_voter_id')
        login_user_id = data.get('login_user_id')
        
        if not voter_ids or not single_voter_id or login_user_id is None:
            logging.debug('Returning error: Invalid input')
            return JsonResponse({'error': 'Invalid input'}, status=400)

        with connection.cursor() as cursor:
            cursor.execute("SELECT voter_name, voter_contact_number, voter_group_id FROM tbl_voter WHERE voter_id = %s", [single_voter_id])
            single_voter = cursor.fetchone()
        
        if not single_voter:
            logging.debug('Returning error: Single voter not found')
            return JsonResponse({'error': 'Single voter not found'}, status=404)

        single_voter_name, single_voter_contact, single_voter_group_id = single_voter
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT voter_id, voter_group_id FROM tbl_voter WHERE voter_id IN %s", [tuple(voter_ids)])
            voter_groups = cursor.fetchall()

        group_ids = {voter_group_id for _, voter_group_id in voter_groups}
        
        if not group_ids or None in group_ids:
            logging.debug('No groups assigned; creating a new family group')
            return create_family_group_town_user(single_voter_name, single_voter_contact, login_user_id, voter_ids)

        
        if len(group_ids) == 1:
            assigned_group_id = group_ids.pop()
            if assigned_group_id == single_voter_group_id:
                
                return update_family_group_town_user(assigned_group_id, login_user_id)

        logging.debug('Creating a new family group')
        return create_family_group_town_user(single_voter_name, single_voter_contact, login_user_id, voter_ids)

    return update_family_group_town_user(assigned_group_id, login_user_id)


def create_family_group_town_user(voter_name, voter_contact, login_user_id, voter_ids):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO tbl_family_group (family_group_name, family_group_head_name, family_group_contact_no, family_group_town_user_id)
            VALUES (%s, %s, %s, %s)
            """,
            [voter_name, voter_name, voter_contact, login_user_id]
        )
        
        
        cursor.execute("SELECT LAST_INSERT_ID()")
        family_group_id = cursor.fetchone()[0]


    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE tbl_voter SET voter_group_id = %s WHERE voter_id IN %s",
            [family_group_id, tuple(voter_ids)]
        )

    return JsonResponse({'message': 'Family group created and voters updated', 'family_group_id': family_group_id}, status=201)


def update_family_group_town_user(family_group_id, login_user_id):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            UPDATE tbl_family_group 
            SET family_group_town_user_id = %s 
            WHERE family_group_id = %s
            """,
            [login_user_id, family_group_id]
        )
    
    logging.debug('Family group town user updated')
    return JsonResponse({'message': 'The group is already created and has been updated'}, status=200)


# Get family groups by town user wise

@csrf_exempt
def get_family_groups_by_town_user(request, town_user_id):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT f.family_group_id,
                    f.family_group_name,
                    f.family_group_head_name,
                    f.family_group_contact_no
                FROM tbl_family_group f
                LEFT JOIN tbl_voter v ON f.family_group_id = v.voter_group_id
                WHERE f.family_group_town_user_id = %s
                GROUP BY f.family_group_id,
                        f.family_group_name,
                        f.family_group_head_name,
                        f.family_group_contact_no,
                        f.family_group_booth_user_id,
                        f.family_group_town_user_id
                HAVING COUNT(v.voter_group_id) > 0;
                """,
                [town_user_id]
            )
            rows = cursor.fetchall()

        family_groups = [
            {
                "family_group_id": row[0],
                "family_group_name": row[1],
                "family_group_head_name": row[2],
                "family_group_contact_no": row[3],
            }
            for row in rows
        ]

        return JsonResponse(family_groups, safe=False, status=200)

    return JsonResponse({'error': 'Invalid method'}, status=405)

#API for get family group by admin
def get_family_groups_for_admin(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT family_group_id, family_group_name, family_group_head_name, family_group_contact_no FROM tbl_family_group")
        rows = cursor.fetchall()
        
        columns = [col[0] for col in cursor.description]
        
        family_groups = [
            dict(zip(columns, row))
            for row in rows
        ]
    
    return JsonResponse(family_groups, safe=False)


# API for get family groups by booth wise

def get_family_groups_booth_wise(request, booth_id):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT voter_group_id
                FROM tbl_voter
                WHERE voter_group_id IS NOT NULL AND voter_booth_id = %s
            """, [booth_id])
            voter_group_ids = cursor.fetchall()

        group_ids = [row[0] for row in voter_group_ids]

        if not group_ids:
            return JsonResponse({'message': 'No voter group found for the given booth ID'}, status=404)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT *
                FROM tbl_family_group
                WHERE family_group_id IN %s
            """, [tuple(group_ids)])  
            family_groups = cursor.fetchall()

        family_group_list = [
            {
                'family_group_id': row[0],
                'family_group_name': row[1],
                'family_group_head_name': row[2],
                'family_group_contact_no': row[3],
                'family_group_town_user_id': row[4],
            }
            for row in family_groups
        ]

        return JsonResponse({'family_groups': family_group_list}, status=200)

    return JsonResponse({'error': 'Invalid method'}, status=405)


# Family group by town wise

def get_family_groups_town_wise(request, town_id):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT voter_group_id
                FROM tbl_voter
                WHERE voter_group_id IS NOT NULL AND voter_town_id = %s
            """, [town_id])
            voter_group_ids = cursor.fetchall()

        group_ids = [row[0] for row in voter_group_ids]

        if not group_ids:
            return JsonResponse({'message': 'No voter group found for the given booth ID'}, status=404)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT *
                FROM tbl_family_group
                WHERE family_group_id IN %s
            """, [tuple(group_ids)])  
            family_groups = cursor.fetchall()

        family_group_list = [
            {
                'family_group_id': row[0],
                'family_group_name': row[1],
                'family_group_head_name': row[2],
                'family_group_contact_no': row[3],
                'family_group_town_user_id': row[4],
            }
            for row in family_groups
        ]

        return JsonResponse({'family_groups': family_group_list}, status=200)

    return JsonResponse({'error': 'Invalid method'}, status=405)


# Get voter data by group wise 

def get_voters_by_group_id(request, voter_group_id):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT voter_id, voter_name, voter_contact_number, voter_name_mar, voter_serial_number, voter_id_card_number
                FROM tbl_voter
                WHERE voter_group_id = %s
            """, [voter_group_id])
            voters = cursor.fetchall()

       
        voter_list = [
            {
                'voter_id': row[0],
                'voter_name': row[1],
                'voter_contact_number': row[2],
                'voter_name_mar': row[3],
                'voter_serial_number': row[4],
                'voter_id_card_number': row[5],
            }
            for row in voters
        ]

        if not voter_list:
            return JsonResponse({'message': 'No voters found for the given group ID'}, status=200)

        return JsonResponse({'voters': voter_list}, status=200)

    return JsonResponse({'error': 'Invalid method'}, status=405)


# # get family group details by voter

@csrf_exempt
def get_family_group_details_by_voter(request, voter_id):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT fg.family_group_id, fg.family_group_name, fg.family_group_head_name, fg.family_group_contact_no, voter_favour_id
                FROM tbl_voter v
                JOIN tbl_family_group fg ON v.voter_group_id = fg.family_group_id
                WHERE v.voter_id = %s
                """,
                [voter_id]
            )
            family_group = cursor.fetchone()

        if not family_group:
            return JsonResponse({'error': 'Family group not found for this voter'}, status=404)

        family_group_id, family_group_name, family_group_head_name, family_group_contact_no, voter_favour_id = family_group

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT v.voter_id, v.voter_name, v.voter_contact_number, v.voter_favour_id
                FROM tbl_voter v
                WHERE v.voter_group_id = %s
                """,
                [family_group_id]
            )
            family_members = cursor.fetchall()

        family_members_list = [
            {
                "voter_id": member[0],
                "voter_name": member[1],
                "voter_contact_number": member[2],
                "voter_favour_id": member[3],
            }
            for member in family_members
        ]

        response_data = {
            "family_group_id": family_group_id,
            "family_group_name": family_group_name,
            "family_group_head_name": family_group_head_name,
            "family_group_contact_no": family_group_contact_no,
            "voter_favour_id": voter_favour_id,
            "family_members": family_members_list,
            

        }

        return JsonResponse(response_data, safe=False, status=200)

    return JsonResponse({'error': 'Invalid method'}, status=405)


# API for get all booth users created by town user

def get_booth_users_by_town_user(request, town_user_id):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.callproc('GetUsersByTownUser', [town_user_id])
            rows = cursor.fetchall()

            columns = [col[0] for col in cursor.description]

            users = [
                dict(zip(columns, row))
                for row in rows
            ]

        if not users:
            return JsonResponse({'message': 'No users found for the given town ID'}, status=status.HTTP_200_OK)

        return JsonResponse(users, status=200, safe = False)

    return JsonResponse({'error': 'Invalid method'}, status=405)


# # # Generate pdf booth user list   

from io import BytesIO

from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table, TableStyle


def wrap_text_word_boundary(text, max_length):
    """Wrap text to ensure no word exceeds max_length characters per line."""
    words = text.split()
    wrapped_lines = []
    current_line = []

    for word in words:
        if sum(len(w) for w in current_line) + len(current_line) + len(word) > max_length:
            wrapped_lines.append(' '.join(current_line))
            current_line = [word]  
        else:
            current_line.append(word)
    
    if current_line:
        wrapped_lines.append(' '.join(current_line))

    return '\n'.join(wrapped_lines)

@csrf_exempt
def generate_booth_user_pdf(request):
    with connection.cursor() as cursor:
        cursor.callproc('GetUsersDetails')
        rows = cursor.fetchall()

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="user_details.pdf"'

    buffer = BytesIO()
    pdf = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=0.1*inch, rightMargin=0.1*inch, topMargin=0.5*inch, bottomMargin=0.5*inch)

    title = "User Details Report"
    styles = getSampleStyleSheet()
    custom_style = ParagraphStyle(name='CustomStyle', parent=styles['Normal'], fontSize=14, spaceAfter=14)
    paragraph = Paragraph(title, custom_style)

    table_data = [
        ['Index', 'User Name', 'Phone Number', 'Booth Names']
    ]

    max_name_length = 30  
    max_phone_length = 20
    max_booth_length = 50

    for index, row in enumerate(rows, start=1):
        user_name = wrap_text_word_boundary(row[1], max_name_length)
        phone_number = wrap_text_word_boundary(row[2], max_phone_length)
        booth_names = wrap_text_word_boundary(row[3], max_booth_length)
        table_data.append([index, user_name, phone_number, booth_names])

    col_widths = [0.5*inch, 2.4*inch, 1.1*inch, 4.1*inch]

    table = Table(table_data, colWidths=col_widths, hAlign='LEFT')

    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),
        ('ALIGN', (1, 1), (-1, -1), 'LEFT'),
        ('LEFTPADDING', (0, 1), (0, -1), 0),
        ('RIGHTPADDING', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('LEFTPADDING', (1, 1), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('WORDWRAP', (1, 1), (-1, -1), True),
    ]))

    elements = [paragraph, table]

    pdf.build(elements)
    pdf_data = buffer.getvalue()
    buffer.close()

    response.write(pdf_data)
    return response


# # Generate PDF Town Users List 

@csrf_exempt 
def generate_town_user_pdf(request):
    with connection.cursor() as cursor:
        cursor.callproc('GetTownUserInfo')
        rows = cursor.fetchall()

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="Town_user_details.pdf"'

    buffer = BytesIO()
    pdf = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=0.1*inch, rightMargin=0.1*inch, topMargin=0.5*inch, bottomMargin=0.5*inch)

    title = "Town User Details Report"
    styles = getSampleStyleSheet()
    custom_style = ParagraphStyle(name='CustomStyle', parent=styles['Normal'], fontSize=14, spaceAfter=14)
    paragraph = Paragraph(title, custom_style)

    table_data = [
        ['Index', 'Town User Name', 'Phone Number', 'Town Names']
    ]

    max_name_length = 50  
    max_phone_length = 20
    max_booth_length = 50

    for index, row in enumerate(rows, start=1):
        town_user_name = wrap_text_word_boundary(row[1], max_name_length)
        phone_number = wrap_text_word_boundary(str(row[2]), max_phone_length)  # Convert phone number to string
        town_names = wrap_text_word_boundary(row[3], max_booth_length)
        table_data.append([index, town_user_name, phone_number, town_names])

    col_widths = [0.5*inch, 2.9*inch, 1.4*inch, 3.1*inch]

    table = Table(table_data, colWidths=col_widths, hAlign='LEFT')

    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),
        ('ALIGN', (1, 1), (-1, -1), 'LEFT'),
        ('LEFTPADDING', (0, 1), (0, -1), 0),
        ('RIGHTPADDING', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('LEFTPADDING', (1, 1), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('WORDWRAP', (1, 1), (-1, -1), True),
    ]))

    elements = [paragraph, table]

    pdf.build(elements)
    pdf_data = buffer.getvalue()
    buffer.close()

    response.write(pdf_data)
    return response



# generate pdf for booth and religion wise

from fpdf import FPDF


@csrf_exempt
def get_voters_booth_religion_wise_pdf(request, booth_id, religion_id):
    
    booth_query = '''
        SELECT booth_name 
        FROM tbl_booth 
        WHERE booth_id = %s;
    '''
    with connection.cursor() as cursor:
        cursor.execute(booth_query, [booth_id])
        booth_data = cursor.fetchone()
        booth_name = booth_data[0] if booth_data else "Unknown Booth"
    religion_query = '''
        SELECT religion_name 
        FROM tbl_religion 
        WHERE religion_id = %s;
    '''
    with connection.cursor() as cursor:
        cursor.execute(religion_query, [religion_id])
        religion_data = cursor.fetchone()
        religion_name = religion_data[0] if religion_data else "Unknown Religion"

    query = '''
        SELECT 
            ROW_NUMBER() OVER (ORDER BY cast_name, voter_name) AS serial_no,
            voter_name,
            voter_contact_number,
            cast_name
        FROM vw_voter_list
        WHERE booth_id = %s
        AND religion_id = %s
        AND cast_id IS NOT NULL 
        ORDER BY cast_name, voter_name;
    '''
    with connection.cursor() as cursor:
        cursor.execute(query, [booth_id, religion_id])
        rows = cursor.fetchall()

    result = [
        {
            'voter_id': str(row[0]),  
            'voter_name': str(row[1]),
            'voter_contact_number': str(row[2]),
            'cast_name': str(row[3])
        }
        for row in rows
    ]

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)

    pdf.cell(0, 10, f'Booth Name: {booth_name}', 0, 1)
    pdf.cell(0, 10, f'Religion Name: {religion_name}', 0, 1)
    pdf.ln(10)  

    pdf.cell(18, 10, 'Sr. No.', 1)
    pdf.cell(110, 10, 'Voter Name', 1)
    pdf.cell(35, 10, 'Contact Number', 1)
    pdf.cell(30, 10, 'Cast Name', 1)
    pdf.ln()
    pdf.set_font('Arial', '', 12)

    for voter in result:
        pdf.cell(18, 10, voter['voter_id'], 1)
        pdf.cell(110, 10, voter['voter_name'], 1)
        pdf.cell(35, 10, voter['voter_contact_number'], 1)
        pdf.cell(30, 10, voter['cast_name'], 1)
        pdf.ln()

    response = HttpResponse(pdf.output(dest='S').encode('latin1'), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="voter_information.pdf"'
    return response


# generate pdf for town and religion wise

@csrf_exempt
def get_voters_town_religion_wise_pdf(request, town_id, religion_id):
    
    religion_query = '''
        SELECT religion_name 
        FROM tbl_religion 
        WHERE religion_id = %s;
    '''
    with connection.cursor() as cursor:
        cursor.execute(religion_query, [religion_id])
        religion_data = cursor.fetchone()
        religion_name = religion_data[0] if religion_data else "Unknown Religion"

    town_query = '''
        SELECT town_name 
        FROM tbl_town 
        WHERE town_id = %s;
    '''
    with connection.cursor() as cursor:
        cursor.execute(town_query, [town_id])
        town_data = cursor.fetchone()
        town_name = town_data[0] if town_data else "Unknown Town"

    query = '''
        SELECT 
            ROW_NUMBER() OVER (ORDER BY cast_name, voter_name) AS serial_no,
            voter_name,
            voter_contact_number,
            cast_name
        FROM vw_voter_list
        WHERE town_id = %s 
        AND religion_id = %s 
        AND cast_id IS NOT NULL 
        ORDER BY cast_name, voter_name;
    '''
    with connection.cursor() as cursor:
        cursor.execute(query, [town_id, religion_id])
        rows = cursor.fetchall()

    result = [
        {
            'voter_id': str(row[0]),  
            'voter_name': str(row[1]),
            'voter_contact_number': str(row[2]),
            'cast_name': str(row[3])
        }
        for row in rows
    ]

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)

    pdf.cell(0, 10, f'Town Name: {town_name}', 0, 1)
    pdf.cell(0, 10, f'Religion Name: {religion_name}', 0, 1)
    pdf.ln(10)  

    pdf.cell(18, 10, 'Voter ID', 1)
    pdf.cell(110, 10, 'Voter Name', 1)
    pdf.cell(35, 10, 'Contact Number', 1)
    pdf.cell(30, 10, 'Cast Name', 1)
    pdf.ln()
    pdf.set_font('Arial', '', 12)

    for voter in result:
        pdf.cell(18, 10, voter['voter_id'], 1)
        pdf.cell(110, 10, voter['voter_name'], 1)
        pdf.cell(35, 10, voter['voter_contact_number'], 1)
        pdf.cell(30, 10, voter['cast_name'], 1)
        pdf.ln()
    response = HttpResponse(pdf.output(dest='S').encode('latin1'), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="voter_information.pdf"'
    return response


# Generate pdf for booth and cast wise

@csrf_exempt
def get_voters_booth_cast_wise_pdf(request, booth_id, cast_id):
    
    booth_query = '''
        SELECT b.booth_name, t.town_name 
        FROM tbl_booth b
        JOIN tbl_town t ON b.booth_town_id = t.town_id
        WHERE b.booth_id = %s;
    '''
    with connection.cursor() as cursor:
        cursor.execute(booth_query, [booth_id])
        booth_data = cursor.fetchone()
        booth_name = booth_data[0] if booth_data else "Unknown Booth"
        town_name = booth_data[1] if booth_data else "Unknown Town"

    cast_query = '''
        SELECT cast_name 
        FROM tbl_cast 
        WHERE cast_id = %s;
    '''
    with connection.cursor() as cursor:
        cursor.execute(cast_query, [cast_id])
        cast_name = cursor.fetchone()
        cast_name = cast_name[0] if cast_name else "Unknown Cast"

    voter_query = '''
        SELECT 
            ROW_NUMBER() OVER (ORDER BY cast_name, voter_name) AS serial_no,
            voter_name,
            voter_contact_number,
            cast_name
        FROM vw_voter_list
        WHERE booth_id = %s
        AND cast_id = %s
        AND cast_id IS NOT NULL 
        ORDER BY cast_name, voter_name;
    '''
    with connection.cursor() as cursor:
        cursor.execute(voter_query, [booth_id, cast_id])
        rows = cursor.fetchall()

    result = [
        {
            'voter_id': str(row[0]),  
            'voter_name': str(row[1]),
            'voter_contact_number': str(row[2]),
            'cast_name': str(row[3])
        }
        for row in rows
    ]

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)

    pdf.cell(0, 10, f'Town Name: {town_name}', 0, 1)
    pdf.cell(0, 10, f'Booth Name: {booth_name}', 0, 1)
    pdf.cell(0, 10, f'Cast Name: {cast_name}', 0, 1)
    pdf.ln(10)  

    pdf.cell(18, 10, 'Voter ID', 1)
    pdf.cell(110, 10, 'Voter Name', 1)
    pdf.cell(35, 10, 'Contact Number', 1)
    pdf.cell(30, 10, 'Cast Name', 1)
    pdf.ln()
    pdf.set_font('Arial', '', 12)

    for voter in result:
        pdf.cell(18, 10, voter['voter_id'], 1)
        pdf.cell(110, 10, voter['voter_name'], 1)
        pdf.cell(35, 10, voter['voter_contact_number'], 1)
        pdf.cell(30, 10, voter['cast_name'], 1)
        pdf.ln()

    response = HttpResponse(pdf.output(dest='S').encode('latin1'), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="voter_information.pdf"'
    return response


# pdf for town and cast wise

@csrf_exempt
def get_voters_town_cast_wise_pdf(request, town_id, cast_id):
    
    town_query = '''
        SELECT town_name 
        FROM tbl_town 
        WHERE town_id = %s;
    '''
    with connection.cursor() as cursor:
        cursor.execute(town_query, [town_id])
        town_data = cursor.fetchone()
        town_name = town_data[0] if town_data else "Unknown Town"

    cast_query = '''
        SELECT cast_name 
        FROM tbl_cast 
        WHERE cast_id = %s;
    '''
    with connection.cursor() as cursor:
        cursor.execute(cast_query, [cast_id])
        cast_data = cursor.fetchone()
        cast_name = cast_data[0] if cast_data else "Unknown Cast"

    
    voter_query = '''
        SELECT 
            ROW_NUMBER() OVER (ORDER BY cast_name, voter_name) AS serial_no,
            voter_name,
            voter_contact_number,
            cast_name
        FROM vw_voter_list
        WHERE town_id = %s 
        AND cast_id = %s 
        AND cast_id IS NOT NULL 
        ORDER BY cast_name, voter_name;
    '''
    with connection.cursor() as cursor:
        cursor.execute(voter_query, [town_id, cast_id])
        rows = cursor.fetchall()

    result = [
        {
            'voter_id': str(row[0]),  
            'voter_name': str(row[1]),
            'voter_contact_number': str(row[2]),
            'cast_name': str(row[3])
        }
        for row in rows
    ]

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)

    
    pdf.cell(0, 10, f'Town Name: {town_name}', 0, 1)
    pdf.cell(0, 10, f'Cast Name: {cast_name}', 0, 1)
    pdf.ln(10)  

    pdf.cell(18, 10, 'Voter ID', 1)
    pdf.cell(110, 10, 'Voter Name', 1)
    pdf.cell(35, 10, 'Contact Number', 1)
    pdf.cell(30, 10, 'Cast Name', 1)
    pdf.ln()
    pdf.set_font('Arial', '', 12)

    for voter in result:
        pdf.cell(18, 10, voter['voter_id'], 1)
        pdf.cell(110, 10, voter['voter_name'], 1)
        pdf.cell(35, 10, voter['voter_contact_number'], 1)
        pdf.cell(30, 10, voter['cast_name'], 1)
        pdf.ln()

    response = HttpResponse(pdf.output(dest='S').encode('latin1'), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="voter_information.pdf"'
    return response


# API for to get voter confirmation data by booth wise (Non Voted and voted)

class GetVoterConfirmationDataBYBooth(APIView):
    def get(self, request, voter_booth_id, voter_vote_confirmation_id=None):
        if voter_vote_confirmation_id is not None:
            query = """
                SELECT voter_id,voter_serial_number, voter_id_card_number, voter_name, voter_vote_confirmation_id, voter_name_mar 
                FROM tbl_voter 
                WHERE voter_vote_confirmation_id = %s AND voter_booth_id = %s
            """
            params = [voter_vote_confirmation_id, voter_booth_id]
        else:
            query = """
                SELECT voter_id,voter_serial_number, voter_id_card_number,voter_name, voter_vote_confirmation_id, voter_name_mar 
                FROM tbl_voter 
                WHERE voter_vote_confirmation_id IS NULL AND voter_booth_id = %s
            """
            params = [voter_booth_id]  

        with connection.cursor() as cursor:
            cursor.execute(query, params)
            rows = cursor.fetchall()

            if not rows:
                return Response([], status=status.HTTP_200_OK)

            columns = [col[0] for col in cursor.description]
            result = [
                {columns[i]: row[i] for i in range(len(columns))}
                for row in rows
            ]

        return Response(result, status=status.HTTP_200_OK)



# API for to get voter confirmation data by town (voted, non voted vpters)

class GetVoterConfirmationDataBYTown(APIView):
    def get(self, request, voter_town_id, voter_vote_confirmation_id=None):
        if voter_vote_confirmation_id is not None:
            query = """
                SELECT voter_id, voter_name, voter_vote_confirmation_id, voter_serial_number, voter_id_card_number 
                FROM tbl_voter 
                WHERE voter_vote_confirmation_id = %s AND voter_town_id = %s
            """
            params = [voter_vote_confirmation_id, voter_town_id]
        else:
            query = """
                SELECT voter_id, voter_name, voter_vote_confirmation_id, voter_serial_number, voter_id_card_number 
                FROM tbl_voter 
                WHERE voter_vote_confirmation_id IS NULL AND voter_town_id = %s
            """
            params = [voter_town_id]  

        with connection.cursor() as cursor:
            cursor.execute(query, params)
            rows = cursor.fetchall()

            if not rows:
                return Response([], status=status.HTTP_200_OK)

            columns = [col[0] for col in cursor.description]
            result = [
                {columns[i]: row[i] for i in range(len(columns))}
                for row in rows
            ]

        return Response(result, status=status.HTTP_200_OK)
    

# API for to get voter confirmation data by admin

class GetVoterConfirmationData(APIView):
    def get(self, request, voter_vote_confirmation_id=None):
        if voter_vote_confirmation_id is not None:
            query = """
                SELECT voter_id, voter_name, voter_vote_confirmation_id 
                FROM tbl_voter 
                WHERE voter_vote_confirmation_id = %s;
            """
            params = [voter_vote_confirmation_id]
        else:
            query = """
                SELECT voter_id, voter_name, voter_vote_confirmation_id 
                FROM tbl_voter 
                WHERE voter_vote_confirmation_id IS NULL
            """
            params = []  

        with connection.cursor() as cursor:
            cursor.execute(query, params)
            rows = cursor.fetchall()

            if not rows:
                return Response([], status=status.HTTP_204_NO_CONTENT)

            columns = [col[0] for col in cursor.description]
            result = [
                {columns[i]: row[i] for i in range(len(columns))}
                for row in rows
            ]

        return Response(result, status=status.HTTP_200_OK)


# # Get Voted, non voted voters data Count By Booth wise

class GetVoterCountByBooth(APIView):
    def get(self, request, voter_booth_id):
        non_voted_query = """
            SELECT COUNT(*) 
            FROM tbl_voter 
            WHERE voter_vote_confirmation_id IS NULL 
            AND voter_booth_id = %s
        """
        voted_query = """
            SELECT COUNT(*) 
            FROM tbl_voter 
            WHERE voter_vote_confirmation_id IS NOT NULL 
            AND voter_booth_id = %s
        """

        with connection.cursor() as cursor:
            cursor.execute(non_voted_query, [voter_booth_id])
            non_voted_count = cursor.fetchone()[0]

            cursor.execute(voted_query, [voter_booth_id])
            voted_count = cursor.fetchone()[0]

        result = {
            "voter_booth_id": voter_booth_id,
            "non_voted_count": non_voted_count,
            "voted_count": voted_count
        }

        return Response(result, status=status.HTTP_200_OK)
    

# # Get Voted, non voted voters data Count By Town wise

class GetVoterCountByTown(APIView):
    def get(self, request, voter_town_id):
        non_voted_query = """
            SELECT COUNT(*) 
            FROM tbl_voter 
            WHERE voter_vote_confirmation_id IS NULL 
            AND voter_town_id = %s
        """
        voted_query = """
            SELECT COUNT(*) 
            FROM tbl_voter 
            WHERE voter_vote_confirmation_id IS NOT NULL 
            AND voter_town_id = %s
        """

        with connection.cursor() as cursor:
            cursor.execute(non_voted_query, [voter_town_id])
            non_voted_count = cursor.fetchone()[0]

            cursor.execute(voted_query, [voter_town_id])
            voted_count = cursor.fetchone()[0]

        result = {
            "voter_town_id": voter_town_id,
            "non_voted_count": non_voted_count,
            "voted_count": voted_count
        }

        return Response(result, status=status.HTTP_200_OK)
    

# # Total voted, non voted count

class VoterVoteConfirmationCount(View):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_vote_confirmation_id IS NOT NULL;")
            confirmed_count = cursor.fetchone()[0]
 
            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_vote_confirmation_id IS NULL;")
            unconfirmed_count = cursor.fetchone()[0]
 
        total_count = confirmed_count + unconfirmed_count
 
        voted_percentage = (confirmed_count / total_count) * 100 if total_count > 0 else 0
        non_voted_percentage = (unconfirmed_count / total_count) * 100 if total_count > 0 else 0
 
        data = {
            "voted_count": confirmed_count,
            "non_voted_count": unconfirmed_count,
            "voted_percentage": round(voted_percentage, 2),
            "non_voted_percentage": round(non_voted_percentage, 2),
        }
       
        return JsonResponse(data)



# API voter vote confirmation 
class VoterConfirmation(APIView):
    def put(self, request, voter_id):
        voter_vote_confirmation_id = request.data.get('voter_vote_confirmation_id', None)

        if voter_vote_confirmation_id == "NULL":
            voter_vote_confirmation_id = None

        query = """
            UPDATE tbl_voter 
            SET voter_vote_confirmation_id = %s 
            WHERE voter_id = %s
        """
        
        with connection.cursor() as cursor:
            cursor.execute(query, [voter_vote_confirmation_id, voter_id])

        return Response({'message': 'Voter updated successfully'}, status=status.HTTP_200_OK)
    

# # # Booth Wise Percentage of voting

def booth_voting_view(request, booth_id=None):
    try:
        with connection.cursor() as cursor:
            if booth_id:
                cursor.callproc('get_booth_voting_percentage',[booth_id])
            else:
                cursor.callproc('get_booth_voting_percentage',[None])
            
            columns = [col[0] for col in cursor.description]
            results = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
            
        return JsonResponse(results, safe=False)
    except:
        return JsonResponse({"error": "Error fetching data"}, status=500)


# # # Town Wise Percentage of voting

def town_voting_view(request, town_id=None):
    try:
        with connection.cursor() as cursor:
            if town_id:
                    cursor.callproc('get_town_voting_percentage',[town_id])
            else:
                    cursor.callproc('get_town_voting_percentage',[None])
            
            columns = [col[0] for col in cursor.description]
            results = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return JsonResponse(results, safe=False)
    except:
        return JsonResponse({"error": "Error fetching data"}, status=500)


# # Get Count fev voted and fev non voted from voted voters

class GetFavorableVotedNonVotedVoterCount(APIView):
    def get(self, request):
        query = """
            SELECT 
                SUM(CASE WHEN vw.voter_vote_confirmation_id IS NOT NULL AND vw.favour_id IS NOT NULL THEN 1 ELSE 0 END) AS favorable_voted_count,
                SUM(CASE WHEN vw.voter_vote_confirmation_id IS NULL AND vw.favour_id IS NOT NULL THEN 1 ELSE 0 END) AS favorable_non_voted_count,
                COUNT(vw.favour_id) AS total_favorable_count
            FROM 
                vw_voter_list vw
            WHERE
                vw.favour_id IS NOT NULL;
        """
        
        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchone()

        if result is None or result[2] == 0:  
            return Response({"detail": "No data found or no favorable voters"}, status=status.HTTP_204_NO_CONTENT)

        favorable_voted_count = result[0]
        favorable_non_voted_count = result[1]
        total_favorable_count = result[2]

        favorable_voted_percentage = (favorable_voted_count / total_favorable_count) * 100
        favorable_non_voted_percentage = (favorable_non_voted_count / total_favorable_count) * 100

        data = {
            "favorable_voted_count": favorable_voted_count,
            "favorable_non_voted_count": favorable_non_voted_count,
            "total_favorable_count": total_favorable_count,
            "favorable_voted_percentage": round(favorable_voted_percentage, 2),
            "favorable_non_voted_percentage": round(favorable_non_voted_percentage, 2)
        }

        return Response(data, status=status.HTTP_200_OK)
    

# # Get Count fev voted and fev non voted from voted voters By Booth wise

class GetFavorableVoterCountByBooth(APIView):
    def get(self, request):
        query = """
            SELECT 
                b.booth_id,
                b.booth_name,
                COUNT(*) AS booth_voter,
                COUNT(CASE WHEN v.voter_vote_confirmation_id = 1 THEN 1 END) AS voted_count,
                COUNT(CASE WHEN v.voter_vote_confirmation_id IS NULL THEN 1 END) AS non_voted_count,
                COUNT(CASE WHEN v.voter_favour_id = 1 AND v.voter_vote_confirmation_id = 1 THEN 1 END) AS favour_voted_count,
                COUNT(CASE WHEN v.voter_favour_id = 1 AND v.voter_vote_confirmation_id IS NULL THEN 1 END) AS favour_non_voted_count
            FROM 
                tbl_voter v
            JOIN 
                tbl_booth b ON v.voter_booth_id = b.booth_id
            GROUP BY 
                b.booth_id, b.booth_name;
        """
        
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        if not rows:
            return Response({"detail": "No data found"}, status=status.HTTP_204_NO_CONTENT)

        data = []
        for row in rows:
            booth_id = row[0]
            booth_name = row[1]
            booth_count = row[2]
            total_voted_count = row[3]  
            non_voted_count = row[4]    
            favorable_voted_count = row[5]  
            favorable_non_voted_count = row[6]  

            total_voted_count = int(total_voted_count) if total_voted_count is not None else 0
            favorable_voted_count = int(favorable_voted_count) if favorable_voted_count is not None else 0
            
            if total_voted_count > 0:  
                favorable_voted_percentage = (favorable_voted_count / total_voted_count) * 100
            else:
                favorable_voted_percentage = 0
            
            data.append({
                "booth_id": booth_id,
                "booth_name": booth_name,
                "booth_count": booth_count,
                "total_voted_count": total_voted_count,
                "favorable_voted_count": favorable_voted_count,
                "favorable_non_voted_count": favorable_non_voted_count, 
                "favorable_voted_percentage": round(favorable_voted_percentage, 2),
            })

        return Response(data, status=status.HTTP_200_OK)


    

# # Get Count fev voted and fev non voted from voted voters By Town wise

class GetFavorableVoterCountByTown(APIView):
    def get(self, request):
        query = """
            SELECT 
                t.town_id,
                t.town_name,
                COUNT(*) AS town_voter,
                COUNT(CASE WHEN voter_vote_confirmation_id = 1 THEN 1 END) AS voted_count,
                COUNT(CASE WHEN voter_vote_confirmation_id IS NULL THEN 1 END) AS non_voted_count,
                COUNT(CASE WHEN voter_favour_id = 1 AND voter_vote_confirmation_id = 1 THEN 1 END) AS favour_voted_count,
                COUNT(CASE WHEN voter_favour_id = 1 AND voter_vote_confirmation_id IS NULL THEN 1 END) AS favour_non_voted_count
            FROM 
                tbl_voter v
            JOIN 
                tbl_town t ON v.voter_town_id = t.town_id
            GROUP BY 
                voter_town_id;

        """
        
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        if not rows:
            return Response({"detail": "No data found"}, status=status.HTTP_204_NO_CONTENT)

        data = []
        for row in rows:
            town_id = row[0]
            town_name = row[1]
            town_voter = row[2]
            total_voted_count = row[3]  
            non_voted_count = row[4]    
            favorable_voted_count = row[5]  
            favorable_non_voted_count = row[6]  

            total_voted_count = int(total_voted_count) if total_voted_count is not None else 0
            favorable_voted_count = int(favorable_voted_count) if favorable_voted_count is not None else 0
            
            if total_voted_count > 0:  
                favorable_voted_percentage = (favorable_voted_count / total_voted_count) * 100
            else:
                favorable_voted_percentage = 0
            
            data.append({
                "town_id": town_id,
                "town_name": town_name,
                "town_voter": town_voter,
                "total_voted_count": total_voted_count,
                "favorable_voted_count": favorable_voted_count,
                "favorable_non_voted_count": favorable_non_voted_count, 
                "favorable_voted_percentage": round(favorable_voted_percentage, 2),
            })

        return Response(data, status=status.HTTP_200_OK)



# Edited voter data confirmation 
# # updated voter data store in temp table 

@csrf_exempt
def compare_voter_data(request):
    if request.method == 'POST':
        voter_data = json.loads(request.body)

        voter_id = voter_data.get('voter_id')

        with connection.cursor() as cursor:
            cursor.execute("SELECT voter_id, voter_name, voter_parent_name, voter_age, voter_gender, voter_contact_number, voter_cast_id, voter_marital_status_id, voter_live_status_id, voter_in_city_id, voter_current_location FROM tbl_voter WHERE voter_id = %s", [voter_id])
            existing_voter = cursor.fetchone()

        if not existing_voter:
            return JsonResponse({"error": "Voter not found."}, status=404)

        existing_voter_dict = {
            'voter_id': existing_voter[0],
            'voter_name': existing_voter[1],
            'voter_parent_name': existing_voter[2],
            'voter_age': existing_voter[3],
            'voter_gender': existing_voter[4],
            'voter_contact_number': existing_voter[5],
            'voter_cast_id': existing_voter[6],
            'voter_marital_status_id': existing_voter[7],
            'voter_live_status_id': existing_voter[8],
            'voter_in_city_id' : existing_voter[9],
            'voter_current_location' : existing_voter[10],
        }

        temp_voter_data_updated_by_user_id = request.session.get('user_id') 

        temp_data = {
            'temp_voter_data_voter_id': voter_id,
            'temp_voter_data_updated_by_user_id': temp_voter_data_updated_by_user_id
        }

        for field in ['voter_name', 'voter_parent_name', 'voter_age', 'voter_gender', 
              'voter_contact_number', 'voter_cast_id', 'voter_marital_status_id', 
              'voter_live_status_id', 'voter_in_city_id', 'voter_current_location']:
            if field in voter_data:
                # Check if the field is either not present in existing data or is different
                if existing_voter_dict[field] != voter_data[field]:
                    temp_data[f'temp_{field}'] = voter_data[field]

        if any(temp_data.get(f'temp_{field}') for field in ['voter_name', 'voter_parent_name', 
                                                              'voter_age', 'voter_gender', 
                                                              'voter_contact_number', 
                                                              'voter_cast_id', 
                                                              'voter_marital_status_id', 
                                                              'voter_live_status_id', 'voter_in_city_id', 'voter_current_location']):
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO tbl_temp_voter_data 
                    (temp_voter_data_voter_id, temp_voter_data_voter_name, temp_voter_data_voter_parent_name, temp_voter_data_voter_contact_number, 
                     temp_voter_data_voter_cast, temp_voter_data_voter_live_status, temp_voter_data_voter_marital_status, 
                     temp_voter_data_voter_age, temp_voter_data_voter_gender, temp_voter_data_updated_by_user_id,  temp_voter_data_voter_in_city_id, temp_voter_data_voter_current_location)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s)
                """, (
                    temp_data['temp_voter_data_voter_id'],
                    temp_data.get('temp_voter_name'),
                    temp_data.get('temp_voter_parent_name'),
                    temp_data.get('temp_voter_contact_number'),
                    temp_data.get('temp_voter_cast_id'),
                    temp_data.get('temp_voter_live_status_id'),
                    temp_data.get('temp_voter_marital_status_id'),
                    temp_data.get('temp_voter_age'),
                    temp_data.get('temp_voter_gender'),
                    temp_voter_data_updated_by_user_id,
                    temp_data.get('temp_voter_in_city_id'),
                    temp_data.get('temp_voter_current_location')
                ))
               

            return JsonResponse({"success": "Data stored in temporary voter data."}, status=201)

        return JsonResponse({"message": "No changes detected."}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)



def get_temp_voter_data(request, temp_voter_data_voter_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                temp_voter_data_voter_id,
                temp_voter_data_voter_name,
                temp_voter_data_voter_parent_name,
                temp_voter_data_voter_contact_number,
                temp_voter_data_voter_cast,
                temp_voter_data_voter_live_status,
                temp_voter_data_voter_marital_status,
                temp_voter_data_voter_age,
                temp_voter_data_voter_gender,
                temp_voter_data_approved_status,
                temp_voter_data_voter_in_city_id, temp_voter_data_voter_current_location
            FROM tbl_temp_voter_data
            WHERE temp_voter_data_voter_id = %s;
        """, [temp_voter_data_voter_id])
        
        row = cursor.fetchone()
        
        if row is None:
            return JsonResponse({"error": "No data found for this temp_voter_data_voter_id."}, status=404)

        columns = [col[0] for col in cursor.description] if cursor.description else []
        
        result = dict(zip(columns, row))

        result = {k: v for k, v in result.items() if v is not None}

    return JsonResponse(result)

#API for reject status of multiple voter 
@api_view(['PUT'])
def reject_multiple_temp_voter_data(request):
    voter_ids = request.data.get('temp_voter_data_voter_ids', [])
    
    if not isinstance(voter_ids, list):
        return Response({'error': 'Invalid data format. Expecting an array of voter IDs.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not voter_ids:
        return Response({'error': 'No voter IDs provided.'}, status=status.HTTP_400_BAD_REQUEST)

    ids_placeholder = ', '.join(['%s'] * len(voter_ids))

    sql_query = f"UPDATE tbl_temp_voter_data SET temp_voter_data_approved_status = 0 WHERE temp_voter_data_voter_id IN ({ids_placeholder})"
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(sql_query, voter_ids)
        updated_count = cursor.rowcount
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'updated_count': updated_count}, status=status.HTTP_200_OK)


@csrf_exempt
def approve_voter_data(request, temp_voter_data_voter_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        update_fields = []
        params = []

        if 'temp_voter_data_voter_name' in data:
            update_fields.append("voter_name = %s")
            params.append(data['temp_voter_data_voter_name'])
        
        if 'temp_voter_data_voter_parent_name' in data:
            update_fields.append("voter_parent_name = %s")
            params.append(data['temp_voter_data_voter_parent_name'])
        
        if 'temp_voter_data_voter_contact_number' in data:
            update_fields.append("voter_contact_number = %s")
            params.append(data['temp_voter_data_voter_contact_number'])
        
        if 'temp_voter_data_voter_cast' in data:
            update_fields.append("voter_cast_id = %s")
            params.append(data['temp_voter_data_voter_cast'])
        
        if 'temp_voter_data_voter_live_status' in data:
            update_fields.append("voter_live_status_id = %s")
            params.append(data['temp_voter_data_voter_live_status'])
        
        if 'temp_voter_data_voter_marital_status' in data:
            update_fields.append("voter_marital_status_id = %s")
            params.append(data['temp_voter_data_voter_marital_status'])
        
        if 'temp_voter_data_voter_age' in data:
            update_fields.append("voter_age = %s")
            params.append(data['temp_voter_data_voter_age'])
        
        if 'temp_voter_data_voter_gender' in data:
            update_fields.append("voter_gender = %s")
            params.append(data['temp_voter_data_voter_gender'])

        if 'temp_voter_data_updated_by_user_id' in data:
            update_fields.append("voter_updated_by = %s")
            params.append(data['temp_voter_data_updated_by_user_id'])

        if 'temp_voter_data_voter_in_city_id' in data:
            update_fields.append("voter_in_city_id = %s")
            params.append(data['temp_voter_data_voter_in_city_id'])

        if 'temp_voter_data_voter_current_location' in data:
            update_fields.append("voter_current_location = %s")
            params.append(data['temp_voter_data_voter_current_location'])

        if not update_fields:
            return JsonResponse({"error": "No fields to update."}, status=400)

        sql_voter = f"""
            UPDATE tbl_voter
            SET {', '.join(update_fields)}
            WHERE voter_id = %s;
        """
        params.append(temp_voter_data_voter_id)

        with connection.cursor() as cursor:
            cursor.execute(sql_voter, params)

        sql_temp_status = """
            UPDATE tbl_temp_voter_data
            SET temp_voter_data_approved_status = 1
            WHERE temp_voter_data_voter_id = %s;
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_temp_status, [temp_voter_data_voter_id])

        return JsonResponse({"message": "Voter data and temporary status updated successfully."}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def update_reject_status(request, temp_voter_data_voter_id):
    if request.method == 'PUT':
        sql_temp_status = """
            UPDATE tbl_temp_voter_data
            SET temp_voter_data_approved_status = 0
            WHERE temp_voter_data_voter_id = %s;
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_temp_status, [temp_voter_data_voter_id])

        return JsonResponse({"message": "Voter temp_voter_data_approved_status rejected"}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def get_temp_voter_data_town(request, temp_voter_data_updated_by_user_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                t.temp_voter_data_id,
                t.temp_voter_data_voter_id,
                COALESCE(t.temp_voter_data_voter_name, v.voter_name) AS voter_name,
                t.temp_voter_data_voter_parent_name,
                t.temp_voter_data_voter_contact_number,
                t.temp_voter_data_voter_cast,
                t.temp_voter_data_voter_live_status,
                t.temp_voter_data_voter_marital_status,
                t.temp_voter_data_voter_age,
                t.temp_voter_data_voter_gender,
                t.temp_voter_data_updated_by_user_id,
                t.temp_voter_data_voter_in_city_id,
                t.temp_voter_data_voter_current_location
            FROM tbl_temp_voter_data t
            LEFT JOIN tbl_voter v ON t.temp_voter_data_voter_id = v.voter_id
            WHERE t.temp_voter_data_updated_by_user_id = %s 
            AND t.temp_voter_data_approved_status IS NULL;
        """, [temp_voter_data_updated_by_user_id])
        
        rows = cursor.fetchall()
        
        if not rows: 
            return JsonResponse({"message": "No data found for this temp_voter_data_updated_by_user_id."}, status=404)

        columns = [col[0] for col in cursor.description] if cursor.description else []

        result = []
        for row in rows:
            row_dict = dict(zip(columns, row))
            row_dict = {k: v for k, v in row_dict.items() if v is not None}
            result.append(row_dict)

    return JsonResponse(result, safe=False)


def get_temp_voter_data_user(request, temp_voter_data_updated_by_user_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                temp_voter_data_id,
                temp_voter_data_voter_id,
                temp_voter_data_voter_name,
                temp_voter_data_voter_parent_name,
                temp_voter_data_voter_contact_number,
                temp_voter_data_voter_cast,
                temp_voter_data_voter_live_status,
                temp_voter_data_voter_marital_status,
                temp_voter_data_voter_age,
                temp_voter_data_voter_gender,
                temp_voter_data_updated_by_user_id,
                temp_voter_data_voter_in_city_id,
                temp_voter_data_voter_current_location
            FROM tbl_temp_voter_data
            WHERE temp_voter_data_updated_by_user_id = %s AND (temp_voter_data_approved_status <> 1 OR temp_voter_data_approved_status IS NULL);
        """, [temp_voter_data_updated_by_user_id])
        
        rows = cursor.fetchall()
        
        if not rows: 
            return JsonResponse({"error": "No data found for this temp_voter_data_voter_id."}, status=404)

        columns = [col[0] for col in cursor.description] if cursor.description else []

        result = []
        for row in rows:
            row_dict = dict(zip(columns, row))
            row_dict = {k: v for k, v in row_dict.items() if v is not None}
            result.append(row_dict)

    return JsonResponse(result, safe=False)



# # GET Town name and voter count

class TownVoterCountView(APIView):
    def get(self, request):
        query = """
        SELECT 
            ROW_NUMBER() OVER (ORDER BY t.town_id) AS serial_number,
            t.town_id,
            t.town_name,
            t.town_name_mar,
            COUNT(DISTINCT v.voter_id) AS voter_count, -- Count distinct voters
            GROUP_CONCAT(DISTINCT u.town_user_name SEPARATOR ', ') AS town_user_names,
            GROUP_CONCAT(DISTINCT u.town_user_id SEPARATOR ', ') AS town_user_id,
            s.sarpanch_name,
            t.town_area_type_id
        FROM 
            vw_voter_list v
        LEFT JOIN 
            tbl_user_town ut ON v.town_id = ut.user_town_town_id
        LEFT JOIN 
            tbl_town_user u ON ut.user_town_town_user_id = u.town_user_id
        LEFT JOIN 
            tbl_town t ON v.town_id = t.town_id
        LEFT JOIN 
            tbl_sarpanch s ON t.town_id = s.sarpanch_town_id
        GROUP BY 
            t.town_id, t.town_name, t.town_name_mar, s.sarpanch_name, t.town_area_type_id
        ORDER BY 
            t.town_id;
        """

        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        response_data = [
            {
                'sr_no': row[0],
                'town_id': row[1],
                'town_name': row[2],
                'town_name_mar': row[3],
                'voter_count': row[4],
                'town_user_names': row[5],  
                'town_user_ids': [int(uid) for uid in row[6].split(',')] if row[6] else [],  
                'sarpanch_name': row[7],
                'town_type': row[8]
            }
            for row in rows
        ]

        return Response(response_data, status=status.HTTP_200_OK)



# # voter town count pdf

class VoterCountPDFView(APIView):
    def get(self, request):
        query = """
            SELECT 
                ROW_NUMBER() OVER (ORDER BY t.town_name) AS serial_number,
                t.town_name, 
                COUNT(v.voter_id) AS voter_count,
                GROUP_CONCAT(DISTINCT u.town_user_name SEPARATOR ', ') AS town_user_names,
                s.sarpanch_name
            FROM 
                vw_voter_list v
            LEFT JOIN 
                tbl_user_town ut ON v.town_id = ut.user_town_town_id
            LEFT JOIN 
                tbl_town_user u ON ut.user_town_town_user_id = u.town_user_id
            LEFT JOIN 
                tbl_town t ON v.town_id = t.town_id
            LEFT JOIN 
                tbl_sarpanch s ON t.town_id = s.sarpanch_town_id
            GROUP BY 
                t.town_id, t.town_name, s.sarpanch_name
            ORDER BY 
                t.town_name
        """

        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        buffer = BytesIO()
        pdf = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=0.5 * inch,
            rightMargin=0.5 * inch,
            topMargin=0.5 * inch,
            bottomMargin=0.5 * inch,
        )
        elements = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(name='Title', fontSize=16, spaceAfter=14)
        title = Paragraph("Voter Count by Town", title_style)
        elements.append(title)

        table_data = [
            ['S/N', 'Town Name', 'Voter Count', 'Town Users', 'Sarpanch Name']
        ]

        for row in rows:
            town_users = Paragraph(row[3] or '', styles['BodyText'])
            sarpanch_name = Paragraph(row[4] or '', styles['BodyText'])
            table_data.append([str(row[0]), row[1], str(row[2]), town_users, sarpanch_name])

        col_widths = [0.5 * inch, 2.2 * inch, 1.0 * inch, 2.3 * inch, 1.4 * inch]

        table = Table(table_data, colWidths=col_widths, hAlign='LEFT')
        
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey), 
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black), 
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  
            ('ALIGN', (1, 1), (1, -1), 'LEFT'),  
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),  
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))


        elements.append(table)

        pdf.build(elements)

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="voter_count_town_summary.pdf"'
        return response



@api_view(['PUT'])
def update_user_name_and_contact(request, user_id):
    user_name = request.data.get('user_name')
    user_phone = request.data.get('user_phone')

    if user_name is None or user_phone is None:
        return Response({'error': 'user_name and user_phone are required.'}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        try:
            cursor.execute(
                "UPDATE tbl_user SET user_name = %s, user_phone = %s WHERE user_id = %s",
                [user_name, user_phone, user_id]
            )
            if cursor.rowcount == 0:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
def update_town_user_name_and_contact(request, town_user_id):
    town_user_name = request.data.get('town_user_name')
    town_user_contact_number = request.data.get('town_user_contact_number')

    if town_user_name is None or town_user_contact_number is None:
        return Response({'error': 'user_name and user_phone are required.'}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        try:
            cursor.execute(
                "UPDATE tbl_user SET town_user_name = %s, town_user_contact_number = %s WHERE user_id = %s",
                [town_user_name, town_user_contact_number, town_user_id]
            )
            if cursor.rowcount == 0:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        



class GetVotedCountByBoothUser(APIView):
    def get(self, request, user_id):
        non_voted_query = """
            SELECT COUNT(*) 
            FROM tbl_voter 
            WHERE voter_vote_confirmation_id IS NULL 
            AND voter_booth_id  IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);
        """
        voted_query = """
             SELECT COUNT(*) 
            FROM tbl_voter 
            WHERE voter_vote_confirmation_id IS NOT NULL 
            AND voter_booth_id  IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);
        """

        with connection.cursor() as cursor:
            cursor.execute(non_voted_query, [user_id])
            non_voted_count = cursor.fetchone()[0]

            cursor.execute(voted_query, [user_id])
            voted_count = cursor.fetchone()[0]

        result = {
            "non_voted_count": non_voted_count,
            "voted_count": voted_count
        }

        return Response(result, status=status.HTTP_200_OK)



class VoterSearchView(View):
    def get(self, request, name):
        name_query = request.GET.get('name', '')
        if not name_query:
            return JsonResponse({'error': 'No name provided'}, status=400)
        
        words = name_query.split()
        with connection.cursor() as cursor:
            if len(words) == 2:
                first_name, last_name = words
                sql_query = f"SELECT * FROM tbl_voter WHERE voter_name LIKE %s"
                cursor.execute(sql_query, [f'%{first_name} % {last_name}%'])
            elif len(words) > 2:
                sql_query = f"SELECT * FROM tbl_voter WHERE voter_name LIKE %s"
                cursor.execute(sql_query, [f'%{name_query}%'])
            else:
                return JsonResponse({'error': 'Please provide at least two words'}, status=400)

            rows = cursor.fetchall()
        
            columns = [col[0] for col in cursor.description]

            
            results = [dict(zip(columns, row)) for row in rows]

        return JsonResponse(results, safe=False)
    


@method_decorator(csrf_exempt, name='dispatch')
class ChangeUserPasswordView(View):
    def put(self, request, user_id, *args, **kwargs):
        data = json.loads(request.body) 
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        try:
            user = User.objects.get(id=user_id)  
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        if check_password(old_password, user.password):  
            user.password = make_password(new_password)  
            user.save()
            return JsonResponse({"message": "Password changed successfully."}, status=200)
        else:
            return JsonResponse({"error": "Old password is incorrect."}, status=400)
        


@method_decorator(csrf_exempt, name='dispatch')
class ChangePoliticianPasswordView(View):
    def put(self, request, politician_id, args, *kwargs):
        data = json.loads(request.body)
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        try:
            politician = Politician.objects.get(politician_id=politician_id)  
        except Politician.DoesNotExist:
            return JsonResponse({"error": "Politician not found."}, status=404)

        if check_password(old_password, politician.politician_password):  
            politician.politician_password = make_password(new_password)  
            politician.save()
            return JsonResponse({"message": "Password changed successfully."}, status=200)
        else:
            return JsonResponse({"error": "Old password is incorrect."}, status=400)
        

@method_decorator(csrf_exempt, name='dispatch')
class ChangeTownUserPasswordView(View):
    def put(self, request, town_user_id, *args, **kwargs):
        data = json.loads(request.body)
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        try:
            town_user = Town_user.objects.get(town_user_id=town_user_id)  
        except Town_user.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        if check_password(old_password, town_user.town_user_password):  
            town_user.town_user_password = make_password(new_password)  
            town_user.save()
            return JsonResponse({"message": "Password changed successfully."}, status=200)
        else:
            return JsonResponse({"error": "Old password is incorrect."}, status=400)


# multiple voter data approved status

@csrf_exempt
def multiple_voter_data_update(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        voter_ids = data.get('temp_voter_data_voter_ids', [])
        if not isinstance(voter_ids, list) or not voter_ids:
            return JsonResponse({"error": "Invalid or empty voter ID list."}, status=400)

        for voter_id in voter_ids:
            with connection.cursor() as cursor:
                cursor.execute("""
                       SELECT  temp_voter_data_voter_name, temp_voter_data_voter_parent_name,
                        temp_voter_data_voter_contact_number, temp_voter_data_voter_cast,
                        temp_voter_data_voter_live_status, temp_voter_data_voter_marital_status,
                        temp_voter_data_voter_age, temp_voter_data_voter_gender,
                        temp_voter_data_updated_by_user_id, temp_voter_data_voter_in_city_id, temp_voter_data_voter_current_location
                    FROM tbl_temp_voter_data
                    WHERE temp_voter_data_voter_id = %s
                    AND (temp_voter_data_approved_status IS NULL OR temp_voter_data_approved_status != 1);
                """, [voter_id])
                temp_voter_data = cursor.fetchone()

            if temp_voter_data:
                update_fields = []
                params = []
                field_mapping = [
                    (temp_voter_data[0], "voter_name"),  
                    (temp_voter_data[1], "voter_parent_name"),  
                    (temp_voter_data[2], "voter_contact_number"),  
                    (temp_voter_data[3], "voter_cast_id"),  
                    (temp_voter_data[4], "voter_live_status_id"),  
                    (temp_voter_data[5], "voter_marital_status_id"),  
                    (temp_voter_data[6], "voter_age"),  
                    (temp_voter_data[7], "voter_gender"),  
                    (temp_voter_data[8], "voter_updated_by"),
                    (temp_voter_data[9], "voter_in_city_id"),  
                    (temp_voter_data[10], "voter_current_location" ) 
                ]

                for value, field in field_mapping:
                    if value is not None:
                        update_fields.append(f"{field} = %s")
                        params.append(value)

                if update_fields:
                    sql_update_voter = f"""
                        UPDATE tbl_voter
                        SET {', '.join(update_fields)}
                        WHERE voter_id = %s;
                    """
                    params.append(voter_id)
                    with connection.cursor() as cursor:
                        cursor.execute(sql_update_voter, params)

                    sql_update_temp_status = """
                        UPDATE tbl_temp_voter_data
                        SET temp_voter_data_approved_status = 1
                        WHERE temp_voter_data_voter_id = %s;
                    """
                    with connection.cursor() as cursor:
                        cursor.execute(sql_update_temp_status, [voter_id])

        return JsonResponse({"message": "Voter data and temporary status updated successfully."}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)


# # Booth Details from booth id

class BoothDetailView(generics.GenericAPIView):
    def get(self, request, booth_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    b.booth_id,
                    b.booth_name, 
                    t.town_id, 
                    t.town_name 
                FROM 
                    tbl_booth b
                JOIN 
                    tbl_town t ON t.town_id = b.booth_town_id
                WHERE 
                    b.booth_id = %s
            """, [booth_id])
            row = cursor.fetchone()
        
        if row:
            return Response({
                'booth_id': row[0],
                'booth_name': row[1],
                'town_id': row[2],
                'town_name': row[3],
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        


# # # male female list by booth wise

def get_male_female_voters_by_booth_wise(request, voter_booth_id, gender):
    if gender not in ['male', 'female']:
        return JsonResponse({'error': 'Invalid gender parameter'}, status=400)

    query = """
        SELECT * FROM tbl_voter
        WHERE voter_booth_id = %s AND voter_gender = %s
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, [voter_booth_id, gender])
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]

    return JsonResponse(results, safe=False)


# # # male female list by town wise

def get_male_female_voters_by_town_wise(request, town, gender):
    if gender not in ['male', 'female']:
        return JsonResponse({'error': 'Invalid gender parameter'}, status=400)

    query = """
        SELECT * FROM tbl_voter
        WHERE voter_town_id = %s AND voter_gender = %s
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, [town, gender])
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]

    return JsonResponse(results, safe=False)


# # # male female list by all

def get_male_female_voters_by_all(request, gender):
    if gender not in ['male', 'female']:
        return JsonResponse({'error': 'Invalid gender parameter'}, status=400)

    query = """
        SELECT * FROM tbl_voter
        WHERE voter_gender = %s
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, [gender])  
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]

    return JsonResponse(results, safe=False)


# Get Non Voted voters

def get_non_voted_voters(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT voter_id, voter_name,voter_name_mar, voter_serial_number, voter_id_card_number  FROM vw_voter_list WHERE voter_vote_confirmation_id IS NULL;")
        rows = cursor.fetchall()

        columns = [col[0] for col in cursor.description]

        results = []
        for row in rows:
            results.append(dict(zip(columns, row)))

    return JsonResponse(results, safe=False)


#voted non voted voter details and count by town user

class VotedVotersListByTownUser(View):
    def get(self, request, user_town_user_id, voter_vote_confirmation_id):
        if voter_vote_confirmation_id not in [1, 2]:
            return JsonResponse({'error': 'Invalid voter_vote_confirmation_id'}, status=400)
 
        try:
            with connection.cursor() as cursor:
                # Call procedure to fetch voters
                cursor.callproc('GetVotersByTownUser', [user_town_user_id, voter_vote_confirmation_id])
                voters = cursor.fetchall()  # Fetch all results
               
                # Clear results to prepare for next procedure call
                cursor.nextset()
 
                # Call procedure to count voters
                cursor.callproc('CountVotersByTownUser', [user_town_user_id, voter_vote_confirmation_id, 0])
                count = cursor.fetchone()[0]  # Fetch the count
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
        # Process voters data
        voters_list = [
            {
                'voter_id': row[0],
                'voter_name': row[1],
                'voter_vote_confirmation_id': row[2]
            }
            for row in voters
        ]
 
        return JsonResponse({
            'count': count,
            'voters': voters_list
        })
 
 

# voted non voted voter details and count by booth user wise
    
class VotedVotersListByBoothUser(View):
    def get(self, request, user_booth_user_id, voter_vote_confirmation_id):
        if voter_vote_confirmation_id not in [1, 2]:
            return JsonResponse({'error': 'Invalid voter_vote_confirmation_id'}, status=400)
 
        try:
            with connection.cursor() as cursor:
                # Call the procedure to fetch voters
                cursor.callproc('GetVotersByBoothUser', [user_booth_user_id, voter_vote_confirmation_id])
                voters = cursor.fetchall()  # Consume all results from the procedure
               
                # Clear the cursor results to avoid "out of sync" error
                cursor.nextset()
 
                # Call the procedure to fetch the voter count
                cursor.callproc('CountVotersByBoothUser', [user_booth_user_id, voter_vote_confirmation_id, 0])
                count = cursor.fetchone()[0]  # Consume the result for count
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
        voters_list = [
            {
                'voter_id': row[0],
                'voter_name': row[1],
                'voter_name_mar': row[2],
                'voter_vote_confirmation_id': row[3],
                'voter_favour_id': row[4],
                'voter_serial_number': row[5],
                'voter_id_card_number': row[6]
            }
            for row in voters
        ]
 
        return JsonResponse({'count': count, 'voters': voters_list})
 


from rest_framework.views import APIView


class VoterCountViewByBooths(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                # SQL query to count confirmed votes
                cursor.execute("""
                    SELECT voter_booth_id,
                           COUNT(*) AS confirmed_count
                    FROM tbl_voter
                    WHERE voter_booth_id = 1 AND voter_vote_confirmation_id = 1
                    GROUP BY voter_booth_id
                """)
                confirmed_count = cursor.fetchall()

                # SQL query to count unconfirmed votes
                cursor.execute("""
                    SELECT voter_booth_id,
                           COUNT(*) AS unconfirmed_count
                    FROM tbl_voter
                    WHERE voter_booth_id = 1 AND voter_vote_confirmation_id IS NULL
                    GROUP BY voter_booth_id
                """)
                unconfirmed_count = cursor.fetchall()

                # SQL query to count confirmed votes for a specific favour
                cursor.execute("""
                    SELECT voter_booth_id,
                           COUNT(*) AS favour_confirmed_count
                    FROM tbl_voter
                    WHERE voter_booth_id = 1 AND voter_favour_id = 1 AND voter_vote_confirmation_id = 1
                    GROUP BY voter_booth_id
                """)
                favour_confirmed_count = cursor.fetchall()

                # SQL query to count unconfirmed votes for a specific favour
                cursor.execute("""
                    SELECT voter_booth_id,
                           COUNT(*) AS favour_unconfirmed_count
                    FROM tbl_voter
                    WHERE voter_booth_id = 1 AND voter_favour_id = 1 AND voter_vote_confirmation_id IS NULL
                    GROUP BY voter_booth_id
                """)
                favour_unconfirmed_count = cursor.fetchall()

            # Combine results into a single response
            response_data = {
                "voter_booth_id": 1,
                "confirmed_count": confirmed_count[0][1] if confirmed_count else 0,
                "unconfirmed_count": unconfirmed_count[0][1] if unconfirmed_count else 0,
                "favour_confirmed_count": favour_confirmed_count[0][1] if favour_confirmed_count else 0,
                "favour_unconfirmed_count": favour_unconfirmed_count[0][1] if favour_unconfirmed_count else 0,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



# # # Count
# GET API for All for count of male, female, null

def voter_gender_count(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender = 'male';")
            male_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender = 'female';")
            female_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender IS NULL;")
            null_count = cursor.fetchone()[0]

        return JsonResponse({
            'male_count': male_count,
            'female_count': female_count,
            'null_count': null_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_contact_count(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("select count(*) from tbl_voter where voter_contact_number IS NOT NULL;")
            contact_assign_count = cursor.fetchone()[0]

            cursor.execute("select count(*) from tbl_voter where voter_contact_number IS NULL;")
            contact_not_assign_count = cursor.fetchone()[0]

            return JsonResponse({
            'contact_assign_count': contact_assign_count,
            'contact_not_assign_count': contact_not_assign_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def voter_cast_count(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("select count(*) from tbl_voter where voter_cast_id IS NOT NULL;")
            cast_assign_count = cursor.fetchone()[0]

            cursor.execute("select count(*) from tbl_voter where voter_cast_id IS NULL;")
            cast_not_assign_count = cursor.fetchone()[0]

            return JsonResponse({
            'cast_assign_count': cast_assign_count,
            'cast_not_assign_count': cast_not_assign_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



# # Count By Booth Wise
# voter_cast_count by booth wise

def voter_cast_count_by_booth_wise(request, booth_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM tbl_voter WHERE voter_cast_id IS NOT NULL AND voter_booth_id = %s;",
                [booth_id]
            )
            cast_assign_count = cursor.fetchone()[0]

            cursor.execute(
                "SELECT COUNT(*) FROM tbl_voter WHERE voter_cast_id IS NULL AND voter_booth_id = %s;",
                [booth_id]
            )
            cast_not_assign_count = cursor.fetchone()[0]

            if cast_assign_count == 0 and cast_not_assign_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

            return JsonResponse({
                'cast_assign_count': cast_assign_count,
                'cast_not_assign_count': cast_not_assign_count
            })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_gender_count_by_booth_wise(request, booth_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender = 'male' AND voter_booth_id = %s;", [booth_id])
            male_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender = 'female' AND voter_booth_id = %s;", [booth_id])
            female_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender IS NULL AND voter_booth_id = %s;", [booth_id])
            null_count = cursor.fetchone()[0]

            if male_count == 0 and female_count == 0 and null_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

        return JsonResponse({
            'male_count': male_count,
            'female_count': female_count,
            'null_count': null_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_contact_count_by_booth_wise(request, booth_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("select count(*) from tbl_voter where voter_contact_number IS NOT NULL AND voter_booth_id = %s;", [booth_id]) 
            contact_assign_count = cursor.fetchone()[0]

            cursor.execute("select count(*) from tbl_voter where voter_contact_number IS NULL AND voter_booth_id = %s;", [booth_id])
            contact_not_assign_count = cursor.fetchone()[0]

            if contact_assign_count == 0 and contact_not_assign_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

            return JsonResponse({
            'contact_assign_count': contact_assign_count,
            'contact_not_assign_count': contact_not_assign_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# voter_cast_count by town wise

def voter_cast_count_by_town_wise(request, town_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM tbl_voter WHERE voter_cast_id IS NOT NULL AND voter_town_id = %s;",
                [town_id]
            )
            cast_assign_count = cursor.fetchone()[0]

            cursor.execute(
                "SELECT COUNT(*) FROM tbl_voter WHERE voter_cast_id IS NULL AND voter_town_id = %s;",
                [town_id]
            )
            cast_not_assign_count = cursor.fetchone()[0]

            if cast_assign_count == 0 and cast_not_assign_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

            return JsonResponse({
                'cast_assign_count': cast_assign_count,
                'cast_not_assign_count': cast_not_assign_count
            })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_gender_count_by_town_wise(request, town_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender = 'male' AND voter_town_id = %s;", [town_id])
            male_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender = 'female' AND voter_town_id = %s;", [town_id])
            female_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender IS NULL AND voter_town_id = %s;", [town_id])
            null_count = cursor.fetchone()[0]

            if male_count == 0 and female_count == 0 and null_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

        return JsonResponse({
            'male_count': male_count,
            'female_count': female_count,
            'null_count': null_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_contact_count_by_town_wise(request, town_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("select count(*) from tbl_voter where voter_contact_number IS NOT NULL AND voter_town_id = %s;", [town_id]) 
            contact_assign_count = cursor.fetchone()[0]

            cursor.execute("select count(*) from tbl_voter where voter_contact_number IS NULL AND voter_town_id = %s;", [town_id])
            contact_not_assign_count = cursor.fetchone()[0]

            if contact_assign_count == 0 and contact_not_assign_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

            return JsonResponse({
            'contact_assign_count': contact_assign_count,
            'contact_not_assign_count': contact_not_assign_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# voter_cast_count by booth user wise

def voter_cast_count_by_booth_user_wise(request, booth_user_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM tbl_voter WHERE voter_cast_id IS NOT NULL AND voter_booth_id IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);",
                [booth_user_id]
            )
            cast_assign_count = cursor.fetchone()[0]

            cursor.execute(
                "SELECT COUNT(*) FROM tbl_voter WHERE voter_cast_id IS NULL AND voter_booth_id IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);",
                [booth_user_id]
            )
            cast_not_assign_count = cursor.fetchone()[0]

            if cast_assign_count == 0 and cast_not_assign_count == 0:
                return JsonResponse({'error': 'booth_user_id not found'}, status=404)

            return JsonResponse({
                'cast_assign_count': cast_assign_count,
                'cast_not_assign_count': cast_not_assign_count
            })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_gender_count_by_booth_user_wise(request, booth_user_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender = 'male' AND voter_booth_id IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);", [booth_user_id])
            male_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender = 'female' AND voter_booth_id IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);", [booth_user_id])
            female_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM tbl_voter WHERE voter_gender IS NULL AND voter_booth_id IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);", [booth_user_id])
            null_count = cursor.fetchone()[0]

            if male_count == 0 and female_count == 0 and null_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

        return JsonResponse({
            'male_count': male_count,
            'female_count': female_count,
            'null_count': null_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_contact_count_by_booth_user_wise(request, booth_user_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("select count(*) from tbl_voter where voter_contact_number IS NOT NULL AND voter_booth_id IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);", [booth_user_id]) 
            contact_assign_count = cursor.fetchone()[0]

            cursor.execute("select count(*) from tbl_voter where voter_contact_number IS NULL AND voter_booth_id IN (select user_booth_booth_id from tbl_user_booth where user_booth_user_id = %s);", [booth_user_id])
            contact_not_assign_count = cursor.fetchone()[0]

            if contact_assign_count == 0 and contact_not_assign_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

            return JsonResponse({
            'contact_assign_count': contact_assign_count,
            'contact_not_assign_count': contact_not_assign_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# voter_cast_count by town user wise

def voter_cast_count_by_town_user_wise(request, user_town_town_user_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                '''SELECT count(*) from tbl_voter where voter_booth_id IN (select booth_id
                    FROM tbl_booth
                    WHERE booth_town_id IN (
                        SELECT user_town_town_id
                        FROM tbl_user_town
                        WHERE user_town_town_user_id = %s
                    )) AND voter_cast_id IS NULL;''',
                [user_town_town_user_id]
            )
            cast_assign_count = cursor.fetchone()[0]

            cursor.execute(
                '''SELECT count(*) from tbl_voter where voter_booth_id IN (select booth_id
                    FROM tbl_booth
                    WHERE booth_town_id IN (
                        SELECT user_town_town_id
                        FROM tbl_user_town
                        WHERE user_town_town_user_id = %s
                    )) AND voter_cast_id IS NULL;''',
                [user_town_town_user_id]
            )
            cast_not_assign_count = cursor.fetchone()[0]

            if cast_assign_count == 0 and cast_not_assign_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

            return JsonResponse({
                'cast_assign_count': cast_assign_count,
                'cast_not_assign_count': cast_not_assign_count
            })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_gender_count_by_town_user_wise(request, user_town_town_user_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute('''SELECT count(*) from tbl_voter where voter_booth_id IN (select booth_id
                FROM tbl_booth
                WHERE booth_town_id IN (
                    SELECT user_town_town_id
                    FROM tbl_user_town
                    WHERE user_town_town_user_id = %s
                )) AND voter_gender = 'male';''', [user_town_town_user_id])
            male_count = cursor.fetchone()[0]

            cursor.execute('''SELECT count(*) from tbl_voter where voter_booth_id IN (select booth_id
                FROM tbl_booth
                WHERE booth_town_id IN (
                    SELECT user_town_town_id
                    FROM tbl_user_town
                    WHERE user_town_town_user_id = %s
                )) AND voter_gender = 'male';''', [user_town_town_user_id])
            female_count = cursor.fetchone()[0]

            cursor.execute('''SELECT count(*) from tbl_voter where voter_booth_id IN (select booth_id
                FROM tbl_booth
                WHERE booth_town_id IN (
                    SELECT user_town_town_id
                    FROM tbl_user_town
                    WHERE user_town_town_user_id = %s
                )) AND voter_gender IS NULL;''', [user_town_town_user_id])
            null_count = cursor.fetchone()[0]

            if male_count == 0 and female_count == 0 and null_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

        return JsonResponse({
            'male_count': male_count,
            'female_count': female_count,
            'null_count': null_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def voter_contact_count_by_town_user_wise(request, user_town_town_user_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute('''SELECT count(*) from tbl_voter where voter_booth_id IN (select booth_id
                            FROM tbl_booth
                            WHERE booth_town_id IN (
                                SELECT user_town_town_id
                                FROM tbl_user_town
                                WHERE user_town_town_user_id = %s
                            )) AND voter_contact_number IS NOT NULL;''', [user_town_town_user_id]) 
            contact_assign_count = cursor.fetchone()[0]

            cursor.execute('''SELECT count(*) from tbl_voter where voter_booth_id IN (select booth_id
                            FROM tbl_booth
                            WHERE booth_town_id IN (
                                SELECT user_town_town_id
                                FROM tbl_user_town
                                WHERE user_town_town_user_id = %s
                            )) AND voter_contact_number IS NULL;''', [user_town_town_user_id])
            contact_not_assign_count = cursor.fetchone()[0]

            if contact_assign_count == 0 and contact_not_assign_count == 0:
                return JsonResponse({'error': 'booth_id not found'}, status=404)

            return JsonResponse({
            'contact_assign_count': contact_assign_count,
            'contact_not_assign_count': contact_not_assign_count
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# views.py


def active_sessions_view(request):
    now = timezone.now()
    active_sessions = Session.objects.filter(expire_date__gte=now)

    session_list = []
    
    for session in active_sessions:
        session_key = session.session_key
        session_data = session.get_decoded()  # Decode the session data

        session_list.append({
            'session_key': session_key,
            'session_data': session_data
        })

    return JsonResponse(session_list, safe=False)


# delete family group 

class FamilyGroupDeleteView(APIView):
    def delete(self, request, family_group_id):
        with transaction.atomic():
            with connection.cursor() as cursor:
                cursor.execute(
                    "UPDATE tbl_voter SET voter_group_id = NULL WHERE voter_group_id = %s",
                    [family_group_id]
                )
 
            with connection.cursor() as cursor:
                cursor.execute(
                    "DELETE FROM tbl_family_group WHERE family_group_id = %s",
                    [family_group_id]
                )
           
            if cursor.rowcount == 0:
                return Response({"message": "Family group not found"}, status=status.HTTP_404_NOT_FOUND)
       
        return Response({"message": "Family group deleted successfully"}, status=status.HTTP_200_OK)
    


# add voter in already existing group

# class AddVoterInExistingGroup(APIView):
#     def put(self, request, voter_id, voter_group_id):
#         try:
#             with connection.cursor() as cursor:
#                 cursor.execute("UPDATE tbl_voter SET voter_group_id = %s WHERE voter_id = %s", [voter_group_id, voter_id])
            
#             if cursor.rowcount == 0:
#                 return Response({"message": "Voter not found"}, status=status.HTTP_404_NOT_FOUND)

#             return Response({"message": "Voter updated successfully"}, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AddVoterInExistingGroup(APIView):
    def put(self, request):
        voter_group_id = request.data.get("voter_group_id")
        voter_ids = request.data.get("voter_ids", [])

        # Check if voter_group_id and voter_ids are provided
        if not voter_group_id or not voter_ids:
            return Response(
                {"message": "voter_group_id and voter_ids are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with connection.cursor() as cursor:
                # Use raw SQL to update multiple voters at once
                cursor.execute(
                    "UPDATE tbl_voter SET voter_group_id = %s WHERE voter_id IN %s",
                    [voter_group_id, tuple(voter_ids)]
                )

            if cursor.rowcount == 0:
                return Response({"message": "No voters found for the provided IDs"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"message": "Voters updated successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Town wise booth wise voter list

@api_view(['GET'])
def get_voters_by_town_and_booth(request, town_id, booth_id):

    with connection.cursor() as cursor:
        cursor.callproc('get_voters_by_town_and_booth', [town_id, booth_id])
        results = cursor.fetchall()

        response_data = [
            {
                'voter_id': row[0],
                'voter_name': row[1],
                'voter_contact_number': row[2],
                'voter_favour_id': row[3],
                'voter_vote_confirmation_id': row[4],
                'town_id': row[5],
                'booth_id': row[6],
            }
            for row in results
        ]

    return JsonResponse(response_data, safe=False)



# # Add Sarpanch to town

@method_decorator(csrf_exempt, name='dispatch')
class RegisterSarpanchView(View):
    def post(self, request, *args, **kwargs):
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            sarpanch_name = data.get('sarpanch_name')
            sarpanch_town_id = data.get('sarpanch_town_id')
        else:
            sarpanch_name = request.POST.get('sarpanch_name')
            sarpanch_town_id = request.POST.get('sarpanch_town_id')

        if not sarpanch_name or sarpanch_town_id is None:
            return JsonResponse({'error': 'sarpanch_name and sarpanch_town_id are required.'}, status=400)

        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM tbl_town WHERE town_id = %s", [sarpanch_town_id])
            town_exists = cursor.fetchone()[0] > 0

        if not town_exists:
            return JsonResponse({'error': 'Town not found.'}, status=404)

        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO tbl_sarpanch (sarpanch_name, sarpanch_town_id) VALUES (%s, %s)",
                [sarpanch_name, sarpanch_town_id]
            )
            return JsonResponse({'message': 'Sarpanch registered successfully.'}, status=201)

    def get(self, request, *args, **kwargs):
        sarpanch_id = kwargs.get('id')

        if sarpanch_id:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT s.sarpanch_name, t.town_name 
                    FROM tbl_sarpanch s 
                    JOIN tbl_town t ON s.sarpanch_town_id = t.town_id 
                    WHERE s.sarpanch_id = %s
                """, [sarpanch_id])
                sarpanch = cursor.fetchone()

            if not sarpanch:
                return JsonResponse({'error': 'Sarpanch not found.'}, status=404)

            return JsonResponse({'sarpanch_name': sarpanch[0], 'town_name': sarpanch[1]}, status=200)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT s.sarpanch_name, t.town_name 
                FROM tbl_sarpanch s 
                JOIN tbl_town t ON s.sarpanch_town_id = t.town_id
            """)
            sarpanches = cursor.fetchall()

        result = [{'sarpanch_name': s[0], 'town_name': s[1]} for s in sarpanches]
        
        return JsonResponse(result, safe=False)

    def put(self, request, *args, **kwargs):
        sarpanch_id = kwargs.get('id')

        if request.content_type == 'application/json':
            data = json.loads(request.body)
            sarpanch_name = data.get('sarpanch_name')
            sarpanch_town_id = data.get('sarpanch_town_id')
        else:
            return JsonResponse({'error': 'Content-Type must be application/json.'}, status=400)

        if not sarpanch_name or sarpanch_town_id is None:
            return JsonResponse({'error': 'sarpanch_name and sarpanch_town_id are required.'}, status=400)

        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE tbl_sarpanch SET sarpanch_name = %s, sarpanch_town_id = %s WHERE sarpanch_id = %s",
                [sarpanch_name, sarpanch_town_id, sarpanch_id]
            )
            if cursor.rowcount == 0:
                return JsonResponse({'error': 'Sarpanch not found.'}, status=404)

            return JsonResponse({'message': 'Sarpanch updated successfully.'}, status=200)

    def delete(self, request, *args, **kwargs):
        sarpanch_id = kwargs.get('id')

        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM tbl_sarpanch WHERE sarpanch_id = %s", [sarpanch_id])
            if cursor.rowcount == 0:
                return JsonResponse({'error': 'Sarpanch not found.'}, status=404)

        return JsonResponse({'message': 'Sarpanch deleted successfully.'}, status=204)



# get count of confirmation vote and non confirmation vote from favourable vote by booth user 

class GetVoterVoteConfirmationCountsViewByBoothUser(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('GetVoterCounts')

                columns = [col[0] for col in cursor.description] 
                result = []
                for row in cursor.fetchall():
                    result.append(dict(zip(columns, row)))

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


# voter vote confirmation and non confirmation count for admin which is favourable

class VoterConfirmatioCountForAdminView(APIView):
    def get(self, request):
        try:
            query = """
                SELECT 
                    COUNT(CASE 
                        WHEN v.voter_vote_confirmation_id = 1 AND v.voter_favour_id = 1 THEN 1 
                        ELSE NULL 
                    END) AS favourable_voted_voters_count,
                    COUNT(CASE 
                        WHEN v.voter_vote_confirmation_id IS NULL AND v.voter_favour_id = 1 THEN 1 
                        ELSE NULL 
                    END) AS favourable_non_voted_voters_count,
                    COUNT(CASE 
                        WHEN v.voter_vote_confirmation_id = 1 AND v.voter_favour_id = 2 THEN 1 
                        ELSE NULL 
                    END) AS not_favourable_voted_voters_count,
                    COUNT(CASE 
                        WHEN v.voter_vote_confirmation_id IS NULL AND v.voter_favour_id = 2 THEN 1 
                        ELSE NULL 
                    END) AS not_favourable_non_voted_voters_count,
                    COUNT(CASE 
                        WHEN v.voter_vote_confirmation_id = 1 AND v.voter_favour_id = 3 THEN 1 
                        ELSE NULL 
                    END) AS not_favourable_voted_voters_count,
                    COUNT(CASE 
                        WHEN v.voter_vote_confirmation_id IS NULL AND v.voter_favour_id = 3 THEN 1 
                        ELSE NULL 
                    END) AS not_favourable_non_voted_voters_count,
                    COUNT(CASE 
                        WHEN v.voter_vote_confirmation_id = 1 AND v.voter_favour_id = 4 THEN 1 
                        ELSE NULL 
                    END) AS favourable_voted_voters_count,
                    COUNT(CASE 
                        WHEN v.voter_vote_confirmation_id IS NULL AND v.voter_favour_id = 4 THEN 1 
                        ELSE NULL 
                    END) AS favourable_non_voted_voters_count
                FROM 
                    tbl_voter v;
            """
            with connection.cursor() as cursor:
                cursor.execute(query)
                
                result = cursor.fetchone()

            response_data = {
                "favourable_voted_voters_count": result[0],
                "favourable_non_voted_voters_count": result[1],
                "not_favourable_voted_voters_count": result[2],
                "not_favourable_non_voted_voters_count": result[3],
                "doubted_voted_voters_count": result[4],
                "doubted_non_voted_voters_count": result[5],
                "chocolate_voted_voters_count": result[6],
                "chocolate_non_voted_voters_count": result[7],
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# get booth details by town id 

def get_booth_details_by_town_id(request, town_id):
    if not town_id:
        return JsonResponse({"error": "town_id is required"}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.callproc('GetBoothDetailsByTownId', [town_id])

            results = cursor.fetchall()
            
            if not results:
                return JsonResponse({"error": "No data found for the given town_id"}, status=404)

            column_names = [col[0] for col in cursor.description]

            if column_names is None:
                return JsonResponse({"error": "Failed to retrieve column names"}, status=500)

            data = [dict(zip(column_names, row)) for row in results]

        return JsonResponse({"data": data}, safe=False)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# # # pegination for redis

# from django.db import connection
# from rest_framework.views import APIView
# from rest_framework.pagination import PageNumberPagination
# from django.http import JsonResponse

# class VoterPagination(PageNumberPagination):
#     page_size = 100
#     max_page_size = 1000

# @method_decorator(csrf_exempt, name='dispatch')
# class VoterListViewPagination(View):
#     def post(self, request):
#         body = json.loads(request.body)
#         page = body.get('page', 1) 
#         page = int(page)

#         offset = (page - 1) * 100  
#         limit = 100

#         with connection.cursor() as cursor:
#             cursor.execute("SELECT voter_id, voter_name, voter_favour_id FROM tbl_voter ORDER BY voter_id LIMIT %s OFFSET %s", [limit, offset])
#             rows = cursor.fetchall()

#             if cursor.description:
#                 columns = [col[0] for col in cursor.description]
#                 results = [dict(zip(columns, row)) for row in rows]
#             else:
#                 results = []

#         return JsonResponse({
#             'page': page,
#             'results': results,
#         })


# import redis

# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

# @require_http_methods(["GET"])
# def all_total_voters(request):
#     try:
#         session_key = request.session.session_key
        
#         redis_key = f"{session_key}:total_voters"

#         cached_voters = redis_client.get(redis_key)
        
#         if cached_voters is not None:
#             return JsonResponse(json.loads(cached_voters), safe=False, status=200)

#         sql_query = "SELECT voter_id, voter_name, voter_favour_id FROM tbl_voter;"
        
#         with connection.cursor() as cursor:
#             cursor.execute(sql_query)
#             rows = cursor.fetchall()
        
#         voter_list = [{'voter_id': row[0], 'voter_name': row[1], 'voter_favour_id': row[2]} for row in rows]
        
#         redis_client.setex(redis_key, 3600, json.dumps(voter_list))  

#         return JsonResponse(voter_list, safe=False, status=200)
    
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)



@method_decorator(csrf_exempt, name='dispatch')
class UpdateAreaTypeView(View):
    def put(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            town_ids = data.get('town_ids', [])
            area_type_id = data.get('area_type_id')

            if not isinstance(town_ids, list) or not isinstance(area_type_id, int):
                return JsonResponse({'error': 'Invalid input'   }, status=400)

            town_ids_str = ','.join(map(str, town_ids))

            query = f"""
                UPDATE tbl_town 
                SET town_area_type_id = %s 
                WHERE town_id IN ({town_ids_str})
            """
            
            with connection.cursor() as cursor:
                cursor.execute(query, [area_type_id])

            return JsonResponse({'status': 'success', 'updated_town_ids': town_ids}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


#new voter add API 




@api_view(['POST'])
def create_voter(request):
    serializer = NewVoterlistSerializer(data=request.data)
    
    if serializer.is_valid():
        voter_booth_id = serializer.validated_data.get('voter_booth_id')

        with connection.cursor() as cursor:
            cursor.execute("SELECT booth_town_id FROM tbl_booth WHERE booth_id = %s", [voter_booth_id])
            row = cursor.fetchone()
        
        if row:
            voter_town_id = row[0]  
        else:
            return Response(
                {"error": "Invalid booth ID or town not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        voter = serializer.save(voter_town_id=voter_town_id)
        return Response({'voter_id': voter.voter_id}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#API for get assigned booth of user
class UserBoothView(APIView):
    def get(self, request, user_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT u.user_booth_booth_id, b.booth_name, b.booth_name_mar
                FROM tbl_user_booth u
                JOIN tbl_booth b ON b.booth_id = u.user_booth_booth_id
                WHERE u.user_booth_user_id = %s
            """, [user_id])
            
            rows = cursor.fetchall()

        results = [{'user_booth_booth_id': row[0], 'booth_name': row[1], 'booth_name_mar': row[2]} for row in rows]

        return Response(results, status=status.HTTP_200_OK)


def get_towns(request):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute("SELECT town_id, town_name FROM tbl_town WHERE town_area_type_id = 1;")
            rows = cursor.fetchall()

        towns = [{"town_id": row[0], "town_name": row[1]} for row in rows]

        return JsonResponse(towns, safe=False)


# @method_decorator(csrf_exempt, name='dispatch')
# class UpdatePrabaghTypeView(View):
#     def put(self, request, *args, **kwargs):
#         try:
#             data = json.loads(request.body)
#             booth_ids = data.get('booth_ids', [])
#             prabhag_id = data.get('prabhag_id')

#             if not isinstance(booth_ids, list) or not isinstance(prabhag_id, int):
#                 return JsonResponse({'error': 'Invalid input'   }, status=400)

#             booth_ids_str = ','.join(map(str, booth_ids))

#             query = f"""
#                 UPDATE tbl_booth 
#                 SET booth_prabhag_id = %s 
#                 WHERE booth_id IN ({booth_ids_str})
#             """
            
#             with connection.cursor() as cursor:
#                 cursor.execute(query, [prabhag_id])

#             return JsonResponse({'status': 'success', 'updated_booth_ids': booth_ids}, status=200)

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class UpdatePrabaghTypeView(View):
    def put(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            booth_ids = data.get('booth_ids', [])
            prabhag_name = data.get('prabhag_name')

            # Validate input data
            if not isinstance(booth_ids, list) or not isinstance(prabhag_name, str):
                return JsonResponse({'error': 'Invalid input'}, status=400)

            booth_ids_str = ','.join(map(str, booth_ids))

            # Execute the entire process in a transaction
            with transaction.atomic():
                # Insert new prabhag_name into tbl_prabhag to generate a new prabhag_id
                insert_prabhag_query = """
                    INSERT INTO tbl_prabhag (prabhag_name) 
                    VALUES (%s)
                """
                with connection.cursor() as cursor:
                    cursor.execute(insert_prabhag_query, [prabhag_name])
                    prabhag_id = cursor.lastrowid  # Retrieve the newly generated prabhag_id

                # Update booth_prabhag_id in tbl_booth for the specified booth_ids
                booth_query = f"""
                    UPDATE tbl_booth 
                    SET booth_prabhag_id = %s 
                    WHERE booth_id IN ({booth_ids_str})
                """
                with connection.cursor() as cursor:
                    cursor.execute(booth_query, [prabhag_id])

            return JsonResponse({
                'status': 'success', 
                'message': 'Prabhag created successfully',
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)



# # get prabhag list

# def get_prabhags(request):
#     if request.method == 'GET':
#         with connection.cursor() as cursor:
#             cursor.execute(''' 
#                     SELECT 
#                     p.prabhag_id,
#                     p.prabhag_name,
#                     p.prabhag_type,
#                     COUNT(b.booth_id) AS booth_count,
#                     GROUP_CONCAT(DISTINCT CONCAT(pu.prabhag_user_id, '|', pu.prabhag_user_name, '|', pu.prabhag_user_contact_number) SEPARATOR ', ') AS prabhag_users_info
#                         FROM 
#                             tbl_prabhag p
#                         LEFT JOIN 
#                             tbl_booth b ON p.prabhag_id = b.booth_prabhag_id
#                         LEFT JOIN
#                             tbl_prabhag_user pu ON pu.prabhag_user_prabhag_id = p.prabhag_id
#                         GROUP BY 
#                             p.prabhag_id, p.prabhag_name, p.prabhag_type
#                         ORDER BY 
#                             p.prabhag_id;''')
#             rows = cursor.fetchall()

#         result = []
#         for row in rows:
#             prabhag_users_info = row[4].split(', ') if row[4] else []
#             prabhag_user_ids = []
#             prabhag_user_name = []
#             prabhag_user_contact_number = []

#             for info in prabhag_users_info:
#                 if info:
#                     parts = info.split('|')
#                     if len(parts) == 3: 
#                         user_id, name, phone, = parts
#                         prabhag_user_ids.append(int(user_id))
#                         prabhag_user_name.append(name)
#                         prabhag_user_contact_number.append(phone)
#                     else:
                        
#                         continue  
            
#             result.append({
#                 'prabhag_id': row[0],
#                 'prabhag_name': row[1],
#                 'prabhag_type': row[2],
#                 'booth_count' : row[3],
#                 'prabhag_user_id': prabhag_user_ids,
#                 'prabhag_user_name': ', '.join(prabhag_user_name),
#                 'prabhag_user_phone': ', '.join(prabhag_user_contact_number)
               
#             })
        
#         return JsonResponse(result, safe=False)

def get_prabhags(request):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute(''' 
                SELECT 
                    p.prabhag_id,
                    p.prabhag_name,
                    p.prabhag_type,
                    COUNT(b.booth_id) AS booth_count,
                    GROUP_CONCAT(DISTINCT CONCAT(pu.prabhag_user_id, '|', pu.prabhag_user_name, '|', pu.prabhag_user_contact_number) SEPARATOR ', ') AS prabhag_users_info,
                    t.town_name  -- Adding town_name to the select statement
                FROM 
                    tbl_prabhag p
                LEFT JOIN 
                    tbl_booth b ON p.prabhag_id = b.booth_prabhag_id
                LEFT JOIN
                    tbl_prabhag_user pu ON pu.prabhag_user_prabhag_id = p.prabhag_id
                LEFT JOIN
                    tbl_town t ON b.booth_town_id = t.town_id  -- Join with tbl_town
                GROUP BY 
                    p.prabhag_id, p.prabhag_name, p.prabhag_type, t.town_name  -- Include town_name in GROUP BY
                ORDER BY 
                    p.prabhag_id;
            ''')
            rows = cursor.fetchall()

        result = []
        for row in rows:
            prabhag_users_info = row[4].split(', ') if row[4] else []
            prabhag_user_ids = []
            prabhag_user_name = []
            prabhag_user_contact_number = []

            for info in prabhag_users_info:
                if info:
                    parts = info.split('|')
                    if len(parts) == 3: 
                        user_id, name, phone = parts
                        prabhag_user_ids.append(int(user_id))
                        prabhag_user_name.append(name)
                        prabhag_user_contact_number.append(phone)
                    else:
                        continue  
            
            result.append({
                'prabhag_id': row[0],
                'prabhag_name': row[1],
                'prabhag_type': row[2],
                'booth_count': row[3],
                'prabhag_user_id': prabhag_user_ids,
                'prabhag_user_name': ', '.join(prabhag_user_name),
                'prabhag_user_phone': ', '.join(prabhag_user_contact_number),
                'town_name': row[5]  # Add town_name to the result
            })
        
        return JsonResponse(result, safe=False)


class TownRuralView(APIView):
    def get(self, request):
        query = """
        SELECT 
            ROW_NUMBER() OVER (ORDER BY t.town_id) AS serial_number,
            t.town_id,
            t.town_name,
            t.town_name_mar,
            COUNT(v.voter_id) AS voter_count,
            GROUP_CONCAT(DISTINCT u.town_user_name SEPARATOR ', ') AS town_user_names,
            GROUP_CONCAT(DISTINCT u.town_user_id SEPARATOR ', ') AS town_user_id,
            t.town_area_type_id
        FROM 
            vw_voter_list v
        LEFT JOIN 
            tbl_user_town ut ON v.town_id = ut.user_town_town_id
        LEFT JOIN 
            tbl_town_user u ON ut.user_town_town_user_id = u.town_user_id
        LEFT JOIN 
            tbl_town t ON v.town_id = t.town_id
        WHERE
            t.town_area_type_id = 2
        GROUP BY 
            t.town_id, t.town_name
        ORDER BY 
            t.town_id;
        """

        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        response_data = [
            {
                'sr_no': row[0],
                'town_id': row[1],
                'town_name': row[2],
                'town_name_mar': row[3],
                'voter_count': row[4],
                'town_user_names': row[5],  
                'town_user_ids': [int(uid) for uid in row[6].split(',')] if row[6] else [],  
                'town_type' : row[7]       
            }
            for row in rows
        ]

        return Response(response_data, status=status.HTTP_200_OK)


def get_town_info_by_psc(request, circle_id):
    if circle_id is None:
        return JsonResponse({'error': 'circle_id parameter is required.'}, status=400)

    with connection.cursor() as cursor:
        cursor.callproc('GetTownInfoByPsc', [circle_id])
        columns = [col[0] for col in cursor.description]
        results = cursor.fetchall()

    data = [dict(zip(columns, row)) for row in results]

    return JsonResponse(data, safe=False)


def get_booth_info_by_prabhag_id(request, booth_prabhag_id):
    sql_query = '''
        SELECT 
            ROW_NUMBER() OVER (ORDER BY v.booth_id) AS serial_number,
            b.booth_id,
            b.booth_name,
            b.booth_name_mar,
            COUNT(v.voter_id) AS voter_count
        FROM 
            vw_voter_list v
        JOIN
            tbl_booth b ON b.booth_id = v.booth_id
        WHERE
            b.booth_prabhag_id = %s
        GROUP BY 
            v.booth_id
    ''' 

    with connection.cursor() as cursor:
        cursor.execute(sql_query, [booth_prabhag_id])
        columns = [col[0] for col in cursor.description]
        results = cursor.fetchall()

    data = [dict(zip(columns, row)) for row in results]

    return JsonResponse(data, safe=False)


def get_voters_by_prabhagh(request, booth_prabhag_id):
    stored_procedure = 'GetVoterInfoByBoothPrabhag'

    with connection.cursor() as cursor:
        cursor.callproc(stored_procedure, [booth_prabhag_id])
        columns = [col[0] for col in cursor.description]
        results = cursor.fetchall()

    data = [dict(zip(columns, row)) for row in results]

    return JsonResponse(data, safe=False)


def get_panchayat_samiti_circle_by_zp_circle(request, zp_circle_id):
    with connection.cursor() as cursor:
        query = """
            SELECT panchayat_samiti_circle_id, panchayat_samiti_circle_name 
            FROM tbl_panchayat_samiti_circle 
            WHERE panchayat_samiti_circle_zp_circle_id = %s
        """
        cursor.execute(query, [zp_circle_id])
        rows = cursor.fetchall()
        
    data = [
        {"panchayat_samiti_circle_id": row[0], "panchayat_samiti_circle_name": row[1]}
        for row in rows
    ]

    return JsonResponse(data, safe=False)


class GetVoterListByBoothUserAndReligionWise(APIView):
    def get(self, request, user_id, cast_religion_id):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('GetVoterListByBoothUserAndReligion', [user_id, cast_religion_id])
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                
                result = []
                for row in rows:
                    result.append(dict(zip(columns, row)))
                
                return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_voter_current_location_details_by_booth(request, booth_id, city_id):
    try:
        with connection.cursor() as cursor:
            cursor.callproc('GetVoterCurrentLocationDetailsByBooth', [booth_id, city_id])
            results = cursor.fetchall() 
            columns = [col[0] for col in cursor.description]
            voters = [dict(zip(columns, row)) for row in results]
        
        return JsonResponse(voters, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_voter_current_location_details_by_town(requtownest, town_id, city_id):
    try:
        with connection.cursor() as cursor:
            cursor.callproc('GetVoterCurrentLocationDetailsByTown', [town_id, city_id])
            results = cursor.fetchall() 
            columns = [col[0] for col in cursor.description]
            voters = [dict(zip(columns, row)) for row in results]
        
        return JsonResponse(voters, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




class PrabhagUserCreate(generics.CreateAPIView):
    serializer_class = PrabhagUserSerializer

    def perform_create(self, serializer):
        politician_id = self.request.session.get('politician_id')

        data = serializer.validated_data
        if politician_id:
            data['prabhag_user_politician_id'] = politician_id
        else:
            data['prabhag_user_politician_id'] = None  

        data['prabhag_user_password'] = make_password(data['prabhag_user_password'])
        
        serializer.save(prabhag_user_politician_id=data['prabhag_user_politician_id'], prabhag_user_password=data['prabhag_user_password'])


class PrabhagUserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PrabhagUser.objects.all()
    serializer_class = PrabhagUserSerializer


class GetVoterDetailsByPrabhagUserId(APIView):
    def get(self, request, prabhag_user_id):
        with connection.cursor() as cursor:
            try:
                cursor.callproc('GetVoterDetailsByPrabhagUserId', [prabhag_user_id])
                rows = cursor.fetchall()
                
                columns = [col[0] for col in cursor.description]
                
                result = [dict(zip(columns, row)) for row in rows]

                return Response(result, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# class PrabhagUserLoginView(generics.CreateAPIView):
#     serializer_class = PrabhagUserSerializer
#     #permission_classes = [AllowAny]  # Allow any user to access this view

#     def post(self, request, *args, **kwargs):
#         contact_number = request.data.get('prabhag_user_contact_number')
#         password = request.data.get('prabhag_user_password')

#         try:
#             # Retrieve user by contact number
#             user = PrabhagUser.objects.get(prabhag_user_contact_number=contact_number)

#             # Check the password using the check_password method
#             if user.check_password(password):
#                 request.session['prabhag_user_id'] = user.prabhag_user_id  # Store ID in session
                
#                 return Response({
#                     'prabhag_user_id': user.prabhag_user_id,
#                     'message': 'Login successful'
#                 }, status=status.HTTP_200_OK)
#             else:
#                 return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

#         except PrabhagUser.DoesNotExist:
#             return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)



# Prabhag User Login




class PrabhagUserLoginView(generics.CreateAPIView):
    serializer_class = PrabhagUserSerializer

    def post(self, request, *args, **kwargs):
        contact_number = request.data.get('prabhag_user_contact_number')
        password = request.data.get('prabhag_user_password')

        try:
            # Retrieve user by contact number
            user = PrabhagUser.objects.get(prabhag_user_contact_number=contact_number)

            # Check the password using Django's check_password method
            if user.check_password(password):
                prabhag_user_id = user.prabhag_user_id

                # Generate JWT token
                payload = {
                    "prabhag_user_id": prabhag_user_id,
                    "exp": datetime.utcnow() + timedelta(hours=24)  # Token expires in 24 hours
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

                # Set session and prepare response data
                request.session['prabhag_user_id'] = prabhag_user_id
                response_data = {
                    'prabhag_user_id': prabhag_user_id,
                    'message': 'Login successful',
                    'token': token
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        except PrabhagUser.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        
class CountVotersCountByPrabhagUserId(APIView):
    def get(self, request, prabhag_user_id):
        with connection.cursor() as cursor:
            try:
                query = """
                SELECT COUNT(*)
                FROM tbl_voter v
                JOIN tbl_booth b ON b.booth_id = v.voter_booth_id
                JOIN tbl_prabhag p ON b.booth_prabhag_id = p.prabhag_id
                JOIN tbl_prabhag_user pu ON p.prabhag_id = pu.prabhag_user_prabhag_id
                WHERE pu.prabhag_user_id = %s;
                """
                cursor.execute(query, [prabhag_user_id])
                count = cursor.fetchone()[0]

                return Response({'count': count}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GetBoothDetailsByPrabhagUser(APIView):
    def get(self, request, prabhag_user_id):
        with connection.cursor() as cursor:
            try:
                cursor.callproc('GetBoothDetailsByPrabhagUser', [prabhag_user_id])
            
                rows = cursor.fetchall()

                columns = [col[0] for col in cursor.description]
                
                result = [dict(zip(columns, row)) for row in rows]

                return Response(result, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class VoterFavourCountsByPrabhagUser(APIView):
    def get(self, request, prabhag_user_id):
        with connection.cursor() as cursor:
            try:
                # Call the stored procedure
                cursor.callproc('GetVoterFavourCountsByPrabhagUser', [prabhag_user_id])
                
                # Fetch the results
                result = cursor.fetchone()

                if result:
                    return Response({
                        'count_favour_1': result[0],
                        'count_favour_2': result[1]
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No data found'}, status=status.HTTP_404_NOT_FOUND)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class GetVoterDetailsByConfirmationView(APIView):
    
    def get(self, request, prabhag_user_id, vote_confirmation_id):
        with connection.cursor() as cursor:
            try:
                cursor.callproc('GetVoterDetailsByConfirmation', [prabhag_user_id, vote_confirmation_id])
                
                results = cursor.fetchall()

                response_data = [
                    {'voter_id': row[0], 'voter_name': row[1], 'voter_name_mar' : row[2], 'voter_favour_id' : row[3]}
                    for row in results
                ]

                return Response(response_data, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BoothUserListCreateByPrabhag(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user_data = {
                'user_name': serializer.validated_data['user_name'],
                'user_password': serializer.validated_data['user_password'],
                'user_phone': serializer.validated_data['user_phone']
            }

            user_serializer = UserSerializer(data=user_data)
            if user_serializer.is_valid():
                session_id = request.session.get('prabhag_user_id')
                print(session_id)
                user = user_serializer.save(user_prabhag_user_id=session_id)
                booth_ids = serializer.validated_data['booth_ids']

                for booth_id in booth_ids:
                    UserBooth.objects.create(user_booth_user_id=user.user_id, user_booth_booth_id=booth_id)

                return Response({'status': 'User registered successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @csrf_exempt
# def edit_voter_data_by_booth_user(request):
#     if request.method == 'POST':
#         voter_data = json.loads(request.body)

#         voter_id = voter_data.get('voter_id')

#         with connection.cursor() as cursor:
#             cursor.execute("SELECT voter_id, voter_name, voter_parent_name, voter_age, voter_gender, voter_contact_number, voter_cast_id, voter_marital_status_id, voter_live_status_id, voter_in_city_id, voter_current_location FROM tbl_voter WHERE voter_id = %s", [voter_id])
#             existing_voter = cursor.fetchone()

#         if not existing_voter:
#             return JsonResponse({"error": "Voter not found."}, status=404)

#         existing_voter_dict = {
#             'voter_id': existing_voter[0],
#             'voter_name': existing_voter[1],
#             'voter_parent_name': existing_voter[2],
#             'voter_age': existing_voter[3],
#             'voter_gender': existing_voter[4],
#             'voter_contact_number': existing_voter[5],
#             'voter_cast_id': existing_voter[6],
#             'voter_marital_status_id': existing_voter[7],
#             'voter_live_status_id': existing_voter[8],
#             'voter_in_city_id' : existing_voter[9],
#             'voter_current_location' : existing_voter[10],
#         }
        
#         temp_voter_data_updated_by_user_id = request.session.get('user_id') 
#         temp_voter_data_updated_date = timezone.now()

#         temp_data = {
#             'temp_voter_data_voter_id': voter_id,
#             'temp_voter_data_updated_by_user_id': temp_voter_data_updated_by_user_id,
#             'temp_voter_data_updated_date' : temp_voter_data_updated_date
#         }

#         for field in ['voter_name', 'voter_parent_name', 'voter_age', 'voter_gender', 
#               'voter_contact_number', 'voter_cast_id', 'voter_marital_status_id', 
#               'voter_live_status_id', 'voter_in_city_id', 'voter_current_location']:
#             if field in voter_data:
#                 # Check if the field is either not present in existing data or is different
#                 if existing_voter_dict[field] != voter_data[field]:
#                     temp_data[f'temp_{field}'] = voter_data[field]

#         if any(temp_data.get(f'temp_{field}') for field in ['voter_name', 'voter_parent_name', 
#                                                               'voter_age', 'voter_gender', 
#                                                               'voter_contact_number', 
#                                                               'voter_cast_id', 
#                                                               'voter_marital_status_id', 
#                                                               'voter_live_status_id', 'voter_in_city_id', 'voter_current_location']):
#             with connection.cursor() as cursor:
#                 cursor.execute("""
#                     INSERT INTO tbl_temp_voter_data_prabhag 
#                     (temp_voter_data_voter_id, temp_voter_data_voter_name, temp_voter_data_voter_parent_name, temp_voter_data_voter_contact_number, 
#                      temp_voter_data_voter_cast, temp_voter_data_voter_live_status, temp_voter_data_voter_marital_status, 
#                      temp_voter_data_voter_age, temp_voter_data_voter_gender, temp_voter_data_updated_by_user_id, temp_voter_data_updated_date, temp_voter_data_voter_in_city_id, temp_voter_data_voter_current_location)
#                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s)
#                 """, (
#                     temp_data['temp_voter_data_voter_id'],
#                     temp_data.get('temp_voter_name'),
#                     temp_data.get('temp_voter_parent_name'),
#                     temp_data.get('temp_voter_contact_number'),
#                     temp_data.get('temp_voter_cast_id'),
#                     temp_data.get('temp_voter_live_status_id'),
#                     temp_data.get('temp_voter_marital_status_id'),
#                     temp_data.get('temp_voter_age'),
#                     temp_data.get('temp_voter_gender'),
#                     temp_voter_data_updated_by_user_id,
#                     temp_voter_data_updated_date,
#                     temp_data.get('temp_voter_in_city_id'),
#                     temp_data.get('temp_voter_current_location')
#                 ))
               

#             return JsonResponse({"success": "Data stored in temporary voter data."}, status=201)

#         return JsonResponse({"message": "No changes detected."}, status=200)

#     return JsonResponse({"error": "Invalid request method."}, status=405)



@csrf_exempt
def edit_voter_data_by_booth_user(request):
    if request.method == 'POST':
        voter_data = json.loads(request.body)

        voter_id = voter_data.get('voter_id')

        with connection.cursor() as cursor:
            cursor.execute("SELECT voter_id, voter_name, voter_parent_name, voter_age, voter_gender, voter_contact_number, voter_cast_id, voter_marital_status_id, voter_live_status_id, voter_in_city_id, voter_current_location FROM tbl_voter WHERE voter_id = %s", [voter_id])
            existing_voter = cursor.fetchone()

        if not existing_voter:
            return JsonResponse({"error": "Voter not found."}, status=404)

        existing_voter_dict = {
            'voter_id': existing_voter[0],
            'voter_name': existing_voter[1],
            'voter_parent_name': existing_voter[2],
            'voter_age': existing_voter[3],
            'voter_gender': existing_voter[4],
            'voter_contact_number': existing_voter[5],
            'voter_cast_id': existing_voter[6],
            'voter_marital_status_id': existing_voter[7],
            'voter_live_status_id': existing_voter[8],
            'voter_in_city_id': existing_voter[9],
            'voter_current_location': existing_voter[10],
        }
        
        temp_voter_data_updated_by_user_id = request.session.get('user_id') 
        temp_voter_data_updated_date = timezone.now()

        temp_data = {
            'temp_voter_data_voter_id': voter_id,
            'temp_voter_data_updated_by_user_id': temp_voter_data_updated_by_user_id,
            'temp_voter_data_updated_date': temp_voter_data_updated_date
        }

        for field in ['voter_name', 'voter_parent_name', 'voter_age', 'voter_gender', 
                      'voter_contact_number', 'voter_cast_id', 'voter_marital_status_id', 
                      'voter_live_status_id', 'voter_in_city_id', 'voter_current_location']:
            if field in voter_data:
                # Check if the field is either not present in existing data or is different
                if existing_voter_dict[field] != voter_data[field]:
                    temp_data[f'temp_{field}'] = voter_data[field]

        # Handle voter_in_city_id specifically
        temp_in_city_id = voter_data.get('voter_in_city_id')
        if temp_in_city_id is not None:
            try:
                temp_in_city_id = int(temp_in_city_id)  # Ensure it's an integer
            except ValueError:
                temp_in_city_id = None  # Handle invalid integer gracefully

        if any(temp_data.get(f'temp_{field}') for field in ['voter_name', 'voter_parent_name', 
                                                              'voter_age', 'voter_gender', 
                                                              'voter_contact_number', 
                                                              'voter_cast_id', 
                                                              'voter_marital_status_id', 
                                                              'voter_live_status_id', 
                                                              'voter_current_location']) or temp_in_city_id is not None:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO tbl_temp_voter_data_prabhag 
                    (temp_voter_data_voter_id, temp_voter_data_voter_name, temp_voter_data_voter_parent_name, temp_voter_data_voter_contact_number, 
                     temp_voter_data_voter_cast, temp_voter_data_voter_live_status, temp_voter_data_voter_marital_status, 
                     temp_voter_data_voter_age, temp_voter_data_voter_gender, temp_voter_data_updated_by_user_id, temp_voter_data_updated_date, temp_voter_data_voter_in_city_id, temp_voter_data_voter_current_location)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    temp_data['temp_voter_data_voter_id'],
                    temp_data.get('temp_voter_name'),
                    temp_data.get('temp_voter_parent_name'),
                    temp_data.get('temp_voter_contact_number'),
                    temp_data.get('temp_voter_cast_id'),
                    temp_data.get('temp_voter_live_status_id'),
                    temp_data.get('temp_voter_marital_status_id'),
                    temp_data.get('temp_voter_age'),
                    temp_data.get('temp_voter_gender'),
                    temp_voter_data_updated_by_user_id,
                    temp_voter_data_updated_date,
                    temp_in_city_id,  # Use the validated/converted variable
                    temp_data.get('temp_voter_current_location')
                ))
               
            return JsonResponse({"success": "Data stored in temporary voter data."}, status=201)

        return JsonResponse({"message": "No changes detected."}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)



@csrf_exempt
def multiple_voter_data_update_by_prabha_user(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        voter_ids = data.get('temp_voter_data_voter_ids', [])
        if not isinstance(voter_ids, list) or not voter_ids:
            return JsonResponse({"error": "Invalid or empty voter ID list."}, status=400)

        for voter_id in voter_ids:
            with connection.cursor() as cursor:
                cursor.execute("""
                   SELECT  temp_voter_data_voter_name, temp_voter_data_voter_parent_name, 
                    temp_voter_data_voter_contact_number, temp_voter_data_voter_cast, 
                    temp_voter_data_voter_live_status, temp_voter_data_voter_marital_status, 
                    temp_voter_data_voter_age, temp_voter_data_voter_gender, 
                    temp_voter_data_updated_by_user_id, temp_voter_data_voter_in_city_id, temp_voter_data_voter_current_location
                FROM tbl_temp_voter_data_prabhag
                WHERE temp_voter_data_voter_id = %s 
                AND (temp_voter_data_approved_status IS NULL OR temp_voter_data_approved_status != 1);
                """, [voter_id])
                temp_voter_data = cursor.fetchone()

            if temp_voter_data:
                update_fields = []
                params = []
                field_mapping = [
                    (temp_voter_data[0], "voter_name"),  
                    (temp_voter_data[1], "voter_parent_name"),  
                    (temp_voter_data[2], "voter_contact_number"),  
                    (temp_voter_data[3], "voter_cast_id"),  
                    (temp_voter_data[4], "voter_live_status_id"),  
                    (temp_voter_data[5], "voter_marital_status_id"),  
                    (temp_voter_data[6], "voter_age"),  
                    (temp_voter_data[7], "voter_gender"),  
                    (temp_voter_data[8], "voter_updated_by"),  
                    (temp_voter_data[9], "voter_in_city_id"),  
                    (temp_voter_data[10], "voter_current_location"),  
                ]

                for value, field in field_mapping:
                    if value is not None:
                        update_fields.append(f"{field} = %s")
                        params.append(value)

                if update_fields:
                    sql_update_voter = f"""
                        UPDATE tbl_voter
                        SET {', '.join(update_fields)}
                        WHERE voter_id = %s;
                    """
                    params.append(voter_id)
                    with connection.cursor() as cursor:
                        cursor.execute(sql_update_voter, params)

                    sql_update_temp_status = """
                        UPDATE tbl_temp_voter_data_prabhag
                        SET temp_voter_data_approved_status = 1
                        WHERE temp_voter_data_voter_id = %s;
                    """
                    with connection.cursor() as cursor:
                        cursor.execute(sql_update_temp_status, [voter_id])

        return JsonResponse({"message": "Voter data and temporary status updated successfully."}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)



@csrf_exempt
def update_voter_data_prabhag_user(request, temp_voter_data_voter_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        update_fields = []
        params = []

        if 'temp_voter_data_voter_name' in data:
            update_fields.append("voter_name = %s")
            params.append(data['temp_voter_data_voter_name'])
        
        if 'temp_voter_data_voter_parent_name' in data:
            update_fields.append("voter_parent_name = %s")
            params.append(data['temp_voter_data_voter_parent_name'])
        
        if 'temp_voter_data_voter_contact_number' in data:
            update_fields.append("voter_contact_number = %s")
            params.append(data['temp_voter_data_voter_contact_number'])
        
        if 'temp_voter_data_voter_cast' in data:
            update_fields.append("voter_cast_id = %s")
            params.append(data['temp_voter_data_voter_cast'])
        
        if 'temp_voter_data_voter_live_status' in data:
            update_fields.append("voter_live_status_id = %s")
            params.append(data['temp_voter_data_voter_live_status'])
        
        if 'temp_voter_data_voter_marital_status' in data:
            update_fields.append("voter_marital_status_id = %s")
            params.append(data['temp_voter_data_voter_marital_status'])
        
        if 'temp_voter_data_voter_age' in data:
            update_fields.append("voter_age = %s")
            params.append(data['temp_voter_data_voter_age'])
        
        if 'temp_voter_data_voter_gender' in data:
            update_fields.append("voter_gender = %s")
            params.append(data['temp_voter_data_voter_gender'])

        if 'temp_voter_data_updated_by_user_id' in data:
            update_fields.append("voter_updated_by = %s")
            params.append(data['temp_voter_data_updated_by_user_id'])

        if 'temp_voter_data_updated_date' in data:
            update_fields.append("voter_updated_date = %s")
            params.append(data['temp_voter_data_updated_date'])

        if 'temp_voter_data_voter_in_city_id' in data:
            update_fields.append("voter_in_city_id = %s")
            params.append(data['temp_voter_data_voter_in_city_id'])

        if 'tbl_temp_voter_data_voter_current_location' in data:
            update_fields.append("voter_current_location = %s")
            params.append(data['tbl_temp_voter_data_voter_current_location'])

        if not update_fields:
            return JsonResponse({"error": "No fields to update."}, status=400)

        sql_voter = f"""
            UPDATE tbl_voter
            SET {', '.join(update_fields)}
            WHERE voter_id = %s;
        """
        params.append(temp_voter_data_voter_id)

        with connection.cursor() as cursor:
            cursor.execute(sql_voter, params)

        sql_temp_status = """
            UPDATE tbl_temp_voter_data_prabhag
            SET temp_voter_data_approved_status = 1
            WHERE temp_voter_data_voter_id = %s;
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_temp_status, [temp_voter_data_voter_id])

        return JsonResponse({"message": "Voter data and temporary status updated successfully."}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)




@csrf_exempt
def update_reject_status_prabhag_user(request, temp_voter_data_voter_id):
    if request.method == 'PUT':
        sql_temp_status = """
            UPDATE tbl_temp_voter_data_prabhag
            SET temp_voter_data_approved_status = 0
            WHERE temp_voter_data_voter_id = %s;
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_temp_status, [temp_voter_data_voter_id])

        return JsonResponse({"message": "Voter temp_voter_data_approved_status rejected"}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def get_temp_voter_data_prabhag_user(request, temp_voter_data_updated_by_user_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                t.temp_voter_data_id,
                t.temp_voter_data_voter_id,
                COALESCE(t.temp_voter_data_voter_name, v.voter_name) AS voter_name,
                t.temp_voter_data_voter_parent_name,
                t.temp_voter_data_voter_contact_number,
                t.temp_voter_data_voter_cast,
                t.temp_voter_data_voter_live_status,
                t.temp_voter_data_voter_marital_status,
                t.temp_voter_data_voter_age,
                t.temp_voter_data_voter_gender,
                t.temp_voter_data_updated_by_user_id,
                t.temp_voter_data_voter_in_city_id,
                t.temp_voter_data_voter_current_location
            FROM tbl_temp_voter_data_prabhag t
            LEFT JOIN tbl_voter v ON t.temp_voter_data_voter_id = v.voter_id
            WHERE t.temp_voter_data_updated_by_user_id = %s 
            AND (t.temp_voter_data_approved_status <> 1 OR t.temp_voter_data_approved_status IS NULL);
        """, [temp_voter_data_updated_by_user_id])
        
        rows = cursor.fetchall()
        
        if not rows: 
            return JsonResponse({"error": "No data found for this temp_voter_data_updated_by_user_id."}, status=404)

        columns = [col[0] for col in cursor.description] if cursor.description else []

        result = []
        for row in rows:
            row_dict = dict(zip(columns, row))
            row_dict = {k: v for k, v in row_dict.items() if v is not None}
            result.append(row_dict)

    return JsonResponse(result, safe=False)


def get_temp_voter_data_user_prabhag_user(request, temp_voter_data_updated_by_user_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                temp_voter_data_id,
                temp_voter_data_voter_id,
                temp_voter_data_voter_name,
                temp_voter_data_voter_parent_name,
                temp_voter_data_voter_contact_number,
                temp_voter_data_voter_cast,
                temp_voter_data_voter_live_status,
                temp_voter_data_voter_marital_status,
                temp_voter_data_voter_age,
                temp_voter_data_voter_gender,
                temp_voter_data_updated_by_user_id,
                temp_voter_data_voter_in_city_id,
                temp_voter_data_voter_in_city_id
            FROM tbl_temp_voter_data_prabhag
            WHERE temp_voter_data_updated_by_user_id = %s AND (temp_voter_data_approved_status <> 1 OR temp_voter_data_approved_status IS NULL);
        """, [temp_voter_data_updated_by_user_id])
        
        rows = cursor.fetchall()
        
        if not rows: 
            return JsonResponse({"error": "No data found for this temp_voter_data_voter_id."}, status=404)

        columns = [col[0] for col in cursor.description] if cursor.description else []

        result = []
        for row in rows:
            row_dict = dict(zip(columns, row))
            row_dict = {k: v for k, v in row_dict.items() if v is not None}
            result.append(row_dict)

    return JsonResponse(result, safe=False) 




class GetUserBoothDetailsByPrabhagUserView(APIView):

    def get(self, request, prabhag_user_id):
        with connection.cursor() as cursor:
            try:
                cursor.callproc('GetUserBoothDetailsByPrabhagUser', [prabhag_user_id])
                
                results = cursor.fetchall()

                response_data = [
                    {
                        'user_id': row[0],
                        'user_name': row[1],
                        'user_phone': row[2],
                        'booth_names': row[3]
                    }
                    for row in results
                ]

                return Response(response_data, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PrabhagUserLogoutView(APIView):
    def post(self, request, prabhag_user_id):
        if 'prabhag_user_id' in request.session:
            if request.session['prabhag_user_id'] == prabhag_user_id:
                del request.session['prabhag_user_id']
                return Response({"message": "Logout Successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid politician_id"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "User not logged in"}, status=status.HTTP_400_BAD_REQUEST)


# class DeletePrabhagUserView(APIView):

#     def delete(self, request, prabhag_user_id):
#         with connection.cursor() as cursor:
#             try:
#                 # cursor.execute(
#                 #     "UPDATE tbl_user SET user_prabhag_user_id = NULL WHERE user_prabhag_user_id = %s",
#                 #     [prabhag_user_id]
#                 # )

#                 cursor.execute(
#                     "DELETE FROM tbl_prabhag_user WHERE prabhag_user_id = %s",
#                     [prabhag_user_id]
#                 )

#                 return Response({'status': 'User deleted successfully'}, status=status.HTTP_200_NO_CONTENT)

#             except Exception as e:
#                 print("Error deleting prabhag user:", e)
#                 return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# from django.db import connection, transaction, IntegrityError
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# class DeletePrabhagUserView(APIView):
    
#     def delete(self, request, prabhag_user_id):
#         try:
#             with transaction.atomic():  # Ensures all queries are atomic
#                 with connection.cursor() as cursor:
#                     # Set user_prabhag_user_id to NULL where prabhag_user_id matches
#                     cursor.execute(
#                         "UPDATE tbl_user SET user_prabhag_user_id = NULL WHERE user_prabhag_user_id = %s", 
#                         [prabhag_user_id]
#                     )
                    
#                     # Delete the prabhag_user record itself
#                     cursor.execute(
#                         "DELETE FROM tbl_prabhag_user WHERE prabhag_user_id = %s", 
#                         [prabhag_user_id]
#                     )
            
#             return Response({'status': 'User deleted successfully'}, status=status.HTTP_200_OK)
        
#         except IntegrityError as e:
#             return Response({'error': 'Integrity error: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({'error': 'An error occurred: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import logging

logger = logging.getLogger(__name__)

class DeletePrabhagUserView(APIView):
    
    def delete(self, request, prabhag_user_id):
        try:
            with transaction.atomic():
                # Log the user ID being deleted
                logger.info(f'Attempting to delete prabhag user with ID: {prabhag_user_id}')
                
                # Update the related user records
                affected_rows = User.objects.filter(user_prabhag_user_id=prabhag_user_id).update(user_prabhag_user_id=None)
                logger.info(f'Updated {affected_rows} user records to set user_prabhag_user_id to NULL')

                # Delete the prabhag user record
                deleted_rows = PrabhagUser.objects.filter(prabhag_user_id=prabhag_user_id).delete()
                logger.info(f'Deleted {deleted_rows[0]} prabhag user records')

            return Response({'status': 'User deleted successfully'}, status=status.HTTP_200_OK)

        except IntegrityError as e:
            logger.error(f'Integrity error occurred: {str(e)}')
            return Response({'error': 'Integrity error: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f'An unexpected error occurred: {str(e)}')
            return Response({'error': 'An error occurred: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class GetPrabhagUsersInfoView(APIView):

    def get(self, request):
        with connection.cursor() as cursor:
            try:
                cursor.execute("""
                    SELECT 
                        pu.prabhag_user_id,
                        pu.prabhag_user_name,
                        pu.prabhag_user_contact_number,
                        p.prabhag_name
                    FROM
                        tbl_prabhag_user pu
                    JOIN
                        tbl_prabhag p ON pu.prabhag_user_prabhag_id = p.prabhag_id
                """)
                
                results = cursor.fetchall()

                response_data = [
                    {
                        'prabhag_user_id': row[0],
                        'prabhag_user_name': row[1],
                        'prabhag_user_contact_number': row[2],
                        'prabhag_name': row[3]
                    }
                    for row in results
                ]

                return Response(response_data, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetPrabhagUserInfoView(APIView):

    def get(self, request, prabhag_user_id):
        with connection.cursor() as cursor:
            try:
                cursor.execute("""
                    SELECT 
                        pu.prabhag_user_id,
                        pu.prabhag_user_name,
                        pu.prabhag_user_contact_number,
                        p.prabhag_name
                    FROM
                        tbl_prabhag_user pu
                    JOIN
                        tbl_prabhag p ON pu.prabhag_user_prabhag_id = p.prabhag_id
                    WHERE
                        pu.prabhag_user_id = %s
                """, [prabhag_user_id])
                
                results = cursor.fetchall()

                response_data = [
                    {
                        'prabhag_user_id': row[0],
                        'prabhag_user_name': row[1],
                        'prabhag_user_contact_number': row[2],
                        'prabhag_name': row[3]
                    }
                    for row in results
                ]

                return Response(response_data, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# # generate current location of voter pdf by town wise

def generate_voter_pdf_by_town(request, town_id, city_id):
    try:
        with connection.cursor() as cursor:
            cursor.callproc('GetVoterCurrentLocationDetailsByTown', [town_id, city_id])
            results = cursor.fetchall() 
            columns = [col[0] for col in cursor.description]
            voters = [dict(zip(columns, row)) for row in results]

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        p.setTitle("Voter Current Location Details")

        p.drawString(200, 800, "Voter Current Location Details")

        y_position = 750
        cell_heights = 20  

        column_widths = [60, 190, 150, 150]  
        x_positions = [30]  

        for width in column_widths[:-1]:
            x_positions.append(x_positions[-1] + width)

        for i, header in enumerate(columns):
            p.drawString(x_positions[i] + 5, y_position - 15, header)
            p.rect(x_positions[i], y_position - cell_heights, column_widths[i], cell_heights, stroke=1, fill=0)
        
        y_position -= cell_heights

        def draw_wrapped_text(canvas, text, x, y, max_width):
            wrapped_lines = []
            words = text.split()
            line = ""
            for word in words:
                test_line = f"{line} {word}".strip()
                if canvas.stringWidth(test_line) <= max_width:
                    line = test_line
                else:
                    wrapped_lines.append(line)
                    line = word
            wrapped_lines.append(line)  

            line_y = y
            for wrapped_line in wrapped_lines:
                canvas.drawString(x, line_y, wrapped_line)
                line_y -= 10  

        for voter in voters:
            max_row_height = cell_heights
            for i, (key, value) in enumerate(voter.items()):
                draw_wrapped_text(p, str(value), x_positions[i] + 5, y_position - 15, column_widths[i] - 10)
                max_row_height = max(max_row_height, 10 * len(str(value).split()))

            for i in range(len(columns)):
                p.rect(x_positions[i], y_position - max_row_height, column_widths[i], max_row_height, stroke=1, fill=0)
            
            y_position -= max_row_height

            if y_position < 50:  
                p.showPage()
                y_position = 750
                for i, header in enumerate(columns):
                    p.drawString(x_positions[i] + 5, y_position - 15, header)
                    p.rect(x_positions[i], y_position - cell_heights, column_widths[i], cell_heights, stroke=1, fill=0)
                y_position -= cell_heights

        p.save()

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="voter_details_by_booth.pdf"'
        return response

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# # generate current location of voter pdf by booth wise



def generate_voter_pdf_by_booth(request, booth_id, city_id):
    try:
        with connection.cursor() as cursor:
            cursor.callproc('GetVoterCurrentLocationDetailsByBooth', [booth_id, city_id])
            results = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
 
        if not results:
            return JsonResponse({'error': 'No voter data found for the given booth and city.'}, status=404)
 
        # Prepare table data (header + rows)
        # Updated table headers: Serial Number, Voter Name, Voter Contact Number
        table_data = [['Serial Number', 'Voter Name', 'Voter Contact Number']]  # Add headers
 
        for idx, row in enumerate(results, start=1):
            voter_name = row[1]  # Assuming voter_name is in the second column
            voter_contact_number = row[2]  # Assuming voter_contact_number is in the third column
            table_data.append([idx, voter_name, voter_contact_number])  # Add serial number along with data
 
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
 
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),  # Header background
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),  # Header text color
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),  # Left align all cells
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Header font
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),  # Padding for header
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),  # Rows background
            ('GRID', (0, 0), (-1, -1), 1, colors.black),  # Grid color and width
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),  # Rows font
            ('FONTSIZE', (0, 0), (-1, -1), 10),  # Font size
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),  # Vertical alignment
        ]))
 
        elements = [table]
        doc.build(elements)
 
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="voter_details_by_booth.pdf"'
        return response
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 

@api_view(['PUT'])
def reject_multiple_temp_voter_data_by_prabhag_user(request):
    voter_ids = request.data.get('temp_voter_data_voter_ids', [])
    
    if not isinstance(voter_ids, list):
        return Response({'error': 'Invalid data format. Expecting an array of voter IDs.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not voter_ids:
        return Response({'error': 'No voter IDs provided.'}, status=status.HTTP_400_BAD_REQUEST)

    ids_placeholder = ', '.join(['%s'] * len(voter_ids))

    sql_query = f"UPDATE tbl_temp_voter_data_prabhag SET temp_voter_data_approved_status = 0 WHERE temp_voter_data_voter_id IN ({ids_placeholder})"
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(sql_query, voter_ids)
        updated_count = cursor.rowcount
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'updated_count': updated_count}, status=status.HTTP_200_OK)


def get_voter_current_location_details_by_prabhag_user(requtownest, prabhag_user_id, city_id):
    try:
        with connection.cursor() as cursor:
            cursor.callproc('GetVoterDetailsByPrabhagUserIdWithLocation', [prabhag_user_id, city_id])
            results = cursor.fetchall() 
            columns = [col[0] for col in cursor.description]
            voters = [dict(zip(columns, row)) for row in results]
        
        return JsonResponse(voters, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500) 


# # get voter info by booth user



def call_stored_procedure(procedure_name, params):
    """Helper function to call a stored procedure with parameters"""
    with connection.cursor() as cursor:
        cursor.callproc(procedure_name, params)
        columns = [col[0] for col in cursor.description] 
        result = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return result

# @csrf_exempt
# def get_voter_info_by_booth_user(request, user_booth_user_id, voter_favour_id, voter_vote_confirmation_id):
#     """
#     GET API to call stored procedures based on voter_vote_confirmation_id.
#     - `user_booth_user_id` (integer)
#     - `voter_favour_id` (integer)
#     - `voter_vote_confirmation_id` (integer)
#     """
#     try:
#         if voter_vote_confirmation_id not in [1, 2]:
#             return JsonResponse({'error': 'Invalid voter_vote_confirmation_id. Must be 1 or 2.'}, status=400)

#         if voter_vote_confirmation_id == 1:
#             procedure_name = 'GetVoterInfoByUserAndFavourForVoted'
#         elif voter_vote_confirmation_id == 2:
#             procedure_name = 'GetVoterInfoByUserAndFavourForNonVoted'

#         result = call_stored_procedure(procedure_name, [user_booth_user_id, voter_favour_id])

#         return JsonResponse({'data': result}, safe=False)

#     except ValueError as ve:
#         return JsonResponse({'error': f'Invalid data format: {str(ve)}'}, status=400)
#     except BadRequest as br:
#         return JsonResponse({'error': str(br)}, status=400)
#     except Exception as e:
#         return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)




@csrf_exempt
def get_voter_info_by_booth_user(request, user_booth_user_id, voter_favour_id, voter_vote_confirmation_id):
    """
    GET API to call stored procedures based on voter_vote_confirmation_id.
    - `user_booth_user_id` (integer)
    - `voter_favour_id` (integer)
    - `voter_vote_confirmation_id` (integer)
    """
    try:
        if voter_vote_confirmation_id not in [1, 2]:
            return JsonResponse({'error': 'Invalid voter_vote_confirmation_id. Must be 1 or 2.'}, status=400) 

        if voter_vote_confirmation_id == 1:
            procedure_name = 'GetVoterInfoByUserAndFavourForVoted'
        elif voter_vote_confirmation_id == 2:
            procedure_name = 'GetVoterInfoByUserAndFavourForNonVoted'

        result = call_stored_procedure(procedure_name, [user_booth_user_id, voter_favour_id])

        return JsonResponse(result, safe=False)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid data format: {str(ve)}'}, status=400)
    except Exception as e:
        # Handling unexpected errors
        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

# # generate current location of voter pdf by prabhag user wise

def generate_voter_pdf_by_brabhag_user(request, prabhag_user_id, city_id):
    try:
        with connection.cursor() as cursor:
            cursor.callproc('GetVoterDetailsByPrabhagUserIdWithLocation', [prabhag_user_id, city_id])
            results = cursor.fetchall() 
            columns = [col[0] for col in cursor.description]
            voters = [dict(zip(columns, row)) for row in results]

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        p.setTitle("Voter Current Location Details")

        p.drawString(200, 800, "Voter Current Location Details")

        y_position = 750
        cell_heights = 20  

        column_widths = [60, 190, 150, 150]  
        x_positions = [30]  

        for width in column_widths[:-1]:
            x_positions.append(x_positions[-1] + width)

        for i, header in enumerate(columns):
            p.drawString(x_positions[i] + 5, y_position - 15, header)
            p.rect(x_positions[i], y_position - cell_heights, column_widths[i], cell_heights, stroke=1, fill=0)
        
        y_position -= cell_heights

        def draw_wrapped_text(canvas, text, x, y, max_width):
            wrapped_lines = []
            words = text.split()
            line = ""
            for word in words:
                test_line = f"{line} {word}".strip()
                if canvas.stringWidth(test_line) <= max_width:
                    line = test_line
                else:
                    wrapped_lines.append(line)
                    line = word
            wrapped_lines.append(line)  

            line_y = y
            for wrapped_line in wrapped_lines:
                canvas.drawString(x, line_y, wrapped_line)
                line_y -= 10  

        for voter in voters:
            max_row_height = cell_heights
            for i, (key, value) in enumerate(voter.items()):
                draw_wrapped_text(p, str(value), x_positions[i] + 5, y_position - 15, column_widths[i] - 10)
                max_row_height = max(max_row_height, 10 * len(str(value).split()))

            for i in range(len(columns)):
                p.rect(x_positions[i], y_position - max_row_height, column_widths[i], max_row_height, stroke=1, fill=0)
            
            y_position -= max_row_height

            if y_position < 50:  
                p.showPage()
                y_position = 750
                for i, header in enumerate(columns):
                    p.drawString(x_positions[i] + 5, y_position - 15, header)
                    p.rect(x_positions[i], y_position - cell_heights, column_widths[i], cell_heights, stroke=1, fill=0)
                y_position -= cell_heights

        p.save()

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="voter_details_by_booth.pdf"'
        return response

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    
class GetVoterInfoByUserAndFavour(View):
    def get(self, request, user_booth_user_id, voter_favour_id, *args, **kwargs):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('GetVoterInfoByUserAndFavour', [user_booth_user_id, voter_favour_id]) 
                result = cursor.fetchall()

            voters = []
            for row in result:
                voters.append({
                    'voter_id': row[0],
                    'voter_name': row[1],
                    'voter_favour_id': row[2],
                    'voter_name_mar': row[3],
                    'voter_serial_number': row[4],
                    'voter_id_card_number': row[5]
                })

            return JsonResponse(voters, safe = False)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
        
# #




def generate_voters_by_cast_pdf(request, cast_id):
    # Define the query to fetch voter details along with cast name
    query = '''
        SELECT 
            v.voter_id,
            v.voter_name,
            v.voter_contact_number,
            c.cast_name
        FROM 
            tbl_voter v
        JOIN 
            tbl_cast c ON v.voter_cast_id = c.cast_id
        WHERE 
            v.voter_cast_id = %s;
    '''
    
    # Execute the query
    with connection.cursor() as cursor:
        cursor.execute(query, [cast_id])
        rows = cursor.fetchall()

    # Initialize PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    
    # Header for the PDF document
    pdf.cell(0, 10, f'Voters by Cast', 0, 1)
    pdf.ln(10)

    # Table headers
    pdf.cell(18, 10, 'Voter ID', 1)
    pdf.cell(90, 10, 'Voter Name', 1)
    pdf.cell(45, 10, 'Contact Number', 1)
    pdf.cell(30, 10, 'Cast Name', 1)
    pdf.ln()

    # Set font for table content
    pdf.set_font('Arial', '', 12)

    # Populate table rows with data from query results
    for row in rows:
        voter_id, voter_name, voter_contact_number, cast_name = row
        pdf.cell(18, 10, str(voter_id), 1)
        pdf.cell(90, 10, voter_name, 1)
        pdf.cell(45, 10, str(voter_contact_number), 1)
        pdf.cell(30, 10, cast_name, 1)
        pdf.ln()

    # Generate PDF response
    response = HttpResponse(pdf.output(dest='S').encode('latin1'), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="voters_by_cast.pdf"'
    return response





def generate_voters_by_religion_pdf(request, religion_id):
    try:
        religion_id = int(religion_id)
    except ValueError:
        return HttpResponseNotFound("Invalid 'religion_id' parameter")

    # Query to fetch voter data by religion
    query = """
    SELECT 
    v.voter_id,
    v.voter_name,
    v.voter_contact_number,
    c.cast_name,
    r.religion_name
    FROM 
        vw_voter_list v
    JOIN 
        tbl_cast c ON v.voter_cast_id = c.cast_id
    JOIN 
        tbl_religion r ON c.cast_religion_id = r.religion_id
    WHERE 
        r.religion_id = %s;
    """
    
    # Execute query and fetch results
    with connection.cursor() as cursor:
        cursor.execute(query, [religion_id])
        rows = cursor.fetchall()
    
    # Prepare the result data
    result = [
        {
            'voter_id': row[0],
            'voter_name': row[1],
            'voter_contact_number': row[2],
            'voter_cast_name': row[3],
            'voter_religion_name': row[4]
        }
        for row in rows
    ]
    
    # Create PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)

    # Add header information
    pdf.cell(0, 10, f'Religion ID: {religion_id}', 0, 1)
    pdf.ln(10)  # Line break

    # Table headers
    pdf.cell(20, 10, 'Voter ID', 1)
    pdf.cell(60, 10, 'Voter Name', 1)
    pdf.cell(40, 10, 'Contact Number', 1)
    pdf.cell(40, 10, 'Cast Name', 1)
    pdf.cell(40, 10, 'Religion Name', 1)
    pdf.ln()

    # Add voter data to PDF
    pdf.set_font('Arial', '', 12)
    for voter in result:
        pdf.cell(20, 10, str(voter['voter_id']), 1)
        pdf.cell(60, 10, voter['voter_name'], 1)
        pdf.cell(40, 10, str(voter['voter_contact_number']), 1)
        pdf.cell(40, 10, voter['voter_cast_name'], 1)
        pdf.cell(40, 10, voter['voter_religion_name'], 1)
        pdf.ln()

    # Return the generated PDF as a response
    response = HttpResponse(pdf.output(dest='S').encode('latin1'), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="voters_by_religion.pdf"'
    
    return response


# # update voter family group discription




@csrf_exempt
def update_family_group_description(request, family_group_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_description = data.get("family_group_description")
            
            if new_description is None:
                return HttpResponseBadRequest("family_group_description is required")

            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE tbl_family_group 
                    SET family_group_description = %s 
                    WHERE family_group_id = %s
                """, [new_description, family_group_id])

            return JsonResponse({"message": "Family group description updated successfully"}, status=200)
        
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON")
    else:
        return HttpResponseBadRequest("Invalid request method")

def get_family_group_description(request, family_group_id):
    if request.method == 'GET':
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT family_group_description 
                FROM tbl_family_group 
                WHERE family_group_id = %s
            """, [family_group_id])
            row = cursor.fetchone()

            if row:
                return JsonResponse({"family_group_description": row[0]}, safe=False)
            else:
                return JsonResponse({"message": "Family group not found"}, status=404)
    else:
        return HttpResponseBadRequest("Invalid request method")
    
    
# # update family group name



@csrf_exempt
def manage_family_group_name(request, family_group_id):
    if request.method == 'GET':
        # Get family_group_name by family_group_id
        with connection.cursor() as cursor:
            cursor.execute("SELECT family_group_name FROM tbl_family_group WHERE family_group_id = %s", [family_group_id])
            result = cursor.fetchone()
        
        if result:
            family_group_name = result[0]
            return JsonResponse({"family_group_id": family_group_id, "family_group_name": family_group_name})
        else:
            return JsonResponse({"error": "Family group not found"}, status=404)
    
    elif request.method == 'POST':
        # Update family_group_name for the given family_group_id
        try:
            data = json.loads(request.body)
            new_family_group_name = data.get("family_group_name")
            
            if not new_family_group_name:
                return JsonResponse({"error": "family_group_name is required"}, status=400)
            
            with connection.cursor() as cursor:
                cursor.execute("UPDATE tbl_family_group SET family_group_name = %s WHERE family_group_id = %s", [new_family_group_name, family_group_id])
            
            return JsonResponse({"message": "Family group name updated successfully"})
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


# # town wise prabhag

@method_decorator(csrf_exempt, name='dispatch')
class GetPrabhagByTownView(View):
    def get(self, request, town_id, *args, **kwargs):
        try:
            if not isinstance(town_id, int):
                return JsonResponse({'error': 'Invalid town_id'}, status=400)

            query = """
                SELECT DISTINCT p.prabhag_id, p.prabhag_name
                FROM tbl_prabhag p
                JOIN tbl_booth b ON p.prabhag_id = b.booth_prabhag_id
                WHERE b.booth_town_id = %s
            """
            
            with connection.cursor() as cursor:
                cursor.execute(query, [town_id])
                results = cursor.fetchall()

            prabhags = [{'prabhag_id': row[0], 'prabhag_name': row[1]} for row in results]
            
            return JsonResponse(prabhags, safe = False, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        
        
# town list by urban or rural wise

@method_decorator(csrf_exempt, name='dispatch')
class TownListByAreaTypeAPIView(APIView):
    def get(self, request, town_area_type_id):
        """
        Retrieve town names based on town_area_type_id
        """
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT town_name, town_id FROM washim_bjp.tbl_town WHERE town_area_type_id = %s
            """, [town_area_type_id])
            rows = cursor.fetchall()
        
        towns = [{"town_id": row[1], "town_name": row[0]} for row in rows]
        
        if towns:
            return JsonResponse(towns, safe=False, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"error": "No towns found for the given area type ID"}, status=status.HTTP_404_NOT_FOUND)
        
        
        
# # Delete prabhag

@method_decorator(csrf_exempt, name='dispatch')
class DeletePrabhagView(View):
    def delete(self, request, prabhag_id, *args, **kwargs):
        try:
            if not isinstance(prabhag_id, int):
                return JsonResponse({'error': 'Invalid prabhag_id'}, status=400)

            with connection.cursor() as cursor:
                cursor.execute('''SELECT prabhag_id FROM tbl_prabhag WHERE prabhag_id = %s''', [prabhag_id])
                result = cursor.fetchone()

            if not result:
                return JsonResponse({'error': 'Prabhag not found'}, status=404)

            with connection.cursor() as cursor:
                cursor.execute('''DELETE FROM tbl_prabhag_user WHERE prabhag_user_prabhag_id = %s''', [prabhag_id])

            with connection.cursor() as cursor:
                cursor.execute('''DELETE FROM tbl_prabhag WHERE prabhag_id = %s''', [prabhag_id])

            return JsonResponse({'status': 'success', 'message': 'Prabhag deleted successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
        
# # update prabhag name 


@method_decorator(csrf_exempt, name='dispatch')
class UpdatePrabhagNameView(View):
    def put(self, request, prabhag_id, *args, **kwargs):
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            new_prabhag_name = data.get('prabhag_name')

            # Validate the prabhag_name
            if not new_prabhag_name:
                return JsonResponse({'error': 'prabhag_name is required'}, status=400)

            if not isinstance(new_prabhag_name, str) or len(new_prabhag_name) < 3:
                return JsonResponse({'error': 'prabhag_name must be a string with at least 3 characters'}, status=400)

            # Check if prabhag_id exists in the database
            with connection.cursor() as cursor:
                cursor.execute('SELECT prabhag_id FROM tbl_prabhag WHERE prabhag_id = %s', [prabhag_id])
                result = cursor.fetchone()

            if not result:
                return JsonResponse({'error': 'Prabhag not found'}, status=404)

            # Update the prabhag_name in the database
            with connection.cursor() as cursor:
                cursor.execute('''
                    UPDATE tbl_prabhag
                    SET prabhag_name = %s
                    WHERE prabhag_id = %s
                ''', [new_prabhag_name, prabhag_id])

            return JsonResponse({'status': 'success', 'message': 'Prabhag name updated successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
        
        
# # all favour counts

def get_all_favour_counts(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT voter_favour_id, COUNT(*) AS count
                FROM tbl_voter
                GROUP BY voter_favour_id
            """)
            results = cursor.fetchall()

        favour_counts = [{'voter_favour_id': row[0], 'count': row[1]} for row in results]
        
        return JsonResponse(favour_counts, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    
# # # voter group 


@csrf_exempt
def create_voter_group_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            voter_group_user_name = data.get('voter_group_user_name')
            voter_group_user_contact_number = data.get('voter_group_user_contact_number')
            voter_group_name = data.get('voter_group_name')
            voter_ids = data.get('voter_ids')
            voter_group_user_password = data.get('voter_group_user_password')  # New field for password

            if not voter_group_user_name or not voter_group_user_contact_number:
                return JsonResponse({'error': 'voter_group_user_name and voter_group_user_contact_number are required'}, status=400)
            if not voter_group_name or not voter_ids:
                return JsonResponse({'error': 'voter_group_name and voter_ids are required'}, status=400)
            if not voter_group_user_password:
                return JsonResponse({'error': 'voter_group_user_password is required'}, status=400)

            hashed_password = make_password(voter_group_user_password)

            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO tbl_voter_group_user (voter_group_user__name, voter_group_user_contact_number, voter_group_user_password)
                        VALUES (%s, %s, %s)
                        """, [voter_group_user_name, voter_group_user_contact_number, hashed_password]
                    )
                    cursor.execute("SELECT LAST_INSERT_ID()")
                    voter_group_user_id = cursor.fetchone()[0]

                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO tbl_voter_group (voter_group_name, voter_group_voter_group_user_id)
                        VALUES (%s, %s)
                        """, [voter_group_name, voter_group_user_id]
                    )
                    cursor.execute("SELECT LAST_INSERT_ID()")
                    voter_group_id = cursor.fetchone()[0]

                with connection.cursor() as cursor:
                    cursor.execute(
                        "UPDATE tbl_voter SET voter_voter_group_id = %s WHERE voter_id IN %s",
                        [voter_group_id, tuple(voter_ids)]
                    )

            return JsonResponse({
                'message': 'Voter group user created, voter group created, and voters updated successfully!',
                'voter_group_user_id': voter_group_user_id,
                'voter_group_name': voter_group_name,
                'voter_ids': voter_ids
            }, status=201)

        except Exception as e:
            logging.error(f"Error creating voter group user: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



# get voter list by voter group user wise

@csrf_exempt
def get_voters_by_voter_group_user(request, voter_group_user_id):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.callproc('GetVotersByVoterGroupUser', [voter_group_user_id])
               
                result = cursor.fetchall()
 
                if result and 'No voter groups found for this user' in result[0]:
                    return JsonResponse({'message': result[0][0]}, status=404)
 
                voters = [
                    {
                        'voter_id': voter[0],
                        'voter_name': voter[1],
                        'voter_name_mar': voter[2],
                        'voter_favour_id': voter[3],
                        'voter_contact_number': voter[4],
                        'voter_vote_confirmation_id': voter[5],
                        'booth_name': voter[6],
                        'booth_name_mar': voter[7],
                        'voter_serial_number':voter[8],
                        'voter_id_card_number': voter[9]
                    }
                    for voter in result
                ]
               
                return JsonResponse({
                    'voter_group_user_id': voter_group_user_id,
                    'voters': voters
                }, status=200)
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)
 

# voter group user login and logout

# @csrf_exempt
# def login_voter_group_user(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             voter_group_user_contact_number = data.get('voter_group_user_contact_number')
#             voter_group_user_password = data.get('voter_group_user_password')

#             if not voter_group_user_contact_number or not voter_group_user_password:
#                 return JsonResponse({'error': 'Both contact number and password are required'}, status=400)

#             with connection.cursor() as cursor:
#                 cursor.execute(
#                     """
#                     SELECT voter_group_user_id, voter_group_user_name, voter_group_user_password
#                     FROM tbl_voter_group_user
#                     WHERE voter_group_user_contact_number = %s
#                     """, [voter_group_user_contact_number]
#                 )
#                 user = cursor.fetchone()

#             if not user:
#                 return JsonResponse({'error': 'User not found'}, status=404)

#             user_password = user[2]  
#             if not check_password(voter_group_user_password, user_password):
#                 return JsonResponse({'error': 'Invalid password'}, status=400)

#             request.session['voter_group_user_id'] = user[0]
#             request.session['voter_group_user_name'] = user[1]

#             return JsonResponse({
#                 'message': 'Login successful',
#                 'voter_group_user_id': user[0],
   
#             }, status=200)

#         except Exception as e:
#             logging.error(f"Error logging in voter group user: {str(e)}")
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_voter_group_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            voter_group_user_contact_number = data.get('voter_group_user_contact_number')
            voter_group_user_password = data.get('voter_group_user_password')

            if not voter_group_user_contact_number or not voter_group_user_password:
                return JsonResponse({'error': 'Both contact number and password are required'}, status=400)

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT voter_group_user_id, voter_group_user_name, voter_group_user_password
                    FROM tbl_voter_group_user
                    WHERE voter_group_user_contact_number = %s
                    """, [voter_group_user_contact_number]
                )
                user = cursor.fetchone()

            if not user:
                return JsonResponse({'error': 'User not found'}, status=404)

            voter_group_user_id, voter_group_user_name, user_password = user

            if not check_password(voter_group_user_password, user_password):
                return JsonResponse({'error': 'Invalid password'}, status=400)

            payload = {
                'voter_group_user_id': voter_group_user_id,
                'exp': datetime.utcnow() + timedelta(hours=24),  
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            return JsonResponse({
                'message': 'Login successful',
                'voter_group_user_id': voter_group_user_id,
                'voter_group_user_name': voter_group_user_name,
                'token': token,
            }, status=200)

        except Exception as e:
            logging.error(f"Error logging in voter group user: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def logout_voter_group_user(request):
    if request.method == 'POST':
        try:
            if 'voter_group_user_id' not in request.session:
                return JsonResponse({'error': 'User not logged in'}, status=400)
 
            request.session.flush()
 
            return JsonResponse({
                'message': 'Logout successful'
            }, status=200)
 
        except Exception as e:
            logging.error(f"Error logging out voter group user: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)

 
@csrf_exempt
def add_voter_to_existing_group(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            voter_ids = data.get('voter_ids')
            voter_group_user_id = data.get('voter_group_user_id')
 
            if not voter_ids or not voter_group_user_id:
                return JsonResponse({'error': 'voter_ids and voter_group_user_id are required'}, status=400)
 
            if not isinstance(voter_ids, list):
                voter_ids = [voter_ids]
 
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT COUNT(*)
                    FROM tbl_voter_group
                    WHERE voter_group_voter_group_user_id = %s
                """, [voter_group_user_id])
 
                group_exists = cursor.fetchone()[0]
 
                if group_exists == 0:
                    return JsonResponse({'error': 'voter_group_user_id does not exist'}, status=404)
 
                cursor.executemany("""
                    UPDATE tbl_voter
                    SET voter_voter_group_id = %s
                    WHERE voter_id = %s
                """, [(voter_group_user_id, voter_id) for voter_id in voter_ids])
 
            return JsonResponse({
                'message': 'Voters added in group successfully!',
                # 'voter_ids': voter_ids,
                # 'voter_group_user_id': voter_group_user_id
            }, status=200)
 
        except Exception as e:
            logging.error(f"Error adding voters to group: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)
 
   
 
# remove voter from existing group
@csrf_exempt
def remove_voter_from_existing_group(request, voter_group_id, voter_id):
    if request.method == 'POST':
        try:
            if not voter_id or not voter_group_id:
                return JsonResponse({'error': 'Both voter_id and voter_group_id are required'}, status=400)
 
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT voter_voter_group_id
                    FROM tbl_voter
                    WHERE voter_id = %s
                """, [voter_id])
               
                current_group_id = cursor.fetchone()
 
                if not current_group_id:
                    return JsonResponse({'error': 'Voter not found'}, status=404)
 
                if current_group_id[0] != int(voter_group_id):  
                    return JsonResponse({'error': 'Voter is not in the specified group'}, status=400)
 
                cursor.execute("""
                    UPDATE tbl_voter
                    SET voter_voter_group_id = NULL
                    WHERE voter_id = %s AND voter_voter_group_id = %s
                """, [voter_id, voter_group_id])
 
            return JsonResponse({
                'message': 'Voter removed from the group successfully!',
                # 'voter_id': voter_id,
                # 'voter_group_id': voter_group_id
            }, status=200)
 
        except Exception as e:
            logging.error(f"Error removing voter from group: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def get_voter_group_details_by_user(request, voter_group_user_id):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                # Step 1: Get voter group details for the specific voter_group_user_id
                cursor.execute("""
                    SELECT vg.voter_group_name,
                           COUNT(v.voter_id) AS group_voter_count,
                           vgu.voter_group_user_name,
                           vgu.voter_group_user_contact_number
                    FROM tbl_voter_group vg
                    JOIN tbl_voter v ON vg.voter_group_id = v.voter_voter_group_id
                    JOIN tbl_voter_group_user vgu ON vg.voter_group_voter_group_user_id = vgu.voter_group_user_id
                    WHERE vgu.voter_group_user_id = %s
                    GROUP BY vg.voter_group_name, vgu.voter_group_user_name, vgu.voter_group_user_contact_number
                """, [voter_group_user_id])
               
                group_details = cursor.fetchone()
 
            if group_details:
                # Format the result
                return JsonResponse({
                    'voter_group_user_id': voter_group_user_id,
                    'voter_group_name': group_details[0],
                    'group_voter_count': group_details[1],
                    'group_user_name': group_details[2],
                    'group_user_contact': group_details[3]
                }, status=200)
            else:
                return JsonResponse({'error': 'No group found for this user.'}, status=404)
 
        except Exception as e:
            logging.error(f"Error fetching voter group details: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)


# get voted non voted voters by voter group user wise
 
@csrf_exempt
def get_voters_by_confirmation(request, voter_group_user_id, confirmation_id):
    if request.method == 'GET':
        try:
            if confirmation_id not in ['1', 'null', '2']:
                return JsonResponse({'error': 'Invalid confirmation_id, must be "1", "null", or "2"'}, status=400)
 
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT voter_group_id
                    FROM tbl_voter_group
                    WHERE voter_group_voter_group_user_id = %s
                """, [voter_group_user_id])
 
                group_id_result = cursor.fetchone()
 
                if not group_id_result:
                    return JsonResponse({'error': 'No group found for this user'}, status=404)
 
                voter_group_id = group_id_result[0]
 
                if confirmation_id == '1':
                    confirmation_condition = 'voter_vote_confirmation_id = 1'
                else:
                    confirmation_condition = 'voter_vote_confirmation_id IS NULL OR voter_vote_confirmation_id = 2'
 
                cursor.execute(f"""
                    SELECT v.voter_id, v.voter_name, v.voter_vote_confirmation_id, v.voter_favour_id
                    FROM tbl_voter v
                    WHERE v.voter_voter_group_id = %s AND ({confirmation_condition})
                """, [voter_group_id])
 
                voters = cursor.fetchall()
 
                voters_list = [
                    {
                        'voter_id': voter[0],
                        'voter_name': voter[1],
                        'voter_confirmation_id': voter[2],
                        'voter_favour_id': voter[3]
                    }
                    for voter in voters
                ]
 
                # Return the list of voters only
                return JsonResponse(voters_list, safe=False, status=200)
 
        except Exception as e:
            logging.error(f"Error fetching voters by confirmation status: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)


 
# voter group details

@csrf_exempt
def get_voter_group_details(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                query = """
                SELECT
                    vg.voter_group_name,
                    COUNT(v.voter_id) AS group_voter_count,
                    vgu.voter_group_user_id,
                    vg.voter_group_id,
                    vgu.voter_group_user__name,
                    vgu.voter_group_user_contact_number
                FROM tbl_voter_group vg
                LEFT JOIN tbl_voter v ON vg.voter_group_id = v.voter_voter_group_id
                LEFT JOIN tbl_voter_group_user vgu ON vg.voter_group_voter_group_user_id = vgu.voter_group_user_id
                GROUP BY
                    vg.voter_group_name,
                    vgu.voter_group_user_id,
                    vgu.voter_group_user__name,
                    vgu.voter_group_user_contact_number,
                    vg.voter_group_id
                ORDER BY
                    vg.voter_group_name,
                    vgu.voter_group_user__name
                """
                cursor.execute(query)
                group_details = cursor.fetchall()
 
            if group_details:
                group_users = [
                    {
                        'voter_group_name': voter_group_name,
                        'group_voter_count': group_voter_count,
                        'voter_group_user_id': voter_group_user_id,
                        'voter_group_id': voter_group_id,
                        'group_user_name': group_user_name,
                        'group_user_contact': group_user_contact
                    }
                    for (voter_group_name, group_voter_count, voter_group_user_id, voter_group_id, group_user_name, group_user_contact) in group_details
                ]
                return JsonResponse(group_users, safe=False, status=200)
            else:
                return JsonResponse({'message': 'No voter groups found.'}, status=200)
 
        except Exception as e:
            logging.error(f"Error fetching voter group details: {str(e)}", exc_info=True)
            return JsonResponse({'error': 'An error occurred while fetching voter group details.'}, status=500)
 
    return JsonResponse({'error': 'Invalid request method. Use GET.'}, status=405)
 


# # vote confirmation by voter group user wise
 
@csrf_exempt
def get_voters_by_confirmation(request, voter_group_user_id, confirmation_id):
    if request.method == 'GET':
        try:
            if confirmation_id not in ['1', 'null', '2']:
                return JsonResponse({'error': 'Invalid confirmation_id, must be "1", "null", or "2"'}, status=400)
 
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT voter_group_id
                    FROM tbl_voter_group
                    WHERE voter_group_voter_group_user_id = %s
                """, [voter_group_user_id])
 
                group_id_result = cursor.fetchone()
 
                if not group_id_result:
                    return JsonResponse({'error': 'No group found for this user'}, status=404)
 
                voter_group_id = group_id_result[0]
 
                if confirmation_id == '1':
                    confirmation_condition = 'voter_vote_confirmation_id = 1'
                else:
                    confirmation_condition = 'voter_vote_confirmation_id IS NULL OR voter_vote_confirmation_id = 2'
 
                cursor.execute(f"""
                    SELECT v.voter_id, v.voter_name, v.voter_name_mar, v.voter_vote_confirmation_id, v.voter_favour_id, v.voter_serial_number, v.voter_id_card_number
                    FROM tbl_voter v
                    WHERE v.voter_voter_group_id = %s AND ({confirmation_condition})
                """, [voter_group_id])
 
                voters = cursor.fetchall()
 
                voters_list = [
                    {
                        'voter_id': voter[0],
                        'voter_name': voter[1],
                        'voter_name_mar': voter[2],
                        'voter_confirmation_id': voter[3],
                        'voter_favour_id': voter[4],
                        'voter_serial_number': voter[5],
                        'voter_id_card_number': voter[6]
                    }
                    for voter in voters
                ]
 
                return JsonResponse(voters_list, safe=False, status=200)
 
        except Exception as e:
            logging.error(f"Error fetching voters by confirmation status: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)



# get user by town type
@csrf_exempt
def get_users_by_town_area_type(request, town_area_type_id):
    if request.method == 'GET':
        try:
            if town_area_type_id not in [1, 2]:
                return JsonResponse({'error': 'Invalid town_area_type_id. It must be 1 (Urban) or 2 (Rural).'}, status=400)
 
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT u.user_id, u.user_name, u.user_phone
                    FROM tbl_user u
                    JOIN tbl_user_booth ub ON u.user_id = ub.user_booth_user_id
                    JOIN tbl_booth b ON ub.user_booth_booth_id = b.booth_id
                    JOIN tbl_town t ON b.booth_town_id = t.town_id
                    WHERE t.town_area_type_id = %s
                    """, [town_area_type_id]
                )
               
                users = cursor.fetchall()
 
            if not users:
                return JsonResponse({'message': 'No users found for the given town area type.'}, status=200)
 
            user_list = [
                {
                    'user_id': row[0],
                    'user_name': row[1],
                    'user_phone': row[2],
                } for row in users
            ]
           
            return JsonResponse({'users': user_list}, status=200)
 
        except Exception as e:
            logging.error(f"Error fetching users by town area type: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method. Use GET method.'}, status=405)


# # urb rur wise booth slow activity
 
 
@csrf_exempt
def get_voter_count_by_town_area_type(request, town_area_type_id=None):
    if request.method == 'GET':
        try:
            if town_area_type_id and town_area_type_id not in [1, 2]:
                return JsonResponse({'error': 'Invalid town_area_type_id. Must be 1 (Urban) or 2 (Rural).'}, status=400)
 
            with connection.cursor() as cursor:
                if town_area_type_id:
                    cursor.execute(
                        """
                        SELECT town_id
                        FROM tbl_town
                        WHERE town_area_type_id = %s
                        """, [town_area_type_id]
                    )
                else:
                    cursor.execute(
                        """
                        SELECT town_id
                        FROM tbl_town
                        """
                    )
 
                town_ids = [row[0] for row in cursor.fetchall()]
 
            if not town_ids:
                return JsonResponse({'message': 'No towns found for the given filters.'}, status=200)
 
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    SELECT
                        b.booth_name,
                        GROUP_CONCAT(DISTINCT u.user_name SEPARATOR ', ') AS booth_user_names,  -- Concatenate unique user names
                        GROUP_CONCAT(DISTINCT u.user_phone SEPARATOR ', ') AS booth_user_phones,  -- Concatenate unique user phones
                        (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id) AS voter_count, -- Count voters per booth
                        (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id AND voter_favour_id = 1) AS favor_count, -- Favor voters
                        (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id AND voter_favour_id = 2) AS non_favor_count, -- Non-favor voters
                        (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id AND voter_favour_id = 3) AS not_confirm_count, -- Not confirmed voters
                        (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id AND voter_vote_confirmation_id = 1 AND voter_favour_id = 1) AS favor_voted, -- Favor voted
                        (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id AND voter_vote_confirmation_id IN (0, 2) AND voter_favour_id = 1) AS favor_non_voted, -- Favor not voted
                        ROUND(
                            (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id AND voter_vote_confirmation_id = 1 AND voter_favour_id = 1) * 100.0 /
                            NULLIF(
                                (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id AND voter_vote_confirmation_id IN (1, 0, 2)), 0
                            ), 2
                        ) AS favor_percentage,
                        (SELECT COUNT(voter_id) FROM tbl_voter WHERE voter_booth_id = b.booth_id AND voter_vote_confirmation_id IN (1, 0, 2)) AS total_voted_count
                    FROM tbl_booth b
                    LEFT JOIN tbl_user_booth ub ON b.booth_id = ub.user_booth_booth_id
                    LEFT JOIN tbl_user u ON ub.user_booth_user_id = u.user_id
                    JOIN tbl_town t ON b.booth_town_id = t.town_id
                    WHERE t.town_id IN %s  -- Filter by the list of towns of the specified area type (or all towns)
                    GROUP BY b.booth_id, b.booth_name

                    """, [tuple(town_ids)]  
                )
 
                booths_voter_count = cursor.fetchall()
 
            if not booths_voter_count:
                return JsonResponse({'message': 'No booths or voters found for the given filters.'}, status=200)
 
            booth_data = {}
 
            for row in booths_voter_count:
                booth_name = row[0]
                user_names = row[1] if row[1] else "No User"  
                user_phones = row[2] if row[2] else "No Phone"  
                voter_count = row[3]
                favor_count = row[4]
                non_favor_count = row[5]
                not_confirm_count = row[6]
                favor_voted = row[7]
                favor_non_voted = row[8]
                favor_percentage = row[9]
                total_voted_count = row[10]
 
                if booth_name not in booth_data:
                    booth_data[booth_name] = {
                        'booth_name': booth_name,
                        'booth_user_names': user_names,  
                        'booth_user_phones': user_phones,  
                        'voter_count': voter_count,
                        'favor_count': favor_count,
                        'non_favor_count': non_favor_count,
                        'not_confirm_count': not_confirm_count,
                        'favor_voted': favor_voted,
                        'favor_non_voted': favor_non_voted,
                        'favor_percentage': favor_percentage,
                        'total_voted_count': total_voted_count
                    }
                else:
                    if user_names and user_names not in booth_data[booth_name]['booth_user_names']:
                        booth_data[booth_name]['booth_user_names'] += f", {user_names}"
                    if user_phones and user_phones not in booth_data[booth_name]['booth_user_phones']:
                        booth_data[booth_name]['booth_user_phones'] += f", {user_phones}"
 
            booth_voter_list = list(booth_data.values())
 
            response_data = {
                'booth_voter_counts': booth_voter_list,
                'booth_count': len(booth_voter_list)  # Count of booths
            }
 
            return JsonResponse(response_data, status=200)
 
        except Exception as e:
            logging.error(f"Error fetching voter count: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method. Use GET method.'}, status=405)

 
# @csrf_exempt
# def get_voter_count_by_town_area_type(request, town_area_type_id=None):
#     if request.method == 'GET':
#         try:
#             if town_area_type_id and town_area_type_id not in [0, 1, 2]:
#                 return JsonResponse({'error': 'Invalid town_area_type_id. Must be 0 (All), 1 (Urban), or 2 (Rural).'}, status=400)
 
#             with connection.cursor() as cursor:
#                 if town_area_type_id == 1:  
#                     cursor.execute(
#                         """
#                         SELECT town_id
#                         FROM tbl_town
#                         WHERE town_area_type_id = 1
#                         """
#                     )
#                 elif town_area_type_id == 2:  
#                     cursor.execute(
#                         """
#                         SELECT town_id
#                         FROM tbl_town
#                         WHERE town_area_type_id = 2
#                         """
#                     )
#                 elif town_area_type_id == 0 or not town_area_type_id: 
#                     cursor.execute(
#                         """
#                         SELECT town_id
#                         FROM tbl_town
#                         """
#                     )
 
#                 town_ids = [row[0] for row in cursor.fetchall()]
 
#             if not town_ids:
#                 return JsonResponse({'message': 'No towns found for the given filters.'}, status=200)
 
#             with connection.cursor() as cursor:
#                 cursor.execute(
#                     f"""
#                     SELECT
#                         b.booth_name,
#                         GROUP_CONCAT(DISTINCT u.user_name SEPARATOR ', ') AS booth_user_names,  -- Concatenate unique user names
#                         GROUP_CONCAT(DISTINCT u.user_phone SEPARATOR ', ') AS booth_user_phones,  -- Concatenate unique user phones
#                         COUNT(v.voter_id) AS voter_count,
#                         COUNT(CASE WHEN v.voter_favour_id = 1 THEN 1 END) AS favor_count,
#                         COUNT(CASE WHEN v.voter_favour_id = 2 THEN 1 END) AS non_favor_count,
#                         COUNT(CASE WHEN v.voter_favour_id = 3 THEN 1 END) AS not_confirm_count,
#                         COUNT(CASE WHEN v.voter_vote_confirmation_id = 1 AND v.voter_favour_id = 1 THEN 1 END) AS favor_voted,
#                         COUNT(CASE WHEN v.voter_vote_confirmation_id IN (0, 2) AND v.voter_favour_id = 1 THEN 1 END) AS favor_non_voted,
#                         ROUND((COUNT(CASE WHEN v.voter_vote_confirmation_id = 1 AND v.voter_favour_id = 1 THEN 1 END) * 100.0) /
#                               NULLIF(COUNT(CASE WHEN v.voter_vote_confirmation_id IN (1, 0, 2) THEN 1 END), 0), 2) AS favor_percentage,
#                         COUNT(CASE WHEN v.voter_vote_confirmation_id IN (1, 0, 2) THEN 1 END) AS total_voted_count
#                     FROM tbl_booth b
#                     LEFT JOIN tbl_user_booth ub ON b.booth_id = ub.user_booth_booth_id
#                     LEFT JOIN tbl_user u ON ub.user_booth_user_id = u.user_id
#                     JOIN tbl_town t ON b.booth_town_id = t.town_id
#                     LEFT JOIN tbl_voter v ON b.booth_id = v.voter_booth_id
#                     LEFT JOIN tbl_favour f ON v.voter_favour_id = f.favour_id
#                     WHERE t.town_id IN %s  -- Filter by the list of towns of the specified area type (or all towns)
#                     GROUP BY b.booth_id, b.booth_name
#                     """, [tuple(town_ids)]  
#                 )
 
#                 booths_voter_count = cursor.fetchall()
 
#             if not booths_voter_count:
#                 return JsonResponse({'message': 'No booths or voters found for the given filters.'}, status=200)
 
#             booth_data = {}
 
#             for row in booths_voter_count:
#                 booth_name = row[0]
#                 user_names = row[1] if row[1] else "No User" 
#                 user_phones = row[2] if row[2] else "No Phone"  
#                 voter_count = row[3]
#                 favor_count = row[4]
#                 non_favor_count = row[5]
#                 not_confirm_count = row[6]
#                 favor_voted = row[7]
#                 favor_non_voted = row[8]
#                 favor_percentage = row[9]
#                 total_voted_count = row[10]
 
#                 if booth_name not in booth_data:
#                     booth_data[booth_name] = {
#                         'booth_name': booth_name,
#                         'booth_user_names': user_names,  
#                         'booth_user_phones': user_phones,  
#                         'voter_count': voter_count,
#                         'favor_count': favor_count,
#                         'non_favor_count': non_favor_count,
#                         'not_confirm_count': not_confirm_count,
#                         'favor_voted': favor_voted,
#                         'favor_non_voted': favor_non_voted,
#                         'favor_percentage': favor_percentage,
#                         'total_voted_count': total_voted_count
#                     }
#                 else:
#                     if user_names and user_names not in booth_data[booth_name]['booth_user_names']:
#                         booth_data[booth_name]['booth_user_names'] += f", {user_names}"
#                     if user_phones and user_phones not in booth_data[booth_name]['booth_user_phones']:
#                         booth_data[booth_name]['booth_user_phones'] += f", {user_phones}"
 
#             booth_voter_list = list(booth_data.values())
 
#             response_data = {
#                 'booth_voter_counts': booth_voter_list,
#                 'booth_count': len(booth_voter_list)  
#             }
 
#             return JsonResponse(response_data, status=200)
 
#         except Exception as e:
#             logging.error(f"Error fetching voter count: {str(e)}")
#             return JsonResponse({'error': str(e)}, status=500)
 
#     return JsonResponse({'error': 'Invalid request method. Use GET method.'}, status=405)
  

 # generate booth user favour count
def truncate_text(text, max_width, pdf):
    """
    Truncates text to fit within a specified width.

    :param text: Text to truncate
    :param max_width: Maximum width for the text
    :param pdf: ReportLab canvas object for measuring text width
    :return: Truncated text with ellipsis if necessary
    """
    if pdf.stringWidth(text, "Helvetica", 10) <= max_width:
        return text
    while pdf.stringWidth(text + "...", "Helvetica", 10) > max_width:
        text = text[:-1]
    return text + "..."


def get_voter_count_pdf(request, town_area_type_id=None):
    try:
        voter_data_response = get_voter_count_by_town_area_type(request, town_area_type_id)
        if voter_data_response.status_code != 200:
            return voter_data_response 

        voter_data = json.loads(voter_data_response.content.decode('utf-8')).get('booth_voter_counts', [])

        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.setTitle("Voter Count Report")

        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawString(50, 750, "Voter Count Report")
        pdf.setFont("Helvetica", 12)
        pdf.drawString(50, 730, f"Town Area Type ID: {town_area_type_id if town_area_type_id else 'All'}")

        headers = ["Booth User Names", "Phone No.", "Voter Count", "Favor", "Against", "Doubted"]
        column_positions = [30, 210, 310, 380, 450, 520]  
        column_widths = [180, 100, 70, 70, 70, 70]  
        y_position = 700  

        pdf.setFont("Helvetica-Bold", 10)  
        for i, header in enumerate(headers):
            wrapped_header = truncate_text(header, column_widths[i] - 10, pdf)
            pdf.drawString(column_positions[i] + 5, y_position - 10, wrapped_header)  
            pdf.rect(column_positions[i], y_position - 20, column_widths[i], 20)  

        pdf.setFont("Helvetica", 10)  
        y_position -= 40 
        row_height = 20  

        for booth in voter_data:
            if y_position < 50:  
                pdf.showPage()
                y_position = 750
                pdf.setFont("Helvetica-Bold", 10)  
                for i, header in enumerate(headers):
                    wrapped_header = truncate_text(header, column_widths[i] - 10, pdf)
                    pdf.drawString(column_positions[i] + 5, y_position - 10, wrapped_header)
                    pdf.rect(column_positions[i], y_position - 20, column_widths[i], 20)
                y_position -= 40  

            booth_user_names = booth.get('booth_user_names', 'N/A')
            booth_user_phones = booth.get('booth_user_phones', 'N/A')

            booth_user_names_list = booth_user_names.split(', ') if booth_user_names != 'N/A' else []
            booth_user_phones_list = booth_user_phones.split(', ') if booth_user_phones != 'N/A' else []

            max_lines = max(len(booth_user_names_list), len(booth_user_phones_list))
            
            for i in range(max_lines):
                user_name = booth_user_names_list[i] if i < len(booth_user_names_list) else 'N/A'
                user_phone = booth_user_phones_list[i] if i < len(booth_user_phones_list) else 'N/A'

                booth_user_names_wrapped = truncate_text(user_name, column_widths[0] - 10, pdf)
                booth_user_phones_wrapped = truncate_text(user_phone, column_widths[1] - 10, pdf)

                cell_data = [
                    booth_user_names_wrapped,
                    booth_user_phones_wrapped,
                    str(booth.get('voter_count', 0)),
                    str(booth.get('favor_count', 0)),
                    str(booth.get('non_favor_count', 0)),
                    str(booth.get('not_confirm_count', 0)),
                ]

                for i, data in enumerate(cell_data):
                    pdf.drawString(column_positions[i] + 5, y_position + 5, data)
                    pdf.rect(column_positions[i], y_position, column_widths[i], row_height)  

                y_position -= row_height 

                if y_position < 50:  
                    pdf.showPage()
                    y_position = 750
                    pdf.setFont("Helvetica-Bold", 10)  
                    for i, header in enumerate(headers):
                        wrapped_header = truncate_text(header, column_widths[i] - 10, pdf)
                        pdf.drawString(column_positions[i] + 5, y_position - 10, wrapped_header)
                        pdf.rect(column_positions[i], y_position - 20, column_widths[i], 20)
                    y_position -= 40  

        pdf.save()

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="voter_count_report.pdf"'
        return response

    except Exception as e:
        logging.error(f"Error generating PDF: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
    
    
# all favour wise voter list

@csrf_exempt
def favour_wise_voter_list(request, favor_id):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT voter_id, voter_name, voter_name_mar,voter_favour_id,voter_serial_number,voter_id_card_number
                    FROM tbl_voter
                    WHERE voter_favour_id = %s
                    """, [favor_id]
                )
               
                voters = cursor.fetchall()
 
            if not voters:
                return JsonResponse({'message': 'No voters found for this favor_id.'}, status=404)
 
            voter_list = [{'voter_id': row[0], 'voter_name': row[1], 'voter_name_mar': row[2], 'voter_favour_id': row[3], 'voter_serial_number':row[4], 'voter_id_card_number':row[5]} for row in voters]
 
            return JsonResponse({
                # 'message': 'Voters retrieved successfully!',
                # 'favor_id': favor_id,
                'voters': voter_list
            }, status=200)
 
        except Exception as e:
            logging.error(f"Error retrieving voters by favor_id: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)
 
# # all voted voters list 

@csrf_exempt
def get_voters_by_vote_status(request, status):
    if request.method == 'GET':
        try:
            if status not in [1, 2]:
                return JsonResponse({'error': 'Invalid status value. Use 1 for voted or 2 for non-voted.'}, status=400)
 
            if status == 1:
                condition = "voter_vote_confirmation_id = 1"
            else:
                condition = "voter_vote_confirmation_id IS NULL"
 
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    SELECT voter_id, voter_name, favour_id, booth_id, town_id
                    FROM vw_voter_list
                    WHERE {condition}
                    """
                )
               
                voters = cursor.fetchall()
 
            voter_list = [{'voter_id': row[0], 'voter_name': row[1],
                           'voter_favour_id': row[2], 'voter_booth_id': row[3], 'voter_town_id': row[4]}
                          for row in voters]
 
            return JsonResponse({
                'status': 'success',
                'voters': voter_list
            }, status=200)
 
        except Exception as e:
            logging.error(f"Error fetching voters by vote status: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method, only GET is allowed.'}, status=405)


# all favour voter list with booth name
@csrf_exempt
def get_voters_by_favour_id(request, favour_id):
    if request.method == 'GET':
        try:
            if favour_id != 1:
                return JsonResponse({'error': 'Invalid favour_id. This API only supports favour_id = 1.'}, status=400)

            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    SELECT voter_id, voter_name, booth_name
                    FROM vw_voter_list
                    WHERE favour_id = %s
                    """, [favour_id]
                )

                voters = cursor.fetchall()

            voter_list = [{'voter_id': row[0], 'voter_name': row[1], 'booth_name': row[2]} for row in voters]
            total_voters = len(voter_list)

            if request.GET.get('format') == 'pdf':
                pass

            return JsonResponse({
                'status': 'success',
                'total_voters': total_voters,
                'voters': voter_list
            }, status=200)

        except Exception as e:
            logging.error(f"Error fetching voters by favour_id: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method, only GET is allowed.'}, status=405)


@csrf_exempt
def generate_pdf_by_favour_id(request, favour_id):
    try:
        if favour_id != 1:
            return JsonResponse({'error': 'Invalid favour_id. This API only supports favour_id = 1.'}, status=400)

        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT voter_id, voter_name, booth_name
                FROM vw_voter_list
                WHERE favour_id = %s
                """, [favour_id]
            )
            voters = cursor.fetchall()

        voter_list = [{'voter_id': row[0], 'voter_name': row[1], 'booth_name': row[2]} for row in voters]
        total_voters = len(voter_list)

        return generate_pdf_by_favour_id(voter_list, total_voters)

    except Exception as e:
        logging.error(f"Error generating PDF by favour_id: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
def get_town_wise_voter_percentage(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        t.town_name,
                        COUNT(v.voter_id) AS voter_count,
                        ROUND((COUNT(v.voter_id) * 100.0) / (SELECT COUNT(*) FROM tbl_voter), 2) AS voter_percentage,
                        t.town_id
                    FROM tbl_town AS t
                    LEFT JOIN tbl_voter AS v
                    ON t.town_id = v.voter_town_id
                    GROUP BY t.town_id, t.town_name
                    ORDER BY t.town_id;
                """)
                
                results = cursor.fetchall()

            town_voter_data = [
                {
                    "town_name": row[0],
                    "voter_count": row[1],
                    "voter_percentage": row[2],
                    "town_id":row[3],
                }
                for row in results
            ]

            return JsonResponse({
                "town_voter_statistics": town_voter_data,
            }, status=200)

        except Exception as e:
            logging.error(f"Error fetching town voter statistics: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


 
# Update contact number to each family member of a voter for total groups
@csrf_exempt
def update_voters_by_existing_family_contact(request):
    if request.method == 'POST':
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT family_group_id, family_group_contact_no
                    FROM tbl_family_group
                    WHERE family_group_contact_no IS NOT NULL
                    """
                )
                family_groups = cursor.fetchall()
 
            if not family_groups:
                return JsonResponse({'error': 'No family groups with valid contact numbers found'}, status=404)
 
            for family_group_id, family_contact_number in family_groups:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE tbl_voter
                        SET voter_contact_number = %s
                        WHERE voter_group_id = %s
                        """,
                        [family_contact_number, family_group_id]
                    )
 
            return JsonResponse({
                'message': 'Voter contact numbers updated successfully',
                'updated_family_groups': [
                    {'family_group_id': fg[0], 'contact_number': fg[1]} for fg in family_groups
                ]
            }, status=200)
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid method'}, status=405)
 
 
 # Update contact number to each family member of a voter for a perticular group

@csrf_exempt
def update_voters_by_existing_family_contact(request, family_group_id):
    if request.method == 'POST':
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT family_group_contact_no
                    FROM tbl_family_group
                    WHERE family_group_id = %s
                    AND family_group_contact_no IS NOT NULL
                    """,
                    [family_group_id]
                )
                family_group = cursor.fetchone()
 
            if not family_group:
                return JsonResponse({'error': 'No contact number found for the specified family group'}, status=404)
 
            family_contact_number = family_group[0]
 
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT voter_id, voter_name, voter_contact_number
                    FROM tbl_voter
                    WHERE voter_group_id = %s
                    """,
                    [family_group_id]
                )
                voters = cursor.fetchall()
 
            if not voters:
                return JsonResponse({'error': 'No voters found for the given family group'}, status=404)
 
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE tbl_voter
                    SET voter_contact_number = %s
                    WHERE voter_group_id = %s
                    """,
                    [family_contact_number, family_group_id]
                )
 
            return JsonResponse({
                'message': f'Voter contact numbers updated successfully for family group {family_group_id}',
                'updated_family_group': {
                    'family_group_id': family_group_id,
                    'contact_number': family_contact_number
                },
                'updated_voters': [
                    {'voter_id': voter[0], 'voter_name': voter[1], 'old_contact_number': voter[2]} for voter in voters
                ]
            }, status=200)
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid method'}, status=405)


# Asign voter cast 

class VoterCastAssignView(APIView):
    def post(self, request, *args, **kwargs):
        return self.handle_bulk_update(request)

    def put(self, request, *args, **kwargs):
        return self.handle_bulk_update(request)

    def handle_bulk_update(self, request):
        voter_ids = request.data.get('voter_ids', [])
        voter_cast_id = request.data.get('voter_cast_id', None)

        if not voter_ids or voter_cast_id is None:
            return Response(
                {"error": "voter_ids and voter_cast_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            updated_count = Voterlist.objects.filter(voter_id__in=voter_ids).update(voter_cast_id=voter_cast_id)

            return Response(
                {
                    "message": f"Successfully updated {updated_count} records.",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
# generate pdf by family group wise

@csrf_exempt
def generate_voter_pdf_family_group_id(request, family_group_id):
    if request.method == 'GET':
        try:
            if not family_group_id:
                return JsonResponse({'error': 'family_group_id is required'}, status=400)
 
            query = """
                SELECT
                    v.voter_id,
                    v.voter_name,
                    v.voter_parent_name,
                    v.voter_age,
                    v.voter_gender,
                    t.town_name,
                    b.booth_name
                FROM tbl_voter v
                JOIN tbl_town t ON v.voter_town_id = t.town_id
                JOIN tbl_booth b ON v.voter_booth_id = b.booth_id
                WHERE v.voter_group_id = %s
            """
 
            with connection.cursor() as cursor:
                cursor.execute(query, [family_group_id])
                voters = cursor.fetchall()
 
            if not voters:
                return JsonResponse({'message': 'No voters found for the given family group ID.'}, status=404)
 
            buffer = io.BytesIO()
 
            def draw_border(canvas_obj, doc):
                width, height = letter
                margin = 0.5 * inch
                canvas_obj.saveState()
                canvas_obj.setStrokeColorRGB(0, 0, 0)
                canvas_obj.setLineWidth(1)
                canvas_obj.rect(margin, margin, width - 2 * margin, height - 2 * margin)
                canvas_obj.restoreState()
 
            doc = SimpleDocTemplate(buffer, pagesize=letter)
 
            styles = getSampleStyleSheet()
            custom_style = ParagraphStyle(
                name='CustomStyle',
                parent=styles['Normal'],
                fontName='Helvetica',
                fontSize=12,
                leading=14,
                spaceAfter=12
            )
 
            elements = []
            for voter in voters:
                voter_id, voter_name, voter_parent_name, voter_age, voter_gender, town_name, booth_name = voter
 
                voter_text = (
                    f"<b>Voter ID:</b> {voter_id}<br/>"
                    f"<b>Name:</b> {voter_name}<br/>"
                    f"<b>Parent Name:</b> {voter_parent_name}<br/>"
                    f"<b>Age:</b> {voter_age}<br/>"
                    f"<b>Gender:</b> {voter_gender}<br/>"
                    f"<b>Town Name:</b> {town_name}<br/>"
                    f"<b>Booth Name:</b> {booth_name}<br/><br/>"
                )
 
                elements.append(Paragraph(voter_text, custom_style))
 
            doc.build(elements, onFirstPage=draw_border, onLaterPages=draw_border)
 
            pdf = buffer.getvalue()
            buffer.close()
            response = HttpResponse(pdf, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="family_group_{family_group_id}_voters.pdf"'
            return response
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)


# get zp circle info
@require_http_methods(["GET"])
def get_zp_circle_info(request, zp_circle_id=None):
    try:
        with connection.cursor() as cursor:
            if zp_circle_id:
                query = '''
                SELECT 
                    zp_circle.zp_circle_id AS zp_circle_id,
                    zp_circle.zp_circle_name AS zp_circle_name,
                    IFNULL(
                        GROUP_CONCAT(DISTINCT zp_circle_user.zp_circle_user_name SEPARATOR ', '),
                        "Unassigned"
                    ) AS zp_circle_user_name,
                    IFNULL(
                        GROUP_CONCAT(DISTINCT zp_circle_user.zp_circle_user_contact_number SEPARATOR ', '),
                        ""
                    ) AS zp_circle_user_contact_number
                FROM 
                    tbl_zp_circle AS zp_circle
                LEFT JOIN 
                    tbl_user_zp_circle AS user_zp_circle 
                ON 
                    user_zp_circle.user_zp_circle_zp_circle_id = zp_circle.zp_circle_id
                LEFT JOIN 
                    tbl_zp_circle_user AS zp_circle_user 
                ON 
                    user_zp_circle.user_zp_circle_id = zp_circle_user.zp_circle_user_id
                WHERE 
                    zp_circle.zp_circle_id = %s
                GROUP BY 
                    zp_circle.zp_circle_id, zp_circle.zp_circle_name
                '''
                cursor.execute(query, [zp_circle_id])
            else:
                query = '''
                SELECT 
                    zp_circle.zp_circle_id AS zp_circle_id,
                    zp_circle.zp_circle_name AS zp_circle_name,
                    IFNULL(
                        GROUP_CONCAT(DISTINCT zp_circle_user.zp_circle_user_name SEPARATOR ', '),
                        "Unassigned"
                    ) AS zp_circle_user_name,
                    IFNULL(
                        GROUP_CONCAT(DISTINCT zp_circle_user.zp_circle_user_contact_number SEPARATOR ', '),
                        ""
                    ) AS zp_circle_user_contact_number
                FROM 
                    tbl_zp_circle AS zp_circle
                LEFT JOIN 
                    tbl_user_zp_circle AS user_zp_circle 
                ON 
                    user_zp_circle.user_zp_circle_zp_circle_id = zp_circle.zp_circle_id
                LEFT JOIN 
                    tbl_zp_circle_user AS zp_circle_user 
                ON 
                    user_zp_circle.user_zp_circle_id = zp_circle_user.zp_circle_user_id
                GROUP BY 
                    zp_circle.zp_circle_id, zp_circle.zp_circle_name
                '''
                cursor.execute(query)

            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]

        zp_circle_list = [dict(zip(columns, row)) for row in results]
        return JsonResponse(zp_circle_list, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# get ps circle info
@require_http_methods(["GET"])
def get_panchayat_samiti_circle_info(request, panchayat_samiti_circle_id=None):
    try:
        with connection.cursor() as cursor:
            if panchayat_samiti_circle_id:
                cursor.execute('''
                    SELECT 
                        psc.panchayat_samiti_circle_id AS panchayat_samiti_circle_id, 
                        psc.panchayat_samiti_circle_name AS panchayat_samiti_circle_name,
                        pscu.panchayat_samiti_circle_user_name AS panchayat_samiti_circle_user_name,
                        pscu.panchayat_samiti_circle_user_contact_number AS panchayat_samiti_circle_user_contact_number
                    FROM 
                        tbl_panchayat_samiti_circle psc
                    LEFT JOIN 
                        tbl_user_panchayat_samiti_circle upsc 
                        ON psc.panchayat_samiti_circle_id = upsc.user_panchayat_samiti_circle_panchayat_samiti_circle_id
                    LEFT JOIN 
                        tbl_panchayat_samiti_circle_user pscu 
                        ON upsc.user_panchayat_samiti_circle_id = pscu.panchayat_samiti_circle_user_id
                    WHERE 
                        psc.panchayat_samiti_circle_id = %s
                ''', [panchayat_samiti_circle_id])
            else:
                cursor.execute('''
                    SELECT 
                        psc.panchayat_samiti_circle_id AS panchayat_samiti_circle_id, 
                        psc.panchayat_samiti_circle_name AS panchayat_samiti_circle_name,
                        pscu.panchayat_samiti_circle_user_name AS panchayat_samiti_circle_user_name,
                        pscu.panchayat_samiti_circle_user_contact_number AS panchayat_samiti_circle_user_contact_number
                    FROM 
                        tbl_panchayat_samiti_circle psc
                    LEFT JOIN 
                        tbl_user_panchayat_samiti_circle upsc 
                        ON psc.panchayat_samiti_circle_id = upsc.user_panchayat_samiti_circle_panchayat_samiti_circle_id
                    LEFT JOIN 
                        tbl_panchayat_samiti_circle_user pscu 
                        ON upsc.user_panchayat_samiti_circle_id = pscu.panchayat_samiti_circle_user_id
                ''')
            
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
        
        psc_circle_list = [dict(zip(columns, row)) for row in results]
        return JsonResponse(psc_circle_list, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    
    
    
# all users login view
class common_login(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user_phone = int(serializer.validated_data.get('user_phone'))
            user_password = serializer.validated_data.get('user_password')
 
            def check_user(model, phone_field, password_field, user_id_field, table_name):
                """
                Utility function to perform checks in a specific table.
                Returns a dictionary with table_name and user_id if successful, otherwise None.
                """
                user = model.objects.filter(**{phone_field: user_phone}).first()
                print(user)
                if user and check_password(user_password, getattr(user, password_field)):
                    return {
                        "user_id": getattr(user, user_id_field),
                        "table_name": table_name,
                    }
                return None
 
            try:
                checks = [
                    (Politician, "politician_contact_number", "politician_password", "politician_id", "tbl_politician"),
                    (Zp_circle_user, "zp_circle_user_contact_number", "zp_circle_user_password", "zp_circle_user_id", "tbl_zp_circle_user"),
                    (Panchayat_samiti_circle_user, "panchayat_samiti_circle_user_name", "panchayat_samiti_circle_user_password", "panchayat_samiti_circle_user_id", "tbl_panchayat_samiti_circle_user"),
                    (Town_user, "town_user_contact_number", "town_user_password", "town_user_id", "tbl_town_user"),
                    (User, "user_phone", "user_password", "user_id", "tbl_user"),
                    (PrabhagUser, "prabhag_user_contact_number", "prabhag_user_password", "prabhag_user_id", "tbl_prabhag_user"),
                    # (VoterGroupUser, "voter_group_user_contact_number", "voter_group_user_password", "voter_group_user_id", "tbl_voter_group_user"),
                ]
 
                user_data = None
                for model, phone_field, password_field, user_id_field, table_name in checks:
                    user_data = check_user(model, phone_field, password_field, user_id_field, table_name)
                    if user_data:
                        break
 
                if user_data:
                    payload = {
                        "user_id": user_data["user_id"],
                        "table_name": user_data["table_name"],
                        "exp": datetime.utcnow() + timedelta(hours=24),  
                    }
                    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
 
                    response_data = {
                        "message": "Login Successful",
                        "user_id": user_data["user_id"],
                        "table_name": user_data["table_name"],
                        "token": token,
                    }
 
                    request.session["user_id"] = user_data["user_id"]
 
                    return Response(response_data, status=status.HTTP_200_OK)
 
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
 
            except Exception as e:
                return Response({"message": "An error occurred", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
        
# get zp user user info

class ZpCircleUserListView(APIView):
    def get(self, request, user_id=None):
        """
        Fetch all users if no user_id is provided; otherwise, fetch a specific user.
        """
        with connection.cursor() as cursor:
            cursor.callproc('GetZpCircleUsers', [user_id])
            result = cursor.fetchall()
        
        column_names = [
            "zp_circle_user_id",
            "zp_circle_user_name",
            "zp_circle_user_contact_number",
            "zp_circle_name"
        ]
        
        data = [dict(zip(column_names, row)) for row in result]
        
        return JsonResponse(data, safe=False)
    
    
# get ps user user info

class PanchayatSamitiCircleUserListView(APIView):
    def get(self, request, user_id=None):
        """
        Fetch all users if no user_id is provided; otherwise, fetch a specific user.
        """
        with connection.cursor() as cursor:
            cursor.callproc('GetPanchayatSamitiCircleUsers', [user_id])
            result = cursor.fetchall()
        
        column_names = [
            "panchayat_samiti_circle_user_id",
            "panchayat_samiti_circle_user_name",
            "panchayat_samiti_circle_user_contact_number",
            "panchayat_samiti_circle_names"
        ]
        
        data = [dict(zip(column_names, row)) for row in result]
        
        return JsonResponse(data, safe=False)
    
# Generate zp user user info pdf

class ZpCircleUserListPDFView(APIView):
    def get(self, request, user_id=None):
        """
        Fetch all users if no user_id is provided; otherwise, fetch a specific user and generate PDF.
        """
        with connection.cursor() as cursor:
            cursor.callproc('GetZpCircleUsers', [user_id])
            result = cursor.fetchall()
        
        column_names = [
            "zp_circle_user_id",
            "zp_circle_user_name",
            "zp_circle_user_contact_number",
            "zp_circle_name"
        ]
        
        data = [dict(zip(column_names, row)) for row in result]

        buffer = BytesIO()
        pdf = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=0.5*inch, rightMargin=0.5*inch, 
                                topMargin=0.5*inch, bottomMargin=0.5*inch)
        elements = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(name='Title', fontSize=16, spaceAfter=14)
        title = Paragraph("ZP Circle User List", title_style)
        elements.append(title)

        table_data = [['S/N', 'User Name', 'Contact Number', 'ZP Circle Name']]
        
        for i, row in enumerate(data, 1):
            table_data.append([str(i), row['zp_circle_user_name'], row['zp_circle_user_contact_number'], row['zp_circle_name']])

        col_widths = [0.5 * inch, 2.5 * inch, 1.5 * inch, 2.5 * inch]

        table = Table(table_data, colWidths=col_widths, hAlign='LEFT')

        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),  
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),  
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))

        elements.append(table)

        pdf.build(elements)

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="zp_circle_user_list.pdf"'
        return response
    
# Generate PDF for PS Circle User List

class PanchayatSamitiCircleUserListPDFView(APIView):
    def get(self, request, user_id=None):
        """
        Fetch all users if no user_id is provided; otherwise, fetch a specific user and generate PDF.
        """
        with connection.cursor() as cursor:
            cursor.callproc('GetPanchayatSamitiCircleUsers', [user_id])
            result = cursor.fetchall()
        
        column_names = [
            "panchayat_samiti_circle_user_id",
            "panchayat_samiti_circle_user_name",
            "panchayat_samiti_circle_user_contact_number",
            "panchayat_samiti_circle_names"
        ]
        
        data = [dict(zip(column_names, row)) for row in result]

        buffer = BytesIO()
        pdf = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=0.5*inch, rightMargin=0.5*inch, 
                                topMargin=0.5*inch, bottomMargin=0.5*inch)
        elements = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(name='Title', fontSize=16, spaceAfter=14)
        title = Paragraph("Panchayat Samiti Circle User List", title_style)
        elements.append(title)

        table_data = [['S/N', 'User Name', 'Contact Number', 'Panchayat Samiti Circle Names']]
        
        for i, row in enumerate(data, 1):
            table_data.append([str(i), row['panchayat_samiti_circle_user_name'], row['panchayat_samiti_circle_user_contact_number'], row['panchayat_samiti_circle_names']])

        col_widths = [0.5 * inch, 2.5 * inch, 1.5 * inch, 2.5 * inch]

        table = Table(table_data, colWidths=col_widths, hAlign='LEFT')

        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey), 
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'), 
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),  
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))

        elements.append(table)

        pdf.build(elements)

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="panchayat_samiti_circle_user_list.pdf"'
        return response
    
 
# Edit and Delete zp circle users 
@csrf_exempt
def manage_ps_circle_user(request, panchayat_samiti_circle_user_id):
    if request.method == 'DELETE':
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM tbl_panchayat_samiti_circle_user WHERE panchayat_samiti_circle_user_id = %s", [panchayat_samiti_circle_user_id])
                rows_affected = cursor.rowcount
                cursor.execute("DELETE FROM tbl_user_panchayat_samiti_circle WHERE user_panchayat_samiti_circle_id = %s", [panchayat_samiti_circle_user_id])
 
                if rows_affected == 0:
                    return JsonResponse({'message': 'Panchayat samiti circle user not found'}, status=404)
 
                return JsonResponse({'message': 'Panchayat samiti circle user deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
 
            panchayat_samiti_circle_user_name = None
            panchayat_samiti_circle_user_password = None
            panchayat_samiti_circle_user_contact_number = None
            panchayat_samiti_circle_ids = None
 
            if 'panchayat_samiti_circle_user_name' in data:
                panchayat_samiti_circle_user_name = data.get('panchayat_samiti_circle_user_name')
            if 'panchayat_samiti_circle_user_password' in data:
                panchayat_samiti_circle_user_password = data.get('panchayat_samiti_circle_user_password')
            if 'panchayat_samiti_circle_user_contact_number' in data:
                panchayat_samiti_circle_user_contact_number = data.get('panchayat_samiti_circle_user_contact_number')
            if 'panchayat_samiti_circle_ids' in data:
                panchayat_samiti_circle_ids = data.get('panchayat_samiti_circle_ids', [])
 
            with connection.cursor() as cursor:
                update_query = "UPDATE tbl_panchayat_samiti_circle_user SET"
                params = []
 
                if panchayat_samiti_circle_user_name:
                    update_query += " panchayat_samiti_circle_user_name = %s,"
                    params.append(panchayat_samiti_circle_user_name)
                if panchayat_samiti_circle_user_password:
                    update_query += " panchayat_samiti_circle_user_password = %s,"
                    params.append(make_password(panchayat_samiti_circle_user_password))
                if panchayat_samiti_circle_user_contact_number:
                    update_query += " panchayat_samiti_circle_user_contact_number = %s,"
                    params.append(panchayat_samiti_circle_user_contact_number)
 
                update_query = update_query.rstrip(',') + " WHERE panchayat_samiti_circle_user_id = %s"
                params.append(panchayat_samiti_circle_user_id)
 
                cursor.execute(update_query, params)
                rows_affected = cursor.rowcount
 
                if rows_affected == 0:
                    return JsonResponse({'message': 'Panchayat samiti circle user not found'}, status=404)
 
                if panchayat_samiti_circle_ids is not None:
                    cursor.execute("DELETE FROM tbl_user_panchayat_samiti_circle WHERE user_panchayat_samiti_circle_id = %s", [panchayat_samiti_circle_user_id])
 
                    for panchayat_samiti_circle_id in panchayat_samiti_circle_ids:
                        cursor.execute("""
                            INSERT INTO tbl_user_panchayat_samiti_circle (user_panchayat_samiti_circle_id, user_panchayat_samiti_circle_panchayat_samiti_circle_id)
                            VALUES (%s, %s)
                        """, [panchayat_samiti_circle_user_id, panchayat_samiti_circle_id])
 
                return JsonResponse({'message': 'Panchayat samiti circle user updated successfully'}, status=200)
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
    
# # Edit and Delete ZP circle user details
@csrf_exempt
def manage_zp_circle_user(request, zp_circle_user_id):
    if request.method == 'DELETE':
        try:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM tbl_zp_circle_user WHERE zp_circle_user_id = %s", [zp_circle_user_id])
                rows_affected = cursor.rowcount
                cursor.execute("DELETE FROM tbl_user_zp_circle WHERE user_zp_circle_id = %s", [zp_circle_user_id])
 
                if rows_affected == 0:
                    return JsonResponse({'message': 'ZP circle user not found'}, status=404)
 
                return JsonResponse({'message': 'ZP circle user deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
 
            zp_circle_user_name = None
            zp_circle_user_password = None
            zp_circle_user_contact_number = None
            zp_circle_ids = None
 
            if 'zp_circle_user_name' in data:
                zp_circle_user_name = data.get('zp_circle_user_name')
            if 'zp_circle_user_password' in data:
                zp_circle_user_password = data.get('zp_circle_user_password')
            if 'zp_circle_user_contact_number' in data:
                zp_circle_user_contact_number = data.get('zp_circle_user_contact_number')
            if 'zp_circle_ids' in data:
                zp_circle_ids = data.get('zp_circle_ids', [])
 
            with connection.cursor() as cursor:
                update_query = "UPDATE tbl_zp_circle_user SET"
                params = []
 
                if zp_circle_user_name:
                    update_query += " zp_circle_user_name = %s,"
                    params.append(zp_circle_user_name)
                if zp_circle_user_password:
                    update_query += " zp_circle_user_password = %s,"
                    params.append(make_password(zp_circle_user_password))
                if zp_circle_user_contact_number:
                    update_query += " zp_circle_user_contact_number = %s,"
                    params.append(zp_circle_user_contact_number)
 
                update_query = update_query.rstrip(',') + " WHERE zp_circle_user_id = %s"
                params.append(zp_circle_user_id)
 
                cursor.execute(update_query, params)
                rows_affected = cursor.rowcount
 
                if rows_affected == 0:
                    return JsonResponse({'message': 'ZP circle user not found'}, status=404)
 
                if zp_circle_ids is not None:
                    cursor.execute("DELETE FROM tbl_user_zp_circle WHERE user_zp_circle_id = %s", [zp_circle_user_id])
 
                    for zp_circle_id in zp_circle_ids:
                        cursor.execute("""
                            INSERT INTO tbl_user_zp_circle (user_zp_circle_id, user_zp_circle_zp_circle_id)
                            VALUES (%s, %s)
                        """, [zp_circle_user_id, zp_circle_id])
 
                return JsonResponse({'message': 'ZP circle user updated successfully'}, status=200)
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
    
# get list of confirm voters by booth
def get_voted_list_by_booth(request, booth_id):

    voted_query = """
        SELECT voter_id, voter_name, voter_favour_id,voter_vote_confirmation_id, voter_booth_id
        FROM tbl_voter
        WHERE voter_vote_confirmation_id IS NOT NULL
        AND voter_booth_id = %s
    """
 
    with connection.cursor() as cursor:
        cursor.execute(voted_query, [booth_id])
        columns = [col[0] for col in cursor.description] 
        voters = [dict(zip(columns, row)) for row in cursor.fetchall()] 
 
    return JsonResponse(voters, safe=False)


# # Surname wise voter count
#---------------------------------------------------------------------- Surname wise voters version-1-----------------------------------------#
 
def get_surname_by_serial(serial_no=None):
    with connection.cursor() as cursor:
        if serial_no:

            cursor.execute("""
                SELECT surnames
                FROM total_surname_view
                WHERE serial_number = %s
            """, [serial_no])
            
            result = cursor.fetchone()
 
            if result:
                return result[0]
            return None
        else:
            cursor.execute("""
                SELECT * FROM total_surname_view;
            """)
            result = cursor.fetchall()
 
            if result:
                return {"surname_counts": [{"surname_id": row[0], "surname": row[1], "count": row[2]} for row in result], "type": "counts"}
            else:
                return {"error": "No surname data found.", "type": "error"}
 
def get_voter_ids_by_surname(surname):
    with connection.cursor() as cursor:
        cursor.execute("""
        SELECT voter_id
        FROM tbl_voter inner join voter_view on voter_id = voter_view_voter_id
            WHERE LOWER(memberlast) LIKE LOWER(%s);
    """, [f"{surname}"])
 
        result = cursor.fetchall()
 
    return [row[0] for row in result]
 
 
 
@csrf_exempt  
def surname_wise_voter_count(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            surname_ids = data.get('surname_ids', [])
           
            print(surname_ids)
           
            all_voter_ids = []  
 
            for surname_id in surname_ids:
                surname = get_surname_by_serial(surname_id)
 
                if surname:
                    voter_ids = get_voter_ids_by_surname(surname)
                    all_voter_ids.extend(voter_ids)
 
            return JsonResponse({
                "voter_ids": all_voter_ids,
                "total_count": len(all_voter_ids)
            })
 
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
 
    elif request.method == 'GET':
        surname_count_data = get_surname_by_serial()
 
        if surname_count_data.get("type") == "error":
            return JsonResponse({"error": surname_count_data["error"]}, status=404)
 
        return JsonResponse(surname_count_data["surname_counts"], safe=False)


def get_voter_details_by_surname(request, surname_id):
    surname = get_surname_by_serial(surname_id)
   
    if not surname:
        return JsonResponse({"error": "No surname found for the given surname_id."}, status=404)
   
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT voter_id, voter_name, voter_contact_number, voter_favour_id, voter_cast_id
            FROM tbl_voter
            INNER JOIN voter_view ON voter_id = voter_view_voter_id
            WHERE LOWER(memberlast) LIKE LOWER(%s)
        """, [f"{surname}"])
 
        result = cursor.fetchall()
 
    voter_details = [{"voter_id": row[0], "voter_name": row[1], "voter_contact_number": row[2], "voter_favour_id": row[3], "voter_cast_id": row[4]} for row in result] 
 
    if not voter_details:
        return JsonResponse({"error": "No voters found with the given surname."}, status=404)
 
    return JsonResponse(voter_details, safe=False)
 
 
# # generate surname wise voter count pdf
@csrf_exempt
def surname_wise_voter_count_pdf(request):
    if request.method == 'GET':
        surname_count_data = get_surname_by_serial()

        if surname_count_data.get("type") == "error":
            return JsonResponse({"error": surname_count_data["error"]}, status=404)

        surname_counts = surname_count_data.get("surname_counts", [])

        buffer = BytesIO()
        pdf = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(name='Title', fontSize=16, spaceAfter=14)
        title = Paragraph("All Surnames with Voter Counts", title_style)
        elements.append(title)

        table_data = [['S/N', 'Surname', 'Voter Count']]
        for i, surname_data in enumerate(surname_counts, start=1):
            table_data.append([i, surname_data['surname'], surname_data['count']])

        table = Table(table_data, colWidths=[50, 200, 100])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))

        elements.append(table)
        pdf.build(elements)

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="surname_voter_counts.pdf"'
        return response

    else:
        return JsonResponse({"error": "Only GET requests are allowed for this endpoint."}, status=405)




@csrf_exempt
def surname_wise_favour_caste_assign_voters(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        surname_ids = data.get('surname_ids', [])
        favour_id = data.get('favour_id', None)  
        caste_id = data.get('caste_id', None)
 
        success_msg = str()
        
        if favour_id is None and caste_id is None:
            return JsonResponse({"error": "Either favour_id or caste_id must be provided."}, status=400)
 
        api_url = 'http://192.168.1.38:8001/api/surname_wise_voter_count/'
 
        api_data = {
            'surname_ids': surname_ids
        }
 
        try:
            response = requests.post(api_url, json=api_data)
           
            if response.status_code == 200:
                response_data = response.json()
                print(response_data)
 
                if isinstance(response_data, dict) and 'voter_ids' in response_data:
                    all_voter_ids = response_data['voter_ids']
                   
                    if not all_voter_ids:
                        return JsonResponse({"error": "No voter_ids found for the given surname_ids."}, status=404)
 
                    surnames = []
                    for surname_id in surname_ids:
                        surname = get_surname_by_serial(surname_id)
                        if surname:
                            surnames.append(surname)
                   
                    if not surnames:
                        return JsonResponse({"error": "No valid surnames found for the given surname_ids."}, status=404)
 
                    update_fields = []
                    params = []
 
                    if favour_id is not None:
                        update_fields.append("voter_favour_id = %s")
                        params.append(favour_id)
                        success_msg = "Voter Favour ID updated successfully."
                    if caste_id is not None:
                        update_fields.append("voter_cast_id = %s")
                        params.append(caste_id)
                        success_msg = "Voter Caste ID updated successfully."
 
                    like_conditions = []
                    for surname in surnames:
                        like_conditions.append(f"LOWER(vv.memberlast) LIKE LOWER(%s)")
                        params.append(f"%{surname}%")
 
                    with connection.cursor() as cursor:
                        query = f"""
                                UPDATE tbl_voter AS v
                                INNER JOIN voter_view AS vv ON v.voter_id = vv.voter_view_voter_id
                                SET {', '.join(update_fields)}
                                WHERE ({' OR '.join(like_conditions)})
                                AND v.voter_id IN ({', '.join(['%s'] * len(all_voter_ids))})
                            """
                        params.extend(all_voter_ids)
                        cursor.execute(query, params)
 
                    return JsonResponse({"success": f"{success_msg}"}, status=200)
                else:
                    return JsonResponse({"error": "Invalid response structure from surname_wise_voter_count API."}, status=400)
            else:
                return JsonResponse({"error": "Failed to fetch data from surname_wise_voter_count API."}, status=response.status_code)
 
        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"Error making request: {str(e)}"}, status=500)