# Importa as dependências necessárias para o funcionamento da API, incluindo autenticação, permissões e manipulação de erros.
from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.utils.timezone import now
from .models import Reservation
from .serializers import UserProfileSerializer, ReservationSerializer 

# Cadastro de usuário: Classe responsável pela criação de novos usuários.
class RegisterView(APIView):
    def post(self, request):
        # Usa o serializer para validar e salvar os dados do usuário.
        serializer = UserProfileSerializer(data=request.data)
        
        # Verifica se os dados são válidos.
        if serializer.is_valid():
            user = serializer.save()
            password = serializer.validated_data['password']

            # Valida a senha: ela precisa ter pelo menos 8 caracteres, conter letras e números.
            if len(password) < 8 or not any(char.isdigit() for char in password) or not any(char.isalpha() for char in password):
                raise ValidationError("A senha deve ter pelo menos 8 caracteres, incluindo letras e números.")

            # Criptografa a senha e salva o usuário no banco.
            user.set_password(password)  
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Retorna erros caso o serializer não seja válido.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login de usuário: Classe responsável pela autenticação do usuário.
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Verifica as credenciais e autentica o usuário.
        user = authenticate(username=username, password=password)

        if user and user.is_active:
            # Gera tokens JWT para o usuário.
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        
        # Levanta erro caso as credenciais sejam inválidas ou o usuário esteja inativo.
        raise ValidationError("Credenciais inválidas ou usuário inativo.")

# Solicitação de reserva: Classe para criação de reservas.
class CreateReservationView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]  # Exige que o usuário esteja autenticado

    def perform_create(self, serializer):
        # Atribui o usuário logado à reserva e define o status como 'Pendente'.
        serializer.save(user=self.request.user, status='Pendente')

# Lista de reservas para administradores: Classe para visualizar todas as reservas de administradores.
class AdminReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAdminUser]  # Exige que o usuário seja administrador

    def get_queryset(self):
        # Obtém parâmetros de filtro (status e categoria) da query string da requisição.
        status_filter = self.request.query_params.get('status', 'Pendente')
        category_filter = self.request.query_params.get('category', '').lower()

        # Filtra as reservas com base no status e na data final.
        queryset = Reservation.objects.filter(status=status_filter, final_date__gte=now().date()).order_by('initial_date')

        # Filtra por categoria se for 'auditorio' ou 'veiculo'.
        if category_filter == 'auditorio':
            queryset = queryset.filter(auditorium__isnull=False)
        elif category_filter == 'veiculo':
            queryset = queryset.filter(vehicle__isnull=False)

        # Usando `select_related` para otimizar a consulta e evitar consultas N+1.
        return queryset.select_related('auditorium', 'vehicle')  

# Aprovar/Reprovar reserva: Classe para administradores aprovar ou reprovar reservas.
class UpdateReservationStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]  # Exige que o usuário seja administrador

    def patch(self, request, pk):
        # Obtém a reserva com o ID especificado.
        reservation = get_object_or_404(Reservation, pk=pk)
        status_choice = request.data.get('status')

        # Verifica se o status enviado é válido.
        if status_choice not in ['Aprovado', 'Reprovado']:
            return Response({"error": "Status inválido."}, status=status.HTTP_400_BAD_REQUEST)

        # Atualiza o status da reserva e a salva.
        reservation.status = status_choice
        reservation.save()
        return Response({"message": f"Reserva {status_choice.lower()} com sucesso."}, status=status.HTTP_200_OK)

# Lista de reservas do usuário logado: Classe para exibir as reservas de um usuário logado.
class UserReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]  # Exige que o usuário esteja autenticado

    def get_queryset(self):
        # Filtra as reservas do usuário logado, garantindo que a data final seja maior ou igual à data atual.
        return Reservation.objects.filter(
            user=self.request.user,
            final_date__gte=now().date()
        ).order_by('-initial_date')

# Detalhes de uma reserva (admin e usuário): Classe para exibir detalhes de uma reserva específica.
class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]  # Exige que o usuário esteja autenticado

    def get_object(self):
        # Obtém o objeto da reserva.
        reservation = super().get_object()

        # Verifica se o usuário tem permissão para acessar a reserva (se for o dono ou administrador).
        if self.request.user == reservation.user or self.request.user.is_staff:
            return reservation
        raise PermissionDenied("Você não tem permissão para acessar esta reserva.")
