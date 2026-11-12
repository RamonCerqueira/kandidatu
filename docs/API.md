# Contrato de API proposto (rascunho para o backend Java)

> PROPOSTA. Nada aqui existe ainda; ajustar com o dev backend. Validação no front via Zod em `src/schemas`.

| Método | Rota | Descrição |
|---|---|---|
| POST | /auth/login | `{email,password}` → `{token,user}` (JWT) |
| POST | /auth/register/candidate | `{fullName,phone,whatsapp?,region,citySector,educationLevel,primaryCategory,experienceLevel,email,password}` |
| POST | /advertising-requests | `{organizationName,contactName,phone,email,packageType,paymentMethod,notes?}` (Orange Money / MTN MoMo / Transferência) |
| POST | /auth/register/company | `{organizationType,legalName,tradeName?,taxId,sector,sizeRange,region,citySector,addressReference,website?,contactName,contactRole,phone,whatsapp?,email,password}`; empresa fica pendente de verificação |
| POST | /auth/forgot-password | `{email}`; resposta neutra (não revelar se o e-mail existe) |
| GET | /auth/me | utilizador atual |
| GET | /jobs | query: q, region, category, contractType, workMode, page, sort → `{items,page,pageSize,total}` |
| GET | /jobs/{id} | detalhe da vaga |
| GET | /jobs (extra) | também: experience, education, postedWithinDays, salaryMin, companyId |
| GET | /companies | query: q, sector, region, verified, page → página de empresas |
| GET | /companies/{id} | detalhe da empresa (inclui openJobs) |
| GET | /stats | `{jobs,companies,candidates}` para os indicadores da landing |
| POST | /contact | `{name,email,message}` |
| GET | /candidate/dashboard | indicadores, recomendações e candidaturas recentes |
| GET / PUT | /candidate/profile | dados pessoais do candidato |
| POST | /candidate/profile/photo | upload multipart `file` → `{url}` |
| GET / PUT | /candidate/curriculum | currículo estruturado do candidato |
| GET | /candidate/applications | lista de candidaturas do candidato |
| POST | /applications | `{jobId}` cria candidatura |
| POST | /candidate/applications/{id}/cancel | cancela candidatura |
| GET / PUT / DELETE | /candidate/saved-jobs(/{jobId}) | vagas guardadas |
| GET | /candidate/interviews | agenda de entrevistas do candidato |
| GET / POST | /notifications (/{id}/read) | central de notificações |
| GET | /employer/dashboard | indicadores e séries temporais para Recharts |
| GET / PUT | /employer/profile | perfil da empresa e status `verified` |
| GET / POST | /employer/jobs | listagem e criação de vagas da empresa |
| PUT / DELETE | /employer/jobs/{id} | edição e remoção de vaga |
| POST | /employer/jobs/{id}/duplicate | duplicar vaga |
| PATCH | /employer/jobs/{id}/status | `{status}` (ACTIVE, PAUSED, CLOSED) |
| GET | /employer/applicants | filtros: jobId, experience, education, skill, location, stage |
| PATCH | /employer/applicants/{id}/stage | `{stage}` para Kanban / gestão |
| PUT | /employer/applicants/{id}/notes | `{notes}` observações internas |
| PATCH | /employer/applicants/{id}/favorite | `{favorite}` |
| GET / POST / PUT | /employer/interviews(/{id}) | agenda de entrevistas da empresa |
| POST | /employer/interviews/{id}/cancel | cancelar entrevista |
| GET | /admin/overview | métricas globais e gráficos por região e mês |
| GET / PATCH | /admin/users(/{id}/active) | gestão de utilizadores e candidatos |
| GET / POST | /admin/companies(/{id}/moderate) | listagem, aprovação e verificação de empresas |
| GET / POST | /admin/jobs(/{id}/moderate) | moderação de vagas |
| GET / POST / DELETE | /admin/categories, /admin/areas, /admin/locations | categorias, áreas e setores da Guiné-Bissau |
| GET / PATCH | /admin/reports(/{id}) | moderação de denúncias |
| GET / POST / PUT | /admin/plans(/{id}) | planos comerciais em XOF |
| GET | /admin/payments | histórico de pagamentos |
| GET / PUT | /admin/settings | configurações globais e idiomas (`pt-GW`, `gwc`, `fr`) |
| GET | /training/free-courses (/{slug}) | cursos básicos gratuitos de leitura |
| GET / POST | /training/sponsored-ads (/{id}/click) | cursos patrocinados de terceiros e registo de cliques |
| POST / DELETE | /admin/training/free-courses(/{id}) | SuperAdmin: publicar/excluir cursos básicos gratuitos |
| POST / PATCH / DELETE | /admin/training/sponsored-ads(/{id}) | SuperAdmin: gerir propagandas e cursos pagos de terceiros |

Moeda sempre `XOF`. Datas em ISO-8601 (o front formata DD/MM/AAAA). Regiões: BISSAU, BAFATA, GABU, CACHEU, OIO, BIOMBO, QUINARA, TOMBALI, BOLAMA_BIJAGOS.

