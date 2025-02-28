from rest_framework import serializers
from .models import CustomUser, Auditorium, MeetingRoom, Vehicle, Reservation

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'siape', 'role', 'cpf', 'cellphone', 'status']
        read_only_fields = ['id', 'email']  # Evita editar campos como id e email diretamente

    def create(self, validated_data):
        print("Dados recebidos para criar usuário:", validated_data)  # Debug
        user = CustomUser.objects.create_user(**validated_data)  # Garante que a senha seja criptografada
        print("Usuário criado com sucesso:", user.id)  # Debug
        return user

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def get_user(self, identifier):
        return CustomUser.objects.filter(
            Q(username=identifier) | Q(email=identifier) | Q(siape=identifier)
        ).first()

    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')

        user = self.get_user(identifier)

        if not user or not user.check_password(password):
            raise serializers.ValidationError(_('Invalid credentials or user not found'))

        attrs['user'] = user
        return attrs

class AuditoriumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditorium
        fields = ['id', 'name', 'capacity', 'location']

    def validate_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("Location cannot be empty.")
        return value

class MeetingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingRoom
        fields = ['id', 'name', 'capacity', 'location']

    def validate_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("Location cannot be empty.")
        return value

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'plate_number', 'model', 'capacity']

class ReservationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    auditorium = AuditoriumSerializer(required=False, allow_null=True)
    meeting_room = MeetingRoomSerializer(required=False, allow_null=True)
    vehicle = VehicleSerializer(required=False, allow_null=True)

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'initial_date', 'final_date', 'initial_time', 'final_time', 'description', 'status', 'auditorium', 'meeting_room', 'vehicle', 'is_deleted']

    def validate(self, data):
        selected_resources = [data.get('auditorium'), data.get('meeting_room'), data.get('vehicle')]
        
        if sum(bool(resource) for resource in selected_resources) != 1:
            raise serializers.ValidationError("You must select exactly one resource (Auditorium, Meeting Room, or Vehicle).")

        initial_date = data.get('initial_date')
        final_date = data.get('final_date')
        initial_time = data.get('initial_time')
        final_time = data.get('final_time')

        if initial_date > final_date:
            raise serializers.ValidationError("Initial date must be before final date.")

        if initial_date == final_date and initial_time >= final_time:
            raise serializers.ValidationError("Initial time must be before final time on the same day.")

        resource_filters = {k: v for k, v in data.items() if k in ['auditorium', 'meeting_room', 'vehicle'] and v}

        # Melhorando a consulta, considerando que as datas e horários já foram validados
        if Reservation.objects.filter(
            initial_date=initial_date,
            final_date=final_date,
            initial_time__lt=final_time,
            final_time__gt=initial_time,
            **resource_filters
        ).exists():
            raise serializers.ValidationError("This resource is already booked for the selected date and time.")

        return data