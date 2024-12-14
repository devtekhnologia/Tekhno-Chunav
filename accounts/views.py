import requests
import jwt
from django.shortcuts import render, redirect, HttpResponse
from django.contrib import messages
from .forms import RegistrationForm, LoginForm, TownUserForm
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
import logging

BASE_URL = "http://192.168.1.38:8000/"
LOCAL_URL = "http://192.168.1.38:8000/"


API_LOGIN_ENDPOINT = f"{BASE_URL}api/politician_login/"
API_REGISTER_POLITICIAN = f"{BASE_URL}api/politician_register/"

API_ADDTOWNUSER = f"{BASE_URL}api/town_user_register/"
API_ADDBOOTHUSER = f"{BASE_URL}api/register_user/"
API_ADDPRABHAGUSER = f"{BASE_URL}api/prabhag_users_create/"

API_TOTAL_VOTERS = f"{BASE_URL}api/total_voters/"

# Capitalize Name
def format_name(name):
    return ' '.join(part.capitalize() for part in name.split())

# @csrf_exempt
# def register(request):
#     if request.method == 'POST':
#         form = RegistrationForm(request.POST)
#         if form.is_valid():
#             # Extract cleaned data from the form
#             # politician_name = form.cleaned_data['politician_name']
#             # mobile_number = form.cleaned_data['mobile_number']
#             # password = form.cleaned_data['password']

#             # Prepare the data to send to the API
#             payload = {
#                 'politician_name': form.cleaned_data['politician_name'],
#                 'politician_contact_number': form.cleaned_data['mobile_number'],  # Correct field mapping
#                 'politician_password': form.cleaned_data['password'],
#             }
#             print('data--------------------',payload)

#             try:
#                 # Send data to the API using a POST request
#                 response = requests.post(API_REGISTER_POLITICIAN, data=payload)

#                 # Check if the API call was successful (status code 201)
#                 if response.status_code == 201:
#                     messages.success(request, 'Registration successful!')
#                     return redirect('login')
#                 elif response.status_code == 400:
#                     messages.error(request, 'Invalid data submitted. Please check your input.')
#                 else:
#                     messages.error(request, 'Registration failed. Please try again later.')

#             except requests.exceptions.RequestException as e:
#                 # Handle any exceptions (e.g., network issues)
#                 messages.error(request, f'Registration failed: {e}')

#         else:
#             # If the form is invalid, log the errors for debugging
#             print(form.errors)

#     else:
#         # If it's a GET request, initialize an empty form
#         form = RegistrationForm()

#     # Render the registration page with the form
#     return render(request, 'register.html', {'form': form})

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            data = {
                'politician_name': form.cleaned_data['username'],
                'politician_contact_number': form.cleaned_data['contact_number'],  # Corrected
                'politician_password': form.cleaned_data['password'],
            }
            try:
                response = requests.post(API_REGISTER_POLITICIAN, data=data)
                response.raise_for_status()
                if response.status_code == 201:
                    messages.success(request, 'Registration successful!')
                    return redirect('login')
            except requests.exceptions.RequestException as e:
                messages.error(request, f'Registration failed: {e}')
        else:
            print(form.errors)  # Log form errors for debugging
    else:
        form = RegistrationForm()
    return render(request, 'register.html', {'form': form})

# Login view
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            data1 = {
                'politician_name': form.cleaned_data['mobile_number'],
                'politician_password': form.cleaned_data['password'],
            }
            # print('payload--------', data1)
            response = requests.post(f"{BASE_URL}api/politician_login/", data=data1)
            if response.status_code == 200:
                response_data = response.json()
                token = response_data.get('token')
                decoded_data = jwt.decode(token, options={"verify_signature": False})
                # print('decoded pid---',decoded_data)
                politician_id = response_data.get('politician_id')  # Extract the politician_id
                mobile_number = form.cleaned_data['mobile_number']

                user, created = User.objects.get_or_create(username=mobile_number)
                if created:
                    user.set_password(None)
                    user.save()

                request.session['auth_token'] = token
                request.session['politician_id'] = decoded_data['politician_id']
                auth_login(request, user)

                return redirect('dashboard')
            else:
                messages.error(request, 'Log-in failed. Please check your credentials and try again.')
        else:
            # If form is not valid, errors will be automatically rendered
            messages.error(request, 'Please correct the errors above.')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})


# Logout
def logout_view(request):
    auth_logout(request)  # Logs out the user
    request.session.flush()  # Clears the session data
    messages.success(request, 'You have successfully Signed out.')
    return redirect('login')

# Dashboard
@login_required(login_url='login')
def dashboard(request):
    politician_id = request.session.get('politician_id')
    # print('PID--',politician_id)
    return render(request, 'dashboard.html', {'p_id': politician_id})

# Navbar
@login_required(login_url='login')
def navbar(request):
    return render(request, 'navbar.html')

#  User profile
@login_required(login_url='login')
def user_profile(request):
    # Fetch current user's details
    politician_id = request.session.get('politician_id')

    response = requests.get(f"{BASE_URL}api/politician_get_by_id/{politician_id}/")
    if response.status_code == 200:
        user_data_list = response.json()  # This is a list
        if user_data_list:  # Check if the list is not empty
            user_data = user_data_list[0]  # Access the first item in the list
            name = user_data.get('politician_name')
            contact = user_data.get('politician_contact_number')
            about_me = user_data.get('politician_about', '...')
            user_id = user_data.get('politician_id')  # Get the user ID
        else:
            name = contact = about_me = 'Not available'
    else:
        name = contact = about_me = 'Not available'

    # Get the politician_id from session
    politician_id = request.session.get('politician_id')
    context = {
        'name': name,
        'contact_number': contact,
        'about_me': about_me,
        'p_id': politician_id,  # Include politician_id in context
    }
    return render(request, 'User.html', context)


#  Users
@login_required(login_url='login')
def user_list(request):
    return render(request, 'users.html')


# Booth Details
@login_required(login_url='login')
def BoothDetails(request):
    # Fetch the data from the API
    response = requests.get(f"{BASE_URL}api/booth_votes_summary/")
    # booth_data = response.json() if response.status_code == 200 else []

    if response.status_code == 200:
        booth_data = response.json()  # Assuming the API returns a JSON response
        # Capitalize each word in specific fields
        for item in booth_data:
            item['user_name'] = item['user_name'].title() if item.get('user_name') else ''
    else:
        data = []

    # Search functionality
    # search_query = request.GET.get('search', '')
    # if search_query:
    #     booth_data = [
    #         booth for booth in booth_data 
    #         if search_query.lower() in booth['booth_name'].lower() or 
    #            search_query.lower() in booth['town_name'].lower()
    #     ]

    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        booth_data = [
            booth for booth in booth_data
            if search_query.lower() in booth['booth_name'].lower() or
               search_query.lower() in booth['town_name'].lower() or
               search_query.lower() in booth['user_name'].lower()
        ]

    # Sort the booth_data alphabetically by Town Name
    booth_data.sort(key=lambda x: x['town_name'].lower())

     # Add formatted user names to the booth data
    for booth in booth_data:
        if booth['user_id']:
            # Assuming you have a way to get user names by their IDs (e.g., another API call or a local dict)
            booth['user_names'] = ", ".join([f'<a href="/boothUserActlog/{user_id}/" class="link-underline-primary text-dark">{user_name}</a>' for user_id, user_name in zip(booth['user_id'], booth['user_name'].split(", "))])
        else:
            booth['user_names'] = "None"

    # Pagination functionality
    paginator = Paginator(booth_data, 50)  # 50 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Pass the page_obj to the template
    context = {
        'page_obj': page_obj,
        'search_query': search_query  # Ensure this is passed
    }
    return render(request, 'BoothDetails.html', context)


