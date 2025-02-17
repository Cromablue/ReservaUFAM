from django.contrib import admin
from .models import UserProfile, AdminProfile, Reserva, AllowedUser

admin.site.register(UserProfile)
admin.site.register(AdminProfile)
admin.site.register(Reserva)
admin.site.register(AllowedUser)