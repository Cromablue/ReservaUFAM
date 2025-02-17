from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile, AllowedUser 
from .forms import UserForm, LoginForm, AllowedUserForm
from django.contrib.auth import authenticate, login, logout


# Create your views here.
@login_required
def home(request):
    return render(request, 'index.html')


#view de registro
def register_user(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            # Criar um usuário Django
            user = User.objects.create_user(
                username=form.cleaned_data["email"],  # Usando o email como username
                email=form.cleaned_data["email"],
                password=form.cleaned_data["password"]
            )

            # Criar um perfil associado ao usuário
            user_profile = UserProfile(
                user=user,
                name=form.cleaned_data["name"],
                email=form.cleaned_data["email"],
                siape=form.cleaned_data["siape"],
                cpf=form.cleaned_data["cpf"],
                cellphone=form.cleaned_data["cellphone"],
                password=make_password(form.cleaned_data["password"])  # Senha criptografada
                #verificar se o siape desse usuario está presente na lista dos usuarios permitidos.
            )
            user_profile.save()

            return redirect('login')  # Redirecionar para a página de login
    else:
        form = UserForm()

    return render(request, 'register.html', {'form': form})

#view de login

def login_user(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]

            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')  # Redireciona para a página inicial
            else:
                form.add_error(None, "Invalid email or password.")

    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})

#view de logout

def logout_user(request):
    logout(request)
    return redirect('home')


def is_admin(user):
    return user.is_superuser or hasattr(user, 'admin_profile')


@user_passes_test(is_admin)
def register_siape_user(request):
    form = AllowedUserForm()  # Garante que 'form' sempre tenha um valor

    if request.method == "POST":
        form = AllowedUserForm(request.POST)
        if form.is_valid():
            siape = form.cleaned_data["siape"]
            name = form.cleaned_data["name"]

            allowed_user = AllowedUser(siape=siape, name=name)
            allowed_user.save()

            print("Usuário permitido:", siape, name)  # Confirmação visual
            return redirect('home')

    return render(request, 'allowed_user.html', {'form': form})
