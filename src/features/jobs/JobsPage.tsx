import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BadgeCheck, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { useJobs } from './hooks'
import { JobCard } from '../../components/jobs/JobCard'
import { EmptyState, Skeleton } from '../../components/ui/feedback'
import { contractTypes, regions, workModes, type Job, type JobSearch } from '../../schemas/job'
import { CATEGORIES, CONTRACT_LABELS, EDUCATION_LEVELS, EXPERIENCE_LEVELS, MODE_LABELS, REGION_LABELS } from '../../constants'
import { useDebounced } from '../../hooks/useDebounced'
import { Seo } from '../../components/shared/Seo'
import { formatDate, formatSalary } from '../../utils/format'

type Opt = [string, string]
const pairs = (vals: readonly string[], labels?: Record<string, string>): Opt[] => vals.map((v) => [v, labels?.[v] ?? v])

export default function JobsPage() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Job | null>(null)
  const debounced = useDebounced(q)

  useEffect(() => {
    const cur = params.get('q') ?? ''
    if (cur === debounced) return
    const n = new URLSearchParams(params)
    if (debounced) n.set('q', debounced); else n.delete('q')
    n.delete('page')
    setParams(n, { replace: true })
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  const num = (k: string) => (params.get(k) ? Number(params.get(k)) : undefined)
  const page = num('page') ?? 1
  const search: Partial<JobSearch> = {
    q: params.get('q') || undefined,
    page,
    sort: (params.get('sort') as JobSearch['sort']) ?? 'recent',
    region: (params.get('region') as JobSearch['region']) ?? undefined,
    category: params.get('category') ?? undefined,
    contractType: (params.get('contractType') as JobSearch['contractType']) ?? undefined,
    workMode: (params.get('workMode') as JobSearch['workMode']) ?? undefined,
    experience: params.get('experience') ?? undefined,
    education: params.get('education') ?? undefined,
    postedWithinDays: num('postedWithinDays'),
    salaryMin: num('salaryMin'),
  }
  const { data, isLoading, isError } = useJobs(search)
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v); else next.delete(k)
    next.delete('page')
    setParams(next)
  }
  const go = (p: number) => { const n = new URLSearchParams(params); n.set('page', String(p)); setParams(n) }
  const active = [...params.entries()].filter(([k]) => !['page', 'sort', 'q'].includes(k))

  const select = (key: string, label: string, options: Opt[]) => (
    <label className="block text-xs font-semibold text-ink">
      {label}
      <select className="input mt-1" value={params.get(key) ?? ''} onChange={(e) => set(key, e.target.value)}>
        <option value="">Todos</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )

  return (
    <div>
      <Seo title="Encontrar emprego" description="Pesquise vagas na Guiné-Bissau por região, área e tipo de contrato." />

      {/* Banner de pesquisa */}
      <div className="border-b border-line bg-brand bg-pinti-grid px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-extrabold md:text-3xl">Explorar oportunidades profissionais</h1>
          <p className="mt-1 text-sm text-white/75">Filtre por região da Guiné-Bissau, categoria, contrato e faixa salarial em XOF.</p>
          <div className="mt-4 flex flex-col gap-2 rounded-xl bg-white p-2 text-ink shadow-lift sm:flex-row">
            <label className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 text-brand" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Pesquisar por cargo, competência ou organização…"
                className="w-full py-2 text-sm outline-none"
              />
            </label>
            <select
              aria-label="Região"
              className="rounded-lg border border-line px-3 py-2 text-sm"
              value={params.get('region') ?? ''}
              onChange={(e) => set('region', e.target.value)}
            >
              <option value="">Todas as regiões</option>
              {regions.map((r) => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[250px_1fr_340px]">
        <button className="btn-outline lg:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filtros{active.length ? ` (${active.length})` : ''}
        </button>

        <aside aria-label="Filtros" className={`card h-fit space-y-4 p-4 ${open ? '' : 'hidden'} lg:block`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Refinar busca</h2>
            <button
              type="button"
              className="text-xs font-semibold text-brand hover:underline"
              onClick={() => { setQ(''); setParams(new URLSearchParams()) }}
            >
              Limpar
            </button>
          </div>
          {select('category', 'Categoria / área', pairs(CATEGORIES))}
          {select('contractType', 'Tipo de contrato', pairs(contractTypes, CONTRACT_LABELS))}
          {select('workMode', 'Modalidade', pairs(workModes, MODE_LABELS))}
          {select('experience', 'Experiência exigida', pairs(EXPERIENCE_LEVELS))}
          {select('education', 'Escolaridade', pairs(EDUCATION_LEVELS))}
          {select('postedWithinDays', 'Data de publicação', [['1', 'Últimas 24 horas'], ['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias']])}
          <label className="block text-xs font-semibold text-ink">
            Salário mínimo (XOF)
            <input type="number" min={0} step={10000} className="input mt-1" value={params.get('salaryMin') ?? ''} onChange={(e) => set('salaryMin', e.target.value)} />
          </label>
        </aside>

        <section aria-live="polite" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-muted">{data ? `${data.total} vagas encontradas` : 'A consultar oportunidades…'}</p>
            <select aria-label="Ordenar" className="input w-auto py-1.5 text-xs" value={params.get('sort') ?? 'recent'} onChange={(e) => set('sort', e.target.value)}>
              <option value="recent">Mais recentes</option>
              <option value="salary">Maior salário</option>
            </select>
          </div>

          {active.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {active.map(([k, v]) => (
                <button key={k} onClick={() => set(k, '')} className="chip hover:border-brand" aria-label={`Remover filtro ${v}`}>
                  {REGION_LABELS[v] ?? CONTRACT_LABELS[v] ?? MODE_LABELS[v] ?? v} ✕
                </button>
              ))}
            </div>
          )}

          {isLoading && [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
          {isError && <EmptyState title="Servidor de vagas ainda não conectado" description="Conecte o backend Java em VITE_API_URL para listar as oportunidades reais." />}
          {data?.items.length === 0 && <EmptyState title="Nenhuma vaga encontrada" description="Ajuste os filtros laterais para ampliar os resultados." />}
          {data?.items.map((j) => (
            <JobCard key={j.id} job={j} onSelect={setSelected} selected={selected?.id === j.id} />
          ))}

          {data && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button className="btn-outline" disabled={page <= 1} onClick={() => go(page - 1)}>Anterior</button>
              <span className="text-sm font-medium">{page} / {totalPages}</span>
              <button className="btn-outline" disabled={page >= totalPages} onClick={() => go(page + 1)}>Seguinte</button>
            </div>
          )}
        </section>

        {/* Painel lateral de detalhes da vaga no desktop XL */}
        <aside aria-label="Pré-visualização da vaga" className="hidden xl:block">
          <div className="card sticky top-24 p-5">
            {selected ? (
              <div>
                <h2 className="text-lg font-extrabold text-ink">{selected.title}</h2>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                  {selected.company.name}
                  {selected.verified && <BadgeCheck className="h-4 w-4 text-accent" />}
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
                  <MapPin className="h-3.5 w-3.5 text-brand" />
                  {selected.city ?? REGION_LABELS[selected.region]} · {CONTRACT_LABELS[selected.contractType]}
                </p>
                {formatSalary(selected.salaryMin, selected.salaryMax) && (
                  <p className="mt-2 rounded-md bg-gold-50 px-2.5 py-1 text-xs font-bold text-brand">
                    {formatSalary(selected.salaryMin, selected.salaryMax)}
                  </p>
                )}
                <p className="mt-4 line-clamp-6 whitespace-pre-line text-xs leading-relaxed text-ink-muted">
                  {selected.description}
                </p>
                {selected.deadline && (
                  <p className="mt-3 text-[11px] text-ink-muted">Prazo: {formatDate(selected.deadline)}</p>
                )}
                <Link to={`/vagas/${selected.id}`} className="btn-accent mt-5 w-full">
                  Ver vaga completa
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm font-semibold text-ink">Pré-visualização rápida</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Selecione uma vaga na lista para consultar o resumo, requisitos e condições sem sair da pesquisa.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
