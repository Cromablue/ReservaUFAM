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