# PrabhagWiseBoothList
@login_required(login_url='login')
def PrabhagWiseBoothList(request):
    # Fetch the data from the API
    response = requests.get(f"{BASE_URL}api/booth_votes_summary/")
    booth_data = response.json() if response.status_code == 200 else []

    # Filter by search query and Prabhag if provided
    search_query = request.GET.get('search', '')
    prabhag_id = request.GET.get('prabhag')
    if search_query or prabhag_id:
        booth_data = [
            booth for booth in booth_data 
            if (not search_query or search_query.lower() in booth['booth_name'].lower() or search_query.lower() in booth['town_name'].lower())
            and (not prabhag_id or booth['prabagh_id'] == int(prabhag_id))
        ]

    # Sort the booth_data alphabetically by Town Name
    booth_data.sort(key=lambda x: (x.get('prabagh_name', '') or '--').lower())

    # Pagination functionality
    paginator = Paginator(booth_data, 50)  # 50 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Pass the page_obj, search_query and prabhag_id to the template
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
        'prabhag_id': prabhag_id
    }
    return render(request, 'PrabhagWiseBoothList.html', context)


# Town Details
@login_required(login_url='login')
def TownDetails(request):
    # Fetch search query if available
    search_query = request.GET.get('search', '')

    # Fetch data from the API
    api_url = f"{BASE_URL}api/town_voter_count/"
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()  # Assuming the API returns a JSON response
        # Capitalize each word in the 'town_user_names' field when multiple names are separated by commas
        for item in data:
            if item.get('town_user_names'):
                # Split names by commas, capitalize each name, and join them back with commas
                item['town_user_names'] = ', '.join(
                    name.strip().title() for name in item['town_user_names'].split(',')
                )
    else:
        data = []

    # Filter data by search query
    if search_query:
        data = [item for item in data
                 if (item.get('town_name') and search_query.lower() in item['town_name'].lower()) or
                    (item.get('town_user_names') and search_query.lower() in item['town_user_names'].lower())
                ]

    # Sort users by 'user_name' in alphabetical order
    data.sort(key=lambda x: x.get('town_name', '').lower())

    # for item in data:
    #     if len(item['town_user_names']) > 1:
    #         item['town_user_names'] = item['town_user_names'].split(',')

    # Pagination
    paginator = Paginator(data, 50)  # Show 10 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'TownDetails.html', context)

# Prabhag Details
@login_required(login_url='login')
def PrabhagDetails(request):
    # Fetch search query if available
    search_query = request.GET.get('search', '')

    # Fetch data from the API
    api_url = f"{BASE_URL}api/get_prabhags/"
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()  # Assuming the API returns a JSON response
        # Capitalize each word in specific fields
        for item in data:
            item['prabhag_name'] = item['prabhag_name'].title() if item.get('prabhag_name') else ''
            item['prabhag_user_name'] = item['prabhag_user_name'].title() if item.get('prabhag_user_name') else ''
            # item['town_name'] = item['town_name'].title() if item.get('town_name') else ''
    else:
        data = []

    # Filter data by search query
    if search_query:
        data = [item for item in data if search_query.lower() in item['prabhag_name'].lower()]

    # Sort users by 'user_name' in alphabetical order
    # data.sort(key=lambda x: x.get('prabhag_name', '').lower())

    # Pagination
    paginator = Paginator(data, 50)  # Show 50 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'PrabhagDetails.html', context)


# Delete Booth User
logger = logging.getLogger(__name__)
@login_required(login_url='login')
@csrf_protect
@require_http_methods(["DELETE"])
def delete_booth_user(request, user_id):
    try:
        api_url = f"{BASE_URL}api/delete_booth_user/{user_id}/"
        response = requests.delete(api_url)

        logger.info(f"API response status: {response.status_code}")
        logger.info(f"API response content: {response.text}")

        # Handle both 200 and 204 as successful
        if response.status_code in [200, 204]:
            return JsonResponse({'success': True})
        else:
            error_message = f"Failed to delete user from API. Status: {response.status_code}, Response: {response.text}"
            logger.error(error_message)
            return JsonResponse({'success': False, 'message': error_message}, status=400)

    except requests.RequestException as e:
        logger.error(f"Request Exception: {str(e)}")
        return JsonResponse({'success': False, 'message': f'Error communicating with API: {str(e)}'}, status=500)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'success': False, 'message': f'An unexpected error occurred: {str(e)}'}, status=500)


# Booth User List
@login_required(login_url='login')
def BoothUser(request):
    search_query = request.GET.get('search', '')
    api_url_users = f"{BASE_URL}api/booth_user_info/"
    api_url_booths = f"{BASE_URL}api/booths/"
    
    try:
        # Fetch the booth user data
        response_users = requests.get(api_url_users)
        response_users.raise_for_status()  # Raise an error for bad responses
        booth_users = response_users.json()

        # Fetch the booth data
        response_booths = requests.get(api_url_booths)
        response_booths.raise_for_status()
        booths_data = response_booths.json()

        # Create a dictionary to map booth_id to booth_name for quick lookup
        booth_dict = {booth['booth_id']: booth['booth_name'] for booth in booths_data}

        for user in booth_users:
            # Capitalize the user name
            user['user_name'] = ' '.join(word.capitalize() for word in user['user_name'].split())
            
            # Get the booth names using the booth_ids
            user['booth_names'] = [booth_dict.get(booth_id) for booth_id in user['booth_ids']]

        if search_query:
            booth_users = [
                user for user in booth_users
                if (search_query.lower() in user['user_name'].lower() or
                    search_query.lower() in user['user_phone'].lower() or
                    any(search_query.lower() in town.lower() for town in user.get('town_names', [])))
            ]
        
        # Sort users by 'user_name' in alphabetical order
        booth_users.sort(key=lambda x: x.get('user_name', '').lower())

        # Paginator setup
        paginator = Paginator(booth_users, 50)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        context = {
            'page_obj': page_obj,
            'search_query': search_query
        }
        return render(request, 'BoothUser.html', context)
    
    except requests.RequestException as e:
        logger.error(f"API Request Error: {str(e)}")
        return render(request, 'error.html', {'error_message': 'Unable to fetch booth user data. Please try again later.'})



# Add Prabhag User
@login_required(login_url='login')
def AddPrabhagUser(request):
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name')
        contact = request.POST.get('contact')
        password = request.POST.get('password')
        prabhag_ids = request.POST.get('prabhagSelect')

        # Prepare data for the API request
        api_data = {
            "prabhag_user_name": name,
            "prabhag_user_contact_number": int(contact),
            "prabhag_user_password": password,
            "prabhag_user_prabhag_id": int(prabhag_ids)  # This will be a list of selected prabhag IDs
        }
        print('api_data-',api_data)

        # Send POST request to external API
        response = requests.post(API_ADDPRABHAGUSER, json=api_data)
        if response.status_code == 201:
            messages.success(request, 'The user saved successfully!')
        else:
            error_message = response.json().get('error', 'Failed to register user, try again!')
            messages.error(request, f'Error: {error_message}')
            
    return render(request, 'AddPrabhagUser.html')

