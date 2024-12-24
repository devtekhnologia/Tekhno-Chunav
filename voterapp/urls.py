from django.urls import path, include
from .views import UserListCreate, UserDetail
from .views import UserLogin, UserLogout
from .views import upload_file
from .views import get_voters
from .views import TownList
from .views import BoothList
from .views import PanchayatSamitiListCreate, PanchayatSamitiRetrieveUpdateDestroy
from .views import ZPListCreate, ZPRetrieveUpdateDestroy
from .views import VidhansabhaListCreate, VidhansabhaRetriveUpdateDestroy
from .views import StateListCreate, StateRetriveUpdateDestroy
from .views import VoterlistListCreate, VoterlistRetrieveUpdateDestroy
from .views import get_voters_by_booth
from .views import GetVoterByCastView
from .views import PoliticianLoginView
from .views import PoliticianLogoutView
from .views import PoliticianCreate
from .views import PoliticianDetail
from .views import PoliticianGetView
from .views import ReligionListCreate
from .views import ReligionRetriveUpdateDestroy
# from .views import Favour_non_favourListCreate
from .views import Favour_non_favourRetriveUpdateDestroy
from .views import Town_user_Login, Town_user_Logout
from .views import Town_userCreate
from .views import get_town_voter_list
from .views import get_taluka_voter_list
from .views import VotersByConstituencyView
from .views import MaritalStatusRetrieveUpdateDestroy
from .views import get_voters_by_constituency
from .views import get_voters_by_userwise
from .views import EditedVoterlistList
from .views import EditedVoterlistByDate
from .views import VoterlistByTown
from .views import VoterCountView
from .views import VoterCountByBoothView
from .views import BoothListByTown
from .views import total_voters
from .views import BoothCountView, TownCountView
from .views import get_all_voters
from .views import VoterlistByReligion,ReligionListView
from .views import VoterlistByReligionView
from .views import UserBoothDeleteView
from .views import TownUserTownDeleteView
from .views import update_town_panchayat
from .views import get_panchayat_samiti_circle
from .views import update_panchayat_circle
from .views import get_voter_list_by_zpcircle
from .views import get_voter_list_by_panchayat_samiti_circle
from .views import VoterUpdatedBy
from .views import get_zp_circle_names
from .views import get_panchayat_samiti_circle_names
from .views import get_town_user_info
from .views import get_town_user_info_with_id
from .views import get_booth_user_info
from .views import get_booth_user_info_with_id
from .views import get_voter_list_by_town_user
from .views import get_user_by_booth_id
from .views import get_town_users_by_town_id
from .views import booth_votes_summary
from .views import generate_pdf
from .views import Panchayat_samiti_circle_userCreate
from .views import Zp_circle_userCreate
from .views import get_panchayat_samiti_user_info
from .views import get_panchayat_samiti_user_info_with_id
from .views import get_zp_user_info
from .views import get_zp_user_info_with_id
from .views import Panchayat_samiti_circle_userLogin, Panchayat_samiti_circle_userLogout
from .views import Zp_circle_userLogin, Zp_circle_userLogout
from .views import get_voter_list_by_user_panchayat_samiti_circle
from .views import get_voter_list_by_user_zp_circle
from .views import get_voters_by_booth_and_vote_confirmation
from .views import send_whatsapp_message
from .views import generate_voter_pdf
from .views import get_voter_favour_counts
from .views import CastByReligionView
from .views import VoterlistByVoteConfirmationView
from .views import get_voter_counts
from .views import GetVoterByCastAndBoothView, GetVoterByCastAndTownView
from .views import send_voter_data
from .views import GetVoterByReligionBoothView, GetVoterByReligionTownView
from .views import CastListView, CastDetailView
from .views import VotersByCastView
from .views import religion_count_api
from .views import get_voters_by_religion
from .views import get_voters_town_religion_cast
from .views import get_voters_booth_religion_cast
from .views import get_voters_booth_religion_wise
from .views import get_voters_town_religion_wise
from .views import get_voters_by_booth_user_and_cast, get_voters_by_town_user_and_cast
from .views import get_booth_names_by_town_user
from .views import get_all_religion
from .views import get_all_cast
from .views import age_wise_voter
from .views import delete_user
from .views import delete_town_user
from .views import get_booth_user_info_town_user_wise
from .views import VoterByBoothConfirmationView, VoterByTownConfirmationView
from .views import VoterByBoothUserConfirmationView, VoterByTownUserConfirmationView
from .views import get_family_groups_by_user
from .views import manage_family_group
from .views import update_voter_group 
from .views import manage_family_group_by_user
from .views import get_family_groups_by_town_user
from .views import get_family_groups_booth_wise
from .views import get_family_groups_town_wise
from .views import get_family_group_details_by_voter

from .views import get_voters_by_group_id 
from .views import get_booth_users_by_town_user
from .views import generate_booth_user_pdf, generate_town_user_pdf
from .views import get_voters_booth_religion_wise_pdf, get_voters_town_religion_wise_pdf
from .views import get_voters_booth_cast_wise_pdf, get_voters_town_cast_wise_pdf
from .views import GetVoterConfirmationDataBYBooth, GetVoterConfirmationDataBYTown, GetVoterConfirmationData
from .views import GetVoterCountByBooth, GetVoterCountByTown, VoterVoteConfirmationCount
from .views import VoterConfirmation
from .views import booth_voting_view, town_voting_view
from .views import GetFavorableVotedNonVotedVoterCount, GetFavorableVoterCountByBooth, GetFavorableVoterCountByTown
from .views import compare_voter_data
from .views import get_temp_voter_data
from .views import approve_voter_data
from .views import update_reject_status
from .views import TownVoterCountView
from .views import VoterCountPDFView
from .views import update_user_name_and_contact
from .views import update_town_user_name_and_contact
from .views import GetVotedCountByBoothUser
from .views import VoterSearchView
from .views import ChangeUserPasswordView
from .views import ChangePoliticianPasswordView
from .views import ChangeTownUserPasswordView
from .views import get_temp_voter_data_town
from .views import get_family_groups_for_admin
from .views import Town_userUpdate
from .views import multiple_voter_data_update
from .views import BoothDetailView
# from .views import VoterGenderStatsView
from .views import reject_multiple_temp_voter_data
from .views import get_male_female_voters_by_booth_wise, get_male_female_voters_by_town_wise, get_male_female_voters_by_all
from .views import get_non_voted_voters
from .views import get_voters_by_town_and_vote_confirmation
from .views import VotedVotersListByTownUser
from .views import VotedVotersListByBoothUser
from .views import VoterCountViewByBooths

from .views import voter_contact_count_by_booth_wise
from .views import voter_gender_count_by_booth_wise
from .views import voter_cast_count_by_booth_wise
from .views import voter_contact_count_by_town_wise
from .views import voter_gender_count_by_town_wise
from .views import voter_cast_count_by_town_wise
from .views import voter_contact_count_by_booth_user_wise
from .views import voter_gender_count_by_booth_user_wise
from .views import voter_cast_count_by_booth_user_wise 

