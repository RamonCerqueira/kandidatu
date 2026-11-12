import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-md bg-line ${className}`} />
}

interface EmptyStateProps { title: string; description?: string; action?: ReactNode }

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div role="status" className="card flex flex-col items-center px-6 py-12 text-center">
      <Inbox className="mb-3 h-6 w-6 text-ink-muted" aria-hidden />
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

