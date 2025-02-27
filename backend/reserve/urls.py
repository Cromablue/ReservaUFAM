from django.urls import path
from . import views
from .views import (
    RegisterView,
    LoginView,
    CreateReservationView,
    AdminReservationListView,
    UpdateReservationStatusView,
    UserReservationListView,
    CancelReservationView,
)

urlpatterns = [
    # Home
    path('', views.index, name='index'),

    # Cadastro de usuário
    path('register/', RegisterView.as_view(), name='register'),
    
    # Login de usuário
    path('login/', LoginView.as_view(), name='login'),
    
    # Solicitação de reserva
    path('reservations/create/', CreateReservationView.as_view(), name='create-reservation'),
    
    # Lista de reservas para administradores
    path('admin/reservations/', AdminReservationListView.as_view(), name='admin-reservation-list'),
    
    # Aprovar/Reprovar reserva (admin)
    path('admin/reservations/<int:pk>/status/', UpdateReservationStatusView.as_view(), name='update-reservation-status'),
    
    # Lista de reservas do usuário logado
    path('user/reservations/', UserReservationListView.as_view(), name='user-reservation-list'),
    
    # Cancelar reserva
    path('user/reservations/<int:pk>/cancel/', CancelReservationView.as_view(), name='cancel-reservation'),
]