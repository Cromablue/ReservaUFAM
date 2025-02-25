from django.db import models
from django.contrib.auth.models import User

# Model to store additional user information
class UserProfile(models.Model):
    # One-to-one relationship with Django's default User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Mandatory fields for user identification
    siape = models.CharField(max_length=7, unique=True, null=False)  # Unique SIAPE code
    cpf = models.CharField(max_length=11, unique=True, null=False)  # Unique CPF
    name = models.CharField(max_length=255, null=False)  # Full name
    email = models.EmailField(unique=True, blank=True, null=False)  # Unique email
    cellphone = models.CharField(max_length=15, null=True, blank=True)  # Optional phone number
    password = models.CharField(max_length=12, null=False)  # User password
    
    # User status in the system
    STATUS_CHOICES = [
        ('Pendente', 'Pending'),
        ('Aprovado', 'Approved'),
        ('Reprovado', 'Rejected'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pendente', blank=True)

    def __str__(self):
        return self.name  # Returns the user's name when printing the object
    
    # Model to store administrator information
class AdminProfile(models.Model):
    # One-to-one relationship with Django's default User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    
    # Administrator details
    name = models.CharField(max_length=50)  # Full name
    cellphone = models.CharField(max_length=11, unique=True)  # Unique phone number
    cpf = models.CharField(max_length=11, unique=True)  # Unique CPF
    siape = models.CharField(max_length=7, unique=True)  # Unique SIAPE

    def __str__(self):
        return self.name  # Returns the administrator's name when printing the object
    
# Model for Auditoriums
class Auditorium(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Unique auditorium name
    capacity = models.IntegerField()  # Seating capacity
    location = models.CharField(max_length=255)  # Location description
    
    def __str__(self):
        return self.name
    
# Model for Meeting Rooms
class MeetingRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Unique meeting room name
    capacity = models.IntegerField()  # Seating capacity
    location = models.CharField(max_length=255)  # Location description
    
    def __str__(self):
        return self.name