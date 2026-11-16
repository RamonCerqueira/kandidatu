import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, name='', role='CANDIDATE', **extra_fields):
        if not email:
            raise ValueError('O e-mail é obrigatório.')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, name='Administrador', **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')

        return self.create_user(email, password, name=name, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        CANDIDATE = 'CANDIDATE', 'Candidato'
        COMPANY = 'COMPANY', 'Empresa / Organização'
        ADMIN = 'ADMIN', 'Super Administrador'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField('Nome completo / Razão', max_length=160)
    email = models.EmailField('E-mail de acesso', max_length=180, unique=True)
    role = models.CharField('Perfil', max_length=20, choices=Role.choices, default=Role.CANDIDATE)
    
    is_active = models.BooleanField('Ativo', default=True)
    is_staff = models.BooleanField('Acesso equipe', default=False)
    created_at = models.DateTimeField('Criado em', auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'
        verbose_name = 'Utilizador'
        verbose_name_plural = 'Utilizadores'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.email}) - {self.get_role_display()}"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_company(self):
        return self.role == self.Role.COMPANY

    @property
    def is_candidate(self):
        return self.role == self.Role.CANDIDATE


class CandidateProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='candidate_profile',
        primary_key=True
    )
    full_name = models.CharField('Nome Completo', max_length=160)
    photo_url = models.TextField('URL da Foto', blank=True, null=True)
    birth_date = models.DateField('Data de Nascimento', blank=True, null=True)
    nationality = models.CharField('Nacionalidade', max_length=80, default='Guineense')
    city = models.CharField('Bairro / Setor', max_length=100, blank=True, null=True)
    phone = models.CharField('Telefone (+245)', max_length=24)
    whatsapp = models.CharField('WhatsApp (+245)', max_length=24, blank=True, null=True)
    address = models.TextField('Morada', blank=True, null=True)
    summary = models.TextField('Resumo Profissional', blank=True, null=True)
    objective = models.TextField('Objetivo Profissional', blank=True, null=True)
    availability = models.CharField('Disponibilidade', max_length=30, blank=True, null=True)
    curriculum_json = models.JSONField('Dados Estruturados do Currículo', default=dict, blank=True)
    updated_at = models.DateTimeField('Atualizado em', auto_now=True)

    class Meta:
        db_table = 'candidate_profiles'
        verbose_name = 'Perfil do Candidato'
        verbose_name_plural = 'Perfis de Candidatos'

    def __str__(self):
        return f"Perfil: {self.full_name}"


class Company(models.Model):
    class OrgType(models.TextChoices):
        EMPRESA_PRIVADA = 'EMPRESA_PRIVADA', 'Empresa Privada'
        ONG = 'ONG', 'ONG'
        ORGANISMO_INTERNACIONAL = 'ORGANISMO_INTERNACIONAL', 'Organismo Internacional'
        INSTITUICAO_PUBLICA = 'INSTITUICAO_PUBLICA', 'Instituição Pública'
        ENSINO_FORMACAO = 'ENSINO_FORMACAO', 'Ensino e Formação Profissional'

    class ModerationStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pendente'
        APPROVED = 'APPROVED', 'Aprovada'
        REJECTED = 'REJECTED', 'Rejeitada'

    class Region(models.TextChoices):
        BISSAU = 'BISSAU', 'Bissau (SAB)'
        BAFATA = 'BAFATA', 'Bafatá'
        GABU = 'GABU', 'Gabú'
        CACHEU = 'CACHEU', 'Cacheu'
        OIO = 'OIO', 'Oio'
        BIOMBO = 'BIOMBO', 'Biombo'
        QUINARA = 'QUINARA', 'Quinara'
        TOMBALI = 'TOMBALI', 'Tombali'
        BOLAMA_BIJAGOS = 'BOLAMA_BIJAGOS', 'Bolama / Bijagós'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner_user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='company_profile',
        null=True,
        blank=True
    )
    organization_type = models.CharField(
        'Tipo de Organização',
        max_length=40,
        choices=OrgType.choices,
        default=OrgType.EMPRESA_PRIVADA
    )
    legal_name = models.CharField('Denominação Social', max_length=200)
    trade_name = models.CharField('Nome Comercial / Fantasia', max_length=200, blank=True, null=True)
    tax_id = models.CharField('NIF / Registo Comercial', max_length=60)
    size_range = models.CharField('Porte da Empresa', max_length=20, blank=True, null=True)
    logo_url = models.TextField('URL do Logótipo', blank=True, null=True)
    cover_url = models.TextField('URL da Capa', blank=True, null=True)
    sector = models.CharField('Setor de Atividade', max_length=120)
    description = models.TextField('Descrição da Empresa', blank=True, default='')
    region = models.CharField('Região', max_length=30, choices=Region.choices, default=Region.BISSAU)
    city = models.CharField('Setor Administrativo / Bairro', max_length=100, blank=True, null=True)
    address = models.TextField('Morada / Ponto de Referência', blank=True, null=True)
    contact_name = models.CharField('Nome do Responsável', max_length=160, blank=True, null=True)
    contact_role = models.CharField('Cargo do Responsável', max_length=120, blank=True, null=True)
    phone = models.CharField('Telefone (+245)', max_length=24)
    whatsapp = models.CharField('WhatsApp (+245)', max_length=24, blank=True, null=True)
    email = models.EmailField('E-mail Corporativo', max_length=180)
    website = models.URLField('Website', blank=True, null=True)
    socials_json = models.JSONField('Redes Sociais', default=list, blank=True)
    employees = models.IntegerField('Número de Funcionários', null=True, blank=True)
    verified = models.BooleanField('Verificada', default=False)
    moderation_status = models.CharField(
        'Status de Moderação',
        max_length=20,
        choices=ModerationStatus.choices,
        default=ModerationStatus.PENDING
    )
    created_at = models.DateTimeField('Cadastrada em', auto_now_add=True)

    class Meta:
        db_table = 'companies'
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'
        ordering = ['-created_at']

    def __str__(self):
        return self.trade_name or self.legal_name