# Add Town User
@login_required(login_url='login')
def AddTownUser(request):
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name')
        contact = request.POST.get('contact')
        password = request.POST.get('password')
        town_ids = request.POST.getlist('townSelect[]')

        # Prepare data for the API request
        api_data = {
            'town_user_name': name,
            'town_user_contact_number': contact,
            'town_user_password': password,
            'town_ids': town_ids  # This will be a list of selected town IDs
        }

        # Send POST request to external API
        response = requests.post(API_ADDTOWNUSER, json=api_data)
        if response.status_code == 201:
            messages.success(request, 'The user was saved successfully!')
        else:
            error_message = response.json().get('error', 'Failed to register user, try again!')
            messages.error(request, f'Error: {error_message}')
            
    return render(request, 'AddTownUser.html')

# Add ZP User under construction
@login_required(login_url='login')
def AddZPUser(request):
    api_url = f"{BASE_URL}api/zp_circle_user_register/"
 
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name')
        contact = request.POST.get('contact')
        password = request.POST.get('password')
        zp_id = request.POST.getlist('zpSelect[]')
 
        # Prepare data for the API request
        api_data = {
            'zp_circle_user_name': name,
            'zp_circle_user_contact_number': contact,
            'zp_circle_user_password': password,
            'zp_circle_ids': zp_id # This will be a list of selected town IDs
        }
 
        # Send POST request to external API
        response = requests.post(f"{BASE_URL}api/zp_circle_user_register/", json=api_data)
        if response.status_code == 201:
            messages.success(request, 'The user was saved successfully!')
        else:
            error_message = response.json().get('error', 'Failed to register user, try again!')
            messages.error(request, f'Error: {error_message}')
           
    return render(request, 'AddZPUser.html')

# @login_required(login_url='login')
# def AddZPUser(request):
#     if request.method == 'POST':
#         # Get form data
#         name = request.POST.get('name')
#         contact = request.POST.get('contact')
#         password = request.POST.get('password')
#         town_ids = request.POST.getlist('townSelect[]')

#         # Prepare data for the API request
#         api_data = {
#             'town_user_name': name,
#             'town_user_contact_number': contact,
#             'town_user_password': password,
#             'town_ids': town_ids  # This will be a list of selected town IDs
#         }

#         # Send POST request to external API
#         response = requests.post(API_ADDTOWNUSER, json=api_data)
#         if response.status_code == 201:
#             messages.success(request, 'The user was saved successfully!')
#         else:
#             error_message = response.json().get('error', 'Failed to register user, try again!')
#             messages.error(request, f'Error: {error_message}')
            
#     return render(request, 'AddZPUser.html')

# Add PS User under construction
@login_required(login_url='login')
def AddPSUser(request):
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name')
        contact = request.POST.get('contact')
        password = request.POST.get('password')
        ps_id = request.POST.getlist('psSelect[]')

        # Prepare data for the API request
        payload = {
            'panchayat_samiti_circle_user_name': name,
            'panchayat_samiti_circle_user_contact_number': contact,
            'panchayat_samiti_circle_user_password': password,
            'panchayat_samiti_circle_ids': ps_id  # This will be a list of selected town IDs
        }
        print('PS payload-----------------------------------------',payload)

        # Send POST request to external API
        response = requests.post(f"{BASE_URL}api/panchayat_samiti_circle_user_register/", json=payload)
        if response.status_code == 201:
            messages.success(request, 'The user was saved successfully!')
        else:
            error_message = response.json().get('error', 'Failed to register user, try again!')
            messages.error(request, f'Error: {error_message}')
            
    return render(request, 'AddPSUser.html')


# Add Booth User
@login_required(login_url='login')
def AddBoothUser(request):
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name')
        contact = request.POST.get('contact')
        password = request.POST.get('password')
        booth_ids = request.POST.getlist('boothSelect[]')

        # Prepare data for the API request
        api_data = {
            'user_name': name,
            'user_phone': contact,
            'user_password': password,
            'booth_ids': booth_ids  # This will be a list of selected booth IDs
        }
        print('json--', api_data)
        
        # Send POST request to external API
        response = requests.post(API_ADDBOOTHUSER, json=api_data)

        # Check for the response status
        try:
            response_json = response.json()
            # Check if 'message' exists and matches the success message
            if response_json.get('message') == "User registered successfully":
                messages.success(request, 'The user was saved successfully!')
            else:
                error_message = response_json.get('error', 'Failed to register user, try again!')
                messages.error(request, f'Error: {error_message}')
        except ValueError:
            # Handle case if the response is not a valid JSON
            messages.error(request, 'Failed to register user, try again!')
            
    return render(request, 'AddBoothUser.html')


# Exit Poll
@login_required(login_url='login')
def ExitPoll(request):
    return render(request, 'ExitPoll.html')

  
# # Rural/Urban Exit Poll
from django.http import JsonResponse
from django.shortcuts import render
@login_required(login_url='login')
def RUExitPoll(request):
    area_type = request.GET.get('area_type', '')  # '1' for Urban, '2' for Rural
    api_url = f"{BASE_URL}api/get_voter_count_by_town_area_type/{area_type}/" if area_type else f"{BASE_URL}api/get_voter_count_by_town_area_type/"

    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        booths_data = data.get("booth_voter_counts", [])
    except requests.exceptions.RequestException as e:
        booths_data = []
        print(f"Error fetching booth data: {e}")

    # Filter by search query if it exists
    search_query = request.GET.get('search')
    if search_query:
        booths_data = [
            booth for booth in booths_data
            if search_query.lower() in booth['booth_name'].lower() or
               any(search_query.lower() in user_name.lower() for user_name in booth['booth_user_names'].split(','))
        ]
    
    # Capitalize the first letter of each word in 'booth_user_names'
    for col in booths_data:
        if isinstance(col.get('booth_user_names'), str):
            col['booth_user_names'] = ' '.join(word.capitalize() for word in col['booth_user_names'].split())

    # Check if the request is an AJAX request
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        # Return only the table HTML as a response
        context = {
            'booths_data': booths_data,
        }
        return render(request, 'partials/booth_table_body.html', context)  # Render partial template

    context = {
        'booths_data': booths_data,
        'search_query': search_query,
    }
    return render(request, 'RUExitPoll.html', context)


# Voted/Non-voted List
@login_required(login_url='login')
def VotedNonvotedList(request):
    return render(request, 'VotedNonvotedList.html')


# Ensure export functionality based on area type
def get_voter_count_pdf(request, area_type):
    api_url = f"{BASE_URL}api/get_voter_count_by_town_area_type/{area_type}/"
    response = requests.get(api_url)
    # You should implement the PDF generation here and return the PDF file.
    # For now, it might just return a response with the appropriate headers for downloading.
    return HttpResponse(response.content, content_type="application/pdf")


# Town Exit Poll
@login_required(login_url='login')
def TownExitPoll(request):
    # API endpoint URL
    api_url = f"{BASE_URL}api/get_fevorable_voted_nonvoted_vote_count_by_town/"
    
    # Make the API call
    try:
        response = requests.get(api_url)
        response.raise_for_status()  
        towns_data = response.json()
    except requests.exceptions.RequestException as e:
        towns_data = []
        print(f"Error fetching data: {e}")

    # Get the sort order from the request parameters
    sort_order = request.GET.get('sort', 'asc')
    reverse_order = True if sort_order == 'desc' else False
    
    # Sort the data based on the 'favorable_voted_percentage'
    towns_data = sorted(towns_data, key=lambda x: x['favorable_voted_percentage'], reverse=reverse_order)

    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        towns_data = [town for town in towns_data if search_query.lower() in town['town_name'].lower()]

    # Capitalize the first letter of each word in 'Town Name' field
    for t_name in towns_data:
        if isinstance(t_name.get('town_name'), str):
            t_name['town_name'] = format_name(t_name['town_name'])

    # Pagination
    paginator = Paginator(towns_data, 50)  # 50 results per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'TownExitPoll.html', context)


