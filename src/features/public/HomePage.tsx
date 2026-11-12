import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, BadgeCheck, Briefcase, Building2, CheckCircle2, Compass, FileText, Globe2, GraduationCap,
  Handshake, HeartHandshake, Landmark, Layers, MapPin, Search, ShieldCheck, Sparkles, TrendingUp, Users,
} from 'lucide-react'
import { useJobs } from '../jobs/hooks'
import { useCompanies, useStats } from '../companies/hooks'
import { JobCard } from '../../components/jobs/JobCard'
import { CompanyCard } from '../../components/companies/CompanyCard'
import { Skeleton } from '../../components/ui/feedback'
import {
  BissauStripe, FloatingCard, GuineaBissauBadge, MotionButton, MotionCard, PulseDot, StaggerGrid, StaggerItem,
} from '../../components/ui/MotionPrimitives'
import { CATEGORIES, REGION_LABELS } from '../../constants'
import { Seo } from '../../components/shared/Seo'
import type { Job } from '../../schemas/job'

const CATEGORY_ICONS: Record<string, typeof Briefcase> = {
  Administração: Briefcase,
  Saúde: HeartHandshake,
  Educação: GraduationCap,
  Tecnologia: Layers,
  'Comércio e Vendas': TrendingUp,
  'Agricultura e Pesca': Globe2,
  Construção: Building2,
  Finanças: Landmark,
  'ONGs e Cooperação': Handshake,
  'Transportes e Logística': Compass,
  'Turismo e Hotelaria': Sparkles,
  Comunicação: Users,
}