from .views import voter_cast_count_by_town_user_wise
from .views import voter_gender_count_by_town_user_wise
from .views import voter_contact_count_by_town_user_wise

from .views import get_male_female_voters_by_booth_wise, get_male_female_voters_by_town_wise, get_male_female_voters_by_all

from .views import voter_gender_count
from .views import voter_contact_count
from .views import voter_cast_count

from .views import active_sessions_view
from .views import FamilyGroupDeleteView
from .views import AddVoterInExistingGroup
from .views import get_voters_by_town_and_booth
from .views import RegisterSarpanchView
from .views import GetVoterVoteConfirmationCountsViewByBoothUser
from .views import VoterConfirmatioCountForAdminView
from .views import get_booth_details_by_town_id
# from .views import VoterListViewPagination
from .views import delete_booth_user
# from .views import all_total_voters
from .views import UpdateAreaTypeView
from .views import create_voter
from .views import UserBoothView
from .views import get_towns
from .views import UpdatePrabaghTypeView
from .views import get_prabhags
from .views import TownRuralView
from .views import get_town_info_by_psc
from .views import get_booth_info_by_prabhag_id
from .views import get_voters_by_prabhagh
from .views import get_panchayat_samiti_circle_by_zp_circle 
from .views import GetVoterListByBoothUserAndReligionWise
from .views import get_voter_current_location_details_by_booth
from .views import get_voter_current_location_details_by_town
from .views import PrabhagUserCreate, PrabhagUserDetail
from .views import GetVoterDetailsByPrabhagUserId
from .views import PrabhagUserLoginView
from .views import CountVotersCountByPrabhagUserId
from .views import GetBoothDetailsByPrabhagUser
from .views import VoterFavourCountsByPrabhagUser
from .views import GetVoterDetailsByConfirmationView
from .views import BoothUserListCreateByPrabhag
from .views import edit_voter_data_by_booth_user
from .views import multiple_voter_data_update_by_prabha_user
from .views import update_voter_data_prabhag_user
from .views import update_reject_status_prabhag_user
from .views import get_temp_voter_data_prabhag_user
from .views import get_temp_voter_data_user_prabhag_user
from .views import GetUserBoothDetailsByPrabhagUserView
from .views import PrabhagUserLogoutView
from .views import DeletePrabhagUserView
from .views import GetPrabhagUsersInfoView
from .views import GetPrabhagUserInfoView
from .views import generate_voter_pdf_by_booth
from .views import generate_voter_pdf_by_town
from .views import reject_multiple_temp_voter_data_by_prabhag_user
from .views import get_voter_current_location_details_by_prabhag_user
from .views import get_voter_info_by_booth_user
from .views import GetVoterInfoByUserAndFavour
from .views import  generate_voters_by_cast_pdf
from .views import  generate_voters_by_religion_pdf
from .views import update_family_group_description, get_family_group_description
from .views import manage_family_group_name
from .views import GetPrabhagByTownView
from .views import TownListByAreaTypeAPIView
from .views import DeletePrabhagView
from .views import UpdatePrabhagNameView
from .views import get_all_favour_counts

from .views import create_voter_group_user
from .views import get_voters_by_voter_group_user
from .views import login_voter_group_user, logout_voter_group_user
from .views import add_voter_to_existing_group
from .views import remove_voter_from_existing_group
from .views import get_voter_group_details_by_user
from .views import get_voter_group_details
from .views import get_voters_by_confirmation
from .views import delete_voter_group

from .views import get_users_by_town_area_type
from .views import get_voter_count_by_town_area_type
from .views import get_voter_count_pdf
from .views import favour_wise_voter_list

from .views import get_voters_by_vote_status
from .views import get_voters_by_favour_id
from .views import generate_pdf_by_favour_id

from .views import get_town_wise_voter_percentage
from .views import update_voters_by_existing_family_contact
from .views import VoterCastAssignView
from .views import generate_voter_pdf_family_group_id
from .views import get_zp_circle_info, get_panchayat_samiti_circle_info
from .views import common_login
from .views import ZpCircleUserListView
from .views import PanchayatSamitiCircleUserListView
from .views import ZpCircleUserListPDFView, PanchayatSamitiCircleUserListPDFView
from .views import manage_zp_circle_user, manage_ps_circle_user
from .views import get_voted_list_by_booth
from .views import surname_wise_voter_count, get_voter_details_by_surname
from .views import surname_wise_voter_count_pdf
from .views import surname_wise_favour_caste_assign_voters
from .views import get_voters_by_booth_and_town_wise
from .views import booth_and_surname_wise_voter_count, booth_and_surname_wise_voter_details, booth_and_surname_wise_voter_count_pdf
from .views import get_booth_names_by_ps_circle_user_wise, ps_circle_user_vote_confirmation, ps_circle_user_cast_wise, ps_circle_user_religion_wise, ps_circle_user_favour_wise
from .views import PanchayatSamitiCircleAPIView, zp_circle_user_vote_confirmation, zp_circle_user_cast_wise, BoothListByZPCircleUser, VoterListByZPCircleUser


