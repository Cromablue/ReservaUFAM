from django.shortcuts import render, redirect
from  .forms import UserForm 
from django.contrib.auth.hashers import make_password

# Create your views here.
def home(request):
    return render(request, 'index.html')

def register_user(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.password = make_password(form.cleaned_data["password"])
            user.save()
            return redirect('login')
    else:
        form = UserForm()
    return render(request, 'register.html', {'form': form})