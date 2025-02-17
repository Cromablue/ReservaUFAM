from django.db import models
from django.contrib.auth.models import User

#class to admin add alowed users, and they can have yours register aproved without wait to admin aproval
class AllowedUser(models.Model):
    siape = models.CharField(max_length=7, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    siape = models.CharField(max_length=7, unique=True, null=False)
    cpf = models.CharField(max_length=11, unique=True, null=False)
    name = models.CharField(max_length=255, null=False)
    email = models.EmailField(unique=True, blank=True, null=False)
    cellphone = models.CharField(max_length=15, null=True, blank=True)
    password = models.CharField(max_length=12, null=False)
    
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Aprovado', 'Aprovado'),
        ('Reprovado', 'Reprovado'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pendente', blank=True)

    def __str__(self):
        return self.name

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    name = models.CharField(max_length=50)
    cellphone = models.CharField(max_length=11, unique=True)
    cpf = models.CharField(max_length=11, unique=True)
    siape = models.CharField(max_length=7, unique=True)

    def __str__(self):
        return self.name


class Reserva(models.Model):
    TYPE_CHOICES = (
        ('Auditório', 'Auditório'),
        ('Sala de Reunião', 'Sala de Reunião'),
        ('Veículo', 'Veículo'),
    )

    STATUS_CHOICES = (
        ('Pendente', 'Pendente'),
        ('Confirmado', 'Confirmado'),
        ('Cancelado', 'Cancelado'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservas')
    initial_date = models.DateField()
    final_date = models.DateField()
    initial_time = models.TimeField()
    final_time = models.TimeField()
    description = models.TextField()
    type_of_reserve = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')

    def __str__(self):
        return f"{self.type_of_reserve} - {self.user.username} ({self.status})"