# Booth Exit Poll
@login_required(login_url='login')
def BoothExitPoll(request):
    api_url = f"{BASE_URL}api/get_fevorable_voted_nonvoted_vote_count_by_booth/"
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        booths_data = response.json()
    except requests.exceptions.RequestException as e:
        booths_data = []
        print(f"Error fetching booth data: {e}")

    # Check for the sort parameter
    sort_order = request.GET.get('sort', 'asc')  # Default sort order
    reverse = True if sort_order == 'desc' else False

    # Sort data by 'favorable_voted_percentage'
    booths_data = sorted(booths_data, key=lambda x: x['favorable_voted_percentage'], reverse=reverse)

    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        booths_data = [booth for booth in booths_data if search_query.lower() in booth['booth_name'].lower()]

    # Pagination
    paginator = Paginator(booths_data, 50)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'BoothExitPoll.html', context)



# Town User List
@login_required(login_url='login')
def TownUserList(request):
    search_query = request.GET.get('search', '')  # Get search query if provided
    url = f"{BASE_URL}api/town_user_info/"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        users = response.json()

        # Filter users based on search query (name, town, contact)
        if search_query:
            search_query = search_query.lower()
            users = [user for user in users if 
             (isinstance(user.get('town_user_name'), str) and search_query in user['town_user_name'].lower()) or
             (isinstance(user.get('town_user_contact_number'), (str, int)) and str(search_query) in str(user['town_user_contact_number'])) or  # Partial match for contact
             (isinstance(user.get('town_names'), str) and search_query in user['town_names'].lower())]


        # Capitalize the first letter of each word in 'Name' field
        # for user in users:
        #     if isinstance(user.get('town_user_name'), str):
        #         user['town_user_name'] = ' '.join(word.capitalize() for word in user['town_user_name'].split())
        for user in users:
            if isinstance(user.get('town_user_name'), str):
                user['town_user_name'] = format_name(user['town_user_name'])

        # Sort users by 'town_user_name' in alphabetical order
        users.sort(key=lambda x: x.get('town_user_name', '').lower())

        # Paginate the filtered results
        paginator = Paginator(users, 10)  # 10 records per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        # Check if any users were found
        data_found = len(page_obj) > 0

        return render(request, 'KaryakartaList.html', {
            'page_obj': page_obj,
            'search_query': search_query,
            'data_found': data_found  # Pass data_found variable to template
        })
    
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return render(request, 'KaryakartaList.html', {
            'page_obj': None,
            'error': "Error fetching data."
        })


# Surname Wise Voter List
@login_required(login_url='login')
def SurnameWiseVoterList(request):
    search_query = request.GET.get('search', '')  # Get search query if provided
    sort_order = request.GET.get('sort', '')  # Get the sort query (a-z)
    url = "http://192.168.1.38:8000/api/surname_wise_voter_count/"
    
    response = requests.get(url)
    response.raise_for_status()
    surname_data = response.json()  # Parse the JSON response

    # Capitalize the first letter of each surname
    for data in surname_data:
        if isinstance(data.get('surname'), str):
            data['surname'] = data['surname'].capitalize() 

    # Filter surnames based on the search query (surname or count)
    if search_query:
        search_query = search_query.lower()
        surname_data = [data for data in surname_data if 
                         (isinstance(data.get('surname'), str) and search_query in data['surname'].lower()) or
                         (isinstance(data.get('count'), (int, float)) and str(search_query) in str(data['count']))]
        
    # If sort_order is 'a-z', sort surnames alphabetically (A-Z)
    if sort_order == 'a-z':
        surname_data.sort(key=lambda x: (x.get('surname', '').lower()if x.get('surname') else ''))  # Sort A-Z

    # Sort surnames alphabetically by surname, ensuring 'surname' is not None
    # surname_data.sort(key=lambda x: (x.get('surname', '').lower() if x.get('surname') else ''))


    # Paginate the filtered results
    paginator = Paginator(surname_data, 100)  # 100 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Check if any surnames were found
    data_found = len(page_obj) > 0

    return render(request, 'SurnameWiseVoterList.html', {
        'page_obj': page_obj,
        'search_query': search_query,
        'data_found': data_found,  # Pass data_found variable to template
        'sort_order': sort_order,
    })


# ZP User List
# @login_required(login_url='login')
# def ZPUserList(request):
#     return render(request, 'UnderConstruction.html')
# ZP User List
@login_required(login_url='login')
def ZPUserList(request):
    search_query = request.GET.get('search', '')  # Get search query if provided
    url = f"{BASE_URL}api/zp_circle_user_info/"
   
    try:
        response = requests.get(url)
        response.raise_for_status()
        users = response.json()
 
        # Filter users based on search query (name, town, contact)
        if search_query:
            search_query = search_query.lower()
            users = [user for user in users if
             (isinstance(user.get('zp_circle_user_name'), str) and search_query in user['zp_circle_user_name'].lower()) or
             (isinstance(user.get('zp_circle_user_contact_number'), (str, int)) and str(search_query) in str(user['zp_circle_user_contact_number'])) or  # Partial match for contact
             (isinstance(user.get('zp_circle_names'), str) and search_query in user['zp_circle_names'].lower())]
 
 
        # Capitalize the first letter of each word in 'Name' field
        # for user in users:
        #     if isinstance(user.get('town_user_name'), str):
        #         user['town_user_name'] = ' '.join(word.capitalize() for word in user['town_user_name'].split())
        for user in users:
            if isinstance(user.get('zp_circle_user_name'), str):
                user['zp_circle_user_name'] = format_name(user['zp_circle_user_name'])
 
        # Sort users by 'town_user_name' in alphabetical order
        users.sort(key=lambda x: x.get('zp_circle_user_name', '').lower())
 
        # Paginate the filtered results
        paginator = Paginator(users, 50)  # 50 records per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
 
        # Check if any users were found
        data_found = len(page_obj) > 0
 
        return render(request, 'ZPUserList.html', {
            'page_obj': page_obj,
            'search_query': search_query,
            'data_found': data_found  # Pass data_found variable to template
        })
   
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return render(request, 'ZPUserList.html', {
            'page_obj': None,
            'error': "Error fetching data."
        })

# PS User List
# @login_required(login_url='login')
# def PSUserList(request):
#     return render(request, 'UnderConstruction.html')
@login_required(login_url='login')
def PSUserList(request):
    search_query = request.GET.get('search', '')  # Get search query if provided
    url = f"{BASE_URL}api/panchayat_samiti_circle_user_info/"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        users = response.json()

        # Filter users based on search query (name, town, contact)
        if search_query:
            search_query = search_query.lower()
            users = [user for user in users if 
             (isinstance(user.get('panchayat_samiti_circle_user_name'), str) and search_query in user['panchayat_samiti_circle_user_name'].lower()) or
             (isinstance(user.get('town_user_contact_number'), (str, int)) and str(search_query) in str(user['town_user_contact_number'])) or  # Partial match for contact
             (isinstance(user.get('town_names'), str) and search_query in user['town_names'].lower())]


        # Capitalize the first letter of each word in 'Name' field
        for user in users:
            if isinstance(user.get('panchayat_samiti_circle_user_name'), str):
                user['panchayat_samiti_circle_user_name'] = format_name(user['panchayat_samiti_circle_user_name'])

        # Sort users by 'town_user_name' in alphabetical order
        users.sort(key=lambda x: x.get('panchayat_samiti_circle_user_name', '').lower())

        # Paginate the filtered results
        paginator = Paginator(users, 10)  # 10 records per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        # Check if any users were found
        data_found = len(page_obj) > 0

        return render(request, 'PSUserList.html', {
            'page_obj': page_obj,
            'search_query': search_query,
            'data_found': data_found  # Pass data_found variable to template
        })
    
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return render(request, 'PSUserList.html', {
            'page_obj': None,
            'error': "Error fetching data."
        })


