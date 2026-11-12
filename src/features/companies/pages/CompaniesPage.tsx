import { useState } from 'react'
import { useCompanies } from '../hooks'
import { CompanyCard } from '../../../components/companies/CompanyCard'
import { EmptyState, Skeleton } from '../../../components/ui/feedback'
import { REGION_LABELS } from '../../../constants'
import { useDebounced } from '../../../hooks/useDebounced'
import { Seo } from '../../../components/shared/Seo'

export default function CompaniesPage() {
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('')
  const [verified, setVerified] = useState(false)
  const [page, setPage] = useState(1)
  const dq = useDebounced(q)
  const { data, isLoading, isError } = useCompanies({ q: dq || undefined, region: region || undefined, verified: verified || undefined, page })
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="Empresas" description="Empresas e instituições que recrutam na Guiné-Bissau." />
      <h1 className="text-2xl font-bold">Empresas</h1>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium">Pesquisar
          <input className="input mt-1" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Nome, setor ou segmento" />
        </label>
        <label className="text-sm font-medium">Localização
          <select className="input mt-1" value={region} onChange={(e) => { setRegion(e.target.value); setPage(1) }}>
            <option value="">Todas</option>
            {Object.entries(REGION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" checked={verified} onChange={(e) => { setVerified(e.target.checked); setPage(1) }} />Só verificadas</label>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)}
        {data?.items.map((c) => <CompanyCard key={c.id} company={c} />)}
      </div>
      {isError && <EmptyState title="Não foi possível carregar as empresas" description="O servidor não respondeu. Tente novamente mais tarde." />}
      {data?.items.length === 0 && <EmptyState title="Nenhuma empresa encontrada" />}
      {data && pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span className="text-sm">{page} / {pages}</span>
          <button className="btn-outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>Seguinte</button>
        </div>
      )}
    </div>
  )
}

