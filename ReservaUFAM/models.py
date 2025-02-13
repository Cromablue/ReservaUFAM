from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    STATUS_CHOICES = (
        ('pendente', 'Pendente'),
        ('confirmado', 'Confirmado'),
        ('rejeitado', 'Rejeitado'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=50)
    cellphone = models.CharField(max_length=11, unique=True)
    cpf = models.CharField(max_length=11, unique=True)
    siap = models.CharField(max_length=7, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')

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
