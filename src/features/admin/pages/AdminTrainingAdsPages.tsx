import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, Megaphone, Plus, Power, Trash2 } from 'lucide-react'
import {
  adPlacements, createFreeCourseSchema, createSponsoredAdSchema,
  type CreateFreeCourseInput, type CreateSponsoredAdInput,
} from '../../../schemas/training'
import { regions } from '../../../schemas/job'
import { CATEGORIES, REGION_LABELS } from '../../../constants'
import { useFreeCourses, useSponsoredAds, useTrainingAdminActions } from '../../training/hooks'
import { FormField } from '../../../components/forms/FormField'
import { PageHeader, QueryState, StatCard } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'
import { formatDate, formatXOF } from '../../../utils/format'

/** Gestão SuperAdmin de Cursos Básicos Gratuitos de Leitura (Múltiplas Lições + Quiz de Certificação) */
export function AdminFreeCoursesPage() {
  const { data, isLoading, isError } = useFreeCourses()
  const { createCourse, deleteCourse } = useTrainingAdminActions()

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateFreeCourseInput>({
    resolver: zodResolver(createFreeCourseSchema) as never,
    defaultValues: {
      category: 'Empregabilidade',
      level: 'INICIANTE',
      readingMinutes: 15,
      lessons: [{ title: 'Introdução e conceitos práticos', durationMinutes: 5, content: '' }],
      quizCorrectIndex: 0,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lessons' })

  const onSubmit = async (v: CreateFreeCourseInput) => {
    await createCourse.mutateAsync(v)
    reset()
  }

  return (
    <div className="space-y-8">
      <Seo title="SuperAdmin — Cursos Gratuitos de Leitura" />
      <PageHeader
        title="Cursos básicos gratuitos (Leitura & Certificado)"
        subtitle="Publique cursos com múltiplas lições e pergunta final para emissão de certificado KANDIDATU."
      />

      <div className="grid gap-6 xl:grid-cols-[480px_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card h-fit space-y-4 p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <BookOpen className="h-4 w-4 text-accent" aria-hidden />
            Criar curso gratuito com lições
          </h2>

          <FormField label="Título do curso" error={errors.title?.message}>
            {(id, d) => <input id={id} aria-describedby={d} placeholder="Ex: Preparação para Entrevistas na Guiné-Bissau" className="input" {...register('title')} />}
          </FormField>

          <div className="grid grid-cols-3 gap-2">
            <FormField label="Categoria" error={errors.category?.message}>
              {(id, d) => (
                <select id={id} aria-describedby={d} className="input" {...register('category')}>
                  <option value="Empregabilidade">Empregabilidade</option>
                  <option value="Informática">Informática</option>
                  <option value="Idiomas">Idiomas</option>
                  <option value="Gestão e Finanças">Gestão e Finanças</option>
                </select>
              )}
            </FormField>

            <FormField label="Nível" error={errors.level?.message}>
              {(id, d) => (
                <select id={id} aria-describedby={d} className="input" {...register('level')}>
                  <option value="INICIANTE">Iniciante</option>
                  <option value="INTERMEDIO">Intermédio</option>
                  <option value="AVANCADO">Avançado</option>
                </select>
              )}
            </FormField>

            <FormField label="Minutos totais" error={errors.readingMinutes?.message}>
              {(id, d) => <input id={id} aria-describedby={d} type="number" min={1} className="input" {...register('readingMinutes')} />}
            </FormField>
          </div>

          <FormField label="Resumo do curso" error={errors.summary?.message}>
            {(id, d) => <textarea id={id} aria-describedby={d} rows={2} className="input" {...register('summary')} />}
          </FormField>

          {/* Lista dinâmica de lições */}
          <div className="space-y-3 rounded-lg border border-line bg-canvas p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-brand">Lições do curso ({fields.length})</span>
              <button
                type="button"
                onClick={() => append({ title: '', durationMinutes: 5, content: '' })}
                className="btn-outline py-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />Adicionar lição
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2 rounded-lg border border-line bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-ink-muted">Lição {index + 1}</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="text-xs text-red-600 hover:underline">
                      Remover
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-[1fr_90px] gap-2">
                  <input placeholder="Título da lição" className="input" {...register(`lessons.${index}.title`)} />
                  <input type="number" min={1} placeholder="Min" className="input" {...register(`lessons.${index}.durationMinutes`)} />
                </div>
                <textarea rows={4} placeholder="Texto completo da lição para leitura…" className="input" {...register(`lessons.${index}.content`)} />
              </div>
            ))}
          </div>

          {/* Pergunta de revisão para desbloquear certificado */}
          <div className="space-y-2 rounded-lg border border-line bg-canvas p-3">
            <p className="text-xs font-bold uppercase text-brand">Pergunta final para Certificado (Opcional)</p>
            <input placeholder="Pergunta de verificação da leitura" className="input" {...register('quizQuestion')} />
            <input placeholder="Opção A" className="input" {...register('quizOptionA')} />
            <input placeholder="Opção B" className="input" {...register('quizOptionB')} />
            <input placeholder="Opção C" className="input" {...register('quizOptionC')} />
            <label className="block text-xs font-medium">
              Resposta correta:
              <select className="input mt-1" {...register('quizCorrectIndex')}>
                <option value={0}>Opção A</option>
                <option value={1}>Opção B</option>
                <option value={2}>Opção C</option>
              </select>
            </label>
          </div>

          <button className="btn-primary w-full" disabled={isSubmitting || createCourse.isPending}>
            <Plus className="h-4 w-4" aria-hidden />
            Publicar curso gratuito
          </button>
        </form>

        <div>
          <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Nenhum curso gratuito cadastrado ainda">
            <div className="space-y-3">
              {data?.map((c) => (
                <div key={c.id} className="card flex items-center justify-between gap-3 p-4">
                  <div>
                    <h3 className="font-bold">{c.title}</h3>
                    <p className="text-xs text-ink-muted">
                      {c.category} · {c.level} · {c.readingMinutes} min · {c.lessons.length} lições
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCourse.mutate(c.id)}
                    className="btn-outline px-2.5 py-1.5 text-xs text-red-600"
                    aria-label="Excluir curso"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </QueryState>
        </div>
      </div>
    </div>
  )
}

/** Gestão SuperAdmin de Propagandas e Cursos Patrocinados de Terceiros */
export function AdminSponsoredAdsPage() {
  const { data, isLoading, isError } = useSponsoredAds()
  const { createAd, toggleAd, deleteAd } = useTrainingAdminActions()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateSponsoredAdInput>({
    resolver: zodResolver(createSponsoredAdSchema) as never,
    defaultValues: {
      category: CATEGORIES[0],
      region: 'BISSAU',
      mode: 'PRESENCIAL',
      placement: 'CATALOG_CARD',
      adFeePaidXof: 50000,
    },
  })

  const onSubmit = async (v: CreateSponsoredAdInput) => {
    await createAd.mutateAsync(v)
    reset()
  }

  const totalRevenue = (data ?? []).reduce((acc, a) => acc + a.adFeePaidXof, 0)
  const totalClicks = (data ?? []).reduce((acc, a) => acc + a.clicks, 0)

  return (
    <div className="space-y-8">
      <Seo title="SuperAdmin — Publicidade & Cursos de Terceiros" />
      <PageHeader
        title="Publicidade & Cursos de Terceiros"
        subtitle="Cadastre campanhas pagas de escolas, universidades e parceiros que anunciam na KANDIDATU."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Campanhas cadastradas" value={data?.length ?? 0} />
        <StatCard label="Receita publicitária (XOF)" value={formatXOF(totalRevenue)} />
        <StatCard label="Total de cliques gerados" value={totalClicks} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card h-fit space-y-3.5 p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <Megaphone className="h-4 w-4 text-bissau-red" aria-hidden />
            Inserir propaganda / curso de terceiro
          </h2>

          <FormField label="Instituição anunciante" error={errors.partnerName?.message}>
            {(id, d) => <input id={id} aria-describedby={d} placeholder="Ex: Instituto Técnico de Bissau" className="input" {...register('partnerName')} />}
          </FormField>

          <FormField label="Título do curso ou campanha" error={errors.courseTitle?.message}>
            {(id, d) => <input id={id} aria-describedby={d} placeholder="Ex: Curso Intensivo de Contabilidade" className="input" {...register('courseTitle')} />}
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Posição do anúncio" error={errors.placement?.message}>
              {(id, d) => (
                <select id={id} aria-describedby={d} className="input" {...register('placement')}>
                  {adPlacements.map((p) => (
                    <option key={p} value={p}>
                      {p === 'SPOTLIGHT_TOP' ? 'Banner Topo (Spotlight)' : p === 'CATALOG_CARD' ? 'Card na Vitrine' : 'Banner Lateral (Vagas & Painel)'}
                    </option>
                  ))}
                </select>
              )}
            </FormField>

            <FormField label="Modalidade" error={errors.mode?.message}>
              {(id, d) => (
                <select id={id} aria-describedby={d} className="input" {...register('mode')}>
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="ONLINE">Online</option>
                  <option value="HIBRIDO">Híbrido</option>
                </select>
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Região" error={errors.region?.message}>
              {(id, d) => (
                <select id={id} aria-describedby={d} className="input" {...register('region')}>
                  {regions.map((r) => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                </select>
              )}
            </FormField>

            <FormField label="Categoria" error={errors.category?.message}>
              {(id, d) => (
                <select id={id} aria-describedby={d} className="input" {...register('category')}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Valor pago à KANDIDATU (XOF)" error={errors.adFeePaidXof?.message}>
              {(id, d) => <input id={id} aria-describedby={d} type="number" className="input" {...register('adFeePaidXof')} />}
            </FormField>

            <FormField label="Preço do curso ao aluno (XOF)" hint="Opcional" error={errors.coursePriceXof?.message}>
              {(id, d) => <input id={id} aria-describedby={d} type="number" className="input" {...register('coursePriceXof')} />}
            </FormField>
          </div>

          <FormField label="URL do Banner (Imagem)" hint="Opcional" error={errors.bannerUrl?.message}>
            {(id, d) => <input id={id} aria-describedby={d} placeholder="https://..." className="input" {...register('bannerUrl')} />}
          </FormField>

          <FormField label="Link de inscrição / destino" error={errors.targetUrl?.message}>
            {(id, d) => <input id={id} aria-describedby={d} placeholder="https://escola.gw/inscricao" className="input" {...register('targetUrl')} />}
          </FormField>

          <FormField label="WhatsApp do anunciante (+245)" hint="Opcional" error={errors.whatsapp?.message}>
            {(id, d) => <input id={id} aria-describedby={d} placeholder="+245955000000" className="input" {...register('whatsapp')} />}
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Início da campanha" error={errors.startsAt?.message}>
              {(id, d) => <input id={id} aria-describedby={d} type="date" className="input" {...register('startsAt')} />}
            </FormField>
            <FormField label="Fim da campanha" error={errors.endsAt?.message}>
              {(id, d) => <input id={id} aria-describedby={d} type="date" className="input" {...register('endsAt')} />}
            </FormField>
          </div>

          <FormField label="Descrição persuasiva do anúncio" error={errors.description?.message}>
            {(id, d) => <textarea id={id} aria-describedby={d} rows={3} className="input" {...register('description')} />}
          </FormField>

          <button className="btn-accent w-full" disabled={isSubmitting || createAd.isPending}>
            <Plus className="h-4 w-4" aria-hidden />
            Publicar propaganda / curso
          </button>
        </form>

        <div>
          <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Nenhuma campanha publicitária registada">
            <div className="space-y-3">
              {data?.map((ad) => (
                <div key={ad.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ad.active ? 'bg-accent-50 text-accent-600' : 'bg-line text-ink-muted'}`}>
                        {ad.active ? 'ATIVA' : 'PAUSADA'}
                      </span>
                      <span className="text-xs font-bold text-brand">{ad.partnerName}</span>
                    </div>
                    <h3 className="mt-1 font-bold">{ad.courseTitle}</h3>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      Patrocínio: <strong>{formatXOF(ad.adFeePaidXof)}</strong> · Vigência: {formatDate(ad.startsAt)} até {formatDate(ad.endsAt)} ·{' '}
                      <strong>{ad.clicks} cliques</strong> / {ad.impressions} impressões
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAd.mutate({ id: ad.id, active: !ad.active })}
                      className="btn-outline px-2.5 py-1.5 text-xs"
                    >
                      <Power className="h-3.5 w-3.5" />
                      {ad.active ? 'Pausar' : 'Ativar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAd.mutate(ad.id)}
                      className="btn-outline px-2.5 py-1.5 text-xs text-red-600"
                      aria-label="Excluir campanha"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </QueryState>
        </div>
      </div>
    </div>
  )
}
