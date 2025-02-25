from django.contrib import admin
from .models import Auditorium, MeetingRoom, Vehicle, Reservation

admin.site.register(Auditorium)
admin.site.register(MeetingRoom)
admin.site.register(Vehicle)
admin.site.register(Reservation)
