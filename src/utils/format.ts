export const formatDate = (iso: string): string => new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const formatXOF = (v: number): string => `${new Intl.NumberFormat('pt-PT').format(v)} XOF`

export const formatSalary = (min: number | null, max: number | null): string | null => {
  if (min && max) return `${formatXOF(min)} – ${formatXOF(max)}`
  if (min) return `A partir de ${formatXOF(min)}`
  if (max) return `Até ${formatXOF(max)}`
  return null
}

