import { useEffect, useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BadgeCheck, Check, Plus, Trash2, X } from 'lucide-react'
import { platformSettingsSchema, type CommercialPlan, type PlatformSettings } from '../../../schemas/admin'
import { regions } from '../../../schemas/job'
import { REGION_LABELS } from '../../../constants'
import {
  useAdminActions, useAdminAreas, useAdminCategories, useAdminCompanies, useAdminJobs, useAdminLocations,
  useAdminOverview, useAdminPayments, useAdminPlans, useAdminReports, useAdminSettings, useAdminUsers,
} from '../hooks'
import { FormField } from '../../../components/forms/FormField'
import { PageHeader, QueryState, StatCard } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'
import { formatDate, formatXOF } from '../../../utils/format'

export function AdminOverviewPage() {
  const { data: d, isLoading, isError } = useAdminOverview()
  return (
    <div className="space-y-8">
      <Seo title="Administração — Visão Geral" />
      <PageHeader title="Painel administrativo" subtitle="Métricas globais, moderação e operação da plataforma KANDIDATU." />
      <QueryState isLoading={isLoading} isError={isError} empty={!d} emptyTitle="Sem métricas globais">
        {d && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total de utilizadores" value={d.totalUsers} />
              <StatCard label="Candidatos" value={d.totalCandidates} />
              <StatCard label="Empresas" value={d.totalCompanies} />
              <StatCard label="Empresas pendentes" value={d.pendingCompanies} />
              <StatCard label="Vagas para aprovar" value={d.pendingJobs} />
              <StatCard label="Denúncias abertas" value={d.openReports} />
              <StatCard label="Planos ativos" value={d.activePlans} />
              <StatCard label="Receita mensal" value={formatXOF(d.monthlyRevenueXof)} />
            </div>
            <AdminCharts growth={d.growthByMonth} byRegion={d.jobsByRegion} />
          </>
        )}
      </QueryState>
    </div>
  )
}

