from django import forms
from django.contrib.auth import authenticate

class WebLoginForm(forms.Form):
    email = forms.EmailField(
        label='E-mail',
        widget=forms.EmailInput(attrs={
            'class': 'w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm text-slate-800 placeholder-slate-400',
            'placeholder': 'seu.email@exemplo.gw',
            'autocomplete': 'email',
            'required': True,
        })
    )
    password = forms.CharField(
        label='Palavra-passe',
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm text-slate-800 placeholder-slate-400',
            'placeholder': '••••••••',
            'autocomplete': 'current-password',
            'required': True,
        })
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if user is None:
                raise forms.ValidationError('E-mail ou palavra-passe incorretos. Por favor tente novamente.')
            if not user.is_active:
                raise forms.ValidationError('Esta conta de utilizador está desativada.')
            self.user = user
        return cleaned_data

