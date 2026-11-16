from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from .forms import WebLoginForm

class WebLoginView(View):
    template_name = 'accounts/login.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('accounts:dashboard')
        form = WebLoginForm()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('accounts:dashboard')

        form = WebLoginForm(request.POST)
        if form.is_valid():
            user = form.user
            login(request, user)
            messages.success(request, f'Bem-vindo de volta, {user.name}!')
            next_url = request.GET.get('next') or request.POST.get('next') or 'accounts:dashboard'
            return redirect(next_url)
        
        return render(request, self.template_name, {'form': form})


class WebLogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        messages.info(request, 'Sessão encerrada com sucesso.')
        return redirect('accounts:login')

    def post(self, request, *args, **kwargs):
        logout(request)
        messages.info(request, 'Sessão encerrada com sucesso.')
        return redirect('accounts:login')


class DashboardView(LoginRequiredMixin, View):
    login_url = '/login/'
    template_name = 'accounts/dashboard.html'

    def get(self, request, *args, **kwargs):
        user = request.user
        context = {
            'user': user,
            'role_label': user.get_role_display(),
        }
        return render(request, self.template_name, context)

