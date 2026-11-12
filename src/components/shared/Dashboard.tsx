import type { ReactNode } from 'react'
import { EmptyState, Skeleton } from '../ui/feedback'

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-2xl font-bold">{title}</h1>{subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}</div>
      {actions}
    </div>
  )
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return <div className="card p-4"><p className="text-xs text-ink-muted">{label}</p><p className="mt-1 text-2xl font-extrabold text-brand">{value}</p></div>
}

const LABELS: Record<string, [string, string]> = {
  SENT: ['Enviada', 'bg-brand-50 text-brand'], REVIEWING: ['Em análise', 'bg-gold-50 text-yellow-800'],
  SHORTLISTED: ['Pré-selecionado', 'bg-accent-50 text-accent-600'], INTERVIEW: ['Entrevista', 'bg-accent-50 text-accent-600'],
  APPROVED: ['Aprovado', 'bg-accent text-white'], REJECTED: ['Reprovado', 'bg-red-50 text-red-700'], CANCELLED: ['Cancelado', 'bg-line text-ink-muted'],
}
export const statusLabel = (s: string): string => LABELS[s]?.[0] ?? s

export function StatusBadge({ status }: { status: string }) {
  const [label, cls] = LABELS[status] ?? [status, 'bg-line']
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
}

// Estados de carregamento/erro/vazio padronizados para listas vindas da API
export function QueryState({ isLoading, isError, empty, emptyTitle, children }: { isLoading: boolean; isError: boolean; empty: boolean; emptyTitle: string; children: ReactNode }) {
  if (isLoading) return <div className="space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
  if (isError) return <EmptyState title="Não foi possível carregar" description="O servidor não respondeu. Tente novamente mais tarde." />
  if (empty) return <EmptyState title={emptyTitle} />
  return <>{children}</>
}

