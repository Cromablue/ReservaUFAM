from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class users(models.Model):
    status = (
        ('pendente', 'pendente'),
        ('confirmado', 'confirmado'),
        ('rejeitado', 'rejeitado'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    Name = models.CharField(max_length=50)
    celphone = models.CharField(max_length=11, unique=True)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    cpf = models.CharField(max_length=11, unique=True)
    siap = models.CharField(max_length=11, unique=True)
    status = models.CharField(max_length=20, default='pendente')

    def __str__(self):
        return self.Name   

class SuperUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    Name = models.CharField(max_length=50)
    celphone = models.CharField(max_length=11, unique=True)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    cpf = models.CharField(max_length=11, unique=True)
    siap = models.CharField(max_length=11, unique=True)

    def __str__(self):
        return self.Name


class Reservas(models.Model):
    typesOfReserve = (
        ('Auditório', 'Auditório'),
        ('Sala de Reunião', 'Sala de Reunião'),
        ('Veículo', 'Veículo'),
    )
    status = (
        ('Pendente', 'Pendente'),
        ('Confirmado', 'Confirmado'),
        ('Cancelado', 'Cancelado'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    initial_date = models.DateField()
    final_date = models.DateField()
    initial_time = models.TimeField()
    final_time = models.TimeField()
    description = models.TextField()
    typeOfReserve = models.CharField(max_length=20, choices=typesOfReserve )
    status = models.CharField(max_length=20, default='Pendente')

    def __str__(self):
        return self.Name
    