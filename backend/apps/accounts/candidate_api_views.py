from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import CandidateProfile
from apps.jobs.models import Job, Application, SavedJob, Interview, Notification

class CandidateCurriculumApiView(APIView):
    """
    GET /api/candidate/curriculum
    PUT /api/candidate/curriculum
    Gestão do currículo estruturado do candidato.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = CandidateProfile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': user.name,
                'phone': '+245',
                'city': 'Bissau',
            }
        )

        curriculum = profile.curriculum_json
        if not curriculum or not isinstance(curriculum, dict) or 'personal' not in curriculum:
            # Fallback seguro para o schema do front
            curriculum = {
                'template': 'moderno',
                'personal': {
                    'fullName': profile.full_name or user.name,
                    'email': user.email,
                    'phone': profile.phone or '+245',
                    'city': profile.city or 'Bissau',
                },
                'summary': profile.summary or '',
                'experiences': [],
                'education': [],
                'courses': [],
                'certifications': [],
                'languages': [],
                'skills': [],
                'references': []
            }

        return Response(curriculum, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        profile, _ = CandidateProfile.objects.get_or_create(user=user)
        profile.curriculum_json = request.data
        if isinstance(request.data, dict) and 'personal' in request.data:
            personal = request.data['personal']
            if isinstance(personal, dict):
                if personal.get('fullName'):
                    profile.full_name = personal['fullName']
                if personal.get('phone'):
                    profile.phone = personal['phone']
                if personal.get('city'):
                    profile.city = personal['city']
        if isinstance(request.data, dict) and request.data.get('summary'):
            profile.summary = request.data['summary']

        profile.save()
        return Response({'message': 'Currículo guardado com sucesso.'}, status=status.HTTP_200_OK)


class CandidateDashboardApiView(APIView):
    """
    GET /api/candidate/dashboard
    Métricas e indicadores para a página inicial do candidato.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'candidate_profile', None)

        has_curriculum = bool(profile and profile.curriculum_json and profile.curriculum_json.get('personal'))
        applications_count = Application.objects.filter(candidate_user=user).count()
        saved_jobs_count = SavedJob.objects.filter(user=user).count()
        interviews_count = Interview.objects.filter(application__candidate_user=user, status='SCHEDULED').count()

        # Recomendação de vagas ativas
        recommendations = []
        for job in Job.objects.filter(status='ACTIVE')[:4]:
            recommendations.append({
                'id': str(job.id),
                'title': job.title,
                'category': job.category,
                'region': job.region,
                'city': job.city or 'Bissau',
                'contractType': job.contract_type,
                'workMode': job.work_mode,
                'salaryMin': job.salary_min,
                'salaryMax': job.salary_max,
                'currency': job.currency,
                'verified': job.verified,
                'publishedAt': job.published_at.isoformat(),
                'company': {
                    'id': str(job.company.id),
                    'name': job.company.trade_name or job.company.legal_name,
                    'logoUrl': job.company.logo_url,
                    'verified': job.company.verified
                }
            })

        # Candidaturas recentes
        recent_apps = []
        for app in Application.objects.filter(candidate_user=user).select_related('job', 'job__company')[:5]:
            recent_apps.append({
                'id': str(app.id),
                'status': app.status,
                'appliedAt': app.applied_at.isoformat(),
                'job': {
                    'id': str(app.job.id),
                    'title': app.job.title,
                    'company': {
                        'id': str(app.job.company.id),
                        'name': app.job.company.trade_name or app.job.company.legal_name
                    }
                }
            })

        return Response({
            'profileProgress': 85 if has_curriculum else 40,
            'hasCurriculum': has_curriculum,
            'applications': applications_count,
            'savedJobs': saved_jobs_count,
            'interviews': interviews_count,
            'recommendations': recommendations,
            'recentApplications': recent_apps,
        }, status=status.HTTP_200_OK)


