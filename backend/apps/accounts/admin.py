from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, CandidateProfile, Company

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'role', 'is_active', 'is_staff', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('name', 'role')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'role', 'password', 'is_active', 'is_staff'),
        }),
    )
    search_fields = ('email', 'name')
    ordering = ('-created_at',)


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'nationality', 'city', 'updated_at')
    search_fields = ('full_name', 'phone', 'city')
    list_filter = ('nationality',)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('legal_name', 'trade_name', 'organization_type', 'sector', 'region', 'verified', 'moderation_status')
    list_filter = ('organization_type', 'sector', 'region', 'verified', 'moderation_status')
    search_fields = ('legal_name', 'trade_name', 'tax_id', 'email', 'phone')
    actions = ['approve_companies', 'verify_companies']

    @admin.action(description='Aprovar empresas selecionadas')
    def approve_companies(self, request, queryset):
        queryset.update(moderation_status=Company.ModerationStatus.APPROVED)

    @admin.action(description='Marcar empresas selecionadas como Verificadas')
    def verify_companies(self, request, queryset):
        queryset.update(verified=True)

