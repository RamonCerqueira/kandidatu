from django.urls import path
from .api_views import (
    ApiLoginView,
    ApiMeView,
    ApiRegisterCandidateView,
    ApiRegisterCompanyView,
    ApiForgotPasswordView,
)
from .candidate_api_views import (
    CandidateCurriculumApiView,
    CandidateDashboardApiView,
    CandidateProfileApiView,
    CandidateSavedJobsApiView,
    CandidateApplicationsApiView,
    CandidateInterviewsApiView,
    NotificationsApiView,
    NotificationReadApiView,
)

urlpatterns = [
    # Auth
    path('auth/login', ApiLoginView.as_view(), name='api_login'),
    path('auth/login/', ApiLoginView.as_view(), name='api_login_slash'),
    path('auth/me', ApiMeView.as_view(), name='api_me'),
    path('auth/me/', ApiMeView.as_view(), name='api_me_slash'),
    path('auth/register/candidate', ApiRegisterCandidateView.as_view(), name='api_register_candidate'),
    path('auth/register/candidate/', ApiRegisterCandidateView.as_view(), name='api_register_candidate_slash'),
    path('auth/register/company', ApiRegisterCompanyView.as_view(), name='api_register_company'),
    path('auth/register/company/', ApiRegisterCompanyView.as_view(), name='api_register_company_slash'),
    path('auth/forgot-password', ApiForgotPasswordView.as_view(), name='api_forgot_password'),
    path('auth/forgot-password/', ApiForgotPasswordView.as_view(), name='api_forgot_password_slash'),

    # Candidate Portal API
    path('candidate/curriculum', CandidateCurriculumApiView.as_view(), name='api_candidate_curriculum'),
    path('candidate/curriculum/', CandidateCurriculumApiView.as_view(), name='api_candidate_curriculum_slash'),
    path('candidate/dashboard', CandidateDashboardApiView.as_view(), name='api_candidate_dashboard'),
    path('candidate/dashboard/', CandidateDashboardApiView.as_view(), name='api_candidate_dashboard_slash'),
    path('candidate/profile', CandidateProfileApiView.as_view(), name='api_candidate_profile'),
    path('candidate/profile/', CandidateProfileApiView.as_view(), name='api_candidate_profile_slash'),
    path('candidate/saved-jobs', CandidateSavedJobsApiView.as_view(), name='api_candidate_saved_jobs'),
    path('candidate/saved-jobs/', CandidateSavedJobsApiView.as_view(), name='api_candidate_saved_jobs_slash'),
    path('candidate/saved-jobs/<str:job_id>', CandidateSavedJobsApiView.as_view(), name='api_candidate_save_job_item'),
    path('candidate/saved-jobs/<str:job_id>/', CandidateSavedJobsApiView.as_view(), name='api_candidate_save_job_item_slash'),
    path('candidate/applications', CandidateApplicationsApiView.as_view(), name='api_candidate_applications'),
    path('candidate/applications/', CandidateApplicationsApiView.as_view(), name='api_candidate_applications_slash'),
    path('candidate/interviews', CandidateInterviewsApiView.as_view(), name='api_candidate_interviews'),
    path('candidate/interviews/', CandidateInterviewsApiView.as_view(), name='api_candidate_interviews_slash'),

    # Notifications
    path('notifications', NotificationsApiView.as_view(), name='api_notifications'),
    path('notifications/', NotificationsApiView.as_view(), name='api_notifications_slash'),
    path('notifications/<str:id>/read', NotificationReadApiView.as_view(), name='api_notification_read'),
    path('notifications/<str:id>/read/', NotificationReadApiView.as_view(), name='api_notification_read_slash'),
]
