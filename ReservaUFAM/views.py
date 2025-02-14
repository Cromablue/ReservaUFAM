from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from .forms import UserForm, LoginForm
from django.contrib.auth import authenticate, login, logout


# Create your views here.
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
                siape=form.cleaned_data["siape"],
                cpf=form.cleaned_data["cpf"],
                name=form.cleaned_data["name"],
                email=form.cleaned_data["email"],
                cellphone=form.cleaned_data["cellphone"],
                password=make_password(form.cleaned_data["password"])  # Senha criptografada
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