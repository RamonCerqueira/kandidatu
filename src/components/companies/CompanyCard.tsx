import { Link } from 'react-router-dom'
import { ArrowUpRight, BadgeCheck, MapPin } from 'lucide-react'
import type { Company } from '../../schemas/company'
import { REGION_LABELS } from '../../constants'
import { MotionCard } from '../ui/MotionPrimitives'

export function CompanyCard({ company }: { company: Company }) {
  return (
    <MotionCard className="group relative overflow-hidden p-5">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-bissau-red via-bissau-yellow to-bissau-green opacity-0 transition-opacity group-hover:opacity-100"
      />
      <Link to={`/empresas/${company.id}`} className="block">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-50 font-bold text-brand transition-transform group-hover:scale-105">
              {company.logoUrl ? <img src={company.logoUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : company.name[0]}
            </div>
            <div className="min-w-0">
              <h3 className="flex items-center gap-1 truncate font-semibold group-hover:text-brand">
                {company.name}
                {company.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-accent" aria-label="Empresa verificada" />}
              </h3>
              <p className="text-xs text-ink-muted">{company.sector}</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
        </div>
        <p className="mt-3 flex items-center justify-between text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-bissau-red" aria-hidden />{REGION_LABELS[company.region]}</span>
          <span className="rounded-md bg-accent-50 px-2 py-0.5 font-semibold text-accent-600">{company.openJobs} vagas abertas</span>
        </p>
      </Link>
    </MotionCard>
  )
}
