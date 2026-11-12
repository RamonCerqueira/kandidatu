import { useEffect, useState } from 'react'
import { useFieldArray, useForm, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDown, ArrowUp, HardDriveDownload, Plus, Printer, Trash2 } from 'lucide-react'
import { curriculumSchema, type Curriculum } from '../../../schemas/candidate'
import { useCurriculum, useSaveCurriculum } from '../hooks'
import { useToast } from '../../../components/ui/ToastContext'
import { PageHeader } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'

const DRAFT_STORAGE_KEY = 'kandidatu.curriculum.draft'

const emptyCurriculum: Curriculum = {
  template: 'moderno',
  personal: { fullName: '', email: '', phone: '+245', city: 'Bissau' },
  summary: '',
  experiences: [],
  education: [],
  courses: [],
  certifications: [],
  languages: [],
  skills: [],
  references: [],
}

type ArrayKey = 'experiences' | 'education' | 'courses' | 'certifications' | 'languages' | 'skills' | 'references'

function ArraySection({
  title, name, control, defaultItem, render,
}: {
  title: string
  name: ArrayKey
  control: Control<Curriculum>
  defaultItem: Record<string, string>
  render: (index: number) => React.ReactNode
}) {
  const { fields, append, remove, swap } = useFieldArray({ control, name })
  return (
    <section className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <button type="button" className="btn-outline py-1.5 text-xs" onClick={() => append(defaultItem as never)}>
          <Plus className="h-3.5 w-3.5" aria-hidden />Adicionar
        </button>
      </div>
      {fields.map((f, i) => (
        <div key={f.id} className="space-y-2 rounded-lg border border-line p-3">
          {render(i)}
          <div className="flex justify-end gap-1">
            <button type="button" aria-label="Mover para cima" disabled={i === 0} onClick={() => swap(i, i - 1)} className="btn-outline px-2 py-1 text-xs"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button type="button" aria-label="Mover para baixo" disabled={i === fields.length - 1} onClick={() => swap(i, i + 1)} className="btn-outline px-2 py-1 text-xs"><ArrowDown className="h-3.5 w-3.5" /></button>
            <button type="button" aria-label="Remover" onClick={() => remove(i)} className="btn-outline px-2 py-1 text-xs text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ))}
    </section>
  )
}

export default function CurriculumPage() {
  const { data } = useCurriculum()
  const save = useSaveCurriculum()
  const { notify } = useToast()
  const [offlineSavedAt, setOfflineSavedAt] = useState<string | null>(null)

  const { register, control, handleSubmit, reset, watch } = useForm<Curriculum>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: () => {
      try {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
        if (raw) return JSON.parse(raw) as Curriculum
      } catch {
        // ignora erro de leitura local
      }
      return emptyCurriculum
    },
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])
  const v = watch()

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(v))
      setOfflineSavedAt(new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }))
    } catch {
      // ignora quota excedida
    }
  }, [v])

  const onSaveServer = (c: Curriculum) => {
    save.mutate(c, {
      onSuccess: () => notify('Currículo sincronizado com o servidor!', 'success'),
      onError: () => notify('Rascunho mantido offline no seu dispositivo.', 'info'),
    })
  }

  return (
    <div>
      <Seo title="Meu Currículo" />
      <PageHeader
        title="Construtor de currículo"
        subtitle="Adicione, reordene secções e gere o PDF em formato A4."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {offlineSavedAt && (
              <span className="inline-flex items-center gap-1 rounded-md bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-600">
                <HardDriveDownload className="h-3.5 w-3.5" aria-hidden />
                Guardado offline às {offlineSavedAt}
              </span>
            )}
            <select aria-label="Modelo do currículo" className="input w-auto" {...register('template')}>
              <option value="moderno">Modelo Moderno</option>
              <option value="classico">Modelo Clássico</option>
            </select>
            <button type="button" className="btn-outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" aria-hidden />Gerar PDF
            </button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <form onSubmit={handleSubmit(onSaveServer)} noValidate className="space-y-4 print:hidden">
          <section className="card grid gap-3 p-4 sm:grid-cols-2">
            <h2 className=" font-semibold sm:col-span-2">Dados pessoais</h2>
            <input placeholder="Nome completo" className="input" {...register('personal.fullName')} />
            <input placeholder="E-mail" className="input" {...register('personal.email')} />
            <input placeholder="Telefone (+245)" className="input" {...register('personal.phone')} />
            <input placeholder="Cidade / Região" className="input" {...register('personal.city')} />
            <textarea rows={3} placeholder="Resumo profissional" className="input sm:col-span-2" {...register('summary')} />
          </section>

          <ArraySection title="Experiência profissional" name="experiences" control={control} defaultItem={{ role: '', company: '', period: '', description: '' }}
            render={(i) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <input placeholder="Cargo" className="input" {...register(`experiences.${i}.role`)} />
                <input placeholder="Empresa" className="input" {...register(`experiences.${i}.company`)} />
                <input placeholder="Período (ex: 2023 - Presente)" className="input sm:col-span-2" {...register(`experiences.${i}.period`)} />
                <textarea rows={2} placeholder="Descrição das atividades" className="input sm:col-span-2" {...register(`experiences.${i}.description`)} />
              </div>
            )}
          />

          <ArraySection title="Formação académica" name="education" control={control} defaultItem={{ course: '', institution: '', period: '' }}
            render={(i) => (
              <div className="grid gap-2 sm:grid-cols-3">
                <input placeholder="Curso / Grau" className="input" {...register(`education.${i}.course`)} />
                <input placeholder="Instituição" className="input" {...register(`education.${i}.institution`)} />
                <input placeholder="Período" className="input" {...register(`education.${i}.period`)} />
              </div>
            )}
          />

          <ArraySection title="Cursos complementares" name="courses" control={control} defaultItem={{ name: '', institution: '', year: '' }}
            render={(i) => (
              <div className="grid gap-2 sm:grid-cols-3">
                <input placeholder="Curso" className="input" {...register(`courses.${i}.name`)} />
                <input placeholder="Instituição" className="input" {...register(`courses.${i}.institution`)} />
                <input placeholder="Ano" className="input" {...register(`courses.${i}.year`)} />
              </div>
            )}
          />

          <ArraySection title="Certificações" name="certifications" control={control} defaultItem={{ name: '', issuer: '', year: '' }}
            render={(i) => (
              <div className="grid gap-2 sm:grid-cols-3">
                <input placeholder="Certificação" className="input" {...register(`certifications.${i}.name`)} />
                <input placeholder="Entidade emissora" className="input" {...register(`certifications.${i}.issuer`)} />
                <input placeholder="Ano" className="input" {...register(`certifications.${i}.year`)} />
              </div>
            )}
          />

          <ArraySection title="Idiomas" name="languages" control={control} defaultItem={{ name: '', level: 'Intermédio' }}
            render={(i) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <input placeholder="Idioma (ex: Português, Crioulo, Francês)" className="input" {...register(`languages.${i}.name`)} />
                <input placeholder="Nível" className="input" {...register(`languages.${i}.level`)} />
              </div>
            )}
          />

          <ArraySection title="Competências" name="skills" control={control} defaultItem={{ name: '' }}
            render={(i) => <input placeholder="Competência" className="input" {...register(`skills.${i}.name`)} />}
          />

          <ArraySection title="Referências profissionais" name="references" control={control} defaultItem={{ name: '', role: '', contact: '' }}
            render={(i) => (
              <div className="grid gap-2 sm:grid-cols-3">
                <input placeholder="Nome" className="input" {...register(`references.${i}.name`)} />
                <input placeholder="Cargo / Empresa" className="input" {...register(`references.${i}.role`)} />
                <input placeholder="Contacto" className="input" {...register(`references.${i}.contact`)} />
              </div>
            )}
          />

          {save.isSuccess && <p role="status" className="text-sm text-accent-600">Currículo guardado.</p>}
          {save.isError && <p role="alert" className="text-sm text-red-600">Erro ao guardar o currículo.</p>}
          <button className="btn-primary" disabled={save.isPending}>Guardar currículo</button>
        </form>

        {/* Pré-visualização A4 */}
        <aside aria-label="Pré-visualização A4 do currículo" className="card mx-auto aspect-[1/1.414] w-full max-w-[420px] overflow-y-auto p-6 text-xs shadow-lift print:max-w-none print:border-0 print:shadow-none">
          <header className={v.template === 'moderno' ? 'border-b-2 border-brand pb-3' : 'border-b border-ink pb-3 text-center'}>
            <h2 className="text-lg font-extrabold text-brand">{v.personal.fullName || 'O seu nome'}</h2>
            <p className="text-ink-muted">{[v.personal.city, v.personal.phone, v.personal.email].filter(Boolean).join(' · ')}</p>
          </header>
          {v.summary && <section className="mt-3"><h3 className="font-bold uppercase tracking-wider text-brand">Resumo</h3><p className="mt-1 whitespace-pre-line">{v.summary}</p></section>}
          {v.experiences.length > 0 && (
            <section className="mt-3">
              <h3 className="font-bold uppercase tracking-wider text-brand">Experiência</h3>
              {v.experiences.map((e, i) => (
                <div key={i} className="mt-1.5">
                  <p className="font-semibold">{e.role} — {e.company} <span className="font-normal text-ink-muted">({e.period})</span></p>
                  <p className="text-ink-muted">{e.description}</p>
                </div>
              ))}
            </section>
          )}
          {v.education.length > 0 && (
            <section className="mt-3">
              <h3 className="font-bold uppercase tracking-wider text-brand">Formação</h3>
              {v.education.map((e, i) => <p key={i} className="mt-1"><span className="font-semibold">{e.course}</span> · {e.institution} ({e.period})</p>)}
            </section>
          )}
          {v.skills.length > 0 && (
            <section className="mt-3">
              <h3 className="font-bold uppercase tracking-wider text-brand">Competências</h3>
              <p className="mt-1">{v.skills.map((s) => s.name).filter(Boolean).join(' · ')}</p>
            </section>
          )}
          {v.languages.length > 0 && (
            <section className="mt-3">
              <h3 className="font-bold uppercase tracking-wider text-brand">Idiomas</h3>
              <p className="mt-1">{v.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}</p>
            </section>
          )}
          {v.references.length > 0 && (
            <section className="mt-3">
              <h3 className="font-bold uppercase tracking-wider text-brand">Referências</h3>
              {v.references.map((r, i) => <p key={i} className="mt-1">{r.name} — {r.role} ({r.contact})</p>)}
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

