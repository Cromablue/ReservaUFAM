#urls django
from django.urls import path
from django.conf import settings
from . import views
from .views import login_user


urlpatterns = [
    path('', views.home, name='home'),
    path('register', views.register_user, name='register'),
    path('add_user', views.register_siape_user, name='add_user'),
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
]