# Prabhag User List
@login_required(login_url='login')
def PrabhagUserList(request):
    search_query = request.GET.get('search', '')  # Get search query if provided
    url = f"{BASE_URL}api/prabhag_users_info/"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        users = response.json()

        if response.status_code == 200:
            users = response.json()  # Assuming the API returns a JSON response
            # Capitalize each word in specific fields
            for item in users:
                item['prabhag_name'] = item['prabhag_name'].title() if item.get('prabhag_name') else ''
        else:
            users = []

        # Filter users based on search query (name, town, contact)
        if search_query:
            search_query = search_query.lower()
            users = [user for user in users if 
             (isinstance(user.get('prabhag_user_name'), str) and search_query in user['prabhag_user_name'].lower()) or
             (isinstance(user.get('prabhag_user_contact_number'), (str, int)) and str(search_query) in str(user['prabhag_user_contact_number'])) or  # Partial match for contact
             (isinstance(user.get('prabhag_name'), str) and search_query in user['prabhag_name'].lower())]


        # Capitalize the first letter of each word in 'Name' field
        # for user in users:
        #     if isinstance(user.get('prabhag_user_name'), str):
        #         user['prabhag_user_name'] = ' '.join(word.capitalize() for word in user['prabhag_user_name'].split())
        for user in users:
            if isinstance(user.get('prabhag_user_name'), str):
                user['prabhag_user_name'] = format_name(user['prabhag_user_name'])

        # Sort users by 'town_user_name' in alphabetical order
        users.sort(key=lambda x: x.get('prabhag_user_name', '').lower())

        # Paginate the filtered results
        paginator = Paginator(users, 10)  # 10 records per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        # Check if any users were found
        data_found = len(page_obj) > 0

        return render(request, 'PrabhagUserList.html', {
            'page_obj': page_obj,
            'search_query': search_query,
            'data_found': data_found  # Pass data_found variable to template
        })
    
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return render(request, 'PrabhagUserList.html', {
            'page_obj': None,
            'error': "Error fetching data."
        })


# Edit Town User
@login_required(login_url='login')
def EditTownUser(request, id):
    # Fetch data from the API
    response = requests.get(f"{BASE_URL}api/town_user_info/{id}/")

    if response.status_code == 200:
        user_data = response.json()

        if isinstance(user_data, list) and user_data:
            user_data = user_data[0]
            user_name = user_data.get('town_user_name', '')
            user_phone = user_data.get('town_user_contact_number', '')
        else:
            user_name = ''
            user_phone = ''
    else:
        user_name = ''
        user_phone = ''

    if request.method == 'POST':
        # Update user data
        new_name = request.POST.get('name')
        new_contact = request.POST.get('contact')

        update_response = requests.put(
            f"{BASE_URL}api/town_user/{id}/",
            json={
                "town_user_name": new_name,
                "town_user_contact_number": new_contact
            }
        )

        if update_response.status_code == 200:
            messages.success(request, "User updated successfully")
            return redirect('/KaryakartaList/')  # Adjust as necessary
        else:
            messages.error(request, "Failed to update user. Please try again.")

    context = {
        'user': {
            'user_id': id,
            'user_name': user_name,
            'user_phone': user_phone,
        },
        'messages': messages.get_messages(request),
    }
    return render(request, 'EditTownUser.html', context)


# Edit PS User
@login_required(login_url='login')
def EditPSUser(request, id):
    try:
        response = requests.get(f"{BASE_URL}api/panchayat_samiti_circle_user_info/{id}/")
        response.raise_for_status()
        user_data = response.json()
        # Assuming you expect a single user, take the first item
        user = user_data[0] if user_data else None
    except requests.exceptions.RequestException as e:
        messages.error(request, "Failed to fetch user data.")
        return redirect('some_error_handling_url')
 
    if request.method == 'POST':
        payload = {
            "panchayat_samiti_circle_user_name": request.POST.get('name'),
            "panchayat_samiti_circle_user_contact_number": request.POST.get('contact')
        }
        update_response = requests.put(f"{BASE_URL}api/manage_ps_circle_user/{id}/", json=payload)
 
        if update_response.status_code == 200:
            messages.success(request, "User updated successfully")
            return redirect('PSUserList')
        
        elif update_response.status_code != 200:
            messages.error(request, f"Failed to update user: {update_response.text}")
        else:
            messages.error(request, "Failed to update user.")
 
    return render(request, 'EditPSUser.html', {'user': user})


# Edit ZP User
@login_required(login_url='login')
def EditZPUser(request, id):
    try:
        response = requests.get(f"{BASE_URL}api/zp_circle_user_info/{id}/")
        response.raise_for_status()
        user_data = response.json()
        # Assuming you expect a single user, take the first item
        user = user_data[0] if user_data else None
    except requests.exceptions.RequestException as e:
        messages.error(request, "Failed to fetch user data.")
        return redirect('some_error_handling_url')
 
    if request.method == 'POST':
        payload = {
            "zp_circle_user_name": request.POST.get('name'),
            "zp_circle_user_contact_number": request.POST.get('contact'),
        }
        update_response = requests.put(f"{BASE_URL}api/manage_zp_circle_user/{id}/", json=payload)
 
        if update_response.status_code == 200:
            messages.success(request, "User updated successfully")
            return redirect('ZPUserList')
        elif update_response.status_code != 200:
            messages.error(request, f"Failed to update user: {update_response.text}")
        else:
            messages.error(request, "Failed to update user.")
 
    return render(request, 'EditZPUser.html', {'user': user})
 


# Delete Town User
@login_required(login_url='login')
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_town_user(request, user_id):
    try:
        api_url = f"{BASE_URL}api/delete_town_user/{user_id}/"
        response = requests.delete(api_url)

        logger.info(f"API response status: {response.status_code}")
        logger.info(f"API response content: {response.text}")

        # Handle both 200 and 204 as successful
        if response.status_code in [200, 204]:
            return JsonResponse({'success': True})
        else:
            error_message = f"Failed to delete user from API. Status: {response.status_code}, Response: {response.text}"
            logger.error(error_message)
            return JsonResponse({'success': False, 'message': error_message}, status=400)

    except requests.RequestException as e:
        logger.error(f"Request Exception: {str(e)}")
        return JsonResponse({'success': False, 'message': f'Error communicating with API: {str(e)}'}, status=500)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'success': False, 'message': f'An unexpected error occurred: {str(e)}'}, status=500)


# Index
@login_required(login_url='login')
def index(request):
    return render(request, 'index.html')


# Edit Booth User view
@login_required(login_url='login')
def EditBoothUser(request, id):
    try:
        response = requests.get(f"{BASE_URL}api/booth_user_info/{id}/")
        response.raise_for_status()
        user_data = response.json()
        # Assuming you expect a single user, take the first item
        user = user_data[0] if user_data else None
    except requests.exceptions.RequestException as e:
        messages.error(request, "Failed to fetch user data.")
        return redirect('some_error_handling_url')

    if request.method == 'POST':
        payload = {
            "user_name": request.POST.get('name'),
            "user_phone": request.POST.get('contact'),
        }
        update_response = requests.put(f"{BASE_URL}api/update_booth_users/{id}/", json=payload)

        if update_response.status_code == 200:
            messages.success(request, "User updated successfully")
            return redirect('BoothUser')
        elif update_response.status_code != 200:
            messages.error(request, f"Failed to update user: {update_response.text}")
        else:
            messages.error(request, "Failed to update user.")

    return render(request, 'EditBoothUser.html', {'user': user})


