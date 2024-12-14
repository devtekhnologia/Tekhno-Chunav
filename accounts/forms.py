# accounts/forms.py
from django import forms
from django.core.exceptions import ValidationError
import re

# Register Form
# class RegistrationForm(forms.Form):
#     username = forms.CharField(max_length=150, required=True, label='Name')
#     email = forms.IntegerField( required=True, label='Contact No.')
#     password = forms.CharField(widget=forms.PasswordInput, required=True, label='Password')
    

#     def clean(self):
#         cleaned_data = super().clean()
#         password = cleaned_data.get('password')


# Register Form
class RegistrationForm(forms.Form):
    username = forms.CharField(
        max_length=150,
        required=True,
        label='Username',
        widget=forms.TextInput(attrs={'placeholder': 'Enter username'}),
        error_messages={
            'required': 'Username is required',
            'max_length': 'Username cannot exceed 150 characters',
        }
    )
    
    contact_number = forms.CharField(
        max_length=10,
        min_length=10,
        required=True,
        label='Contact Number',
        widget=forms.TextInput(attrs={'placeholder': 'Enter contact number'}),
        error_messages={
            'required': 'Contact number is required',
            'min_length': 'Contact number must be 10 digits',
            'max_length': 'Contact number must be 10 digits',
        }
    )
    
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Enter password'}),
        required=True,
        label='Password',
        error_messages={
            'required': 'Password is required',
        }
    )

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username.isalpha():
            raise ValidationError("Username should only contain letters")
        return username

    def clean_contact_number(self):
        contact_number = self.cleaned_data.get('contact_number')
        if not re.match(r'^\d{10}$', contact_number):
            raise ValidationError("Contact number must be 10 digits long and numeric")
        return contact_number

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long")
        if not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
            raise ValidationError("Password must contain both letters and numbers")
        return password

# Login Form
class LoginForm(forms.Form):
    mobile_number = forms.CharField(
        max_length=10,  # Adjust length as necessary
        required=True,
        label='Mobile Number',
        widget=forms.TextInput(attrs={'placeholder': 'Enter your mobile number'}),
        error_messages={
            'required': 'Mobile number is required',
            'max_length': 'Mobile number cannot exceed 10 characters'
        }
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Enter your password'}),
        required=True,
        label='Password',
        error_messages={
            'required': 'Password is required',
        }
    )

    def clean_mobile_number(self):
        mobile_number = self.cleaned_data.get('mobile_number')
        if not mobile_number.isdigit():
            raise forms.ValidationError("Mobile number should only contain digits")
        return mobile_number

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password) < 8:
            raise forms.ValidationError("Password must be at least 8 characters long")
        return password

# Login Form
# class LoginForm(forms.Form):
#     username = forms.CharField(
#         max_length=150,
#         required=True,
#         label='Username',
#         widget=forms.TextInput(attrs={'placeholder': 'Enter your username'}),
#         error_messages={
#             'required': 'Username is required',
#             'max_length': 'Username cannot exceed 150 characters'
#         }
#     )
#     password = forms.CharField(
#         widget=forms.PasswordInput(attrs={'placeholder': 'Enter your password'}),
#         required=True,
#         label='Password',
#         error_messages={
#             'required': 'Password is required',
#         }
#     )

#     def clean_username(self):
#         username = self.cleaned_data.get('username')
#         if not username.isalpha():
#             raise forms.ValidationError("Username should only contain letters")
#         return username

#     def clean_password(self):
#         password = self.cleaned_data.get('password')
#         if len(password) < 8:
#             raise forms.ValidationError("Password must be at least 8 characters long")
#         return password


class TownUserForm(forms.Form):
    name = forms.CharField(
        max_length=150,
        required=True,
        label="Town User's Name",
        widget=forms.TextInput(attrs={'placeholder': "Enter Town User's Name"}),
        error_messages={
            'required': 'Town User name is required',
            'max_length': 'Name cannot exceed 150 characters',
        }
    )
    
    contact = forms.CharField(
        max_length=10,
        min_length=10,
        required=True,
        label='Contact Number',
        widget=forms.TextInput(attrs={'placeholder': "Enter Town User's Contact Number"}),
        error_messages={
            'required': 'Contact number is required',
            'min_length': 'Contact number must be 10 digits',
            'max_length': 'Contact number must be 10 digits',
        }
    )
    
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': "Enter Town User's Password"}),
        required=True,
        label='Password',
        error_messages={
            'required': 'Password is required',
        }
    )

    def clean_name(self):
        name = self.cleaned_data.get('name')
        # Ensure name contains only alphabetic characters and spaces
        if not re.match(r'^[A-Za-z\s]+$', name):
            raise ValidationError("Name should only contain letters and spaces")
        return name

    def clean_contact(self):
        contact = self.cleaned_data.get('contact')
        if not re.match(r'^\d{10}$', contact):
            raise ValidationError("Contact number must be 10 digits long and numeric")
        return contact

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long")
        if not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
            raise ValidationError("Password must contain both letters and numbers")
        return password