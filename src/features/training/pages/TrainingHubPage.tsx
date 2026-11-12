import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight, Award, BookOpen, CheckCircle2, Clock, ExternalLink, GraduationCap, Megaphone, MapPin, MessageCircle, Printer, Sparkles,
} from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { useFreeCourses, useSponsoredAds } from '../hooks'
import { trainingService } from '../../../services/training/trainingService'
import { REGION_LABELS } from '../../../constants'
import { formatXOF } from '../../../utils/format'
import {
  BissauStripe, GuineaBissauBadge, MotionCard, StaggerGrid, StaggerItem,
} from '../../../components/ui/MotionPrimitives'
import { Skeleton } from '../../../components/ui/feedback'
import { Seo } from '../../../components/shared/Seo'
import type { FreeCourse, SponsoredCourseAd } from '../../../schemas/training'

const LEVEL_LABELS: Record<FreeCourse['level'], [string, string]> = {
  INICIANTE: ['Iniciante', 'bg-accent-50 text-accent-600'],
  INTERMEDIO: ['Intermédio', 'bg-gold-50 text-brand'],
  AVANCADO: ['Avançado', 'bg-brand-50 text-brand'],
}

export function TrainingHubPage() {
  const [categoryFilter, setCategoryFilter] = useState('')
  const free = useFreeCourses()
  const ads = useSponsoredAds()

  const spotlightAds = (ads.data ?? []).filter((a) => a.active && a.placement === 'SPOTLIGHT_TOP')
  const catalogAds = (ads.data ?? []).filter((a) => a.active)
  const courses = (free.data ?? []).filter((c) => (!categoryFilter ? true : c.category === categoryFilter))

  const handleAdClick = async (ad: SponsoredCourseAd) => {
    try {
      await trainingService.trackAdClick(ad.id)
    } catch {
      // ignora falha de telemetria
    }
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <Seo
        title="Valorização Profissional & Cursos"
        description="Cursos básicos gratuitos de leitura e formação profissional de instituições parceiras na Guiné-Bissau."
      />

      {/* HERO ACADEMIA KANDIDATU */}
      <section className="relative overflow-hidden bg-brand-900 bg-pinti-grid px-4 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2">
            <GuineaBissauBadge label="Capacitação Profissional" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-bissau-yellow">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
              Academia KANDIDATU & Parceiros
            </span>
          </div>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
            Qualifique-se gratuitamente e descubra cursos das melhores instituições.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            Estude os nossos guias rápidos de leitura sem gastar pacote de dados com vídeos pesados, ou inscreva-se em cursos presenciais e online de escolas, universidades e centros técnicos parceiros na Guiné-Bissau.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10">
        {/* BANNER SPOTLIGHT PUBLICITÁRIO (QUANDO EXISTIR CAMPANHA ATIVA) */}
        {spotlightAds.length > 0 && (
          <section aria-label="Destaque patrocinado">
            {spotlightAds.slice(0, 1).map((ad) => (
              <MotionCard key={ad.id} className="overflow-hidden border-2 border-gold bg-gradient-to-r from-brand to-brand-900 text-white">
                <BissauStripe className="h-1" />
                <div className="grid items-center gap-6 p-6 md:grid-cols-[1.4fr_0.6fr]">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-bissau-yellow px-2.5 py-0.5 text-[11px] font-extrabold text-brand-900">
                      <Megaphone className="h-3 w-3" aria-hidden />
                      DESTAQUE PATROCINADO · {ad.partnerName}
                    </span>
                    <h2 className="mt-3 text-2xl font-extrabold">{ad.courseTitle}</h2>
                    <p className="mt-2 text-sm text-white/80">{ad.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/75">
                      <span><MapPin className="mr-1 inline h-3.5 w-3.5 text-bissau-yellow" />{REGION_LABELS[ad.region]} · {ad.mode}</span>
                      {ad.coursePriceXof ? <span className="font-bold text-gold">Investimento: {formatXOF(ad.coursePriceXof)}</span> : <span>Bolsa / Sob consulta</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <button type="button" onClick={() => handleAdClick(ad)} className="btn-gold w-full sm:w-auto">
                      Conhecer curso e inscrever-se
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </MotionCard>
            ))}
          </section>
        )}

        {/* SECÇÃO 1: CURSOS BÁSICOS GRATUITOS DE LEITURA */}
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-600">
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                100% Gratuito · Leitura direta no navegador
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">Cursos básicos para valorização profissional</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Leitura leve e prática pensada para aumentar as suas hipóteses de contratação imediata.
              </p>
            </div>
            <select
              aria-label="Filtrar categoria"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input w-auto"
            >
              <option value="">Todas as áreas</option>
              <option value="Empregabilidade">Empregabilidade</option>
              <option value="Informática">Informática</option>
              <option value="Idiomas">Idiomas</option>
              <option value="Gestão e Finanças">Gestão e Finanças</option>
            </select>
          </div>

          {free.isLoading && (
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-48" />)}
            </div>
          )}

          {(!free.isLoading && courses.length === 0) && (
            <div className="card border-dashed p-6">
              <h3 className="font-bold">Guias gratuitos geridos pelo SuperAdmin</h3>
              <p className="mt-1 text-xs text-ink-muted">
                Os cursos gratuitos de leitura publicados em <code>/admin/formacao</code> aparecem automaticamente aqui para todos os candidatos.
              </p>
            </div>
          )}

          {courses.length > 0 && (
            <StaggerGrid className="grid gap-4 md:grid-cols-3">
              {courses.map((c) => {
                const [lvl, cls] = LEVEL_LABELS[c.level]
                return (
                  <StaggerItem key={c.id}>
                    <MotionCard className="flex h-full flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${cls}`}>{lvl}</span>
                          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            {c.readingMinutes} min de leitura
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-bold text-ink">{c.title}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{c.summary}</p>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
                        <span className="text-xs font-medium text-ink-muted">{c.lessons.length} lições</span>
                        <Link to={`/formacao/${c.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">
                          Iniciar leitura <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </MotionCard>
                  </StaggerItem>
                )
              })}
            </StaggerGrid>
          )}
        </section>

        {/* SECÇÃO 2: CURSOS DE TERCEIROS / PARCEIROS PATROCINADOS */}
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand">
                <Sparkles className="h-3.5 w-3.5 text-bissau-red" aria-hidden />
                Escolas, Universidades e Centros de Formação Parceiros
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">Formações e cursos recomendados</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Oportunidades de especialização promovidas por instituições de ensino na Guiné-Bissau e online.
              </p>
            </div>
            <Link to="/anunciar" className="btn-outline text-xs">
              <Megaphone className="h-4 w-4 text-accent" aria-hidden />
              Anunciar curso da minha instituição
            </Link>
          </div>

          {ads.isLoading && (
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
            </div>
          )}

          {(!ads.isLoading && catalogAds.length === 0) && (
            <MotionCard className="flex flex-col items-start justify-between gap-4 border-dashed p-6 sm:flex-row sm:items-center">
              <div>
                <span className="rounded-md bg-gold-50 px-2.5 py-1 text-xs font-bold text-brand">Espaço Publicitário Educacional</span>
                <h3 className="mt-2 font-bold">Tem uma escola, centro técnico ou universidade na Guiné-Bissau?</h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Divulgue os seus cursos pagos ou bolsas diretamente para milhares de candidatos que procuram qualificação profissional.
                </p>
              </div>
              <Link to="/anunciar" className="btn-primary">Quero anunciar cursos</Link>
            </MotionCard>
          )}

          {catalogAds.length > 0 && (
            <StaggerGrid className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {catalogAds.map((ad) => (
                <StaggerItem key={ad.id}>
                  <MotionCard className="flex h-full flex-col overflow-hidden">
                    <div className="relative h-36 bg-brand-900">
                      {ad.bannerUrl ? (
                        <img src={ad.bannerUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-pinti-grid px-4 text-center text-sm font-bold text-gold">
                          {ad.partnerName}
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded bg-brand-900/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bissau-yellow backdrop-blur">
                        Patrocinado
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <p className="text-xs font-bold text-accent-600">{ad.partnerName}</p>
                        <h3 className="mt-1 text-base font-extrabold text-ink">{ad.courseTitle}</h3>
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-muted">{ad.description}</p>
                      </div>

                      <div className="mt-4 space-y-3 border-t border-line pt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-muted">{REGION_LABELS[ad.region]} · {ad.mode}</span>
                          <span className="font-bold text-brand">
                            {ad.coursePriceXof ? formatXOF(ad.coursePriceXof) : 'Consultar valor'}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleAdClick(ad)} className="btn-primary flex-1 py-2 text-xs">
                            Ver oferta <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          {ad.whatsapp && (
                            <a
                              href={`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trainingService.trackAdClick(ad.id).catch(() => undefined)}
                              className="btn-accent px-3 py-2 text-xs"
                              aria-label="Contactar via WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </MotionCard>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </section>
      </div>
    </div>
  )
}

/** Leitor de curso básico gratuito + Quiz e Emissão de Certificado A4 em PDF */
export function CourseReaderPage() {
  const { slug = '' } = useParams()
  const { user } = useAuth()
  const { data: course, isLoading, isError } = useFreeCourses()
  const found = course?.find((c) => c.slug === slug)
  const [lessonIdx, setLessonIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [certified, setCertified] = useState(false)

  if (isLoading) return <div className="mx-auto max-w-3xl p-8"><Skeleton className="h-64" /></div>
  if (isError || !found) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Curso não encontrado</h1>
        <Link to="/formacao" className="btn-primary mt-4">Voltar à área de formação</Link>
      </div>
    )
  }

  const lesson = found.lessons[lessonIdx] ?? found.lessons[0]
  const isLastLesson = lessonIdx === found.lessons.length - 1

  const completeCourse = () => {
    if (found.quiz && selectedOption !== found.quiz.correctIndex) return
    setCertified(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Seo title={found.title} description={found.summary} />
      <Link to="/formacao" className="text-xs font-semibold text-ink-muted hover:text-ink print:hidden">← Voltar para Cursos & Formação</Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-4 print:hidden">
          <p className="text-xs font-bold uppercase text-accent-600">{found.category}</p>
          <h1 className="mt-1 font-extrabold">{found.title}</h1>
          <ol className="mt-4 space-y-1.5 text-xs">
            {found.lessons.map((l, idx) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => { setLessonIdx(idx); setCertified(false) }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-medium ${
                    idx === lessonIdx && !certified ? 'bg-brand text-white' : 'hover:bg-canvas'
                  }`}
                >
                  <span>{idx + 1}. {l.title}</span>
                  {idx < lessonIdx && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {!certified && lesson && (
          <article className="card p-6 sm:p-8">
            <BissauStripe className="mb-5 h-1 rounded-full" />
            <p className="text-xs text-ink-muted">Lição {lessonIdx + 1} de {found.lessons.length} · {lesson.durationMinutes} min de leitura</p>
            <h2 className="mt-1 text-2xl font-extrabold">{lesson.title}</h2>
            <div className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink">
              {lesson.content}
            </div>

            {isLastLesson && found.quiz && (
              <div className="mt-8 rounded-xl border border-line bg-canvas p-4">
                <p className="text-xs font-bold uppercase text-brand">Pergunta de revisão para emitir Certificado</p>
                <p className="mt-1 text-sm font-semibold">{found.quiz.question}</p>
                <div className="mt-3 space-y-2 text-xs">
                  {found.quiz.options.map((opt, idx) => (
                    <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white p-2.5">
                      <input type="radio" name="quiz" checked={selectedOption === idx} onChange={() => setSelectedOption(idx)} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between border-t border-line pt-4">
              <button
                type="button"
                className="btn-outline"
                disabled={lessonIdx === 0}
                onClick={() => setLessonIdx((i) => i - 1)}
              >
                Lição anterior
              </button>
              {!isLastLesson ? (
                <button type="button" className="btn-primary" onClick={() => setLessonIdx((i) => i + 1)}>
                  Próxima lição
                </button>
              ) : (
                <button type="button" className="btn-accent" onClick={completeCourse}>
                  <Award className="h-4 w-4" aria-hidden />
                  Emitir Certificado KANDIDATU
                </button>
              )}
            </div>
          </article>
        )}

        {certified && (
          <section aria-label="Certificado de conclusão" className="card overflow-hidden border-2 border-gold p-8 text-center shadow-lift">
            <BissauStripe className="mb-6 h-1.5 rounded-full" />
            <Award className="mx-auto h-12 w-12 text-gold" aria-hidden />
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-brand">Academia KANDIDATU · Guiné-Bissau</p>
            <h2 className="mt-2 text-2xl font-extrabold">Certificado de Valorização Profissional</h2>
            <p className="mt-4 text-sm text-ink-muted">Certificamos que</p>
            <p className="mt-1 text-xl font-extrabold text-brand">{user?.name ?? 'Profissional KANDIDATU'}</p>
            <p className="mt-3 text-sm text-ink-muted">
              concluiu com aproveitamento o curso de leitura <strong>{found.title}</strong> ({found.readingMinutes} min) na área de {found.category}.
            </p>
            <p className="mt-6 text-xs text-ink-muted">
              Código de validação: <code>KND-{found.id.slice(0, 6).toUpperCase()}</code> · Emitido em {new Date().toLocaleDateString('pt-PT')}
            </p>
            <div className="mt-6 flex justify-center gap-3 print:hidden">
              <button type="button" onClick={() => window.print()} className="btn-primary">
                <Printer className="h-4 w-4" aria-hidden />
                Imprimir / Guardar PDF
              </button>
              <Link to="/vagas" className="btn-accent">Explorar vagas na área</Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default TrainingHubPage

