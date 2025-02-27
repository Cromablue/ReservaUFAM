from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from django.utils.timezone import now
from django.shortcuts import render, get_object_or_404
from .models import Reservation, Auditorium, MeetingRoom, Vehicle
from .serializers import (
    AuditoriumSerializer, MeetingRoomSerializer, VehicleSerializer,
    CustomUserSerializer, ReservationSerializer
)

def index(request):
    return JsonResponse({'message': 'Ola do Django!'})

# Painel do administrador para gerenciar auditórios
class AuditoriumAdminView(generics.ListCreateAPIView):
    queryset = Auditorium.objects.all()
    serializer_class = AuditoriumSerializer
    permission_classes = [permissions.IsAdminUser]

class AuditoriumDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Auditorium.objects.all()
    serializer_class = AuditoriumSerializer
    permission_classes = [permissions.IsAdminUser]

# Painel do administrador para gerenciar salas de reunião
class MeetingRoomAdminView(generics.ListCreateAPIView):
    queryset = MeetingRoom.objects.all()
    serializer_class = MeetingRoomSerializer
    permission_classes = [permissions.IsAdminUser]

class MeetingRoomDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MeetingRoom.objects.all()
    serializer_class = MeetingRoomSerializer
    permission_classes = [permissions.IsAdminUser]

# Painel do administrador para gerenciar veículos
class VehicleAdminView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAdminUser]

class VehicleDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAdminUser]

# Cadastro de usuário
class RegisterView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            password = request.data.get('password')
            user.set_password(password)
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login de usuário
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            # Aqui usamos o token simples
            token, created = obtain_auth_token(request)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        raise ValidationError("Credenciais inválidas ou usuário inativo.")

# Listagem de reservas para administradores
class AdminReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        status_filter = self.request.query_params.get('status', 'Pendente')
        category_filter = self.request.query_params.get('category', '').lower()
        queryset = Reservation.objects.filter(status=status_filter, final_date__gte=now().date(), is_deleted=False).order_by('initial_date')
        if category_filter == 'auditorio':
            queryset = queryset.filter(auditorium__isnull=False)
        elif category_filter == 'veiculo':
            queryset = queryset.filter(vehicle__isnull=False)
        elif category_filter == 'sala de reunião':
            queryset = queryset.filter(meeting_room__isnull=False)
        return queryset.select_related('auditorium', 'vehicle', 'meeting_room')

# Listagem de reservas para usuário comum
class UserReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(
            user=self.request.user,
            final_date__gte=now().date(),
            is_deleted=False
        ).order_by('-initial_date')

# Criação de reservas
class CreateReservationView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        meeting_room = serializer.validated_data.get('meeting_room')
        if meeting_room and not Reservation.objects.filter(
            meeting_room=meeting_room,
            initial_date=serializer.validated_data['initial_date'],
            final_date=serializer.validated_data['final_date'],
            initial_time__lt=serializer.validated_data['final_time'],
            final_time__gt=serializer.validated_data['initial_time'],
        ).exists():
            serializer.save(user=self.request.user, status='Aprovado')
        else:
            serializer.save(user=self.request.user, status='Pendente')

# Aprovar/Reprovar reserva
class UpdateReservationStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk)
        status_choice = request.data.get('status')
        if status_choice not in ['Aprovado', 'Reprovado']:
            return Response({"error": "Status inválido."}, status=status.HTTP_400_BAD_REQUEST)
        reservation.status = status_choice
        reservation.save()
        return Response({"message": f"Reserva {status_choice.lower()} com sucesso."}, status=status.HTTP_200_OK)

# Cancelar reserva (marcar como deletada)
class CancelReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk, user=request.user, is_deleted=False)
        reservation.is_deleted = True
        reservation.save()
        return Response({"message": "Reserva cancelada com sucesso."}, status=status.HTTP_200_OK)
