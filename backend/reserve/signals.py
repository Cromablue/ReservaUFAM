from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from .models import CustomUser, YourModel  # Substitua YourModel pelo seu modelo real

# Cria token de autenticação ao criar usuário
@receiver(post_save, sender=CustomUser)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


# Replicação simples entre bancos para YourModel

@receiver(post_save, sender=YourModel)
def replicate_save(sender, instance, created, **kwargs):
    using_db = kwargs.get('using', 'default')
    target_db = 'replica' if using_db == 'default' else 'default'
    # Evita replicar se já estiver no banco alvo para evitar loop
    if kwargs.get('raw', False):
        return
    # Salva no banco alvo
    instance.save(using=target_db)

@receiver(post_delete, sender=YourModel)
def replicate_delete(sender, instance, **kwargs):
    using_db = kwargs.get('using', 'default')
    target_db = 'replica' if using_db == 'default' else 'default'
    # Apaga no banco alvo
    instance.delete(using=target_db)