urlpatterns = [
    path('upload/', upload_file, name='upload_file'),
    path('register_user/', UserListCreate.as_view(), name='user-list-create'),
    path('register_user/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('user_booth_delete/<int:user_booth_user_id>/', UserBoothDeleteView.as_view(), name='user_booth_delete'),
    path('town_user_town_delete/<int:user_town_user_id>/', TownUserTownDeleteView.as_view(), name='user_town_delete'),
    
    path('user_login/', UserLogin.as_view(), name='user-login'), 
    path('user_logout/<int:user_id>/', UserLogout.as_view(), name='logout'),

    path('get_voters/', get_voters, name='get_voters'),
    path('get_voters/<int:voter_id>/', get_voters, name='get_voters'),                          # getting error for fetch perticular voter 
    path('towns/', TownList.as_view(), name='town-list'),
    path('booths/', BoothList.as_view(), name='booth-list'),
    path('booths/<int:booth_id>/', BoothList.as_view(), name='booth-detail'),
    path('panchayat_samitis/', PanchayatSamitiListCreate.as_view(), name='panchayat-samiti-list-create'),
    path('panchayat_samitis/<int:pk>/', PanchayatSamitiRetrieveUpdateDestroy.as_view(), name='panchayat-samiti-detail'),
    path('zps/', ZPListCreate.as_view(),name = 'zp-list-create'),
    path('zps/<int:pk>/', ZPRetrieveUpdateDestroy.as_view(), name='zp-details'),
    path('vidhansabhas/', VidhansabhaListCreate.as_view(), name = 'vidhansabha-list-create'),
    path('vidhansabha/<int:pk>/',VidhansabhaRetriveUpdateDestroy.as_view(), name = 'vidhansabha-details'),
    path('states/', StateListCreate.as_view(), name = 'state-list-create'),
    path('states/<int:pk>/',StateRetriveUpdateDestroy.as_view(), name = 'state-details'),
    path('voters/', VoterlistListCreate.as_view(), name='voter-list-create'),
    path('voters/<int:voter_id>/', VoterlistRetrieveUpdateDestroy.as_view(), name='voter-detail'),
    path('get_voters_by_booth/<int:booth_id>/', get_voters_by_booth, name='get_voters_by_booth'),
    path('get_voters_by_booth/<int:booth_id>/<int:voter_id>/', get_voters, name='voter_detail'),
    path('voters_by_cast/<int:voter_cast_id>/', GetVoterByCastView.as_view(), name='voter-by-cast'),
    path('cast_by_religion/<int:religion_id>/', CastByReligionView.as_view(), name='cast-by-religion'),

    path('politician_register/', PoliticianCreate.as_view(), name='Politician-list'), 
    path('politician_register/<int:pk>/', PoliticianDetail.as_view(), name='politician-detail'), 
    path('politician_register/<str:mobile_number>/', PoliticianDetail.as_view(), name='politician-detail'),
    path('politician_login/', PoliticianLoginView.as_view(), name='politician-login'),
    path('politician_logout/<int:politician_id>/', PoliticianLogoutView.as_view(), name='politician-logout'),
    path('religion/', ReligionListCreate.as_view(), name='religion-list'),
    path('religion/<int:pk>/', ReligionRetriveUpdateDestroy.as_view(), name='religion-detail'),
    path('politician_get_by_id/<int:politician_id>/', PoliticianGetView.as_view(), name='politician_detail'),
    # path('favour/', Favour_non_favourListCreate.as_view(), name='Favour_non_favour-list'),
    # path('favour/<int:pk>/', Favour_non_favourRetriveUpdateDestroy.as_view(), name='Favour_non_favour-detail'),
    path('favour/', Favour_non_favourRetriveUpdateDestroy.as_view(), name='Favour_non_favour-detail'),

    path('town_user_login/', Town_user_Login.as_view(), name='town_user-login'),
    path('town_user_logout/<int:user_town_town_user_id>/', Town_user_Logout.as_view(), name='town_user-logout'),
    path('town_user_register/', Town_userCreate.as_view(), name='town_user-list'), 
    path('town_user/<int:pk>/', Town_userUpdate.as_view(), name='town_user_update'),

    path('get_town_voter_list/<int:town_user_town_id>/', get_town_voter_list, name='get_voters_by_town_user'),
    path('get_taluka_voter_list/<int:politician_taluka_id>/', get_taluka_voter_list, name='get_voters_by_town_user'),
    path('constituency/<int:constituency_id>/', VotersByConstituencyView.as_view(), name='voters-by-constituency'),
    path('get_voters_by_booth/<int:booth_id>/<int:voter_id>/', get_voters_by_booth, name='update_voter'),
    path('marital_status/<int:pk>/', MaritalStatusRetrieveUpdateDestroy.as_view(), name='marital-status-detail'),
    path('get_voters_by_constituency/<int:constituency_id>/', get_voters_by_constituency, name='constituency_voter_list'),
    path('get_voters_by_user_wise/<int:user_booth_user_id>/', get_voters_by_userwise, name='get_voters_by_userwise'),
    path('edited_voters/', EditedVoterlistList.as_view(), name='edited-voter-list'), 
    path('edited_voters/<int:user_id>/', EditedVoterlistList.as_view(), name='edited-voter-list-by-user'),
    path('edited_voters_date/<str:date>/', EditedVoterlistByDate.as_view(), name='edited-voter-list-by-date'),
    path('town_wise_voter_list/<int:town_id>/', VoterlistByTown.as_view(), name='voterlist-by-town'),
    path('voter_count/', VoterCountView.as_view(), name='voter-count'),
    path('votercountbyboothview/<int:voter_booth_id>/', VoterCountByBoothView, name='votercountbyboothview'),
    path('booths_by_town/<int:town_id>/', BoothListByTown.as_view(), name='boothlist-by-town'),
    path('total_voters/', total_voters, name='total_voters'),
    path('get_all_voters/', get_all_voters, name = 'get_all_voters'),
    path('BoothCountView/', BoothCountView.as_view(), name = 'BoothCountView'),
    path('TownCountView/', TownCountView.as_view(), name = 'TownCountView'),
    path('cast/', CastListView.as_view(), name='cast-list'),
    path('cast/<int:cast_id>/', CastDetailView.as_view(), name='cast-detail'),
    path('religions/', ReligionListView.as_view(), name='religion-list'),
    path('religion/<int:religion_id>/', VoterlistByReligion.as_view(), name='voter-list-by-religion'),
    path('religion_wise_voter_list/<int:religion_id>/', VoterlistByReligionView.as_view(), name='voter-list-by-religion'),
    path('add_panchayat_samiti_circle_town/', update_town_panchayat, name='update-town-panchayat'),   # create PS circle and assign PS circle to town
    path('panchayat_samiti_circle/', get_panchayat_samiti_circle, name='panchayat_samiti_circle'),
    path('add_zp_circle_town/', update_panchayat_circle, name='update_panchayat_circle'),            # #create ZP circle and assign ZP circle to town
    path('get_voter_list_by_zp_circle/<int:zp_circle_id>/', get_voter_list_by_zpcircle, name='get_voter_list_by_zpcircle'),
    path('get_voter_list_by_panchayat_samiti_circle/<int:panchayat_samiti_circle_id>/', get_voter_list_by_panchayat_samiti_circle, name='get_voter_list_by_panchayat_samiti_circle'),
    path('voter_updated_by/<str:voter_updated_by>/', VoterUpdatedBy.as_view(), name='VoterUpdatedBy'),
    path('zp_circle_names/', get_zp_circle_names, name='get_zp_circle_names'),  
    path('zp_circle_names/<int:zp_circle_id>/', get_zp_circle_names, name='get_zp_circle_name_by_id'), 
    path('panchayat_samiti_circle_names/', get_panchayat_samiti_circle_names, name='get_panchayat_samiti_circle_names'),  # For all Panchayat Samiti circles
    path('panchayat_samiti_circle_names/<int:panchayat_samiti_circle_id>/', get_panchayat_samiti_circle_names, name='get_panchayat_samiti_circle_name_by_id'),
    path('town_user_info/', get_town_user_info, name='get_all_town_user_info'),
    path('town_user_info/<int:user_id>/', get_town_user_info_with_id, name='get_town_user_info_with_id'),
    path('booth_user_info/', get_booth_user_info, name='get_all_booth_user_info'),
    path('booth_user_info/<int:user_id>/', get_booth_user_info_with_id, name='get_booth_user_info_with_id'),
    path('get_voter_list_by_town_user/<int:user_town_town_user_id>/', get_voter_list_by_town_user, name='voter_list_by_town_user'),
    path('get_user_by_booth_id/<int:user_booth_booth_id>/', get_user_by_booth_id, name='get_user_by_booth_id'),
    path('get_town_users_by_town_id/<int:user_town_town_id>/', get_town_users_by_town_id, name='get_town_users_by_town_id'),
    path('booth_votes_summary/', booth_votes_summary, name='booth_votes_summary'),
    path('panchayat_samiti_circle_user_register/', Panchayat_samiti_circle_userCreate.as_view(), name='Panchayat_samiti_circle_userCreate-list'),
    path('zp_circle_user_register/', Zp_circle_userCreate.as_view(), name='Zp_circle_userCreate-list'),
    path('panchayat_samiti_circle_user_info/', get_panchayat_samiti_user_info, name='get_panchayat_samiti_user_info'),
    path('panchayat_samiti_circle_user_info/<int:panchayat_samiti_user_id>/', get_panchayat_samiti_user_info_with_id, name='get_panchayat_samiti_user_info_with_id'),
    path('zp_circle_user_info/', get_zp_user_info, name='get_zp_user_info'),
    path('zp_circle_user_info/<int:zp_user_id>/', get_zp_user_info_with_id, name='get_zp_user_info_with_id'),
    path('panchayat_samiti_circle_user_login/', Panchayat_samiti_circle_userLogin.as_view(), name='panchayat_samiti_circle_user_login'),
    path('panchayat_samiti_circle_user_logout/', Panchayat_samiti_circle_userLogout.as_view(), name='panchayat_samiti_circle_user_logout'),
    path('zp_circle_user_login/', Zp_circle_userLogin.as_view(), name='zp_circle_user_login'),
    path('zp_circle_user_logout/', Zp_circle_userLogout.as_view(), name='zp_circle_user_logout'),
    path('voter_list_by_user_panchayat_samiti_circle/<int:user_panchayat_samiti_circle_id>/', get_voter_list_by_user_panchayat_samiti_circle, name='voter_list_by_user_panchayat_samiti_circle'),
    path('get_panchayat_samiti_circle_by_zp_circle/<int:zp_circle_id>/', get_panchayat_samiti_circle_by_zp_circle, name='get_panchayat_samiti_circle_by_zp_circle'),
    path('voter_list_by_user_zp_circle/<int:user_zp_circle_id>/', get_voter_list_by_user_zp_circle, name='get_voter_list_by_user_zp_circle'),
    path('vote_confirmation/<int:vote_confirmation_id>/', VoterlistByVoteConfirmationView.as_view(), name='voter-list-by-vote-confirmation'), 
    path('get_non_voted_voters/', get_non_voted_voters, name='get_non_voted_voters'),
    path('by_booth/<int:booth_id>/vote_confirmation/<int:vote_confirmation_id>/', get_voters_by_booth_and_vote_confirmation, name='voter-list-by-booth-and-vote-confirmation'),
    path('by_town/<int:town_id>/vote_confirmation/<int:vote_confirmation_id>/', get_voters_by_town_and_vote_confirmation, name='get_voters_by_town_and_vote_confirmation'),
    path('send_whatsapp_message/', send_whatsapp_message, name='send_whatsapp_message'),
    path('send_text_message/', send_voter_data, name='send_voter_data'),
    path('generate_voter_pdf/<str:voter_id>/', generate_voter_pdf, name='generate_voter_pdf'),
    path('voter_favour_counts/', get_voter_favour_counts, name='voter_favour_counts'),
    path('voter_updated_counts/', get_voter_counts, name='get_voter_counts'),
    path('town_voter_count/', TownVoterCountView.as_view(), name='town-voter-count'),

    path('cast/<int:voter_cast_id>/booth/<int:voter_booth_id>/', GetVoterByCastAndBoothView.as_view(), name='voters-by-cast-and-booth'),
    path('cast/<int:voter_cast_id>/town/<int:voter_town_id>/', GetVoterByCastAndTownView.as_view(), name='voters-by-cast-and-town'),
    path('booth_details/<int:booth_id>/', BoothDetailView.as_view(), name='booth-detail'),
    path('get_booth_users_by_town_user/<int:town_user_id>/', get_booth_users_by_town_user, name='get_users_by_town'),

# religion or cast wise with booth or town wise voter data
    path('religion/<int:religion_id>/booth/<int:booth_id>/', GetVoterByReligionBoothView.as_view(), name='voters-by-religion-booth'),
    path('religion/<int:religion_id>/town/<int:town_id>/', GetVoterByReligionTownView.as_view(), name='voters-by-religion-town'),
    path('cast/', CastListView.as_view(), name='cast-list'),
    path('cast/<int:cast_id>/', CastDetailView.as_view(), name='cast-detail'),
    path('cast_wise_voter_list/<int:cast_id>/', VotersByCastView.as_view(), name='voters-by-cast'),
    path('religion_count/', religion_count_api, name='religion_count_api'),
    path('voters_by_religion/<int:religion_id>/', get_voters_by_religion, name='get_voters_by_religion'),
    path('town/<int:town_id>/cast/<int:cast_id>/', get_voters_town_religion_cast, name='get_voters'),
    path('booth/<int:booth_id>/cast/<int:cast_id>/', get_voters_booth_religion_cast, name='get_voters'),
    path('booth/<int:booth_id>/religion/<int:religion_id>/', get_voters_booth_religion_wise, name='get_voters'),
    path('town/<int:town_id>/religion/<int:religion_id>/', get_voters_town_religion_wise, name='get_voters'),
    path('get_voters_by_booth_user_and_cast/<int:user_booth_id>/<int:cast_id>/', get_voters_by_booth_user_and_cast, name='voters_by_booth_and_cast'),
    path('get_voters_by_town_user_and_cast/<int:user_town_id>/<int:cast_id>/', get_voters_by_town_user_and_cast, name='voters_by_booth_and_cast'),
    path('get_booth_names_by_town_user/<int:town_user_id>/', get_booth_names_by_town_user, name='booth_names_by_town_user'),
    path('get_all_religion/', get_all_religion, name='get_all_religion'),
    path('get_all_cast/', get_all_cast, name='get_all_cast'),
    path('age_wise_voter/<int:age_from>/<int:age_to>/', age_wise_voter, name='age_wise_voter'), 

# delete usrs   
    path('delete_user/<int:user_id>/', delete_user, name='delete-user'),
    path('delete_town_user/<int:town_user_id>/', delete_town_user, name='delete_town_user'),
    path('delete_booth_user/<int:booth_user_id>/', delete_booth_user, name='delete_booth_user'),

# users info  #  #  # Need to work on this
    path('booth_user_info_town_user_wise/<int:town_user_id>/', get_booth_user_info_town_user_wise, name='get_booth_user_info_town_user_wise'),
    path('booth/<int:booth_id>/confirmation/<int:confirmation_id>/', VoterByBoothConfirmationView.as_view(), name='voters_by_booth_confirmation'),
    path('town/<int:town_id>/confirmation/<int:confirmation_id>/', VoterByTownConfirmationView.as_view(), name='voters_by_town_confirmation'),
    path('booth_user_id/<int:user_id>/confirmation/<int:confirmation_id>/', VoterByBoothUserConfirmationView.as_view(), name='voters_by_booth_user_confirmation'),
    path('town_user_id/<int:town_user_id>/confirmation/<int:confirmation_id>/', VoterByTownUserConfirmationView.as_view(), name='voters_by_town_user_confirmation'),
# Family Group 
    path('get_family_groups_by_user/<int:booth_user_id>/', get_family_groups_by_user, name='get_family_groups_by_user'),
    path('create_family_group_by_booth_user/', manage_family_group, name='manage_family_group'),
    path('remove_voter_from_family_group/<int:voter_id>/', update_voter_group, name='update_voter_group'),
    path('create_family_group_by_town_user/', manage_family_group_by_user, name='manage_family_group'),
    path('get_family_groups_by_town_user/<int:town_user_id>/', get_family_groups_by_town_user, name='get_family_groups_by_town_user'),
    path('get_family_groups_booth_wise/<int:booth_id>/', get_family_groups_booth_wise, name='get_family_groups_booth_wise'),
    path('get_family_groups_town_wise/<int:town_id>/', get_family_groups_town_wise, name='get_family_groups_town_wise'),
    path('get_voters_by_group_id/<int:voter_group_id>/', get_voters_by_group_id, name='get_voters_by_group_id'),
    path('family_group_details/<int:voter_id>/', get_family_group_details_by_voter, name='get_family_group_details_by_voter'),
    path('get_family_groups_for_admin/', get_family_groups_for_admin, name='get_family_groups_for_admin'),
    path('family_group_delete/<int:family_group_id>/', FamilyGroupDeleteView.as_view(), name='delete_family_group'),
    # path('add_voter_in_existing_group/voter_id/<int:voter_id>/group_id/<int:voter_group_id>/', AddVoterInExistingGroup.as_view(), name='update_voter'),

    path('add_voter_in_existing_group/', AddVoterInExistingGroup.as_view(), name='update_voters'),


# pdf generate
    path('generate_pdf/', generate_pdf, name='generate_pdf'),
    path('generate_booth_user_pdf/', generate_booth_user_pdf, name='generate_user_pdf'),
    path('generate_town_user_pdf/', generate_town_user_pdf, name='generate_town_user_pdf'),
    path('booth_pdf/<int:booth_id>/religion/<int:religion_id>/', get_voters_booth_religion_wise_pdf, name='get_voters'),
    path('town_pdf/<int:town_id>/religion/<int:religion_id>/', get_voters_town_religion_wise_pdf, name='get_voters'),
    path('booth_pdf/<int:booth_id>/cast/<int:cast_id>/', get_voters_booth_cast_wise_pdf, name='get_voters'),
    path('town_pdf/<int:town_id>/cast/<int:cast_id>/', get_voters_town_cast_wise_pdf, name='get_voters'),
    path('voter_town_count/', VoterCountPDFView.as_view(), name='voter-count-pdf'),
# Voted non voted voters list
    path('get_non_voted_data_by_booth/<int:voter_booth_id>/', GetVoterConfirmationDataBYBooth.as_view(), name='voter-retrieve'),
    path('get_voted_data_by_booth/<int:voter_booth_id>/<int:voter_vote_confirmation_id>/', GetVoterConfirmationDataBYBooth.as_view(), name='voter-retrieve-by-id'),   
    path('get_non_voted_data_by_town/<int:voter_town_id>/', GetVoterConfirmationDataBYTown.as_view(), name='voter-retrieve'),
    path('get_voted_data_by_town/<int:voter_town_id>/<int:voter_vote_confirmation_id>/', GetVoterConfirmationDataBYTown.as_view(), name='voter-retrieve-by-id'),   
    path('get_non_voted_data_by_all/', GetVoterConfirmationData.as_view(), name='voter-retrieve'),
    path('get_voted_data_by_all/<int:voter_vote_confirmation_id>/', GetVoterConfirmationData.as_view(), name='voter-retrieve-by-id'), 
# voted non voted count
    path('voter_confirmation/<int:voter_id>/', VoterConfirmation.as_view(), name='voter_confirmation'),
    path('get_voted_and_non_voted_count_by_booth/<int:voter_booth_id>/', GetVoterCountByBooth.as_view(), name='voter-count-by-booth'),
    path('get_voted_and_non_voted_count_by_town/<int:voter_town_id>/', GetVoterCountByTown.as_view(), name='voter-count-by-town'),
    path('get_voted_and_non_voted_count/', VoterVoteConfirmationCount.as_view(), name='voter-count'),      
    path('get_voted_and_non_voted_count_by_booth_user/<int:user_id>/', GetVotedCountByBoothUser.as_view(), name='voter-count-by-booth-user'),

    path('booth_voting_percentage/', booth_voting_view, name='booth_voting'),
    path('booth_voting_percentage/<int:booth_id>/', booth_voting_view, name='booth_voting'),
    path('town_voting_percentage/', town_voting_view, name='town_voting'),
    path('town_voting_percentage/<int:town_id>/', town_voting_view, name='town_voting'),

# Fevorable voted and Fevorable Non voted voted non voted count from voted voters   
    path('get_fevorable_voted_nonvoted_vote_count/', GetFavorableVotedNonVotedVoterCount.as_view(), name='favorable-voter-count'),
    path('get_fevorable_voted_nonvoted_vote_count_by_booth/', GetFavorableVoterCountByBooth.as_view(), name='favorable-voter-count-by-booth'),
    path('get_fevorable_voted_nonvoted_vote_count_by_town/', GetFavorableVoterCountByTown.as_view(), name='favorable-voters-by-town'),
# Confirmantion of edited voter data by user
    path('compare_voter_data/', compare_voter_data, name='compare_voter_data'),
    path('get_temp_voter_data/<int:temp_voter_data_voter_id>/', get_temp_voter_data, name='temp_voter_data'),
    path('update_voter_data/<int:temp_voter_data_voter_id>/', approve_voter_data, name='update_voter_data'),
    path('update_reject_status/<int:temp_voter_data_voter_id>/', update_reject_status, name='update_voter_data'),
    path('get_temp_voter_data_town/<int:temp_voter_data_updated_by_user_id>/', get_temp_voter_data_town, name='get_temp_voter_data_town'),
    path('multiple_voter_data_approve/', multiple_voter_data_update, name='update_voter_data'),
    path('reject_multiple_temp_voter_data/', reject_multiple_temp_voter_data, name='reject_multiple_temp_voter_data'),
# edit user, town user details
    path('update_booth_users/<int:user_id>/', update_user_name_and_contact, name='update_user'),
    path('update_town_users/<int:town_user_id>/', update_town_user_name_and_contact, name='update_user'),
    
    path('search_voter/<str:name>/', VoterSearchView.as_view(), name='politician_search'),
# Change Password    
    path('change_user_password/<int:user_id>/', ChangeUserPasswordView.as_view(), name='change-password'),
    path('change_politician_password/<int:politician_id>/', ChangePoliticianPasswordView.as_view(), name='change-password'),
    path('change_town_user_password/<int:town_user_id>/', ChangeTownUserPasswordView.as_view(), name='change-password'),
# Male Female voters 
    path('get_male_female_voters_by_booth_wise/booth/<int:voter_booth_id>/gender/<str:gender>/', get_male_female_voters_by_booth_wise, name='get_voters_by_booth_gender'),
    path('get_male_female_voters_by_town_wise/town/<str:town>/gender/<str:gender>/', get_male_female_voters_by_town_wise, name='get_voters_by_town_gender'),
    path('get_male_female_voters_by_all/gender/<str:gender>/', get_male_female_voters_by_all, name='get_voters_by_gender'),

    path('voted_voters_list_By_town_user/<int:user_town_user_id>/<int:voter_vote_confirmation_id>/', VotedVotersListByTownUser.as_view(), name='VotedVotersListByTownUser'),
    path('voted_voters_list_By_booth_user/<int:user_booth_user_id>/<int:voter_vote_confirmation_id>/', VotedVotersListByBoothUser.as_view(), name='VotedVotersListByTownUser'),
    path('voter_counts/', VoterCountViewByBooths.as_view(), name='voter-count'),
# Voter Deatails data Count
    path('voter_gender_count/', voter_gender_count, name='voter_gender_count'),
    path('voter_contact_count/', voter_contact_count, name='voter_contact_count'),
    path('voter_cast_count/', voter_cast_count, name='voter_cast_count'),
    
    path('voter_contact_count_by_booth_wise/<int:booth_id>/', voter_contact_count_by_booth_wise, name='voter_contact_count_by_booth_wise'),
    path('voter_gender_count_by_booth_wise/<int:booth_id>/', voter_gender_count_by_booth_wise, name='voter_gender_count_by_booth_wise'),
    path('voter_cast_count_by_booth_wise/<int:booth_id>/', voter_cast_count_by_booth_wise, name='voter_cast_count_by_booth_wise'),

    path('voter_contact_count_by_town_wise/<int:town_id>/', voter_contact_count_by_town_wise, name='voter_contact_count_by_town_wise'),
    path('voter_gender_count_by_town_wise/<int:town_id>/', voter_gender_count_by_town_wise, name='voter_contact_count_by_town_wise'),
    path('voter_cast_count_by_town_wise/<int:town_id>/', voter_cast_count_by_town_wise, name='voter_contact_count_by_town_wise'),

    path('voter_contact_count_by_booth_user_wise/<int:booth_user_id>/', voter_contact_count_by_booth_user_wise, name='voter_contact_count_by_booth_user_wise'),
    path('voter_gender_count_by_booth_user_wise/<int:booth_user_id>/', voter_gender_count_by_booth_user_wise, name='voter_gender_count_by_booth_user_wise'),
    path('voter_cast_count_by_booth_user_wise/<int:booth_user_id>/', voter_cast_count_by_booth_user_wise, name='voter_cast_count_by_booth_user_wise'),

    path('voter_contact_count_by_town_user_wise/<int:user_town_town_user_id>/', voter_contact_count_by_town_user_wise, name='voter_contact_count_by_town_user_wise'),
    path('voter_gender_count_by_town_user_wise/<int:user_town_town_user_id>/', voter_gender_count_by_town_user_wise, name='voter_gender_count_by_town_user_wise'),
    path('voter_cast_count_by_town_user_wise/<int:user_town_town_user_id>/', voter_cast_count_by_town_user_wise, name='voter_cast_count_by_town_user_wise'),
    path('active_sessions/', active_sessions_view, name='active_sessions'),
    
    path('town/<int:town_id>/booth/<int:booth_id>/', get_voters_by_town_and_booth, name='get_voters_by_town_and_booth'),
    path('register_sarpanch/', RegisterSarpanchView.as_view(), name='register_sarpanch'),
    path('register_sarpanch/<int:id>/', RegisterSarpanchView.as_view(), name='sarpanch_detail'),
    path('confirmation_count_by_booth_user/', GetVoterVoteConfirmationCountsViewByBoothUser.as_view(), name='get_voter_counts'),
    path('voted_vote_confirmation_count_for_all/', VoterConfirmatioCountForAdminView.as_view(), name='get_voter_counts'),
    path('get_booth_details_by_town_id/<int:town_id>/', get_booth_details_by_town_id, name='get_booth_details_by_town'),
    # path('voters_list_all/', VoterListViewPagination.as_view(), name='voter-list'),
    # path('all_total_voters/', all_total_voters, name='total_voters'),
    path('update_area_type/', UpdateAreaTypeView.as_view(), name='update_area_type'),
    path('create_new_voter/', create_voter, name='create_voter'),
    path('user_booth/<int:user_id>/', UserBoothView.as_view(), name='user-booth'),
    path('get_towns_by_urban/', get_towns, name='get_towns'),
    path('create_prabhag/', UpdatePrabaghTypeView.as_view(), name='prabgh_type'),
    path('get_prabhags/', get_prabhags, name='get_prabhags'),
    path('rural_town_info/', TownRuralView.as_view(), name='town_rural'),
    path('get_town_info_by_psc/<int:circle_id>/', get_town_info_by_psc, name='get_town_info_by_psc'),
    path('get_booth_info_by_prabhag_id/<int:booth_prabhag_id>/', get_booth_info_by_prabhag_id, name='get_booth_info_by_prabhag_id'),
    path('get_voters_by_prabhagh/<int:booth_prabhag_id>/', get_voters_by_prabhagh, name='get_voters_by_prabhagh'),
    path('booth_user_id/<int:user_id>/religion_id/<int:cast_religion_id>/', GetVoterListByBoothUserAndReligionWise.as_view(), name='get_voter_list'),
    path('get_voter_current_location_details_by_booth/booth_id/<int:booth_id>/city_id/<int:city_id>/', get_voter_current_location_details_by_booth, name='get_voter_details'),
    path('get_voter_current_location_details_by_town/town_id/<int:town_id>/city_id/<int:city_id>/', get_voter_current_location_details_by_town, name='get_voter_details'),
    path('prabhag_users_create/', PrabhagUserCreate.as_view(), name='create_prabhag_user'),
    path('prabhag_users/<int:pk>/', PrabhagUserDetail.as_view(), name='prabhag_user_detail'), 
    path('get_voterlist_by_prabhag_user/<int:prabhag_user_id>/', GetVoterDetailsByPrabhagUserId.as_view(), name='get_voter_details'),
    path('prabhag_user_login/', PrabhagUserLoginView.as_view(), name='login'),
    path('voter_count_by_prabhag_user_id/<int:prabhag_user_id>/', CountVotersCountByPrabhagUserId.as_view(), name='count_voters'),
    path('booth_details_by_prabhag_user/<int:prabhag_user_id>/', GetBoothDetailsByPrabhagUser.as_view(), name='voter_count_by_booth'),
    path('voter_favour_countsby_booth_user/<int:prabhag_user_id>/', VoterFavourCountsByPrabhagUser.as_view(), name='voter_favour_counts'),
    path('voter_details_by_confirmation/<int:prabhag_user_id>/<int:vote_confirmation_id>/', GetVoterDetailsByConfirmationView.as_view(), name='get_voter_details'),
    path('register_booth_user_by_prabhag/', BoothUserListCreateByPrabhag.as_view(), name='booth_user_list_create'),
    path('edit_voter_data_by_booth_user/', edit_voter_data_by_booth_user, name='compare_voter_data'),
    path('multiple_voter_data_update_by_prabha_user/', multiple_voter_data_update_by_prabha_user, name='update_voter_data'), 
    path('update_voter_data_prabhag_user/<int:temp_voter_data_voter_id>/', update_voter_data_prabhag_user, name='update_voter_data'),
    path('update_reject_status_prabhag_user/<int:temp_voter_data_voter_id>/', update_reject_status_prabhag_user, name='update_voter_data'),   
    path('get_temp_voter_data_prabhag_user/<int:temp_voter_data_updated_by_user_id>/', get_temp_voter_data_prabhag_user, name='get_temp_voter_data_town'),
    path('get_temp_voter_data_user_prabhag_user/<int:temp_voter_data_updated_by_user_id>/', get_temp_voter_data_user_prabhag_user, name='get_temp_voter_data_user'),
    path('user_booth_details_by_prabhag_user/<int:prabhag_user_id>/', GetUserBoothDetailsByPrabhagUserView.as_view(), name='get_user_booth_details'),
    path('prabhag_user_logout/<int:prabhag_user_id>/', PrabhagUserLogoutView.as_view(), name='prabhag_user_id-logout'),
    path('delete_prabhag_user/<int:prabhag_user_id>/', DeletePrabhagUserView.as_view(), name='delete_prabhag_user'),
    path('prabhag_users_info/', GetPrabhagUsersInfoView.as_view(), name='get_prabhag_users'),
    path('prabhag_users_info/<int:prabhag_user_id>/', GetPrabhagUserInfoView.as_view(), name='get_prabhag_user_info'),
    path('generate_voter_pdf_by_booth/booth_id/<int:booth_id>/city_id/<int:city_id>/', generate_voter_pdf_by_booth, name='generate_voter_pdf_by_booth'),
    path('generate_voter_pdf_by_town/town_id/<int:town_id>/city_id/<int:city_id>/', generate_voter_pdf_by_town, name='generate_voter_pdf_by_town'),
    path('reject_multiple_temp_voter_data_by_prabhag_user/', reject_multiple_temp_voter_data_by_prabhag_user, name='reject_multiple_temp_voter_data_prabgh_user'),
    path('get_voter_current_location_details_by_prabhag_user/prabhag_user_id/<int:prabhag_user_id>/city_id/<int:city_id>/', get_voter_current_location_details_by_prabhag_user, name='get_voter_details'),
    path('get_voter_info_by_booth_user/user_booth_user_id/<int:user_booth_user_id>/voter_favour_id/<int:voter_favour_id>/voter_vote_confirmation_id/<int:voter_vote_confirmation_id>/', 
        get_voter_info_by_booth_user, name='get_voter_info_by_booth_user'),
    path('get_voter_info/<int:user_booth_user_id>/<int:voter_favour_id>/', GetVoterInfoByUserAndFavour.as_view(), name='get_voter_info'),
    path('cast_pdf/<int:cast_id>/', generate_voters_by_cast_pdf, name='generate_voters_by_cast_pdf'),
    path('religion_pdf/<int:religion_id>/', generate_voters_by_religion_pdf, name='generate_voters_by_religion_pdf'),
    path('family_group_update_description/<int:family_group_id>/', update_family_group_description, name='update-family-group-description'),
    path('family_group_get_description/<int:family_group_id>/', get_family_group_description, name='get-family-group-description'),
    path('update_family_group_name/<int:family_group_id>/', manage_family_group_name, name='manage_family_group_name'),
    path('get_prabhag_by_town/<int:town_id>/', GetPrabhagByTownView.as_view(), name='get_prabhag_by_town'),
    path('towns_by_town_area_type/<int:town_area_type_id>/', TownListByAreaTypeAPIView.as_view(), name='town-list-by-area-type'),
    path('delete_prabhag/<int:prabhag_id>/', DeletePrabhagView.as_view(), name='delete_prabhag'),
    path('update_prabhag_name/<int:prabhag_id>/', UpdatePrabhagNameView.as_view(), name='update_prabhag_name'),
    path('favour_counts/', get_all_favour_counts, name='voter_count_by_favour'),
 
# voter group user
    path('create_voter_group_user/', create_voter_group_user, name='create_voter_group_user'),
    path('voters_by_group_user/<int:voter_group_user_id>/', get_voters_by_voter_group_user, name='get_voters_by_voter_group_user'),
    path('voter_group_login/', login_voter_group_user, name='login'),
    path('voter_group_logout/<int:voter_group_user_id>/', logout_voter_group_user, name='voter_group_logout'),
    path('add_voter_to_existing_group/',add_voter_to_existing_group, name='add_voter_to_existing_group'),
    path('remove_voter_from_existing_group/<int:voter_group_id>/<int:voter_id>/', remove_voter_from_existing_group, name='remove_voter_from_existing_group'),
    path('get_voter_group_details/', get_voter_group_details, name='get_voter_group_details'),
    path('get_voter_group_details_by_user/<int:voter_group_user_id>/', get_voter_group_details_by_user, name='get_voter_group_details_by_user'),
    path('voter_status/<int:voter_group_user_id>/<str:confirmation_id>/', get_voters_by_confirmation, name='get_voters_by_confirmation'),
    path('delete_voter_group/<int:voter_group_id>/', delete_voter_group, name='delete_voter_group'),
    
    
    path('get_users_by_town_area_type/<int:town_area_type_id>/', get_users_by_town_area_type, name='get_users_by_town_area_type'),
    path('get_voter_count_by_town_area_type/', get_voter_count_by_town_area_type, name='get_voter_count_by_town_area_type'),
    path('get_voter_count_by_town_area_type/<int:town_area_type_id>/', get_voter_count_by_town_area_type, name='get_voter_count_by_town_area_type_with_filter'),
    path('get_voter_count_pdf/<int:town_area_type_id>/', get_voter_count_pdf, name='get_voter_count_pdf'),
    path('get_voter_count_pdf/', get_voter_count_pdf, name='get_voter_count_pdf_no_id'),  
    
    path('favour_wise_voter_list/<int:favor_id>/', favour_wise_voter_list, name='get_voters_by_favor'),
    
    path('get_voters_by_vote_status/<int:status>/', get_voters_by_vote_status, name='get_voters_by_vote_status'),
    path('get_voters_by_favour_id/<int:favour_id>/', get_voters_by_favour_id, name='get_voters_by_favour_id'),
    path('favour_voter_list_pdf/<int:favour_id>/', generate_pdf_by_favour_id, name='generate_pdf_by_favour_id'),
    
#
    path('get_town_wise_voter_percentage/', get_town_wise_voter_percentage, name='get_town_wise_voter_percentage'),
    path('update_voters_by_existing_family_contact/', update_voters_by_existing_family_contact, name ='update_voters_by_existing_family_contact'),
    path('update_voters_by_existing_family_contact/<int:family_group_id>/', update_voters_by_existing_family_contact, name ='update_voters_by_existing_family_contact_id'),

    path('assign_voter_cast/', VoterCastAssignView.as_view(), name='assign-voter-cast'),
    path('generate_voter_pdf_family_group_id/<int:family_group_id>/', generate_voter_pdf_family_group_id, name='generate_voter_pdf'),
    
    path('zp_circle_info/', get_zp_circle_info, name='get_zp_circle_info'),  
    path('zp_circle_info/<int:zp_circle_id>/', get_zp_circle_info, name='get_zp_circle_name_by_id'),
    path('panchayat_samiti_circle_info/', get_panchayat_samiti_circle_info, name='get_panchayat_samiti_circle_info'),  # For all Panchayat Samiti circles
    path('panchayat_samiti_circle_info/<int:panchayat_samiti_circle_id>/', get_panchayat_samiti_circle_info, name='get_panchayat_samiti_circle_info_by_id'),
 
    path('common_login/', common_login.as_view(), name='login'),
# ZP & PS user details    
    path('zp_circle_user_info/<int:user_id>/', ZpCircleUserListView.as_view(), name='zp_circle_user_details'),
    path('zp_circle_user_info/', ZpCircleUserListView.as_view(), name='zp_circle_user_list'),
    path('panchayat_samiti_circle_user_info/', PanchayatSamitiCircleUserListView.as_view(), name='panchayat_samiti_circle_user_list'),
    path('panchayat_samiti_circle_user_info/<int:user_id>/', PanchayatSamitiCircleUserListView.as_view(), name='panchayat_samiti_circle_user_detail'),
    path('zp_circle_user_list_pdf/', ZpCircleUserListPDFView.as_view(), name='zp_circle_user_list_pdf'),
    path('ps_circle_user_list_pdf/', PanchayatSamitiCircleUserListPDFView.as_view(), name='panchayat_samiti_circle_user_list_pdf'),
    path('manage_zp_circle_user/<int:zp_circle_user_id>/', manage_zp_circle_user, name='manage_zp_circle_user'),
    path('manage_ps_circle_user/<int:panchayat_samiti_circle_user_id>/', manage_ps_circle_user, name='panchayat_samiti_circle_user'),
    path('get_voted_list_by_booth/<int:booth_id>/', get_voted_list_by_booth, name='voter-list'),
# surname wise
    path('surname_wise_voter_count/', surname_wise_voter_count, name='surname_wise_voter_count'),
    path('get_voter_details_by_surname/<int:surname_id>/', get_voter_details_by_surname, name='get_voter_details_by_surname'),
    path('surname_wise_voter_count_pdf/', surname_wise_voter_count_pdf, name='surname_wise_voter_count_pdf'),
    path('surname_wise_favour_caste_assign_voters/', surname_wise_favour_caste_assign_voters,  name='surname_wise_favour_assign_voters'),
    path('get_nagar_parishad_total_voters/', get_voters_by_booth_and_town_wise,  name='get_nagar_parishad_total_voters'),
    path('booth_and_surname_wise_voter_count/<int:booth_id>/',booth_and_surname_wise_voter_count,name='booth_and_surname_wise_voter_count'),
    path('booth_and_surname_wise_voter_details/<int:booth_id>/<int:surname_id>/',booth_and_surname_wise_voter_details,name='booth_and_surname_wise_voter_details'),
    path('booth_and_surname_wise_voter_count_pdf/<int:booth_id>/',booth_and_surname_wise_voter_count_pdf,name='booth_and_surname_wise_voter_count_pdf'),
#PS circle use wise
    path('get_booth_names_by_ps_circle_user_wise/<int:panchayat_samiti_circle_user_id>/',get_booth_names_by_ps_circle_user_wise,name="get_booth_names_by_ps_circle_user_wise"),
    path('ps_circle_user_vote_confirmation/<int:panchayat_samiti_circle_user_id>/<int:vote_confirmation_id>/', ps_circle_user_vote_confirmation, name='ps_circle_user_vote_confirmation'),
    path('ps_circle_user_cast_wise/<int:panchayat_samiti_circle_user_id>/<int:cast_id>/', ps_circle_user_cast_wise, name='ps_circle_user_cast_wise'),
    path('ps_circle_user_religion_wise/<int:panchayat_samiti_circle_user_id>/<int:religion_id>/',ps_circle_user_religion_wise, name='ps_circle_user_religion_wise'),
    path('ps_circle_user_favour_wise/<int:panchayat_samiti_circle_user_id>/<int:favour_id>/', ps_circle_user_favour_wise, name='ps_circle_user_favour_wise'),
# ZP circle use wise
    path('zp_circle_user_wise_panchayat_samiti_circle/<int:zp_circle_user_id>/', PanchayatSamitiCircleAPIView.as_view(), name='panchayat_samiti_circle'),
    path('zp_circle_user_vote_wise_confirmation/<int:zp_circle_user_id>/<int:vote_confirmation_id>/', zp_circle_user_vote_confirmation, name='zp_circle_user_vote_confirmation'),
    path('zp_circle_user_wise_cast_wise/<int:zp_circle_user_id>/<int:cast_id>/', zp_circle_user_cast_wise, name='zp_circle_user_cast_wise'),
    path('zp_circle_user_wise_booths/<int:zp_circle_user_id>/', BoothListByZPCircleUser.as_view(), name='booth-list-by-zp-circle-user'),
    path('zp_circle_user_wise_favour_voters/<int:zp_circle_user_id>/<int:favour_id>/', VoterListByZPCircleUser.as_view(), name='voter-list-by-zp-circle-user'),

    
# admin pannel 
    path('admin/', include('accounts.urls'))
    
]
