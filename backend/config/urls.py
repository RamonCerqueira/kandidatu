from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    # Django Admin Panel
    path('admin/', admin.site.urls),

    # MVC Web Views (HTML Templates)
    path('', include('apps.accounts.web_urls')),

    # REST API for React Frontend / Mobile
    path('api/', include('apps.accounts.api_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

