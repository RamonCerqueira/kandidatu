from django.contrib import admin
from .models import (
    Job, SavedJob, Application, Interview, Notification,
    AbuseReport, CommercialPlan, Payment, FreeCourse, SponsoredCourseAd
)

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'category', 'region', 'contract_type', 'status', 'moderation_status', 'published_at')
    list_filter = ('status', 'moderation_status', 'contract_type', 'work_mode', 'region')
    search_fields = ('title', 'description', 'company__legal_name', 'company__trade_name')
    actions = ['approve_jobs']

    @admin.action(description='Aprovar vagas selecionadas')
    def approve_jobs(self, request, queryset):
        queryset.update(moderation_status=Job.ModerationStatus.APPROVED)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'candidate_user', 'status', 'recruitment_stage', 'applied_at')
    list_filter = ('status', 'recruitment_stage')
    search_fields = ('job__title', 'candidate_user__name', 'candidate_user__email')


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('application', 'starts_at', 'mode', 'status')
    list_filter = ('mode', 'status')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'type', 'read', 'created_at')
    list_filter = ('type', 'read')


@admin.register(AbuseReport)
class AbuseReportAdmin(admin.ModelAdmin):
    list_display = ('target_type', 'status', 'created_at')
    list_filter = ('target_type', 'status')


@admin.register(CommercialPlan)
class CommercialPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_xof', 'billing_cycle', 'job_slots', 'active')
    list_filter = ('billing_cycle', 'active')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('company', 'plan', 'amount_xof', 'method', 'status', 'created_at')
    list_filter = ('status', 'method')


@admin.register(FreeCourse)
class FreeCourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'reading_minutes', 'published')
    list_filter = ('level', 'published')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(SponsoredCourseAd)
class SponsoredCourseAdAdmin(admin.ModelAdmin):
    list_display = ('course_title', 'partner_name', 'placement', 'starts_at', 'ends_at', 'clicks', 'active')
    list_filter = ('placement', 'mode', 'active')

