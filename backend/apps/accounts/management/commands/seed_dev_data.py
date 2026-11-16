from django.core.management.base import BaseCommand
from apps.accounts.models import User, CandidateProfile, Company
from apps.jobs.models import Job, CommercialPlan

class Command(BaseCommand):
    help = 'Popula a base de dados kandidatu com contas e dados iniciais de demonstração'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando o povoamento de dados para o KANDIDATU...')

        default_password = 'IbraCo5526467'

        # 1. SuperAdmin
        admin_email = 'admin@kandidatu.gw'
        admin_user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'name': 'SuperAdmin KANDIDATU',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            }
        )
        admin_user.set_password(default_password)
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.role = User.Role.ADMIN
        admin_user.save()
        self.stdout.write(self.style.SUCCESS(f"✓ SuperAdmin configurado: {admin_email} / {default_password}"))

        # 2. Empresa
        company_email = 'company@kandidatu.gw'
        company_user, created = User.objects.get_or_create(
            email=company_email,
            defaults={
                'name': 'Guiné Telecom SA',
                'role': User.Role.COMPANY,
                'is_active': True,
            }
        )
        company_user.set_password(default_password)
        company_user.role = User.Role.COMPANY
        company_user.save()

        company, _ = Company.objects.get_or_create(
            owner_user=company_user,
            defaults={
                'organization_type': Company.OrgType.EMPRESA_PRIVADA,
                'legal_name': 'Guiné Telecom Sociedade Anónima',
                'trade_name': 'Guiné Telecom',
                'tax_id': '500123456',
                'sector': 'Telecomunicações e Tecnologia',
                'size_range': '51-200',
                'region': Company.Region.BISSAU,
                'city': 'Bissau - Bairro de Santa Luzia',
                'address': 'Avenida Combatentes da Liberdade da Pátria, Nº 14',
                'contact_name': 'Baciro Djaló',
                'contact_role': 'Diretor de Recursos Humanos',
                'phone': '+245955000111',
                'whatsapp': '+245955000111',
                'email': company_email,
                'verified': True,
                'moderation_status': Company.ModerationStatus.APPROVED,
            }
        )
        self.stdout.write(self.style.SUCCESS(f"✓ Empresa configurada: {company_email} / {default_password}"))

        # 3. Candidato
        candidate_email = 'candidate@kandidatu.gw'
        candidate_user, created = User.objects.get_or_create(
            email=candidate_email,
            defaults={
                'name': 'Malam Sambú',
                'role': User.Role.CANDIDATE,
                'is_active': True,
            }
        )
        candidate_user.set_password(default_password)
        candidate_user.role = User.Role.CANDIDATE
        candidate_user.save()

        CandidateProfile.objects.get_or_create(
            user=candidate_user,
            defaults={
                'full_name': 'Malam Sambú',
                'phone': '+245966123456',
                'whatsapp': '+245966123456',
                'city': 'Bissau - Plubá',
                'nationality': 'Guineense',
                'summary': 'Técnico de Redes e Sistemas com 4 anos de experiência em infraestrutura corporativa.',
                'objective': 'Integrar uma equipe dinâmica na área de TIC na Guiné-Bissau.',
                'availability': 'Imediata',
            }
        )
        self.stdout.write(self.style.SUCCESS(f"✓ Candidato configurado: {candidate_email} / {default_password}"))

        # 4. Planos Comerciais em XOF
        CommercialPlan.objects.get_or_create(
            name='Básico Mensal',
            defaults={
                'price_xof': 25000,
                'billing_cycle': CommercialPlan.Cycle.MENSAL,
                'job_slots': 3,
                'featured_slots': 0,
            }
        )
        CommercialPlan.objects.get_or_create(
            name='Empresa Pro',
            defaults={
                'price_xof': 60000,
                'billing_cycle': CommercialPlan.Cycle.MENSAL,
                'job_slots': 10,
                'featured_slots': 3,
            }
        )

        # 5. Vaga de Exemplo
        Job.objects.get_or_create(
            company=company,
            title='Engenheiro de Redes e Telecomunicações',
            defaults={
                'category': 'Tecnologia da Informação',
                'description': 'Procuramos um Engenheiro de Redes sénior para gerir infraestruturas de dados em Bissau.',
                'responsibilities': ['Supervisionar rede de fibra ótica', 'Garantir disponibilidade 99.9%', 'Gerir equipe técnica'],
                'requirements': ['Licenciatura em Engenharia Informática ou similar', 'Mínimo de 3 anos de experiência', 'Certificação CCNA desejável'],
                'benefits': ['Seguro de Saúde Familiar', 'Subsídio de Transporte', 'Bónus Anual'],
                'region': 'BISSAU',
                'city': 'Bissau',
                'salary_min': 450000,
                'salary_max': 750000,
                'currency': 'XOF',
                'contract_type': Job.ContractType.CLT,
                'work_mode': Job.WorkMode.PRESENCIAL,
                'status': Job.Status.ACTIVE,
                'moderation_status': Job.ModerationStatus.APPROVED,
                'verified': True,
            }
        )
        self.stdout.write(self.style.SUCCESS('✓ Dados de demonstração semeados com sucesso!'))

