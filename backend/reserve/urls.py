from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    CreateReservationView,
    AdminReservationListView,
    UpdateReservationStatusView,
    UserReservationListView,
    ReservationDetailView
)

urlpatterns = [
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
    
    # Detalhes de uma reserva (admin e usuário)
    path('reservations/<int:pk>/', ReservationDetailView.as_view(), name='reservation-detail'),
]