# # Total Voter List
# @login_required(login_url='login')
# def TotalVoterList(request):
#     sort_order = request.GET.get('sort', '')  # Get the sort query (a-z)
#     response = requests.get(f"{BASE_URL}api/total_voters/")
#     voters_list = []

#     if response.status_code == 200:
#         data = response.json()
#         if isinstance(data, list):
#             voters_list = data
#         elif isinstance(data, dict):
#             voters_list = data.get('voters', [])

#     # Capitalize each word in the 'voter_name' field
#     # for voter in voters_list:
#     #     voter_name = voter.get('voter_name', '')
#     #     voter['voter_name'] = voter_name.title() if voter_name else ''
#     for voter in voters_list:
#         if isinstance(voter.get('voter_name'), str):
#             voter['voter_name'] = format_name(voter['voter_name'])


#     # If sort_order is 'a-z', sort surnames alphabetically (A-Z)
#     # if sort_order == 'a-z':
#     #     voters_list.sort(key=lambda x: (x.get('voter_name', '').lower()if x.get('voter_name') else ''))  # Sort A-Z
#     # If sort_order is 'a-z', sort surnames alphabetically (A-Z)
#     # Sort the list based on 'a-z' or default
#     if sort_order == 'a-z':
#         voters_list.sort(key=lambda x: (x.get('voter_name', '').lower() if x.get('voter_name') else ''))  # Sort A-Z
#     else:
#         # Default sort can be based on 'voter_id' or any other default order
#         voters_list.sort(key=lambda x: x.get('voter_id', 0))  # Default sort by voter ID or any field


#     # Search functionality
#     search_query = request.GET.get('search', '').strip().lower()
#     if search_query:
#         voters_list = [
#             voter for voter in voters_list
#             if isinstance(voter.get('voter_name'), str) and search_query in voter.get('voter_name', '').lower()
#         ]

#     # Pagination
#     paginator = Paginator(voters_list, 500)  # Show 500 voters per page
#     page_number = request.GET.get('page', 1)
#     page_obj = paginator.get_page(page_number)

#     context = {
#         'voters_list': page_obj,
#         'paginator': paginator,
#         'page_obj': page_obj,
#         'sort_order': sort_order,
#     }
#     return render(request, 'TotalVoterList.html', context)


# Total Voter List
@login_required(login_url='login')
def TotalVoterList(request):
    sort_order = request.GET.get('sort', '')  # Get the sort query (a-z)
    response = requests.get(f"{BASE_URL}api/total_voters/")
    voters_list = []

    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            voters_list = data
        elif isinstance(data, dict):
            voters_list = data.get('voters', [])

    # Capitalize each word in the 'voter_name' field
    for voter in voters_list:
        if isinstance(voter.get('voter_name'), str):
            voter['voter_name'] = format_name(voter['voter_name'])

    # Define the color mapping for each `voter_favour_id`
    favour_colors = {
        1: '#2d8c61',
        2: '#dc3545',
        3: '#ffc107',
        4: '#3683fd',
        5: '#35befd',
        6: '#dc7093',
        7: '#8f0080',
    }

    # If sort_order is 'a-z', sort surnames alphabetically (A-Z)
    if sort_order == 'a-z':
        voters_list.sort(key=lambda x: (x.get('voter_name', '').lower() if x.get('voter_name') else ''))
    else:
        # Default sort by voter ID
        voters_list.sort(key=lambda x: x.get('voter_id', 0))

    # Search functionality
    search_query = request.GET.get('search', '').strip().lower()
    if search_query:
        voters_list = [
            voter for voter in voters_list
            if isinstance(voter.get('voter_name'), str) and search_query in voter.get('voter_name', '').lower()
        ]

    # Pagination
    paginator = Paginator(voters_list, 500)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    # Pass the color mapping to the template
    context = {
        'voters_list': page_obj,
        'paginator': paginator,
        'page_obj': page_obj,
        'sort_order': sort_order,
        'favour_colors': favour_colors,  # Pass the favour_colors dictionary
    }
    return render(request, 'TotalVoterList.html', context)


# Total Voter List with group Id
@login_required(login_url='login')
def TotalVoterListWithGroupId(request, id):
    sort_order = request.GET.get('sort', '')  # Get the sort query (a-z)
    response = requests.get(f"{BASE_URL}api/total_voters/")
    voters_list = []

    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            voters_list = data
        elif isinstance(data, dict):
            voters_list = data.get('voters', [])

    # Capitalize each word in the 'voter_name' field
    # for voter in voters_list:
    #     voter_name = voter.get('voter_name', '')
    #     voter['voter_name'] = voter_name.title() if voter_name else ''
    for voter in voters_list:
        if isinstance(voter.get('voter_name'), str):
            voter['voter_name'] = format_name(voter['voter_name'])
    
    # Define the color mapping for each `voter_favour_id`
    favour_colors = {
        1: '#2d8c61',
        2: '#dc3545',
        3: '#ffc107',
        4: '#3683fd',
        5: '#35befd',
        6: '#dc7093',
        7: '#8f0080',
    }

    # If sort_order is 'a-z', sort surnames alphabetically (A-Z)
    if sort_order == 'a-z':
        voters_list.sort(key=lambda x: (x.get('voter_name', '').lower() if x.get('voter_name') else ''))
    else:
        # Default sort by voter ID
        voters_list.sort(key=lambda x: x.get('voter_id', 0))

    # Search functionality
    search_query = request.GET.get('search', '').strip().lower()
    if search_query:
        voters_list = [
            voter for voter in voters_list
            if search_query in voter.get('voter_name', '').lower()
        ]

    # Pagination
    paginator = Paginator(voters_list, 500)  # Show 500 voters per page
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    context = {
        'voters_list': page_obj,
        'paginator': paginator,
        'page_obj': page_obj,
        'group_id': int(id),
        'sort_order': sort_order,
        'favour_colors': favour_colors,
    }
    return render(request, 'TotalVoterList.html', context)

# @login_required(login_url='login')
# def TotalVoterList(request):
#     response = requests.get(f"{BASE_URL}api/total_voters/")
#     voters_list = []

#     if response.status_code == 200:
#         data = response.json()
#         if isinstance(data, list):
#             voters_list = data
#         elif isinstance(data, dict):
#             voters_list = data.get('voters', [])

#     # Capitalize each word in the 'voter_name' field
#     for voter in voters_list:
#         voter_name = voter.get('voter_name', '')
#         voter['voter_name'] = voter_name.title() if voter_name else ''

#     # Sort functionality based on request parameter
#     sort_order = request.GET.get('sort', '').strip().lower()
#     if sort_order == 'a-z':
#         voters_list.sort(key=lambda voter: voter.get('voter_name', '').lower())

#     # Sort voter list by 'voter_name' alphabetically
#     voters_list.sort(key=lambda voter: voter.get('voter_name'))

#     # Search functionality
#     search_query = request.GET.get('search', '').strip().lower()
#     if search_query:
#         voters_list = [
#             voter for voter in voters_list
#             if search_query in voter.get('voter_name', '').lower()
#         ]

#     # Pagination
#     paginator = Paginator(voters_list, 500)  # Show 500 voters per page
#     page_number = request.GET.get('page', 1)
#     page_obj = paginator.get_page(page_number)

