from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from datetime import date, time
from django.core.management import call_command
from .models import UserProfile, AdminProfile, Reserva


class UserProfileModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('migrate')
        cls.user = User.objects.create_user(
            username='testuser',
            password='12345'
        )

    def setUp(self):
        self.user_data = {
            'user': self.user,
            'name': 'Test User',
            'cellphone': '11999999999',
            'cpf': '12345678901',
            'siap': '1111111',
            'status': 'pendente'
        }

    def test_create_user(self):
        user = UserProfile.objects.create(**self.user_data)
        self.assertEqual(str(user), 'Test User')
        self.assertEqual(user.status, 'pendente')

    def test_unique_cellphone(self):
        UserProfile.objects.create(**self.user_data)
        duplicate_data = self.user_data.copy()
        duplicate_data['cpf'] = '98765432101'
        duplicate_data['siap'] = '2222222'
        with self.assertRaises(IntegrityError):
            UserProfile.objects.create(**duplicate_data)

    def test_unique_cpf(self):
        UserProfile.objects.create(**self.user_data)
        duplicate_data = self.user_data.copy()
        duplicate_data['cellphone'] = '11988888888'
        duplicate_data['siap'] = '3333333'
        with self.assertRaises(IntegrityError):
            UserProfile.objects.create(**duplicate_data)


class AdminProfileModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('migrate')
        cls.user = User.objects.create_user(
            username='testadmin',
            password='12345'
        )

    def setUp(self):
        self.admin_data = {
            'user': self.user,
            'name': 'Test Admin',
            'cellphone': '11999999999',
            'cpf': '12345678901',
            'siape': '1111111'
        }

    def test_create_admin(self):
        admin = AdminProfile.objects.create(**self.admin_data)
        self.assertEqual(str(admin), 'Test Admin')

    def test_unique_cellphone(self):
        AdminProfile.objects.create(**self.admin_data)
        duplicate_data = self.admin_data.copy()
        duplicate_data['cpf'] = '98765432101'
        duplicate_data['siape'] = '2222222'
        with self.assertRaises(IntegrityError):
            AdminProfile.objects.create(**duplicate_data)


class ReservaModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('migrate')
        cls.user = User.objects.create_user(
            username='testreserva',
            password='12345'
        )

    def setUp(self):
        self.reserva_data = {
            'user': self.user,
            'initial_date': date(2025, 1, 1),
            'final_date': date(2025, 1, 2),
            'initial_time': time(9, 0),
            'final_time': time(17, 0),
            'description': 'Teste de reserva',
            'type_of_reserve': 'Auditório',
            'status': 'Pendente'
        }

    def test_create_reserva(self):
        reserva = Reserva.objects.create(**self.reserva_data)
        self.assertEqual(reserva.status, 'Pendente')
        self.assertEqual(reserva.type_of_reserve, 'Auditório')

    def test_choices_type_of_reserve(self):
        reserva = Reserva.objects.create(**self.reserva_data)
        valid_types = [choice[0] for choice in Reserva._meta.get_field('type_of_reserve').choices]
        self.assertIn(reserva.type_of_reserve, valid_types)

    def test_choices_status(self):
        reserva = Reserva.objects.create(**self.reserva_data)
        valid_status = [choice[0] for choice in Reserva._meta.get_field('status').choices]
        self.assertIn(reserva.status, valid_status)

    def test_date_validation(self):
        reserva = Reserva.objects.create(**self.reserva_data)
        self.assertLessEqual(reserva.initial_date, reserva.final_date)

    def test_invalid_dates(self):
        invalid_data = self.reserva_data.copy()
        invalid_data['initial_date'] = date(2025, 1, 2)
        invalid_data['final_date'] = date(2025, 1, 1)
        with self.assertRaises(ValidationError):
            reserva = Reserva(**invalid_data)
            reserva.full_clean()  # Isso agora levantará um erro de validação

    def test_time_validation(self):
        reserva = Reserva.objects.create(**self.reserva_data)
        self.assertLessEqual(reserva.initial_time, reserva.final_time)
