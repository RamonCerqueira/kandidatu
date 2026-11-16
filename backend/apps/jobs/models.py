import uuid
from django.db import models
from django.conf import settings

class Job(models.Model):
    class ContractType(models.TextChoices):
        CLT = 'CLT', 'Efetivo / CLT'
        TEMPORARIO = 'TEMPORARIO', 'Temporário'
        ESTAGIO = 'ESTAGIO', 'Estágio'
        FREELANCE = 'FREELANCE', 'Freelance'
        VOLUNTARIADO = 'VOLUNTARIADO', 'Voluntariado'

    class WorkMode(models.TextChoices):
        PRESENCIAL = 'PRESENCIAL', 'Presencial'
        REMOTO = 'REMOTO', 'Remoto'
        HIBRIDO = 'HIBRIDO', 'Híbrido'

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Ativa'
        PAUSED = 'PAUSED', 'Pausada'
        CLOSED = 'CLOSED', 'Encerrada'
        DRAFT = 'DRAFT', 'Rascunho'

    class ModerationStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pendente'
        APPROVED = 'APPROVED', 'Aprovada'
        REJECTED = 'REJECTED', 'Rejeitada'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        'accounts.Company',
        on_delete=models.CASCADE,
        related_name='jobs',
        verbose_name='Empresa'
    )
    title = models.CharField('Título da Vaga', max_length=180)
    category = models.CharField('Categoria Profissional', max_length=120)
    description = models.TextField('Descrição Completa')
    responsibilities = models.JSONField('Responsabilidades', default=list, blank=True)
    requirements = models.JSONField('Requisitos', default=list, blank=True)
    benefits = models.JSONField('Benefícios', default=list, blank=True)
    education = models.CharField('Escolaridade Mínima', max_length=80, blank=True, null=True)
    experience = models.CharField('Experiência Desejada', max_length=80, blank=True, null=True)
    vacancies = models.IntegerField('Número de Vagas', default=1)
    region = models.CharField('Região', max_length=30)
    city = models.CharField('Cidade / Bairro', max_length=100, blank=True, null=True)
    salary_min = models.BigIntegerField('Salário Mínimo (XOF)', blank=True, null=True)
    salary_max = models.BigIntegerField('Salário Máximo (XOF)', blank=True, null=True)
    currency = models.CharField('Moeda', max_length=3, default='XOF')
    contract_type = models.CharField('Tipo de Contrato', max_length=20, choices=ContractType.choices, default=ContractType.CLT)
    work_mode = models.CharField('Regime de Trabalho', max_length=20, choices=WorkMode.choices, default=WorkMode.PRESENCIAL)
    workload = models.CharField('Carga Horária', max_length=80, blank=True, null=True)
    status = models.CharField('Estado da Vaga', max_length=20, choices=Status.choices, default=Status.ACTIVE)
    moderation_status = models.CharField('Moderação', max_length=20, choices=ModerationStatus.choices, default=ModerationStatus.PENDING)
    verified = models.BooleanField('Vaga Verificada', default=False)
    deadline = models.DateField('Prazo Limite', blank=True, null=True)
    published_at = models.DateTimeField('Publicada em', auto_now_add=True)

    class Meta:
        db_table = 'jobs'
        verbose_name = 'Vaga de Emprego'
        verbose_name_plural = 'Vagas de Emprego'
        ordering = ['-published_at']

    def __str__(self):
        return f"{self.title} - {self.company.trade_name or self.company.legal_name}"


class SavedJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'saved_jobs'
        unique_together = ('user', 'job')
        verbose_name = 'Vaga Guardada'
        verbose_name_plural = 'Vagas Guardadas'


class Application(models.Model):
    class Status(models.TextChoices):
        SENT = 'SENT', 'Enviada'
        REVIEWING = 'REVIEWING', 'Em Análise'
        SHORTLISTED = 'SHORTLISTED', 'Pré-selecionado'
        INTERVIEW = 'INTERVIEW', 'Entrevista'
        APPROVED = 'APPROVED', 'Aprovado'
        REJECTED = 'REJECTED', 'Não Selecionado'
        CANCELLED = 'CANCELLED', 'Cancelada'

    class RecruitmentStage(models.TextChoices):
        NEW = 'NEW', 'Nova Candidatura'
        REVIEWING = 'REVIEWING', 'Triagem'
        SHORTLISTED = 'SHORTLISTED', 'Classificado'
        INTERVIEW = 'INTERVIEW', 'Entrevista'
        APPROVED = 'APPROVED', 'Contratação'
        REJECTED = 'REJECTED', 'Desqualificado'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SENT)
    recruitment_stage = models.CharField(max_length=20, choices=RecruitmentStage.choices, default=RecruitmentStage.NEW)
    favorite = models.BooleanField(default=False)
    internal_notes = models.TextField(blank=True, null=True)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'applications'
        unique_together = ('job', 'candidate_user')
        verbose_name = 'Candidatura'
        verbose_name_plural = 'Candidaturas'
        ordering = ['-applied_at']


