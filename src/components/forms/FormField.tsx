import type { ReactNode } from 'react'

interface FormFieldProps { label: string; error?: string; hint?: string; children: (id: string, describedBy?: string) => ReactNode }

export function FormField({ label, error, hint, children }: FormFieldProps) {
  const id = `f-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const desc = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      <div className="mt-1">{children(id, desc)}</div>
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-ink-muted">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

