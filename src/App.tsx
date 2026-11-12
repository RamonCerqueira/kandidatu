import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PublicLayout } from './app/layouts/PublicLayout'
import { CandidateLayout } from './app/layouts/CandidateLayout'
import { EmployerLayout } from './app/layouts/EmployerLayout'
import { AdminLayout } from './app/layouts/AdminLayout'
import { AuthProvider } from './features/auth/AuthContext'
import { RequireRole } from './features/auth/RequireRole'
import { ErrorBoundary } from './components/shared/ErrorBoundary'

const HomePage = lazy(() => import('./features/public/HomePage'))
const JobsPage = lazy(() => import('./features/jobs/JobsPage'))
const JobDetailPage = lazy(() => import('./features/jobs/JobDetailPage'))
const CompaniesPage = lazy(() => import('./features/companies/pages/CompaniesPage'))
const CompanyPage = lazy(() => import('./features/companies/pages/CompanyPage'))
const InstitutionalPage = lazy(() => import('./features/public/InstitutionalPage'))
const TrainingHubPage = lazy(() => import('./features/training/pages/TrainingHubPage'))
const CourseReaderPage = lazy(() => import('./features/training/pages/CourseReaderPage'))
const SignupChoicePage = lazy(() => import('./features/auth/pages/SignupChoicePage'))
const RegisterCandidatePage = lazy(() => import('./features/auth/pages/RegisterCandidatePage'))
const RegisterCompanyPage = lazy(() => import('./features/auth/pages/RegisterCompanyPage'))
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/ForgotPasswordPage'))
const CandidateDashboardPage = lazy(() => import('./features/candidate/pages/CandidateDashboardPage'))
const ProfilePage = lazy(() => import('./features/candidate/pages/ProfilePage'))
const CurriculumPage = lazy(() => import('./features/candidate/pages/CurriculumPage'))
const ApplicationsPage = lazy(() => import('./features/candidate/pages/ApplicationsPage'))
const SavedJobsPage = lazy(() => import('./features/candidate/pages/SavedJobsPage'))
const CandidateInterviewsPage = lazy(() => import('./features/candidate/pages/CandidateInterviewsPage'))
const NotificationsPage = lazy(() => import('./features/candidate/pages/NotificationsPage'))
const EmployerDashboardPage = lazy(() => import('./features/employer/pages/EmployerDashboardPage'))
const EmployerProfilePage = lazy(() => import('./features/employer/pages/EmployerProfilePage'))
const EmployerJobsPage = lazy(() => import('./features/employer/pages/EmployerJobsPage'))
const EmployerJobFormPage = lazy(() => import('./features/employer/pages/EmployerJobFormPage'))
const EmployerCandidatesPage = lazy(() => import('./features/employer/pages/EmployerCandidatesPage'))
const RecruitmentKanbanPage = lazy(() => import('./features/employer/pages/RecruitmentKanbanPage'))
const EmployerInterviewsPage = lazy(() => import('./features/employer/pages/EmployerInterviewsPage'))
const AdminOverviewPage = lazy(() => import('./features/admin/pages/AdminPages'))
import {
  AdminAnalyticsPage, AdminCompaniesModerationPage, AdminJobsModerationPage, AdminLocationsPage,
  AdminPaymentsPage, AdminPlansPage, AdminReportsPage, AdminSettingsPage, AdminTaxonomyPage, AdminUsersPage,
} from './features/admin/pages/AdminPages'
import { AdminFreeCoursesPage, AdminSponsoredAdsPage } from './features/admin/pages/AdminTrainingAdsPages'
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'))

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 60_000 } } })

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/vagas', element: <JobsPage /> },
      { path: '/vagas/:id', element: <JobDetailPage /> },
      { path: '/empresas', element: <CompaniesPage /> },
      { path: '/empresas/:id', element: <CompanyPage /> },
      { path: '/formacao', element: <TrainingHubPage /> },
      { path: '/formacao/:slug', element: <CourseReaderPage /> },
      { path: '/entrar', element: <LoginPage /> },
      { path: '/cadastro', element: <SignupChoicePage /> },
      { path: '/cadastro/candidato', element: <RegisterCandidatePage /> },
      { path: '/cadastro/empresa', element: <RegisterCompanyPage /> },
      { path: '/recuperar-senha', element: <ForgotPasswordPage /> },
      { path: '/:slug', element: <InstitutionalPage /> },
    ],
  },
  {
    element: <RequireRole role="CANDIDATE" />,
    children: [
      {
        path: '/candidato',
        element: <CandidateLayout />,
        children: [
          { index: true, element: <CandidateDashboardPage /> },
          { path: 'perfil', element: <ProfilePage /> },
          { path: 'curriculo', element: <CurriculumPage /> },
          { path: 'candidaturas', element: <ApplicationsPage /> },
          { path: 'salvas', element: <SavedJobsPage /> },
          { path: 'entrevistas', element: <CandidateInterviewsPage /> },
          { path: 'notificacoes', element: <NotificationsPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireRole role="COMPANY" />,
    children: [
      {
        path: '/empresa',
        element: <EmployerLayout />,
        children: [
          { index: true, element: <EmployerDashboardPage /> },
          { path: 'perfil', element: <EmployerProfilePage /> },
          { path: 'vagas', element: <EmployerJobsPage /> },
          { path: 'vagas/nova', element: <EmployerJobFormPage /> },
          { path: 'vagas/:id/editar', element: <EmployerJobFormPage /> },
          { path: 'candidatos', element: <EmployerCandidatesPage /> },
          { path: 'processo', element: <RecruitmentKanbanPage /> },
          { path: 'entrevistas', element: <EmployerInterviewsPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireRole role="ADMIN" />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminOverviewPage /> },
          { path: 'usuarios', element: <AdminUsersPage title="Usuários" /> },
          { path: 'candidatos', element: <AdminUsersPage role="CANDIDATE" title="Candidatos" /> },
          { path: 'empresas', element: <AdminCompaniesModerationPage /> },
          { path: 'aprovacao-empresas', element: <AdminCompaniesModerationPage pendingOnly /> },
          { path: 'aprovacao-vagas', element: <AdminJobsModerationPage /> },
          { path: 'formacao', element: <AdminFreeCoursesPage /> },
          { path: 'publicidade', element: <AdminSponsoredAdsPage /> },
          { path: 'categorias', element: <AdminTaxonomyPage kind="categories" /> },
          { path: 'areas', element: <AdminTaxonomyPage kind="areas" /> },
          { path: 'localizacoes', element: <AdminLocationsPage /> },
          { path: 'denuncias', element: <AdminReportsPage /> },
          { path: 'planos', element: <AdminPlansPage /> },
          { path: 'pagamentos', element: <AdminPaymentsPage /> },
          { path: 'relatorios', element: <AdminAnalyticsPage /> },
          { path: 'configuracoes', element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<p className="p-8 text-center text-sm text-ink-muted">A carregar…</p>}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
