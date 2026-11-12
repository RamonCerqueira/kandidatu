import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useEmployerDashboard } from '../hooks'
import { PageHeader, QueryState, StatCard } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'

export default function EmployerDashboardPage() {
  const { data: d, isLoading, isError } = useEmployerDashboard()

  return (
    <div className="space-y-8">
      <Seo title="Dashboard Empresarial" />
      <PageHeader
        title="Painel de recrutamento"
        subtitle="Indicadores de vagas, candidaturas e evolução das contratações."
        actions={
          <Link to="/empresa/vagas/nova" className="btn-accent">
            <Plus className="h-4 w-4" aria-hidden />Publicar vaga
          </Link>
        }
      />

      <QueryState isLoading={isLoading} isError={isError} empty={!d} emptyTitle="Sem métricas disponíveis no momento">
        {d && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <StatCard label="Vagas publicadas" value={d.publishedJobs} />
              <StatCard label="Vagas ativas" value={d.activeJobs} />
              <StatCard label="Total de candidatos" value={d.totalCandidates} />
              <StatCard label="Candidaturas recebidas" value={d.applicationsReceived} />
              <StatCard label="Entrevistas agendadas" value={d.scheduledInterviews} />
              <StatCard label="Vagas encerradas" value={d.closedJobs} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="card p-4">
                <h2 className="mb-4 text-sm font-semibold">Candidaturas por período</h2>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={d.applicationsByPeriod}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6EBF0" />
                      <XAxis dataKey="period" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Line type="monotone" dataKey="total" stroke="#142C4E" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="card p-4">
                <h2 className="mb-4 text-sm font-semibold">Candidatos por vaga</h2>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.candidatesPerJob}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6EBF0" />
                      <XAxis dataKey="jobTitle" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="candidates" fill="#19A875" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="card p-4">
                <h2 className="mb-4 text-sm font-semibold">Evolução das contratações</h2>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={d.hiringEvolution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6EBF0" />
                      <XAxis dataKey="month" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Line type="monotone" dataKey="hires" stroke="#E9B95B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          </>
        )}
      </QueryState>
    </div>
  )
}

