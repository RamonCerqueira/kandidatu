# KANDIDATU — Backend Django (Arquitetura MVC)

Backend oficial da plataforma de emprego e talentos da **Guiné-Bissau (KANDIDATU)**, desenvolvido em **Python** com **Django** seguindo o padrão **MVC (Model-View-Controller / Model-Template-View)** e integrado ao banco de dados **PostgreSQL** (`kandidatu`).

---

## 🏛️ Arquitetura MVC Implementada

A estrutura do projeto está organizada respeitando a separação de responsabilidades do MVC:

- **Model (M)**:
  - `apps/accounts/models.py`: Modelos de Utilizador (`User`), Perfil do Candidato (`CandidateProfile`) e Empresa (`Company`).
  - `apps/jobs/models.py`: Vagas (`Job`), Candidaturas (`Application`), Entrevistas (`Interview`), Notificações (`Notification`), Cursos (`FreeCourse`, `SponsoredCourseAd`), Planos e Pagamentos (`CommercialPlan`, `Payment`).
  - Banco de Dados: **PostgreSQL** (`kandidatu`).
- **View / Controller (V / C)**:
  - `apps/accounts/views.py`: Controladores MVC da interface web (processamento de login, logout e painel com formulários Django e CSRF).
  - `apps/accounts/api_views.py`: Controladores da API REST que respondem em JSON para integração com o frontend React/Vite.
- **View Presentation / Templates (T)**:
  - `apps/accounts/templates/accounts/login.html`: Template responsivo da página de login com Tailwind CSS e branding oficial.
  - `apps/accounts/templates/accounts/dashboard.html`: Painel web do utilizador autenticado.
  - `apps/accounts/templates/accounts/base.html`: Layout base com navegação e rodapé contextualizado para a Guiné-Bissau.

---

## ⚙️ Configuração do Ambiente (.env)

O arquivo `.env` dentro de `backend/` está configurado para o banco PostgreSQL local:

```env
DEBUG=True
SECRET_KEY=django-insecure-kandidatu-guine-bissau-2026-secret-key-mvc
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=kandidatu
DB_USER=postgres
DB_PASSWORD=IbraCo5526467
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

---

## 🚀 Como Executar o Backend

1. **Acessar a pasta do backend**:
   ```bash
   cd backend
   ```

2. **Aplicar as migrações no PostgreSQL**:
   ```bash
   python manage.py migrate
   ```

3. **Povoar contas de demonstração (opcional/recomendado)**:
   ```bash
   python manage.py seed_dev_data
   ```

4. **Iniciar o servidor Django**:
   ```bash
   python manage.py runserver 8000
   ```

---

## 🔐 Contas de Demonstração Pré-configuradas

| Perfil | E-mail | Senha | Acesso |
|---|---|---|---|
| **Super Administrador** | `admin@kandidatu.gw` | `IbraCo5526467` | Web, API e Django Admin (`/admin/`) |
| **Empresa (Empregador)** | `company@kandidatu.gw` | `IbraCo5526467` | Painel da Empresa e API |
| **Candidato** | `candidate@kandidatu.gw` | `IbraCo5526467` | Perfil do Candidato e API |

---

## 📡 Rotas Principais

### Interface Web (Django MVC)
- `/login/`: Página inicial de Login do Kandidatu
- `/dashboard/`: Painel do utilizador autenticado
- `/logout/`: Encerramento de sessão
- `/admin/`: Painel de administração oficial do Django

### REST API (Integração com React Frontend)
- `POST /api/auth/login`: Autentica utilizador e devolve `{ token, user }` (JWT)
- `GET /api/auth/me`: Retorna os dados do utilizador autenticado via `Bearer <token>`
- `POST /api/auth/register/candidate`: Registo de novo candidato
- `POST /api/auth/register/company`: Registo de entidade empregadora
- `POST /api/auth/forgot-password`: Recuperação de palavra-passe

