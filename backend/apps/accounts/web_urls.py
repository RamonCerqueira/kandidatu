from django.urls import path
from django.views.generic import RedirectView
from .views import WebLoginView, WebLogoutView, DashboardView

app_name = 'accounts'

urlpatterns = [
    path('', RedirectView.as_view(pattern_name='accounts:login', permanent=False), name='index'),
    path('login/', WebLoginView.as_view(), name='login'),
    path('logout/', WebLogoutView.as_view(), name='logout'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]

