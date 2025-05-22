from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from .models import CustomUser, Reservation


# Criação automática de token ao criar um novo usuário
@receiver(post_save, sender=CustomUser)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


# Evita replicar eventos raw (como loaddata ou dumpdata)
def is_raw(kwargs):
    return kwargs.get('raw', False)


# Replicação de criação e atualização de reservas
@receiver(post_save, sender=Reservation)
def replicate_reservation_save(sender, instance, created, **kwargs):
    if is_raw(kwargs):
        return

    current_db = kwargs.get('using', 'default')
    target_db = 'replica' if current_db == 'default' else 'default'

    # Evita replicação infinita (loop)
    if hasattr(instance, '_replicated') and instance._replicated:
        return

    # Marca para não replicar novamente
    instance._replicated = True
    instance.save(using=target_db)
    instance._replicated = False


# Replicação de remoção de reservas
@receiver(post_delete, sender=Reservation)
def replicate_reservation_delete(sender, instance, **kwargs):
    if is_raw(kwargs):
        return

    current_db = kwargs.get('using', 'default')
    target_db = 'replica' if current_db == 'default' else 'default'

    # Evita loop se já estiver replicado
    try:
        # Busca a mesma reserva no banco alvo por ID e exclui
        Reservation.objects.using(target_db).filter(id=instance.id).delete()
    except Exception as e:
        print(f"Erro ao replicar exclusão: {e}")
