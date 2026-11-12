import { useInterviews, useMarkRead, useNotifications } from '../hooks'
import { PageHeader, QueryState } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'
import { formatDate } from '../../../utils/format'

export function CandidateInterviewsPage() {
  const { data, isLoading, isError } = useInterviews()
  return (
    <div>
      <Seo title="Entrevistas" />
      <PageHeader title="Agenda de entrevistas" subtitle="Consulte data, horário, modalidade e instruções." />
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Nenhuma entrevista agendada">
        <div className="space-y-3">
          {data?.map((i) => {
            const dt = new Date(i.startsAt)
            return (
              <article key={i.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">{i.jobTitle} · {i.company}</h2>
                  <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-600">{i.mode}</span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {formatDate(i.startsAt)} às {dt.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {i.location && <p className="mt-2 text-xs"><span className="font-medium">Local / Link:</span> {i.location}</p>}
                {i.instructions && <p className="mt-1 text-xs text-ink-muted">{i.instructions}</p>}
              </article>
            )
          })}
        </div>
      </QueryState>
    </div>
  )
}

export function NotificationsPage() {
  const { data, isLoading, isError } = useNotifications()
  const mark = useMarkRead()
  return (
    <div>
      <Seo title="Notificações" />
      <PageHeader title="Notificações" subtitle="Novas vagas compatíveis, convites e mensagens das empresas." />
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Sem notificações no momento">
        <ul className="space-y-2">
          {data?.map((n) => (
            <li key={n.id} className={`card flex items-start justify-between gap-3 p-4 ${n.read ? 'opacity-70' : 'border-brand'}`}>
              <div>
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{n.body}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{formatDate(n.createdAt)}</p>
              </div>
              {!n.read && (
                <button type="button" onClick={() => mark.mutate(n.id)} className="btn-outline py-1 text-xs">
                  Marcar lida
                </button>
              )}
            </li>
          ))}
        </ul>
      </QueryState>
    </div>
  )
}

export default CandidateInterviewsPage

