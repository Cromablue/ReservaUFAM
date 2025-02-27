from rest_framework import serializers
from .models import CustomUser, Auditorium, MeetingRoom, Vehicle, Reservation

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'siape', 'cpf', 'cellphone', 'status']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

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

        resource_filters = {k: v for k, v in data.items() if k in ['auditorium', 'meeting_room', 'vehicle'] and v}

        if Reservation.objects.filter(
            initial_date=initial_date,
            final_date=final_date,
            initial_time__lt=final_time,
            final_time__gt=initial_time,
            **resource_filters
        ).exists():
            raise serializers.ValidationError("This resource is already booked for the selected date and time.")

        return data
