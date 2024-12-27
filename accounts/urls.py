
from django.urls import path
from django.conf.urls import handler404, handler500
from .views import register, login_view, AddBoothUser, SurnameWiseVoterList, VotedNonvotedList, TotalVoterListWithGroupId, RUExitPoll, GroupDetails, BoothWiseVoterListWithOnlyBID, PrabhagDetails, PrabhagUserList, AddPrabhagUser, PrabhagWiseVoterListWithID, PrabhagWiseVoterList, ZillaParishadCircleList, PanchayatSamitiCircleList, PrabhagWiseBoothList, TownCategory, GraminList, ShaharList, FamilyDetails, BoothWiseVoterList,BoothwiseSurname, BoothWiseVoterListWithID, TownWiseVoterListID, TownExitPoll, BoothExitPoll, FAQs, TownDetails, delete_town_user, delete_booth_user, religionwiseBoothVoterList, religionwiseTownVoterList, religionwiseTotalVoterList, castwiseBoothVoterList, castwiseTotalVoterList, castwiseTownVoterList, boothUserActivityLog, ActivityLog, logout_view, ContactUs, user_profile, dashboard, user_list, AddTownUser, ExitPoll, TownUserList, BoothDetails, BoothUser, navbar, index, TotalVoterList
from .views import EditPSUser, EditVoterDetails, EditBoothUser, EditTownUser, EditZPUser, EditPSUser
from .views import TownWiseVoterList
from .views import CastWiseVoter
from .views import AddZPUser, ZPUserList
from .views import AddPSUser, PSUserList
from .views import UnderCons

# Define a custom 404 handler
# handler404 = 'myapp.views.custom_page_not_found'
# handler500 = 'myapp.views.custom_server_error'

urlpatterns = [
    # Imp
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    # Main Pages
    # path('navbar/', navbar, name='navbar'),
    path('dashboard/', dashboard, name='dashboard'),
    path('user/', user_profile, name='user_profile'),

    # Zilla Parishad
    path('zillaparishadcirclelist/', ZillaParishadCircleList, name = 'ZillaParishadCircleList'),
    path('addzpuser/', AddZPUser, name='AddZPUser'),
    path('zpuserlist/', ZPUserList, name='ZPUserList'),

    # Panchayat Samiti
    path('panchayatsamiticirclelist/', PanchayatSamitiCircleList, name = 'PanchayatSamitiCircleList'),
    path('addpsuser/', AddPSUser, name='AddPSUser'),
    path('psuserlist/', PSUserList, name='PSUserList'),

    # Town
    path('towndetails/', TownDetails, name='TownDetails'),
    path('town_user/', AddTownUser, name='AddTownUser'),
    path('KaryakartaList/', TownUserList, name='KaryakartaList'),

    # Prabhag
    path('addprabhaguser/', AddPrabhagUser, name='AddPrabhagUser'),
    path('prabhaguserlist/', PrabhagUserList, name='PrabhagUserList'),
    path('prabhagdetails/', PrabhagDetails, name='PrabhagDetails'),
    path('prabhagwisevoterlist/', PrabhagWiseVoterList, name='PrabhagWiseVoterList'),
    path('prabhagwisevoterlist/<str:id>/', PrabhagWiseVoterListWithID, name='PrabhagWiseVoterListWithID'),

    # Booth
    path('boothdetails/', BoothDetails, name='BoothDetails'),
    path('add_booth_user/', AddBoothUser, name='AddBoothUser'),
    path('booth_user/', BoothUser, name='BoothUser'),

    # Group
    path('groupdetails/', GroupDetails, name='GroupDetails'),

    # Voter
    path('totalvoterlist/', TotalVoterList, name = 'TotalVoterList'),
    path('totalvoterlist/<str:id>/', TotalVoterListWithGroupId, name = 'TotalVoterListWithGroupId'),
    path('votednonvotedlist/', VotedNonvotedList, name = 'VotedNonvotedList'),
    path('surnamewisevoterlist/', SurnameWiseVoterList, name = 'SurnameWisevoterList'),
    path('boothwisesurname/', BoothwiseSurname, name = 'BoothwiseSurname'),

    path('townwisevoterlist/', TownWiseVoterList, name='TownWiseVoterList'),
    path('townwisevoterlist/<str:id>/', TownWiseVoterListID, name='TownWiseVoterListID'),

    path('boothwisevoterlist/', BoothWiseVoterList, name='BoothWiseVoterList'),
    path('boothwisevoterlist/<str:b_id>/', BoothWiseVoterListWithOnlyBID, name='BoothWiseVoterListWithOnlyBID'),
    path('boothwisevoterlist/<str:t_id>/<str:b_id>/', BoothWiseVoterListWithID, name='BoothWiseVoterListWithID'),

    # Religionwise
    path('religionwiseTotalVoterList/', religionwiseTotalVoterList, name ='ReligionwiseTotalVoterList'),
    path('religionwiseTownVoterList/', religionwiseTownVoterList, name ='ReligionwiseTownVoterList'),
    path('religionwiseBoothVoterList/', religionwiseBoothVoterList, name ='ReligionwiseBoothVoterList'),

    # Castwise
    path('castwiseTotalVoterList/', castwiseTotalVoterList, name ='CastwiseTotalVoterList'),
    path('castwiseTownVoterList/', castwiseTownVoterList, name ='CastwiseTownVoterList'),
    path('castwiseBoothVoterList/', castwiseBoothVoterList, name ='CastwiseBoothVoterList'),

    # Exitpoll
    path('exitpoll/', ExitPoll, name='ExitPoll'),
    path('townwiseactivity/', TownExitPoll, name = 'TownExitPoll'),
    path('boothwiseactivity/', BoothExitPoll, name = 'BoothExitPoll'),
    path('urbanruralwisexitpoll/', RUExitPoll, name = 'RUExitPoll'),

    # Town Type
    path('towncategory/', TownCategory, name = 'TownCategory'),
    path('ruralList/', GraminList, name = 'GraminList'),
    path('urbanList/', ShaharList, name = 'ShaharList'),

    # Sub Pages
    path('familydetails/<str:id>/', FamilyDetails, name='FamilyDetails'),

    # No use
    path('index/', index, name='index'),
    path('users/', user_list, name='user_list'),
    path('castwisevoter/', CastWiseVoter, name = 'CastWiseVoter'),

    # Edit
    path('editzpuser/<int:id>/', EditZPUser, name='EditZPUser'),
    path('editpsuser/<int:id>/', EditPSUser, name='EditPSUser'),
    path('edittownuser/<int:id>/', EditTownUser, name='EditTownUser'),
    path('editboothuser/<int:id>/', EditBoothUser, name='EditBoothUser'),
    path('editvoter/<str:id>/', EditVoterDetails, name='EditVoterDetails'),

    # Delete
    path('delete_town_user/<str:user_id>/', delete_town_user, name='delete_town_user'),
    path('delete_booth_user/<str:user_id>/', delete_booth_user, name='delete_booth_user'),

    # ActivityLog
    path('activitylog/', ActivityLog, name ='activityLog'),
    path('boothUserActlog/<str:id>/', boothUserActivityLog, name ='BoothUserActivityLog'),

    path('faqs/', FAQs, name='FAQs'),
    path('underconstruction/', UnderCons, name='UnderCons'),
    path('contactus/', ContactUs, name = 'ContactUs'),
]


