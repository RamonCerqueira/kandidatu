import json
from django.test import TestCase, Client
from django.urls import reverse
from .models import User, CandidateProfile, Company

class AccountsMvcAndApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.password = 'IbraCo5526467'
        self.user = User.objects.create_user(
            email='testuser@kandidatu.gw',
            password=self.password,
            name='Utilizador Teste',
            role=User.Role.CANDIDATE
        )

    # 1. MVC Web Views Tests
    def test_web_login_page_renders_successfully(self):
        """Verifica se a página de login MVC carrega com código 200 e formulário."""
        response = self.client.get(reverse('accounts:login'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Entrar na Conta')
        self.assertContains(response, 'E-mail')
        self.assertContains(response, 'Palavra-passe')

    def test_web_login_successful_redirects_to_dashboard(self):
        """Verifica se o login via formulário web autentica e redireciona."""
        response = self.client.post(reverse('accounts:login'), {
            'email': 'testuser@kandidatu.gw',
            'password': self.password,
        })
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('accounts:dashboard'))

    def test_web_login_invalid_credentials_shows_error(self):
        """Verifica se credenciais erradas no formulário web exibem mensagem de erro."""
        response = self.client.post(reverse('accounts:login'), {
            'email': 'testuser@kandidatu.gw',
            'password': 'WrongPassword123',
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'E-mail ou palavra-passe incorretos')

    # 2. REST API Views Tests (Zod / React Frontend Contract)
    def test_api_login_returns_token_and_user_schema(self):
        """
        Verifica se o endpoint POST /api/auth/login retorna exatamente
        { token, user: { id, email, name, role } } conforme exigido pelo Zod no front.
        """
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({'email': 'testuser@kandidatu.gw', 'password': self.password}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('token', data)
        self.assertIn('user', data)
        user_data = data['user']
        self.assertEqual(user_data['email'], 'testuser@kandidatu.gw')
        self.assertEqual(user_data['name'], 'Utilizador Teste')
        self.assertEqual(user_data['role'], 'CANDIDATE')
        self.assertEqual(user_data['id'], str(self.user.id))

    def test_api_me_with_bearer_token(self):
        """Verifica se GET /api/auth/me valida o JWT e retorna os dados do utilizador."""
        login_res = self.client.post(
            '/api/auth/login',
            data=json.dumps({'email': 'testuser@kandidatu.gw', 'password': self.password}),
            content_type='application/json'
        )
        token = login_res.json()['token']

        response = self.client.get(
            '/api/auth/me',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        self.assertEqual(response.status_code, 200)
        user_data = response.json()
        self.assertEqual(user_data['email'], 'testuser@kandidatu.gw')
        self.assertEqual(user_data['role'], 'CANDIDATE')

    def test_api_register_candidate(self):
        """Verifica se POST /api/auth/register/candidate cadastra com sucesso."""
        payload = {
            'email': 'novocandidato@kandidatu.gw',
            'password': 'MinhaSenhaSegura123',
            'fullName': 'Suleimane Embaló',
            'phone': '+245955112233',
            'whatsapp': '+245955112233',
            'region': 'BISSAU',
            'citySector': 'Bandim',
            'educationLevel': 'Licenciatura',
            'primaryCategory': 'Administração',
            'experienceLevel': 'Pleno'
        }
        response = self.client.post(
            '/api/auth/register/candidate',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email='novocandidato@kandidatu.gw').exists())

    def test_api_candidate_curriculum_and_dashboard(self):
        """Verifica se os endpoints do portal do candidato funcionam com o token JWT."""
        login_res = self.client.post(
            '/api/auth/login',
            data=json.dumps({'email': 'testuser@kandidatu.gw', 'password': self.password}),
            content_type='application/json'
        )
        token = login_res.json()['token']
        auth_header = {'HTTP_AUTHORIZATION': f'Bearer {token}'}

        # 1. GET curriculum
        curr_res = self.client.get('/api/candidate/curriculum', **auth_header)
        self.assertEqual(curr_res.status_code, 200)
        curr_data = curr_res.json()
        self.assertIn('personal', curr_data)
        self.assertEqual(curr_data['personal']['fullName'], 'Utilizador Teste')

        # 2. PUT curriculum
        curr_data['summary'] = 'Experiência sólida em Django e React.'
        put_res = self.client.put(
            '/api/candidate/curriculum',
            data=json.dumps(curr_data),
            content_type='application/json',
            **auth_header
        )
        self.assertEqual(put_res.status_code, 200)

        # 3. GET dashboard
        dash_res = self.client.get('/api/candidate/dashboard', **auth_header)
        self.assertEqual(dash_res.status_code, 200)
        dash_data = dash_res.json()
        self.assertIn('profileProgress', dash_data)
        self.assertIn('hasCurriculum', dash_data)