class CandidateProfileApiView(APIView):
    """
    GET /api/candidate/profile
    PUT /api/candidate/profile
    Dados pessoais e profissionais do candidato.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = CandidateProfile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': user.name,
                'phone': '+245',
                'city': 'Bissau',
                'nationality': 'Guineense',
            }
        )

        return Response({
            'fullName': profile.full_name or user.name,
            'photoUrl': profile.photo_url,
            'birthDate': profile.birth_date.isoformat() if profile.birth_date else '1998-01-01',
            'nationality': profile.nationality or 'Guineense',
            'city': profile.city or 'Bissau',
            'phone': profile.phone or '+245955000000',
            'whatsapp': profile.whatsapp or '',
            'email': user.email,
            'address': profile.address or '',
            'summary': profile.summary or '',
            'objective': profile.objective or '',
            'availability': profile.availability or 'Imediata',
        }, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        profile, _ = CandidateProfile.objects.get_or_create(user=user)
        data = request.data

        if 'fullName' in data:
            profile.full_name = data['fullName']
            user.name = data['fullName']
            user.save()
        if 'phone' in data:
            profile.phone = data['phone']
        if 'whatsapp' in data:
            profile.whatsapp = data['whatsapp']
        if 'city' in data:
            profile.city = data['city']
        if 'nationality' in data:
            profile.nationality = data['nationality']
        if 'summary' in data:
            profile.summary = data['summary']
        if 'objective' in data:
            profile.objective = data['objective']
        if 'availability' in data:
            profile.availability = data['availability']
        if 'photoUrl' in data:
            profile.photo_url = data['photoUrl']

        profile.save()
        return Response({'message': 'Perfil atualizado com sucesso.'}, status=status.HTTP_200_OK)


class CandidateSavedJobsApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        saved = SavedJob.objects.filter(user=request.user).select_related('job', 'job__company')
        jobs = []
        for s in saved:
            job = s.job
            jobs.append({
                'id': str(job.id),
                'title': job.title,
                'category': job.category,
                'region': job.region,
                'city': job.city or 'Bissau',
                'contractType': job.contract_type,
                'workMode': job.work_mode,
                'salaryMin': job.salary_min,
                'salaryMax': job.salary_max,
                'currency': job.currency,
                'verified': job.verified,
                'publishedAt': job.published_at.isoformat(),
                'company': {
                    'id': str(job.company.id),
                    'name': job.company.trade_name or job.company.legal_name,
                    'logoUrl': job.company.logo_url,
                    'verified': job.company.verified
                }
            })
        return Response(jobs, status=status.HTTP_200_OK)

    def put(self, request, job_id):
        job = Job.objects.get(id=job_id)
        SavedJob.objects.get_or_create(user=request.user, job=job)
        return Response({'message': 'Vaga guardada com sucesso.'}, status=status.HTTP_200_OK)

    def delete(self, request, job_id):
        SavedJob.objects.filter(user=request.user, job_id=job_id).delete()
        return Response({'message': 'Vaga removida dos guardados.'}, status=status.HTTP_200_OK)


class CandidateApplicationsApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        apps = Application.objects.filter(candidate_user=request.user).select_related('job', 'job__company')
        result = []
        for app in apps:
            result.append({
                'id': str(app.id),
                'status': app.status,
                'appliedAt': app.applied_at.isoformat(),
                'job': {
                    'id': str(app.job.id),
                    'title': app.job.title,
                    'company': {
                        'id': str(app.job.company.id),
                        'name': app.job.company.trade_name or app.job.company.legal_name
                    }
                }
            })
        return Response(result, status=status.HTTP_200_OK)


class CandidateInterviewsApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        interviews = Interview.objects.filter(application__candidate_user=request.user).select_related('application__job', 'application__job__company')
        result = []
        for inv in interviews:
            result.append({
                'id': str(inv.id),
                'startsAt': inv.starts_at.isoformat(),
                'company': inv.application.job.company.trade_name or inv.application.job.company.legal_name,
                'jobTitle': inv.application.job.title,
                'mode': inv.mode,
                'location': inv.location,
                'instructions': inv.instructions,
            })
        return Response(result, status=status.HTTP_200_OK)


class NotificationsApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notes = Notification.objects.filter(user=request.user)
        result = []
        for n in notes:
            result.append({
                'id': str(n.id),
                'type': n.type,
                'title': n.title,
                'body': n.body,
                'createdAt': n.created_at.isoformat(),
                'read': n.read,
            })
        return Response(result, status=status.HTTP_200_OK)


class NotificationReadApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        Notification.objects.filter(id=id, user=request.user).update(read=True)
        return Response({'message': 'Notificação marcada como lida.'}, status=status.HTTP_200_OK)