class Interview(models.Model):
    class Mode(models.TextChoices):
        ONLINE = 'ONLINE', 'Online (Vídeo/Chamada)'
        PRESENCIAL = 'PRESENCIAL', 'Presencial'

    class Status(models.TextChoices):
        SCHEDULED = 'SCHEDULED', 'Agendada'
        CANCELLED = 'CANCELLED', 'Cancelada'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    starts_at = models.DateTimeField('Horário da Entrevista')
    mode = models.CharField(max_length=20, choices=Mode.choices, default=Mode.PRESENCIAL)
    location = models.TextField('Local / Link da Entrevista')
    instructions = models.TextField('Instruções para o Candidato', blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'interviews'
        verbose_name = 'Entrevista'
        verbose_name_plural = 'Entrevistas'


class Notification(models.Model):
    class Type(models.TextChoices):
        NEW_JOB = 'NEW_JOB', 'Nova Vaga'
        APPLICATION_UPDATE = 'APPLICATION_UPDATE', 'Atualização de Candidatura'
        INTERVIEW_INVITE = 'INTERVIEW_INVITE', 'Convite de Entrevista'
        MESSAGE = 'MESSAGE', 'Mensagem'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=30, choices=Type.choices)
    title = models.CharField(max_length=180)
    body = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notificação'
        verbose_name_plural = 'Notificações'
        ordering = ['-created_at']


class AbuseReport(models.Model):
    class TargetType(models.TextChoices):
        JOB = 'JOB', 'Vaga'
        COMPANY = 'COMPANY', 'Empresa'
        USER = 'USER', 'Utilizador'

    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Pendente'
        RESOLVED = 'RESOLVED', 'Resolvida'
        DISMISSED = 'DISMISSED', 'Arquivada'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporter_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    target_type = models.CharField(max_length=20, choices=TargetType.choices)
    target_id = models.UUIDField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'abuse_reports'
        verbose_name = 'Denúncia de Abuso'
        verbose_name_plural = 'Denúncias de Abuso'


class CommercialPlan(models.Model):
    class Cycle(models.TextChoices):
        MENSAL = 'MENSAL', 'Mensal'
        TRIMESTRAL = 'TRIMESTRAL', 'Trimestral'
        ANUAL = 'ANUAL', 'Anual'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField('Nome do Plano', max_length=120)
    price_xof = models.BigIntegerField('Preço em Franco CFA (XOF)')
    billing_cycle = models.CharField(max_length=20, choices=Cycle.choices)
    job_slots = models.IntegerField('Vagas Simultâneas')
    featured_slots = models.IntegerField('Vagas em Destaque', default=0)
    active = models.BooleanField(default=True)

    class Meta:
        db_table = 'commercial_plans'
        verbose_name = 'Plano Comercial'
        verbose_name_plural = 'Planos Comerciais'

    def __str__(self):
        return f"{self.name} - {self.price_xof:,} XOF"


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pendente'
        PAID = 'PAID', 'Pago'
        FAILED = 'FAILED', 'Falhou'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey('accounts.Company', on_delete=models.CASCADE, related_name='payments')
    plan = models.ForeignKey(CommercialPlan, on_delete=models.SET_NULL, null=True, blank=True)
    amount_xof = models.BigIntegerField('Valor (XOF)')
    method = models.CharField('Método de Pagamento', max_length=60)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments'
        verbose_name = 'Pagamento'
        verbose_name_plural = 'Pagamentos'


class FreeCourse(models.Model):
    class Level(models.TextChoices):
        INICIANTE = 'INICIANTE', 'Iniciante'
        INTERMEDIO = 'INTERMEDIO', 'Intermédio'
        AVANCADO = 'AVANCADO', 'Avançado'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=160, unique=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=120)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.INICIANTE)
    reading_minutes = models.IntegerField(default=10)
    summary = models.TextField()
    lessons_json = models.JSONField(default=list, blank=True)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'free_courses'
        verbose_name = 'Curso Gratuito'
        verbose_name_plural = 'Cursos Gratuitos'

    def __str__(self):
        return self.title


class SponsoredCourseAd(models.Model):
    class Mode(models.TextChoices):
        PRESENCIAL = 'PRESENCIAL', 'Presencial'
        ONLINE = 'ONLINE', 'Online'
        HIBRIDO = 'HIBRIDO', 'Híbrido'

    class Placement(models.TextChoices):
        SPOTLIGHT_TOP = 'SPOTLIGHT_TOP', 'Topo em Destaque'
        CATALOG_CARD = 'CATALOG_CARD', 'Cartão no Catálogo'
        SIDEBAR_BANNER = 'SIDEBAR_BANNER', 'Banner Lateral'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    partner_name = models.CharField('Parceiro / Escola', max_length=200)
    course_title = models.CharField('Título do Curso', max_length=200)
    category = models.CharField(max_length=120)
    region = models.CharField(max_length=30)
    mode = models.CharField(max_length=20, choices=Mode.choices, default=Mode.PRESENCIAL)
    banner_url = models.TextField(blank=True, null=True)
    description = models.TextField()
    course_price_xof = models.BigIntegerField(blank=True, null=True)
    ad_fee_paid_xof = models.BigIntegerField(default=0)
    placement = models.CharField(max_length=30, choices=Placement.choices, default=Placement.CATALOG_CARD)
    target_url = models.TextField()
    whatsapp = models.CharField(max_length=30, blank=True, null=True)
    starts_at = models.DateField()
    ends_at = models.DateField()
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sponsored_course_ads'
        verbose_name = 'Publicidade de Curso'
        verbose_name_plural = 'Publicidades de Cursos'

    def __str__(self):
        return f"{self.course_title} ({self.partner_name})"

