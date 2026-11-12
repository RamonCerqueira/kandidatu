import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Copy, Edit, Pause, Play, Plus, Trash2, XCircle } from 'lucide-react'
import { jobFormSchema, type JobFormInput } from '../../../schemas/employer'
import { contractTypes, regions, workModes } from '../../../schemas/job'
import { CATEGORIES, CONTRACT_LABELS, EDUCATION_LEVELS, EXPERIENCE_LEVELS, MODE_LABELS, REGION_LABELS } from '../../../constants'
import { useEmployerJobs, useJobActions, useSaveJob } from '../hooks'
import { FormField } from '../../../components/forms/FormField'
import { PageHeader, QueryState } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'
import { formatDate } from '../../../utils/format'

const STATUS_BADGE: Record<string, [string, string]> = {
  ACTIVE: ['Ativa', 'bg-accent-50 text-accent-600'],
  PAUSED: ['Pausada', 'bg-gold-50 text-yellow-800'],
  CLOSED: ['Encerrada', 'bg-line text-ink-muted'],
  DRAFT: ['Rascunho', 'bg-brand-50 text-brand'],
}

export function EmployerJobsPage() {
  const { data, isLoading, isError } = useEmployerJobs()
  const { duplicate, setStatus, remove } = useJobActions()

  return (
    <div>
      <Seo title="Gestão de Vagas" />
      <PageHeader
        title="Gestão de vagas"
        subtitle="Crie, edite, duplique, pause ou encerre oportunidades."
        actions={<Link to="/empresa/vagas/nova" className="btn-accent"><Plus className="h-4 w-4" aria-hidden />Nova vaga</Link>}
      />

      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Ainda não publicou nenhuma vaga">
        <div className="space-y-3">
          {data?.map((j) => {
            const [stLabel, stCls] = STATUS_BADGE[j.status] ?? [j.status, 'bg-line']
            return (
              <div key={j.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{j.title}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stCls}`}>{stLabel}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    {j.category} · {REGION_LABELS[j.region]} · {CONTRACT_LABELS[j.contractType]} · {j.candidatesCount} candidatos · Publicada em {formatDate(j.publishedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link to={`/empresa/vagas/${j.id}/editar`} className="btn-outline px-2.5 py-1.5 text-xs"><Edit className="h-3.5 w-3.5" />Editar</Link>
                  <button type="button" onClick={() => duplicate.mutate(j.id)} className="btn-outline px-2.5 py-1.5 text-xs"><Copy className="h-3.5 w-3.5" />Duplicar</button>
                  {j.status === 'ACTIVE' ? (
                    <button type="button" onClick={() => setStatus.mutate({ id: j.id, status: 'PAUSED' })} className="btn-outline px-2.5 py-1.5 text-xs"><Pause className="h-3.5 w-3.5" />Pausar</button>
                  ) : (
                    <button type="button" onClick={() => setStatus.mutate({ id: j.id, status: 'ACTIVE' })} className="btn-outline px-2.5 py-1.5 text-xs"><Play className="h-3.5 w-3.5" />Ativar</button>
                  )}
                  {j.status !== 'CLOSED' && (
                    <button type="button" onClick={() => setStatus.mutate({ id: j.id, status: 'CLOSED' })} className="btn-outline px-2.5 py-1.5 text-xs"><XCircle className="h-3.5 w-3.5" />Encerrar</button>
                  )}
                  <button type="button" onClick={() => remove.mutate(j.id)} aria-label="Excluir vaga" className="btn-outline px-2.5 py-1.5 text-xs text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            )
          })}
        </div>
      </QueryState>
    </div>
  )
}

const STEPS = ['1. Informações gerais', '2. Requisitos e descrição', '3. Condições e publicação']

export function EmployerJobFormPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const save = useSaveJob(id)
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormInput>({
    resolver: zodResolver(jobFormSchema) as never,
    defaultValues: {
      currency: 'XOF',
      vacancies: 1,
      region: 'BISSAU',
      contractType: 'CLT',
      workMode: 'PRESENCIAL',
      workload: '40h semanais',
      category: CATEGORIES[0],
      education: EDUCATION_LEVELS[3],
      experience: EXPERIENCE_LEVELS[1],
    },
  })

  const onSubmit = async (v: JobFormInput) => {
    await save.mutateAsync(v)
    nav('/empresa/vagas')
  }

  return (
    <div className="max-w-3xl">
      <Seo title={id ? 'Editar Vaga' : 'Publicar Vaga'} />
      <PageHeader title={id ? 'Editar vaga' : 'Publicar nova vaga'} subtitle="Preencha os dados da oportunidade em três etapas." />

      <ol className="mb-6 grid grid-cols-3 gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className={`rounded-lg border p-2.5 text-xs font-semibold ${i === step ? 'border-brand bg-brand text-white' : i < step ? 'border-accent bg-accent-50 text-accent-600' : 'border-line bg-white text-ink-muted'}`}>
            {label}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-6">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField label="Título da vaga" error={errors.title?.message}>
                {(fid, d) => <input id={fid} aria-describedby={d} className="input" {...register('title')} />}
              </FormField>
            </div>
            <FormField label="Categoria" error={errors.category?.message}>
              {(fid, d) => (
                <select id={fid} aria-describedby={d} className="input" {...register('category')}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
            </FormField>
            <FormField label="Quantidade de vagas" error={errors.vacancies?.message}>
              {(fid, d) => <input id={fid} aria-describedby={d} type="number" min={1} className="input" {...register('vacancies')} />}
            </FormField>
            <FormField label="Região (Guiné-Bissau)" error={errors.region?.message}>
              {(fid, d) => (
                <select id={fid} aria-describedby={d} className="input" {...register('region')}>
                  {regions.map((r) => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                </select>
              )}
            </FormField>
            <FormField label="Cidade / Setor" error={errors.city?.message}>
              {(fid, d) => <input id={fid} aria-describedby={d} className="input" {...register('city')} />}
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <FormField label="Descrição da vaga" error={errors.description?.message}>
              {(fid, d) => <textarea id={fid} aria-describedby={d} rows={4} className="input" {...register('description')} />}
            </FormField>
            <FormField label="Responsabilidades (uma por linha)" error={errors.responsibilities?.message}>
              {(fid, d) => <textarea id={fid} aria-describedby={d} rows={3} className="input" {...register('responsibilities')} />}
            </FormField>
            <FormField label="Requisitos (um por linha)" error={errors.requirements?.message}>
              {(fid, d) => <textarea id={fid} aria-describedby={d} rows={3} className="input" {...register('requirements')} />}
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Escolaridade" error={errors.education?.message}>
                {(fid, d) => (
                  <select id={fid} aria-describedby={d} className="input" {...register('education')}>
                    {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                )}
              </FormField>
              <FormField label="Experiência exigida" error={errors.experience?.message}>
                {(fid, d) => (
                  <select id={fid} aria-describedby={d} className="input" {...register('experience')}>
                    {EXPERIENCE_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                )}
              </FormField>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Salário mínimo (FCFA / XOF)" error={errors.salaryMin?.message}>
              {(fid, d) => <input id={fid} aria-describedby={d} type="number" className="input" {...register('salaryMin')} />}
            </FormField>
            <FormField label="Salário máximo (FCFA / XOF)" error={errors.salaryMax?.message}>
              {(fid, d) => <input id={fid} aria-describedby={d} type="number" className="input" {...register('salaryMax')} />}
            </FormField>
            <FormField label="Tipo de contrato" error={errors.contractType?.message}>
              {(fid, d) => (
                <select id={fid} aria-describedby={d} className="input" {...register('contractType')}>
                  {contractTypes.map((c) => <option key={c} value={c}>{CONTRACT_LABELS[c]}</option>)}
                </select>
              )}
            </FormField>
            <FormField label="Modalidade" error={errors.workMode?.message}>
              {(fid, d) => (
                <select id={fid} aria-describedby={d} className="input" {...register('workMode')}>
                  {workModes.map((m) => <option key={m} value={m}>{MODE_LABELS[m]}</option>)}
                </select>
              )}
            </FormField>
            <FormField label="Jornada de trabalho" error={errors.workload?.message}>
              {(fid, d) => <input id={fid} aria-describedby={d} className="input" {...register('workload')} />}
            </FormField>
            <FormField label="Prazo de candidatura" error={errors.deadline?.message}>
              {(fid, d) => <input id={fid} aria-describedby={d} type="date" className="input" {...register('deadline')} />}
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Benefícios (um por linha)" error={errors.benefits?.message}>
                {(fid, d) => <textarea id={fid} aria-describedby={d} rows={3} className="input" {...register('benefits')} />}
              </FormField>
            </div>
          </div>
        )}

        {save.isError && <p role="alert" className="text-sm text-red-600">Não foi possível publicar a vaga. Verifique todos os campos.</p>}

        <div className="flex justify-between pt-2">
          <button type="button" className="btn-outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Anterior</button>
          {step < 2 ? (
            <button type="button" className="btn-primary" onClick={() => setStep(step + 1)}>Seguinte</button>
          ) : (
            <button type="submit" className="btn-accent" disabled={save.isPending}>Publicar vaga</button>
          )}
        </div>
      </form>
    </div>
  )
}

export default EmployerJobsPage

