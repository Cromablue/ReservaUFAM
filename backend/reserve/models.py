from django.db import models
from django.contrib.auth.models import AbstractUser

# Model for Users
class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Administrator"
        PROFESSOR = "PROFESSOR", "Professor"
        TECHNICIAN = "TECHNICIAN", "Technician"
    
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.TECHNICIAN)
    siape = models.CharField(max_length=7, unique=True, null=False)
    cpf = models.CharField(max_length=11, unique=True, null=False)
    cellphone = models.CharField(max_length=15, null=True, blank=True)
    STATUS_CHOICES = [
        ('Pendente', 'Pending'),
        ('Aprovado', 'Approved'),
        ('Reprovado', 'Rejected'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pendente', blank=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

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
    
# Model for Vehicles
class Vehicle(models.Model):
    plate_number = models.CharField(max_length=10, unique=True)  # Unique vehicle plate number
    model = models.CharField(max_length=100)  # Vehicle model
    capacity = models.IntegerField()  # Passenger capacity
    
    def __str__(self):
        return f"{self.model} - {self.plate_number}"
    
# Model to store reservations
class Reservation(models.Model):
    # Possible reservation statuses
    STATUS_CHOICES = (
        ('Pendente', 'Pending'),
        ('Confirmado', 'Confirmed'),
        ('Cancelado', 'Canceled'),
    )

    # Relationship with the user making the reservation
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    
    # Reservation details
    initial_date = models.DateField()  # Reservation start date
    final_date = models.DateField()  # Reservation end date
    initial_time = models.TimeField()  # Start time
    final_time = models.TimeField()  # End time
    description = models.TextField()  # Activity description
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')  # Reservation status
    is_deleted = models.BooleanField(default=False)  # fild to use when someone delete the reservation, to didn't lost it

    # Foreign keys for different reservable items (optional, one should be filled)
    auditorium = models.ForeignKey(Auditorium, on_delete=models.SET_NULL, null=True, blank=True)
    meeting_room = models.ForeignKey(MeetingRoom, on_delete=models.SET_NULL, null=True, blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"Reservation by {self.user.username} ({self.status})"