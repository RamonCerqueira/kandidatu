import { Link } from 'react-router-dom'
import { CheckCircle2, FileText } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { useDashboard, useProfile } from '../hooks'
import { JobCard } from '../../../components/jobs/JobCard'
import { PageHeader, QueryState, StatCard, StatusBadge } from '../../../components/shared/Dashboard'
import { SponsoredBannerSlot } from '../../../components/shared/SponsoredBannerSlot'
import { Seo } from '../../../components/shared/Seo'
import { formatDate } from '../../../utils/format'

export default function CandidateDashboardPage() {
  const { user } = useAuth()
  const dash = useDashboard()
  const profile = useProfile()
  const d = dash.data

  return (
    <div className="space-y-8">
      <Seo title="Painel do Candidato" />
      <PageHeader
        title={`Olá, ${user?.name ?? 'Candidato'}`}
        subtitle="Acompanhe as suas candidaturas, currículo e novas oportunidades na Guiné-Bissau."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-bold text-gold">
              {profile.data?.photoUrl ? (
                <img src={profile.data.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                (user?.name?.[0] ?? 'K')
              )}
            </div>
            <Link to="/candidato/curriculo" className="btn-accent">
              <FileText className="h-4 w-4" aria-hidden />
              Meu currículo
            </Link>
          </div>
        }
      />

      <QueryState
        isLoading={dash.isLoading}
        isError={dash.isError}
        empty={!d}
        emptyTitle="Ainda não há dados disponíveis no seu painel"
      >
        {d && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="card p-4">
                <p className="text-xs text-ink-muted">Progresso do perfil</p>
                <p className="mt-1 text-2xl font-extrabold text-brand">{d.profileProgress}%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-accent transition-all" style={{ width: `${d.profileProgress}%` }} />
                </div>
              </div>
              <div className="card flex flex-col justify-between p-4">
                <p className="text-xs text-ink-muted">Currículo cadastrado</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <CheckCircle2 className={`h-4 w-4 ${d.hasCurriculum ? 'text-accent' : 'text-ink-muted'}`} aria-hidden />
                  {d.hasCurriculum ? 'Completo' : 'Pendente'}
                </p>
              </div>
              <StatCard label="Total de candidaturas" value={d.applications} />
              <StatCard label="Vagas salvas" value={d.savedJobs} />
              <StatCard label="Entrevistas agendadas" value={d.interviews} />
            </div>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Oportunidades para si</h2>
                <Link to="/vagas" className="text-sm font-medium text-brand hover:underline">Ver todas</Link>
              </div>
              {d.recommendations.length === 0 ? (
                <p className="card p-6 text-sm text-ink-muted">Complete o seu perfil e currículo para receber recomendações personalizadas.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {d.recommendations.map((j) => <JobCard key={j.id} job={j} />)}
                </div>
              )}
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Candidaturas recentes</h2>
                <Link to="/candidato/candidaturas" className="text-sm font-medium text-brand hover:underline">Ver todas</Link>
              </div>
              {d.recentApplications.length === 0 ? (
                <p className="card p-6 text-sm text-ink-muted">Ainda não realizou nenhuma candidatura.</p>
              ) : (
                <ol className="card divide-y divide-line">
                  {d.recentApplications.map((a) => (
                    <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                      <div>
                        <Link to={`/vagas/${a.job.id}`} className="font-semibold hover:underline">{a.job.title}</Link>
                        <p className="text-xs text-ink-muted">{a.job.company.name} · {formatDate(a.appliedAt)}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold">Cursos & qualificações recomendadas</h2>
              <SponsoredBannerSlot placement="SIDEBAR_BANNER" limit={2} />
            </section>
          </>
        )}
      </QueryState>
    </div>
  )
}

