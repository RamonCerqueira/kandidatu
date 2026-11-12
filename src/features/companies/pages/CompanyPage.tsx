import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Globe, MapPin, Users } from 'lucide-react'
import { useCompany } from '../hooks'
import { useJobs } from '../../jobs/hooks'
import { JobCard } from '../../../components/jobs/JobCard'
import { EmptyState, Skeleton } from '../../../components/ui/feedback'
import { REGION_LABELS } from '../../../constants'
import { Seo } from '../../../components/shared/Seo'

export default function CompanyPage() {
  const { id = '' } = useParams()
  const { data: c, isLoading, isError } = useCompany(id)
  const jobs = useJobs({ companyId: id })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/empresas" className="text-sm text-ink-muted hover:text-ink">← Todas as empresas</Link>
      {isLoading && <Skeleton className="mt-4 h-64" />}
      {isError && <div className="mt-4"><EmptyState title="Empresa não encontrada" /></div>}
      {c && (
        <>
          <Seo title={c.name} description={c.description.slice(0, 150)} />
          <article className="card mt-4 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-brand to-brand-600">
              {c.coverUrl && <img src={c.coverUrl} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="p-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold">{c.name}{c.verified && <BadgeCheck className="h-5 w-5 text-accent" aria-label="Empresa verificada" />}</h1>
              <p className="text-ink-muted">{c.sector}</p>
              <p className="mt-3 flex flex-wrap gap-4 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden />{c.city ?? REGION_LABELS[c.region]}</span>
                {c.employees && <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" aria-hidden />{c.employees} funcionários</span>}
                {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline"><Globe className="h-4 w-4" aria-hidden />Website</a>}
                {c.socials.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{s.network}</a>)}
              </p>
              <p className="mt-4 whitespace-pre-line text-sm">{c.description}</p>
            </div>
          </article>
          <h2 className="mb-3 mt-8 text-lg font-bold">Vagas abertas ({c.openJobs})</h2>
          <div className="space-y-4">
            {jobs.isLoading && <Skeleton className="h-28" />}
            {jobs.data?.items.length === 0 && <EmptyState title="Sem vagas abertas neste momento" />}
            {jobs.data?.items.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        </>
      )}
    </div>
  )
}

