from rest_framework import serializers
from .models import UserProfile, AdminProfile, Auditorium, MeetingRoom, Vehicle, Reservation
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'siape', 'cpf', 'name', 'email', 'cellphone', 'password', 'status']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        profile = UserProfile.objects.create(user=user, **validated_data)
        return profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        user.username = user_data.get('username', user.username)
        user.email = user_data.get('email', user.email)
        user.set_password(user_data.get('password', user.password))
        user.save()
        instance.siape = validated_data.get('siape', instance.siape)
        instance.cpf = validated_data.get('cpf', instance.cpf)
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.cellphone = validated_data.get('cellphone', instance.cellphone)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance

class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = ['user', 'name', 'cellphone', 'cpf', 'siape']

class AuditoriumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditorium
        fields = ['id', 'name', 'capacity', 'location']

class MeetingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingRoom
        fields = ['id', 'name', 'capacity', 'location']

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'plate_number', 'model', 'capacity']

class ReservationSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    auditorium = AuditoriumSerializer(required=False)
    meeting_room = MeetingRoomSerializer(required=False)
    vehicle = VehicleSerializer(required=False)

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'initial_date', 'final_date', 'initial_time', 'final_time', 'description', 'status', 'auditorium', 'meeting_room', 'vehicle', 'is_deleted']

    def validate(self, data):
        # Valida que apenas um recurso é selecionado
        selected_resources = [data.get('auditorium'), data.get('meeting_room'), data.get('vehicle')]
        if sum(bool(resource) for resource in selected_resources) != 1:
            raise serializers.ValidationError("You must select exactly one resource (Auditorium, Meeting Room, or Vehicle).")
        return data

    def create(self, validated_data):
        # Criando a reserva
        return Reservation.objects.create(**validated_data)
    
    def validate(self, data):
        # Verifica se há conflito de reservas
        initial_date = data.get('initial_date')
        final_date = data.get('final_date')
        initial_time = data.get('initial_time')
        final_time = data.get('final_time')
        auditorium = data.get('auditorium')
        meeting_room = data.get('meeting_room')
        vehicle = data.get('vehicle')

        # Lógica de validação para conflito de reservas
        if Reservation.objects.filter(
            initial_date=initial_date,
            final_date=final_date,
            initial_time__lt=final_time,
            final_time__gt=initial_time,
            auditorium=auditorium if auditorium else None,
            meeting_room=meeting_room if meeting_room else None,
            vehicle=vehicle if vehicle else None
        ).exists():
            raise serializers.ValidationError("This resource is already booked for the selected date and time.")
        
        return data