#     context = {
#         'voters_list': page_obj,
#         'paginator': paginator,
#         'page_obj': page_obj,
#     }
#     return render(request, 'TotalVoterList.html', context)

# Family Details
@login_required(login_url='login')
def FamilyDetails(request, id):
    url = f"{BASE_URL}api/family_group_details/{id}/"
    money_url = f"{BASE_URL}api/family_group_get_description/{id}/"
    
    # Send requests
    response = requests.get(url)
    money_response = requests.get(money_url)

    # Check if the response is valid JSON
    family_data = {}
    money_data = {}
    family_found = False

    if response.status_code == 200:
        try:
            family_data = response.json()  # Try to parse the JSON data
        except ValueError:
            print("Invalid JSON response from family group API.")
            family_data = {}  # or handle the error as needed
        else:
            family_found = True
            # Format family group and members names
            family_data['family_group_name'] = format_name(family_data['family_group_name'])
            family_data['family_group_head_name'] = format_name(family_data['family_group_head_name'])
            for member in family_data['family_members']:
                member['voter_name'] = format_name(member['voter_name'])

    if money_response.status_code == 200:
        try:
            money_data = money_response.json()  # Try to parse the JSON data
        except ValueError:
            print("Invalid JSON response from money group API.")
            money_data = {}  # or handle the error as needed

    return render(request, 'FamilyDetails.html', {'family_data': family_data, 'family_found': family_found, 'm_data': money_data})


# Group Details
@login_required(login_url='login')
def GroupDetails(request):
    # Fetch search query if available
    search_query = request.GET.get('search', '')

    # Fetch data from the API
    api_url = f"{BASE_URL}api/get_voter_group_details/"
    response = requests.get(api_url)


    # Check if the API request was successful
    if response.status_code == 200:
        try:
            data = response.json()  # Assuming the API returns a JSON response
            # Ensure the data is a list
            if isinstance(data, list):
                # Capitalize each word in the 'voter_group_name' field when multiple names are separated by commas
                for item in data:
                    # Ensure that 'item' is a dictionary and contains 'voter_group_name'
                    if isinstance(item, dict) and item.get('voter_group_name'):
                        # Capitalize each word in 'voter_group_name' by splitting names, title-casing them, and joining them back
                        item['voter_group_name'] = ', '.join(name.strip().title() for name in item['voter_group_name'].split(','))
            else:
                # Handle the case where the response is not a list as expected
                print("Unexpected data structure: API did not return a list.")
                data = []
        except ValueError:
            # Handle the case where JSON decoding fails
            print("Failed to decode JSON from the response.")
            data = []
    else:
        # Handle the case where the response status code is not 200
        print(f"API request failed with status code: {response.status_code}")
        data = []

    # Filter data by search query
    if search_query:
        data = [item for item in data if search_query.lower() in str(item['voter_group_name']).lower() or str(item['group_user_name']).lower() in search_query.lower()]

    # Sort users by 'user_name' in alphabetical order
    data.sort(key=lambda x: x.get('town_name', '').lower())

    # for item in data:
    #     if len(item['town_user_names']) > 1:
    #         item['town_user_names'] = item['town_user_names'].split(',')

    # Pagination
    paginator = Paginator(data, 50)  # Show 10 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'GroupDetails.html', context)


# Edit Voter Details View
@login_required(login_url='login')
def EditVoterDetails(request, id):
    print('VID-',id)
    return render(request, 'EditVoterDetails.html', {'id': id})


# Town Wise Voter list
@login_required(login_url='login')
def TownWiseVoterList(request):
        return render(request, 'TownWiseVoterList.html')

# Town Wise Voter list with ID
@login_required(login_url='login')
def TownWiseVoterListID(request,id):
    context = {
        'town_id': id,
    }
    return render(request, 'TownWiseVoterList.html', context)


# Under Construction
@login_required(login_url='login')
def UnderCons(request):
    return render(request, 'UnderConstruction.html')

# Booth Wise Voters List
@login_required(login_url='login')
def BoothWiseVoterList(request):
    return render(request, 'BoothWiseVoterList.html')

# Prabhag Wise Voters List
@login_required(login_url='login')
def PrabhagWiseVoterList(request):
    return render(request, 'PrabhagWiseVoterList.html')

# Prabhag Wise Voters List with ID
@login_required(login_url='login')
def PrabhagWiseVoterListWithID(request, id):
    return render(request, 'PrabhagWiseVoterList.html', {'town_id': id})

# Booth Wise Voters List with ID
@login_required(login_url='login')
def BoothWiseVoterListWithID(request, t_id, b_id):
    return render(request, 'BoothWiseVoterList.html', {'town_id': t_id, 'booth_id': b_id})

# Booth Wise Voters List with Only Booth_ID
@login_required(login_url='login')
def BoothWiseVoterListWithOnlyBID(request, b_id):
    return render(request, 'BoothWiseVoterList.html', {'booth_id': b_id})


# Cast Wise Voters
@login_required(login_url='login')
def CastWiseVoter(request):
    return render(request, 'CastWiseVoter.html')


# Cast Wise Voters
@login_required(login_url='login')
def ContactUs(request):
    return render(request, 'ContactUs.html')

# Activity Log
@login_required(login_url='login')
def ActivityLog(request):
    return render(request, 'activityLog.html')

# FAQs
@login_required(login_url='login')
def FAQs(request):
    return render(request, 'FAQs.html')

# CastwiseTotalVoterList
@login_required(login_url='login')
def castwiseTotalVoterList(request):
    return render(request, 'CastwiseTotalVoterList.html')

# CastwiseTownVoterList
@login_required(login_url='login')
def castwiseTownVoterList(request):
    return render(request, 'CastwiseTownVoterList.html')

# CastwiseBoothVoterList
@login_required(login_url='login')
def castwiseBoothVoterList(request):
    return render(request, 'CastwiseBoothVoterList.html')

# ReligionwiseTotalVoterList
@login_required(login_url='login')
def religionwiseTotalVoterList(request):
    return render(request, 'ReligionwiseTotalVoterList.html')

# ReligionwiseTownVoterList
@login_required(login_url='login')
def religionwiseTownVoterList(request):
    return render(request, 'ReligionwiseTownVoterList.html')

# ReligionwiseBoothVoterList
@login_required(login_url='login')
def religionwiseBoothVoterList(request):
    return render(request, 'ReligionwiseBoothVoterList.html')


# Town Type
@login_required(login_url='login')
def TownCategory(request):
    # Fetch search query if available
    search_query = request.GET.get('search', '')

    # Fetch data from the API
    api_url = f"{BASE_URL}api/town_voter_count/"
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()  # Assuming the API returns a JSON response
    else:
        data = []

    # Filter data by search query
    if search_query:
        data = [item for item in data if search_query.lower() in item['town_name'].lower()]

    # Sort users by 'user_name' in alphabetical order
    data.sort(key=lambda x: x.get('town_name', '').lower())

    # for item in data:
    #     if len(item['town_user_names']) > 1:
    #         item['town_user_names'] = item['town_user_names'].split(',')

    # Pagination
    paginator = Paginator(data, 50)  # Show 10 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'TownType.html', context)


