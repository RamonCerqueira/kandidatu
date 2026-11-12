import { useState } from 'react'
import { Link } from 'react-router-dom'
import { applicationStatuses } from '../../../schemas/candidate'
import { applicationService } from '../../../services/candidates/candidateService'
import { useApplications } from '../hooks'
import { PageHeader, QueryState, StatusBadge, statusLabel } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'
import { formatDate } from '../../../utils/format'

export default function ApplicationsPage() {
  const { data, isLoading, isError, refetch } = useApplications()
  const [view, setView] = useState<'timeline' | 'kanban'>('timeline')

  const cancel = async (id: string) => {
    await applicationService.cancel(id)
    refetch()
  }

  return (
    <div>
      <Seo title="Minhas Candidaturas" />
      <PageHeader
        title="Minhas candidaturas"
        subtitle="Acompanhe o estado de cada processo seletivo."
        actions={
          <div className="inline-flex rounded-lg border border-line bg-white p-1 text-xs font-medium">
            <button type="button" onClick={() => setView('timeline')} className={`rounded-md px-3 py-1.5 ${view === 'timeline' ? 'bg-brand text-white' : ''}`}>Timeline</button>
            <button type="button" onClick={() => setView('kanban')} className={`rounded-md px-3 py-1.5 ${view === 'kanban' ? 'bg-brand text-white' : ''}`}>Kanban</button>
          </div>
        }
      />

      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Ainda não se candidatou a nenhuma vaga">
        {data && view === 'timeline' && (
          <ol className="space-y-3">
            {data.map((a) => (
              <li key={a.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <Link to={`/vagas/${a.job.id}`} className="font-semibold hover:underline">{a.job.title}</Link>
                  <p className="text-xs text-ink-muted">{a.job.company.name} · Enviada em {formatDate(a.appliedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.status} />
                  {a.status !== 'CANCELLED' && a.status !== 'REJECTED' && (
                    <button type="button" onClick={() => cancel(a.id)} className="btn-outline py-1 text-xs">Cancelar</button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}

        {data && view === 'kanban' && (
          <div className="grid gap-4 overflow-x-auto md:grid-cols-4 xl:grid-cols-7">
            {applicationStatuses.map((st) => (
              <div key={st} className="card min-w-[210px] p-3">
                <h2 className="mb-3 text-xs font-bold uppercase text-ink-muted">{statusLabel(st)}</h2>
                <div className="space-y-2">
                  {data.filter((a) => a.status === st).map((a) => (
                    <div key={a.id} className="rounded-lg border border-line bg-canvas p-3 text-xs">
                      <Link to={`/vagas/${a.job.id}`} className="font-semibold hover:underline">{a.job.title}</Link>
                      <p className="text-ink-muted">{a.job.company.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </QueryState>
    </div>
  )
}