function Section({
  eyebrow, title, subtitle, to, children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  to?: string
  children: ReactNode
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-bissau-red" />
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-2xl font-extrabold text-ink md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
            Ver todas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function JobList({ q }: { q: { data?: { items: Job[] }; isLoading: boolean; isError: boolean } }) {
  if (q.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36" />)}
      </div>
    )
  }
  if (q.isError || !q.data?.items.length) {
    return (
      <MotionCard className="flex flex-col items-start justify-between gap-4 border-dashed p-6 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand">
            <PulseDot color="bg-bissau-green" />
            Pronto para sincronização com a API Java
          </span>
          <h3 className="mt-2 font-bold text-ink">As oportunidades publicadas pelas organizações surgirão aqui</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Assim que o servidor backend estiver ativo, esta secção lista automaticamente as vagas reais da Guiné-Bissau.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/vagas" className="btn-outline">Explorar pesquisa</Link>
          <Link to="/cadastro/empresa" className="btn-accent">Publicar vaga</Link>
        </div>
      </MotionCard>
    )
  }
  return (
    <StaggerGrid className="grid gap-4 md:grid-cols-2">
      {q.data.items.slice(0, 6).map((j) => (
        <StaggerItem key={j.id}>
          <JobCard job={j} />
        </StaggerItem>
      ))}
    </StaggerGrid>
  )
}

export default function HomePage() {
  const nav = useNavigate()
  const reduce = useReducedMotion()
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('')
  const featured = useJobs({ page: 1, sort: 'salary' })
  const recent = useJobs({ page: 1, sort: 'recent' })
  const internships = useJobs({ contractType: 'ESTAGIO' })
  const hiring = useCompanies({ page: 1 })
  const stats = useStats()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (region) p.set('region', region)
    nav(`/vagas?${p.toString()}`)
  }

  return (
    <>
      <Seo
        title="O talento encontra oportunidades"
        description="A plataforma digital de recrutamento e oportunidades profissionais da Guiné-Bissau."
      />

      {/* HERO COMPOSIÇÃO EXCLUSIVA — IDENTIDADE GUINÉ-BISSAU */}
      <section className="relative overflow-hidden bg-brand-900 bg-pinti-grid px-4 pb-16 pt-12 text-white md:py-20">
        {/* Luzes subtis com as cores nacionais e da marca */}
        <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-bissau-green/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute right-1/4 top-12 h-64 w-64 rounded-full bg-bissau-red/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-bissau-yellow/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-2">
              <GuineaBissauBadge label="Guiné-Bissau · 9 Regiões" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-gold">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                O talento encontra oportunidades
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[54px]">
              O seu próximo{' '}
              <span className="relative inline-block text-bissau-yellow">
                emprego
                <span aria-hidden className="absolute -bottom-1 left-0 right-0 flex h-1 overflow-hidden rounded-full">
                  <span className="flex-1 bg-bissau-red" />
                  <span className="flex-1 bg-bissau-yellow" />
                  <span className="flex-1 bg-bissau-green" />
                </span>
              </span>{' '}
              começa aqui.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Conectamos profissionais guineenses, jovens talentos e especialistas a empresas privadas, ONGs, organismos internacionais e instituições públicas de Bissau aos Bijagós.
            </p>

            {/* Barra de busca com microinteração */}
            <form
              onSubmit={submit}
              className="mt-8 flex flex-col gap-2 rounded-xl border border-white/20 bg-white p-2 text-ink shadow-lift transition focus-within:ring-4 focus-within:ring-bissau-yellow/25 sm:flex-row"
            >
              <label className="flex flex-1 items-center gap-2.5 px-3">
                <Search className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span className="sr-only">Cargo, competência ou empresa</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cargo, competência ou organização…"
                  className="w-full py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
                />
              </label>

              <label className="flex items-center gap-2 border-line px-3 sm:border-l">
                <MapPin className="h-4 w-4 shrink-0 text-bissau-red" aria-hidden />
                <span className="sr-only">Localização</span>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-transparent py-2.5 text-sm font-medium text-ink outline-none"
                >
                  <option value="">Toda a Guiné-Bissau</option>
                  {Object.entries(REGION_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>

              <MotionButton className="btn-accent px-6 py-3" type="submit">
                Pesquisar vagas
              </MotionButton>
            </form>

            {/* Atalhos rápidos com microinteração */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/75">
              <span className="text-white/50">Procurados na Guiné-Bissau:</span>
              {['ONGs e Cooperação', 'Finanças', 'Agricultura e Pesca', 'Saúde', 'Tecnologia'].map((cat) => (
                <motion.div key={cat} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to={`/vagas?category=${encodeURIComponent(cat)}`}
                    className="inline-block rounded-md border border-white/15 bg-white/5 px-2.5 py-1 transition hover:border-bissau-yellow/60 hover:bg-white/10 hover:text-white"
                  >
                    {cat}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Indicadores */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-extrabold text-bissau-yellow sm:text-3xl">
                  {stats.data ? new Intl.NumberFormat('pt-PT').format(stats.data.jobs) : '9 Regiões'}
                </p>
                <p className="mt-0.5 text-xs text-white/65">Cobertura nacional</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white sm:text-3xl">
                  {stats.data ? new Intl.NumberFormat('pt-PT').format(stats.data.companies) : 'Verificadas'}
                </p>
                <p className="mt-0.5 text-xs text-white/65">Empresas, ONGs e Estado</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-accent sm:text-3xl">
                  {stats.data ? new Intl.NumberFormat('pt-PT').format(stats.data.candidates) : 'Currículo A4'}
                </p>
                <p className="mt-0.5 text-xs text-white/65">Talentos registados</p>
              </div>
            </div>
          </motion.div>

          {/* COMPOSIÇÃO DE FOTOGRAFIAS DE PROFISSIONAIS NEGROS AFRICANOS + CARDS FLUTUANTES */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="grid grid-cols-12 gap-3.5">
              {/* Fotografia principal: Mulher negra profissional em ambiente corporativo */}
              <motion.div
                whileHover={{ scale: 1.015 }}
                className="relative col-span-7 overflow-hidden rounded-xl border border-white/20 bg-brand shadow-lift"
              >
                <BissauStripe className="h-1" />
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
                  alt="Profissional africana sorridente no escritório"
                  className="h-64 w-full object-cover object-top sm:h-72"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent p-3.5">
                  <p className="text-xs font-bold text-white">Talento & Liderança</p>
                  <p className="text-[11px] text-white/75">Bissau · Setor Financeiro & Gestão</p>
                </div>
              </motion.div>

              <div className="col-span-5 flex flex-col gap-3.5">
                {/* Segunda fotografia: Equipa de jovens profissionais negros africanos */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-xl border border-white/20 bg-brand shadow-lift"
                >
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
                    alt="Equipa de profissionais africanos em colaboração"
                    className="h-40 w-full object-cover"
                    loading="eager"
                  />
                  <span className="absolute right-2 top-2 rounded-md bg-brand-900/80 px-2 py-0.5 text-[10px] font-semibold text-bissau-yellow backdrop-blur">
                    Cooperação & ONGs
                  </span>
                </motion.div>

                {/* Card de identidade nacional e verificação */}
                <div className="flex flex-1 flex-col justify-between rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <BadgeCheck className="h-6 w-6 text-bissau-yellow" aria-hidden />
                    <span className="text-sm font-black text-white">★</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Selo KANDIDATU</p>
                    <p className="mt-0.5 text-[11px] text-white/70">Salários claros em Franco CFA (XOF)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge flutuante animado 1 */}
            <FloatingCard
              delay={0.2}
              className="relative z-10 mt-3 overflow-hidden rounded-xl border border-line bg-white p-4 text-ink shadow-lift sm:-mt-7 sm:ml-5 sm:mr-3"
            >
              <BissauStripe className="mb-3 h-1 rounded-full" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-xs font-extrabold text-bissau-yellow">
                    ★ GB
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">Oportunidades de Bissau ao interior</p>
                    <p className="text-[11px] text-ink-muted">Bafatá · Gabú · Cacheu · Oio · Quinara · Tombali</p>
                  </div>
                </div>
                <Link to="/cadastro/candidato" className="btn-primary py-1.5 text-xs">
                  Criar perfil
                </Link>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* FAIXA DE SETORES E PARCEIROS */}
      <section className="border-b border-line bg-white px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-xs font-medium text-ink-muted">
          <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-brand">
            <span className="h-2 w-2 rounded-full bg-bissau-red" />
            Quem contrata na KANDIDATU:
          </span>
          <span className="inline-flex items-center gap-1.5 transition hover:text-brand"><Building2 className="h-4 w-4 text-brand" /> Empresas Privadas</span>
          <span className="inline-flex items-center gap-1.5 transition hover:text-brand"><Handshake className="h-4 w-4 text-accent" /> ONGs & Cooperação</span>
          <span className="inline-flex items-center gap-1.5 transition hover:text-brand"><Landmark className="h-4 w-4 text-brand" /> Instituições Públicas</span>
          <span className="inline-flex items-center gap-1.5 transition hover:text-brand"><Globe2 className="h-4 w-4 text-accent" /> Organismos Internacionais</span>
          <span className="inline-flex items-center gap-1.5 transition hover:text-brand"><GraduationCap className="h-4 w-4 text-brand" /> Universidades & Centros Técnicos</span>
        </div>
      </section>

      {/* EXPLORE POR ÁREA PROFISSIONAL COM STAGGER E MICROINTERAÇÕES */}
      <Section
        eyebrow="Áreas de atuação"
        title="Explore por setor profissional"
        subtitle="Encontre oportunidades alinhadas com a sua formação e experiência em toda a Guiné-Bissau."
        to="/vagas"
      >
        <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c] ?? Briefcase
            return (
              <StaggerItem key={c}>
                <MotionCard className="group overflow-hidden p-4">
                  <Link to={`/vagas?category=${encodeURIComponent(c)}`} className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand transition-all duration-200 group-hover:scale-110 group-hover:bg-brand group-hover:text-bissau-yellow">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink group-hover:text-brand">{c}</p>
                      <p className="text-xs text-ink-muted transition group-hover:translate-x-0.5">Explorar vagas →</p>
                    </div>
                  </Link>
                </MotionCard>
              </StaggerItem>
            )
          })}
        </StaggerGrid>
      </Section>

      <Section
        eyebrow="Destaques"
        title="Vagas em destaque"
        subtitle="Posições estratégicas de empresas e organizações verificadas."
        to="/vagas"
      >
        <JobList q={featured} />
      </Section>

      <Section
        eyebrow="Acabaram de chegar"
        title="Oportunidades recentes"
        subtitle="Acompanhe as últimas publicações do mercado guineense."
        to="/vagas?sort=recent"
      >
        <JobList q={recent} />
      </Section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-line bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-600">
              <span className="h-1.5 w-1.5 rounded-full bg-bissau-yellow" />
              Simples e transparente
            </p>
            <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Como funciona a KANDIDATU</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Pensado para funcionar com fluidez tanto no computador quanto no telemóvel Android ou iPhone.
            </p>
          </div>

          <StaggerGrid className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              [
                '01',
                'bg-bissau-red text-white',
                'Construa o seu perfil e currículo A4',
                'Preencha a sua trajetória, idiomas (Português, Crioulo, Francês) e gere um currículo em PDF pronto para impressão ou envio direto.',
              ],
              [
                '02',
                'bg-bissau-yellow text-brand-900',
                'Filtre por região e modalidade',
                'Pesquise oportunidades em Bissau, Bafatá, Gabú, Cacheu e demais regiões, com salários claros em Franco CFA (XOF).',
              ],
              [
                '03',
                'bg-bissau-green text-white',
                'Candidate-se e acompanhe em tempo real',
                'Veja o estado da sua candidatura desde o envio até à entrevista, com notificações diretas da organização.',
              ],
            ].map(([num, badgeCls, title, desc]) => (
              <StaggerItem key={num}>
                <MotionCard className="relative h-full p-6">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold ${badgeCls}`}>
                    {num}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
                </MotionCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* BENEFÍCIOS CANDIDATOS VS EMPRESAS */}
      <Section
        eyebrow="Para todo o mercado"
        title="Uma plataforma desenhada para dois lados"
        subtitle="Ferramentas modernas tanto para quem procura trabalho quanto para quem lidera processos seletivos."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <MotionCard className="flex flex-col justify-between border-t-4 border-t-bissau-green p-7">
            <div>
              <span className="rounded-md bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-600">Para Candidatos</span>
              <h3 className="mt-3 text-xl font-extrabold">Impulsione a sua carreira profissional</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
                {[
                  'Acesso 100% gratuito a vagas verificadas nas 9 regiões',
                  'Construtor de currículo com pré-visualização A4 e exportação PDF',
                  'Painel de acompanhamento em Timeline ou Kanban',
                  'Agenda de entrevistas presenciais e online',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bissau-green" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/cadastro/candidato" className="btn-accent">Criar conta gratuita</Link>
              <Link to="/para-candidatos" className="btn-outline">Conhecer vantagens</Link>
            </div>
          </MotionCard>

          <MotionCard className="flex flex-col justify-between border-t-4 border-t-brand p-7">
            <div>
              <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand">Para Empresas, ONGs e Instituições</span>
              <h3 className="mt-3 text-xl font-extrabold">Contrate com agilidade e governação</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
                {[
                  'Publicação de vagas estruturada em 3 etapas com faixa salarial em XOF',
                  'Kanban de recrutamento com drag-and-drop e notas internas da equipa',
                  'Selo de organização verificada para maior credibilidade',
                  'Relatórios e métricas de candidaturas por vaga e período',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/cadastro/empresa" className="btn-primary">Registar organização</Link>
              <Link to="/para-empresas" className="btn-outline">Soluções empresariais</Link>
            </div>
          </MotionCard>
        </div>
      </Section>

      {/* EMPRESAS QUE ESTÃO CONTRATANDO */}
      <Section
        eyebrow="Organizações"
        title="Empresas e instituições na plataforma"
        subtitle="Conheça quem está a construir o futuro económico e social da Guiné-Bissau."
        to="/empresas"
      >
        {hiring.isLoading && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-32" />)}
          </div>
        )}
        {(!hiring.isLoading && (!hiring.data || hiring.data.items.length === 0)) && (
          <MotionCard className="flex flex-wrap items-center justify-between gap-4 border-dashed p-6">
            <div>
              <h3 className="font-bold">A sua empresa, ONG ou instituição está a recrutar na Guiné-Bissau?</h3>
              <p className="mt-1 text-xs text-ink-muted">
                Crie a página oficial da sua organização, obtenha o selo de verificação e receba candidaturas qualificadas.
              </p>
            </div>
            <Link to="/cadastro/empresa" className="btn-primary">Cadastrar organização</Link>
          </MotionCard>
        )}
        {hiring.data && hiring.data.items.length > 0 && (
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hiring.data.items.slice(0, 6).map((c) => (
              <StaggerItem key={c.id}>
                <CompanyCard company={c} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </Section>

      {/* ESTÁGIOS E JOVENS TALENTOS */}
      <Section
        eyebrow="Início de carreira"
        title="Oportunidades de estágio e primeiro emprego"
        subtitle="Programas dedicados a estudantes universitários e centros de formação profissional."
        to="/vagas?contractType=ESTAGIO"
      >
        <JobList q={internships} />
      </Section>

      {/* CHAMADA PARA CURRÍCULO E CTA FINAL */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4">
        <div className="overflow-hidden rounded-2xl bg-brand bg-pinti-grid text-white shadow-lift">
          <BissauStripe className="h-1.5" />
          <div className="grid items-center gap-8 p-8 md:p-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-bissau-yellow">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                Construtor de Currículo A4 integrado
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
                Pronto para dar o próximo passo na sua carreira ou equipa?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                Crie o seu currículo padronizado em minutos ou publique as oportunidades da sua instituição para alcançar profissionais nas 9 regiões da Guiné-Bissau.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/cadastro/candidato" className="btn-gold">Criar currículo gratuito</Link>
                <Link to="/cadastro/empresa" className="btn-accent">Publicar vaga agora</Link>
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-bissau-yellow">
                <span>Regiões da Guiné-Bissau</span>
                <span>★</span>
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {Object.entries(REGION_LABELS).map(([key, label]) => (
                  <Link
                    key={key}
                    to={`/vagas?region=${key}`}
                    className="flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-2 transition hover:bg-white/15"
                  >
                    <MapPin className="h-3.5 w-3.5 text-bissau-yellow" aria-hidden />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