# UrbanTownList
@login_required(login_url='login')
def ShaharList(request):
    # Fetch search query if available
    search_query = request.GET.get('search', '')

    # Fetch data from the API
    api_url = f"{BASE_URL}api/town_voter_count/"
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()  # Assuming the API returns a JSON response
    else:
        data = []

    # Filter data to include only towns with town_type = 2
    data = [item for item in data if item.get('town_type') == 1]

    # Filter data by search query
    if search_query:
        data = [item for item in data if search_query.lower() in item['town_name'].lower()]

    # Sort users by 'town_name' in alphabetical order
    data.sort(key=lambda x: x.get('town_name', '').lower())

    # Pagination
    paginator = Paginator(data, 50)  # Show 50 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'UrbanTownList.html', context)


# RuralTownList
@login_required(login_url='login')
def GraminList(request):
    # Fetch search query if available
    search_query = request.GET.get('search', '')

    # Fetch data from the API
    api_url = f"{BASE_URL}api/town_voter_count/"
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()  # Assuming the API returns a JSON response
    else:
        data = []

    # Filter data to include only towns with town_type = 2
    data = [item for item in data if item.get('town_type') == 2]

    # Filter data by search query
    if search_query:
        data = [item for item in data if search_query.lower() in item['town_name'].lower()]

    # Sort users by 'user_name' in alphabetical order
    data.sort(key=lambda x: x.get('town_name', '').lower())

    # Capitalize each word in the 'town_user_names' field when multiple names are separated by commas
    for item in data:
        if item.get('town_user_names'):
            # Split names by commas, capitalize each name, and join them back with commas
            item['town_user_names'] = ', '.join( name.strip().title() for name in item['town_user_names'].split(','))

    # Pagination
    paginator = Paginator(data, 50)  # Show 10 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'RuralTownList.html', context)

# deleteBoothUser
# @login_required(login_url='login')
# def deleteBoothUser(request, user_id):
#     if request.method == 'DELETE':
#         try:
#             user = User.objects.get(id=user_id)
#             user.delete()
#             return JsonResponse({"message": "User deleted successfully"}, status=200)
#         except User.DoesNotExist:
#             return JsonResponse({"message": "User not found"}, status=404)
#     return JsonResponse({"message": "Invalid request"}, status=400)


# Booth User Activity Log next Page
@login_required(login_url='login')
def boothUserActivityLog(request, id):
    # Fetch Booth User Info from the first API
    api_url = f"{BASE_URL}api/booth_user_info/{id}/"
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list) and len(data) > 0:
            first_item = data[0]
            booth_user_name = first_item.get('user_name', 'N/A')
            town_name = first_item.get('town_names', 'N/A')
            booth_names = first_item.get('booth_names', [])
            # Join multiple booth names into a single string, if any
            booth_names_display = ', '.join(booth_names) if booth_names else 'N/A'
        else:
            booth_user_name = town_name = booth_names_display = "N/A"
    else:
        booth_user_name = town_name = booth_names_display = "N/A"

    # Fetch Edited Voters Data from the second API
    edited_voters_api_url = f"{BASE_URL}api/edited_voters/{id}/"
    edited_voters_response = requests.get(edited_voters_api_url)

    if edited_voters_response.status_code == 200:
        edited_voters_data = edited_voters_response.json()

        # Process each voter in the data
        for user in edited_voters_data:
            # Check if 'voter_name' exists and is not None, then capitalize
            if 'voter_name' in user and user['voter_name']:
                user['voter_name'] = ' '.join(word.capitalize() for word in user['voter_name'].split())

        for voter in edited_voters_data:
            row_updated_fields = []
            if voter.get('voter_name'):
                row_updated_fields.append('Name')
            if voter.get('voter_contact_number'):
                row_updated_fields.append('Contact')
            if voter.get('voter_parent_name'):
                row_updated_fields.append('ParentName')
            if voter.get('voter_age'):
                row_updated_fields.append('Age')
            if voter.get('voter_gender'):
                row_updated_fields.append('Gender')
            if voter.get('cast_name'):
                row_updated_fields.append('Cast')
            if voter.get('voter_marital_status_id'):
                row_updated_fields.append('MaritalStatus')
            if voter.get('voter_live_status_id'):
                row_updated_fields.append('LiveStatus')
            else:
                row_updated_fields.append('Something')
            voter['updated_fields'] = row_updated_fields

        # Sort edited voters by 'last_updated_date' (assuming the date field is correctly named in your data)
        edited_voters_data.sort(key=lambda x: x.get('voter_updated_date'), reverse=True)  # Sort by last updated date

    else:
        edited_voters_data = []

    # Pagination logic: 10 records per page
    paginator = Paginator(edited_voters_data, 50)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Count of updated voters
    updated_voters_count = len(edited_voters_data)

    context = {
        'booth_user_name': booth_user_name,
        'town_name': town_name,
        'booth_name': booth_names_display,
        'page_obj': page_obj,  # Pass the page object to the template
        'updated_voters_count': updated_voters_count
    }
    return render(request, 'BoothUserActivityLog.html', context)

def custom_page_not_found(request, exception):
    return render(request, '404.html', status=404)

def custom_server_error(request):
    return render(request, '500.html', status=500)

def custom_page_not_found(request, exception):
    return render(request, '404.html', status=404)

def custom_server_error(request):
    return render(request, '500.html', status=500)


# PS Details
@login_required(login_url='login')
def PanchayatSamitiCircleList(request):
    # Fetch search query if available
    search_query = request.GET.get('search', '')

    # Fetch data from the API
    api_url = f"{BASE_URL}api/panchayat_samiti_circle_info/"
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()  # Assuming the API returns a JSON response
    else:
        data = []

    # Filter data by search query
    if search_query:
        data = [item for item in data if search_query.lower() in item['panchayat_samiti_circle_name'].lower()]

    # Sort in alphabetical order
    data.sort(key=lambda x: x.get('panchayat_samiti_circle_name', '').lower())

    # Pagination
    paginator = Paginator(data, 50)  # Show 10 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'PanchayatSamitiCircle.html', context)


# # ZillaParishadCircleList
# @login_required(login_url='login')
# def ZillaParishadCircleList(request):
#     # Fetch search query if available
#     search_query = request.GET.get('search', '')

#     # Fetch data from the API
#     api_url = f"{BASE_URL}api/zp_circle_names/"
#     response = requests.get(api_url)

#     if response.status_code == 200:
#         data = response.json()  # Assuming the API returns a JSON response
#     else:
#         data = []

#     # Filter data by search query
#     if search_query:
#         data = [item for item in data if search_query.lower() in item['zp_circle_name'].lower()]

#     # Sort in alphabetical order
#     data.sort(key=lambda x: x.get('zp_circle_name', '').lower())

#     # Pagination
#     paginator = Paginator(data, 50)  # Show 10 records per page
#     page_number = request.GET.get('page')
#     page_obj = paginator.get_page(page_number)

#     context = {
#         'page_obj': page_obj,
#         'search_query': search_query,
#     }
#     return render(request, 'ZillaParishadCircleList.html', context)


# ZP Details
@login_required(login_url='login')
def ZillaParishadCircleList(request):
    # Fetch search query if available
    search_query = request.GET.get('search', '')
 
    # Fetch data from the API
    api_url = f"{BASE_URL}api/zp_circle_info/"
    response = requests.get(api_url)
 
    if response.status_code == 200:
        data = response.json()  # Assuming the API returns a JSON response
    else:
        data = []
 
    # Filter data by search query
    if search_query:
        data = [item for item in data if search_query.lower() in item['zp_circle_name'].lower()]
 
    # Sort in alphabetical order
    data.sort(key=lambda x: x.get('zp_circle_name', '').lower())
 
    # Pagination
    paginator = Paginator(data, 50)  # Show 50 records per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
 
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    return render(request, 'ZillaParishadCircleList.html', context)