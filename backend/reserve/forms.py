#forms.py
from django import forms
from django.contrib.auth.models import User
from .models import UserProfile, AdminProfile, Auditorium, MeetingRoom, Vehicle, Reservation
import re


# Custom validator for CPF (Brazilian format)
def validate_cpf(value):
    if not re.match(r'\d{11}$', value):
        raise forms.ValidationError("Invalid CPF format. Must contain exactly 11 digits.")
    
    # Custom validator for SIAPE
def validate_siape(value):
    if not re.match(r'\d{7}$', value):
        raise forms.ValidationError("Invalid SIAPE format. Must contain exactly 7 digits.")

# Custom validator for password security
def validate_password(value):
    if not re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$', value):
        raise forms.ValidationError("Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, and one special character.")


# User Registration Form
class UserProfileForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(), validators=[validate_password])
    cpf = forms.CharField(validators=[validate_cpf])
    siape = forms.CharField(validators=[validate_siape])
    
    class Meta:
        model = UserProfile
        fields = ['name', 'email', 'cellphone', 'cpf', 'siape', 'password']

# Auditorium Form
class AuditoriumForm(forms.ModelForm):
    class Meta:
        model = Auditorium
        fields = ['name', 'capacity', 'location']

# Meeting Room Form
class MeetingRoomForm(forms.ModelForm):
    class Meta:
        model = MeetingRoom
        fields = ['name', 'capacity', 'location']