function AdminCharts({
  growth, byRegion,
}: {
  growth: { month: string; candidates: number; companies: number; jobs: number }[]
  byRegion: { region: string; total: number }[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card p-4">
        <h2 className="mb-4 text-sm font-semibold">Crescimento mensal</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EBF0" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="candidates" name="Candidatos" stroke="#142C4E" strokeWidth={2} />
              <Line type="monotone" dataKey="companies" name="Empresas" stroke="#19A875" strokeWidth={2} />
              <Line type="monotone" dataKey="jobs" name="Vagas" stroke="#E9B95B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="card p-4">
        <h2 className="mb-4 text-sm font-semibold">Vagas por região da Guiné-Bissau</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byRegion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EBF0" />
              <XAxis dataKey="region" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="total" fill="#142C4E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

export function AdminUsersPage({ role, title }: { role?: 'CANDIDATE' | 'COMPANY' | 'ADMIN'; title: string }) {
  const { data, isLoading, isError } = useAdminUsers(role)
  const { toggleUser } = useAdminActions()
  return (
    <div>
      <Seo title={title} />
      <PageHeader title={title} subtitle="Gestão de contas e estado de acesso." />
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Nenhum registo encontrado">
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-canvas text-ink-muted">
              <tr><th className="p-3">Nome</th><th className="p-3">E-mail</th><th className="p-3">Perfil</th><th className="p-3">Registo</th><th className="p-3">Estado</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data?.map((u) => (
                <tr key={u.id}>
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{formatDate(u.createdAt)}</td>
                  <td className="p-3">
                    <button type="button" onClick={() => toggleUser.mutate({ id: u.id, active: !u.active })} className="btn-outline py-1 text-xs">
                      {u.active ? 'Ativo (Bloquear)' : 'Bloqueado (Ativar)'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </QueryState>
    </div>
  )
}

export function AdminCompaniesModerationPage({ pendingOnly }: { pendingOnly?: boolean }) {
  const { data, isLoading, isError } = useAdminCompanies(pendingOnly ? 'PENDING' : undefined)
  const { moderateCompany } = useAdminActions()
  return (
    <div>
      <Seo title={pendingOnly ? 'Aprovação de Empresas' : 'Empresas Cadastradas'} />
      <PageHeader title={pendingOnly ? 'Aprovação de empresas' : 'Empresas'} subtitle="Verifique organizações e atribua o selo de empresa verificada." />
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Sem empresas para apresentar">
        <div className="space-y-3">
          {data?.map((c) => (
            <div key={c.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <h2 className="flex items-center gap-1.5 font-semibold">
                  {c.legalName} {c.verified && <BadgeCheck className="h-4 w-4 text-accent" />}
                </h2>
                <p className="text-xs text-ink-muted">NIF: {c.taxId} · {c.sector} · {REGION_LABELS[c.region]} · {c.email} · {c.phone}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => moderateCompany.mutate({ id: c.id, decision: 'APPROVED', verified: true })} className="btn-accent py-1.5 text-xs">
                  <Check className="h-3.5 w-3.5" />Aprovar e verificar
                </button>
                <button type="button" onClick={() => moderateCompany.mutate({ id: c.id, decision: 'REJECTED', verified: false })} className="btn-outline py-1.5 text-xs text-red-600">
                  <X className="h-3.5 w-3.5" />Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      </QueryState>
    </div>
  )
}

export function AdminJobsModerationPage() {
  const { data, isLoading, isError } = useAdminJobs('PENDING')
  const { moderateJob } = useAdminActions()
  return (
    <div>
      <Seo title="Aprovação de Vagas" />
      <PageHeader title="Aprovação de vagas" subtitle="Modere anúncios antes de ficarem visíveis na plataforma." />
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Nenhuma vaga pendente de moderação">
        <div className="space-y-3">
          {data?.map((j) => (
            <div key={j.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <h2 className="font-semibold">{j.title}</h2>
                <p className="text-xs text-ink-muted">{j.companyName} · {j.category} · {REGION_LABELS[j.region]} · {formatDate(j.publishedAt)}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => moderateJob.mutate({ id: j.id, decision: 'APPROVED' })} className="btn-accent py-1.5 text-xs">Aprovar</button>
                <button type="button" onClick={() => moderateJob.mutate({ id: j.id, decision: 'REJECTED' })} className="btn-outline py-1.5 text-xs text-red-600">Rejeitar</button>
              </div>
            </div>
          ))}
        </div>
      </QueryState>
    </div>
  )
}

export function AdminTaxonomyPage({ kind }: { kind: 'categories' | 'areas' }) {
  const [name, setName] = useState('')
  const q = kind === 'categories' ? useAdminCategories() : useAdminAreas()
  const { addCategory, delCategory, addArea, delArea } = useAdminActions()
  const add = kind === 'categories' ? addCategory : addArea
  const del = kind === 'categories' ? delCategory : delArea
  const title = kind === 'categories' ? 'Categorias profissionais' : 'Áreas de atuação'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    add.mutate(name.trim())
    setName('')
  }

  return (
    <div className="max-w-2xl">
      <Seo title={title} />
      <PageHeader title={title} />
      <form onSubmit={submit} className="mb-4 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={`Nova ${title.toLowerCase()}`} className="input flex-1" />
        <button className="btn-primary"><Plus className="h-4 w-4" />Adicionar</button>
      </form>
      <QueryState isLoading={q.isLoading} isError={q.isError} empty={!q.data?.length} emptyTitle="Sem itens registados">
        <ul className="card divide-y divide-line">
          {q.data?.map((i) => (
            <li key={i.id} className="flex items-center justify-between p-3 text-sm">
              <span>{i.name}</span>
              <button type="button" onClick={() => del.mutate(i.id)} aria-label="Remover" className="text-red-600"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      </QueryState>
    </div>
  )
}

export function AdminLocationsPage() {
  const [region, setRegion] = useState<string>('BISSAU')
  const [sectorName, setSectorName] = useState('')
  const { data, isLoading, isError } = useAdminLocations()
  const { addLocation, delLocation } = useAdminActions()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!sectorName.trim()) return
    addLocation.mutate({ region, sectorName: sectorName.trim() })
    setSectorName('')
  }

  return (
    <div className="max-w-2xl">
      <Seo title="Localizações da Guiné-Bissau" />
      <PageHeader title="Localizações" subtitle="Regiões e setores administrativos da Guiné-Bissau." />
      <form onSubmit={submit} className="mb-4 flex flex-wrap gap-2">
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="input w-auto">
          {regions.map((r) => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
        </select>
        <input value={sectorName} onChange={(e) => setSectorName(e.target.value)} placeholder="Setor administrativo / Cidade" className="input flex-1" />
        <button className="btn-primary"><Plus className="h-4 w-4" />Adicionar</button>
      </form>
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Sem setores registados">
        <ul className="card divide-y divide-line">
          {data?.map((l) => (
            <li key={l.id} className="flex items-center justify-between p-3 text-sm">
              <span><strong>{REGION_LABELS[l.region]}</strong> — {l.sectorName}</span>
              <button type="button" onClick={() => delLocation.mutate(l.id)} aria-label="Remover" className="text-red-600"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      </QueryState>
    </div>
  )
}

export function AdminReportsPage() {
  const { data, isLoading, isError } = useAdminReports()
  const { resolveReport } = useAdminActions()
  return (
    <div>
      <Seo title="Denúncias" />
      <PageHeader title="Denúncias" subtitle="Analise anúncios ou perfis sinalizados pelos utilizadores." />
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Nenhuma denúncia registada">
        <div className="space-y-3">
          {data?.map((r) => (
            <div key={r.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <h2 className="font-semibold">[{r.targetType}] {r.targetTitle}</h2>
                <p className="text-xs text-ink-muted">Motivo: {r.reason} · Por {r.reporterEmail} em {formatDate(r.createdAt)}</p>
              </div>
              {r.status === 'OPEN' ? (
                <div className="flex gap-2">
                  <button type="button" onClick={() => resolveReport.mutate({ id: r.id, status: 'RESOLVED' })} className="btn-accent py-1 text-xs">Resolver</button>
                  <button type="button" onClick={() => resolveReport.mutate({ id: r.id, status: 'DISMISSED' })} className="btn-outline py-1 text-xs">Arquivar</button>
                </div>
              ) : (
                <span className="text-xs text-ink-muted">{r.status}</span>
              )}
            </div>
          ))}
        </div>
      </QueryState>
    </div>
  )
}

export function AdminPlansPage() {
  const { data, isLoading, isError } = useAdminPlans()
  const { savePlan } = useAdminActions()
  const [name, setName] = useState('')
  const [priceXof, setPrice] = useState(25000)
  const [jobSlots, setSlots] = useState(5)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const payload: Omit<CommercialPlan, 'id'> = { name, priceXof, billingCycle: 'MENSAL', jobSlots, featuredSlots: 1, active: true }
    savePlan.mutate(payload)
    setName('')
  }

  return (
    <div className="space-y-6">
      <Seo title="Planos Comerciais" />
      <PageHeader title="Planos comerciais" subtitle="Planos de recrutamento em Franco CFA (XOF)." />
      <form onSubmit={submit} className="card grid gap-3 p-4 sm:grid-cols-4">
        <input placeholder="Nome do plano" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
        <input type="number" placeholder="Preço (XOF)" value={priceXof} onChange={(e) => setPrice(Number(e.target.value))} className="input" />
        <input type="number" placeholder="Limite de vagas" value={jobSlots} onChange={(e) => setSlots(Number(e.target.value))} className="input" />
        <button className="btn-primary">Criar plano</button>
      </form>
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Sem planos configurados">
        <div className="grid gap-4 sm:grid-cols-3">
          {data?.map((p) => (
            <div key={p.id} className="card p-4">
              <h2 className="font-bold">{p.name}</h2>
              <p className="mt-1 text-xl font-extrabold text-brand">{formatXOF(p.priceXof)} <span className="text-xs font-normal text-ink-muted">/ {p.billingCycle}</span></p>
              <p className="mt-2 text-xs text-ink-muted">{p.jobSlots} vagas · {p.featuredSlots} em destaque</p>
            </div>
          ))}
        </div>
      </QueryState>
    </div>
  )
}

export function AdminPaymentsPage() {
  const { data, isLoading, isError } = useAdminPayments()
  return (
    <div>
      <Seo title="Pagamentos" />
      <PageHeader title="Histórico de pagamentos" subtitle="Registos processados pelo backend (sem processamento financeiro direto no frontend)." />
      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Sem pagamentos registados">
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-canvas text-ink-muted">
              <tr><th className="p-3">Empresa</th><th className="p-3">Plano</th><th className="p-3">Valor</th><th className="p-3">Método</th><th className="p-3">Status</th><th className="p-3">Data</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data?.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-medium">{p.companyName}</td>
                  <td className="p-3">{p.planName}</td>
                  <td className="p-3">{formatXOF(p.amountXof)}</td>
                  <td className="p-3">{p.method}</td>
                  <td className="p-3">{p.status}</td>
                  <td className="p-3">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </QueryState>
    </div>
  )
}

export function AdminAnalyticsPage() {
  const { data: d, isLoading, isError } = useAdminOverview()
  return (
    <div>
      <Seo title="Relatórios" />
      <PageHeader title="Relatórios e estatísticas" subtitle="Evolução de cadastros, vagas e distribuição regional na Guiné-Bissau." />
      <QueryState isLoading={isLoading} isError={isError} empty={!d} emptyTitle="Sem dados de relatórios">
        {d && <AdminCharts growth={d.growthByMonth} byRegion={d.jobsByRegion} />}
      </QueryState>
    </div>
  )
}

export function AdminSettingsPage() {
  const { data } = useAdminSettings()
  const { saveSettings } = useAdminActions()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PlatformSettings>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      platformName: 'KANDIDATU',
      supportEmail: 'suporte@kandidatu.gw',
      supportPhone: '+245',
      defaultCurrency: 'XOF',
      defaultLanguage: 'pt-GW',
      requireCompanyVerification: true,
      requireJobModeration: true,
      maintenanceMode: false,
    },
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])

  return (
    <div className="max-w-2xl">
      <Seo title="Configurações da Plataforma" />
      <PageHeader title="Configurações" subtitle="Idioma (Português, Crioulo Guineense, Francês), moeda XOF e regras de moderação." />
      <form onSubmit={handleSubmit((v) => saveSettings.mutate(v))} noValidate className="card space-y-4 p-6">
        <FormField label="Nome da plataforma" error={errors.platformName?.message}>
          {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('platformName')} />}
        </FormField>
        <FormField label="E-mail de suporte" error={errors.supportEmail?.message}>
          {(id, d) => <input id={id} aria-describedby={d} type="email" className="input" {...register('supportEmail')} />}
        </FormField>
        <FormField label="Telefone de suporte (+245)" error={errors.supportPhone?.message}>
          {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('supportPhone')} />}
        </FormField>
        <FormField label="Idioma padrão" error={errors.defaultLanguage?.message}>
          {(id, d) => (
            <select id={id} aria-describedby={d} className="input" {...register('defaultLanguage')}>
              <option value="pt-GW">Português (Guiné-Bissau)</option>
              <option value="gwc">Crioulo Guineense (Kriol)</option>
              <option value="fr">Francês</option>
            </select>
          )}
        </FormField>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('requireCompanyVerification')} />Exigir verificação de empresas antes de publicar</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('requireJobModeration')} />Exigir moderação prévia de vagas</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('maintenanceMode')} />Modo de manutenção</label>
        {saveSettings.isSuccess && <p role="status" className="text-sm text-accent-600">Configurações guardadas.</p>}
        <button className="btn-primary" disabled={saveSettings.isPending}>Guardar configurações</button>
      </form>
    </div>
  )
}

export default AdminOverviewPage

