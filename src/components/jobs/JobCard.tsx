import { Link } from 'react-router-dom'
import { ArrowUpRight, BadgeCheck, Briefcase, Clock, MapPin } from 'lucide-react'
import type { Job } from '../../schemas/job'
import { CONTRACT_LABELS, MODE_LABELS, REGION_LABELS } from '../../constants'
import { formatDate, formatSalary } from '../../utils/format'
import { MotionCard } from '../ui/MotionPrimitives'

export function JobCard({ job, onSelect, selected }: { job: Job; onSelect?: (j: Job) => void; selected?: boolean }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax)

  return (
    <MotionCard
      onClick={() => onSelect?.(job)}
      className={`group relative overflow-hidden p-5 ${selected ? 'border-brand ring-2 ring-brand/10' : ''} ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Filete lateral com as cores nacionais no hover */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-bissau-red via-bissau-yellow to-bissau-green opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-brand-50 text-base font-extrabold text-brand transition-transform duration-200 group-hover:scale-105">
          {job.company.logoUrl ? (
            <img src={job.company.logoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            job.company.name[0]
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link to={`/vagas/${job.id}`} className="font-bold text-ink transition group-hover:text-brand">
                {job.title}
              </Link>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <span>{job.company.name}</span>
                {job.verified && (
                  <span className="inline-flex items-center gap-0.5 rounded bg-accent-50 px-1.5 py-0.5 text-[11px] font-semibold text-accent-600">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    Verificada
                  </span>
                )}
              </p>
            </div>
            <Link
              to={`/vagas/${job.id}`}
              aria-label={`Ver detalhes de ${job.title}`}
              className="rounded-lg border border-line p-1.5 text-ink-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-brand group-hover:bg-brand group-hover:text-white"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">{job.description}</p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="chip transition group-hover:border-brand/25">
              <MapPin className="h-3.5 w-3.5 text-bissau-red" aria-hidden />
              {job.city ?? REGION_LABELS[job.region] ?? job.region}
            </span>
            <span className="chip transition group-hover:border-brand/25">
              <Briefcase className="h-3.5 w-3.5 text-accent" aria-hidden />
              {CONTRACT_LABELS[job.contractType] ?? job.contractType} · {MODE_LABELS[job.workMode] ?? job.workMode}
            </span>
            {salary && (
              <span className="rounded-md bg-gold-50 px-2.5 py-1 text-xs font-semibold text-brand">
                {salary}
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-ink-muted">
              <Clock className="h-3 w-3" aria-hidden />
              {formatDate(job.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </MotionCard>
  )
}
