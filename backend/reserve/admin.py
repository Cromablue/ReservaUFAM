from django.contrib import admin
from .models import Auditorium, MeetingRoom, Vehicle, Reservation, UserProfile, AdminProfile

admin.site.register(Auditorium)
admin.site.register(MeetingRoom)
admin.site.register(Vehicle)
admin.site.register(Reservation)
admin.site.register(UserProfile)
admin.site.register(AdminProfile)
