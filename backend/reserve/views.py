# Bibliotecas padrão do Django
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from django.utils.timezone import now

# Django Rest Framework
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

# Django Rest Framework Simple JWT
from rest_framework_simplejwt.tokens import RefreshToken

# Modelos
from .models import CustomUser, Reservation, Auditorium, MeetingRoom, Vehicle

# Serializers
from .serializers import (
    AuditoriumSerializer, MeetingRoomSerializer, VehicleSerializer,
    CustomUserSerializer, ReservationSerializer, LoginSerializer
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
    permission_classes = [permissions.AllowAny]  # Permite acesso sem autenticação

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
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']  # Aqui você obtém o usuário do serializer
        
        # Gera o token
        token = RefreshToken.for_user(user)  # Agora 'user' está definido
        
        # Faz o login
        login(request, user)
        
        # Retorna o token e dados do usuário
        return Response({
            'token': str(token.access_token),  # Retorna o access token
            'user': CustomUserSerializer(user).data
        }, status=status.HTTP_200_OK)


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
