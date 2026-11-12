import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useApply, useSavedJobs, useToggleSaved } from '../hooks'
import { PageHeader, QueryState } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'
import { formatSalary } from '../../../utils/format'

export default function SavedJobsPage() {
  const { data, isLoading, isError } = useSavedJobs()
  const toggle = useToggleSaved()
  const apply = useApply()

  return (
    <div>
      <Seo title="Vagas Salvas" />
      <PageHeader title="Vagas salvas" subtitle="Oportunidades guardadas para se candidatar." />
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Não tem vagas salvas">
        <div className="space-y-3">
          {data?.map((j) => (
            <div key={j.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <Link to={`/vagas/${j.id}`} className="font-semibold hover:underline">{j.title}</Link>
                <p className="text-xs text-ink-muted">
                  {j.company.name} · {j.city ?? j.region}
                  {formatSalary(j.salaryMin, j.salaryMax) ? ` · ${formatSalary(j.salaryMin, j.salaryMax)}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="btn-accent py-1.5 text-xs" onClick={() => apply.mutate(j.id)} disabled={apply.isPending}>
                  Candidatar-se
                </button>
                <button type="button" aria-label="Remover dos favoritos" className="btn-outline py-1.5 text-xs" onClick={() => toggle.mutate({ jobId: j.id, saved: true })}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </QueryState>
    </div>
  )
}

