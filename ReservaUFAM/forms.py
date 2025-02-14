from .models import UserProfile
from django import forms

class UserForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['siape', 'cpf', 'name', 'email', 'cellphone', 'password']
    
    def clean_senha(self):
        senha = self.cleaned_data.get("senha")
        if len(senha) < 8 or len(senha) > 12:
            raise forms.ValidationError("A senha deve ter entre 8 e 12 caracteres.")
        return senha


class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))
