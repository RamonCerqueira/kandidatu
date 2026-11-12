import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { scheduleInterviewSchema, type EmployerInterview, type ScheduleInterviewInput } from '../../../schemas/employer'
import { useApplicants, useEmployerInterviews, useInterviewActions } from '../hooks'
import { FormField } from '../../../components/forms/FormField'
import { PageHeader, QueryState } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'
import { formatDate } from '../../../utils/format'

export default function EmployerInterviewsPage() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'month' | 'week' | 'day'>('month')
  const [editing, setEditing] = useState<EmployerInterview | null>(null)
  const { data, isLoading, isError } = useEmployerInterviews()
  const applicants = useApplicants({})
  const { create, update, cancel } = useInterviewActions()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ScheduleInterviewInput>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: { applicantId: params.get('applicantId') ?? '', mode: 'ONLINE' },
  })

  const onSubmit = async (v: ScheduleInterviewInput) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, data: v })
      setEditing(null)
    } else {
      await create.mutateAsync(v)
    }
    reset({ applicantId: '', startsAt: '', mode: 'ONLINE', location: '', instructions: '' })
  }

  const now = new Date()
  const filtered = (data ?? []).filter((i) => {
    const d = new Date(i.startsAt)
    if (mode === 'day') return d.toDateString() === now.toDateString()
    if (mode === 'week') {
      const diff = Math.abs(d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 7
    }
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <Seo title="Calendário de Entrevistas" />
        <PageHeader
          title="Calendário de entrevistas"
          subtitle="Visualize por mês, semana ou dia e gira os agendamentos."
          actions={
            <div className="inline-flex rounded-lg border border-line bg-white p-1 text-xs font-medium">
              <button type="button" onClick={() => setMode('month')} className={`rounded-md px-3 py-1.5 ${mode === 'month' ? 'bg-brand text-white' : ''}`}>Mensal</button>
              <button type="button" onClick={() => setMode('week')} className={`rounded-md px-3 py-1.5 ${mode === 'week' ? 'bg-brand text-white' : ''}`}>Semanal</button>
              <button type="button" onClick={() => setMode('day')} className={`rounded-md px-3 py-1.5 ${mode === 'day' ? 'bg-brand text-white' : ''}`}>Diária</button>
            </div>
          }
        />

        <QueryState isLoading={isLoading} isError={isError} empty={!filtered.length} emptyTitle="Nenhuma entrevista neste período">
          <div className="space-y-3">
            {filtered.map((i) => {
              const dt = new Date(i.startsAt)
              return (
                <article key={i.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <h2 className="font-semibold">{i.candidateName} · {i.jobTitle}</h2>
                    <p className="text-xs text-ink-muted">
                      {formatDate(i.startsAt)} às {dt.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · {i.mode} · {i.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-outline py-1 text-xs"
                      onClick={() => {
                        setEditing(i)
                        reset({ applicantId: i.applicantId, startsAt: i.startsAt.slice(0, 16), mode: i.mode, location: i.location, instructions: i.instructions })
                      }}
                    >
                      Editar
                    </button>
                    {i.status !== 'CANCELLED' && (
                      <button type="button" className="btn-outline py-1 text-xs text-red-600" onClick={() => cancel.mutate(i.id)}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </QueryState>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card h-fit space-y-4 p-5">
        <h2 className="font-bold">{editing ? 'Editar entrevista' : 'Agendar entrevista'}</h2>
        <FormField label="Candidato" error={errors.applicantId?.message}>
          {(id, d) => (
            <select id={id} aria-describedby={d} className="input" {...register('applicantId')}>
              <option value="">Selecione</option>
              {applicants.data?.map((a) => <option key={a.id} value={a.id}>{a.fullName} — {a.jobTitle}</option>)}
            </select>
          )}
        </FormField>
        <FormField label="Data e horário" error={errors.startsAt?.message}>
          {(id, d) => <input id={id} aria-describedby={d} type="datetime-local" className="input" {...register('startsAt')} />}
        </FormField>
        <FormField label="Modalidade" error={errors.mode?.message}>
          {(id, d) => (
            <select id={id} aria-describedby={d} className="input" {...register('mode')}>
              <option value="ONLINE">Online</option>
              <option value="PRESENCIAL">Presencial</option>
            </select>
          )}
        </FormField>
        <FormField label="Local ou link" error={errors.location?.message}>
          {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('location')} />}
        </FormField>
        <FormField label="Instruções" error={errors.instructions?.message}>
          {(id, d) => <textarea id={id} aria-describedby={d} rows={3} className="input" {...register('instructions')} />}
        </FormField>
        <div className="flex gap-2">
          {editing && <button type="button" className="btn-outline flex-1" onClick={() => setEditing(null)}>Cancelar</button>}
          <button className="btn-accent flex-1" disabled={isSubmitting}>{editing ? 'Guardar' : 'Agendar'}</button>
        </div>
      </form>
    </div>
  )
}

