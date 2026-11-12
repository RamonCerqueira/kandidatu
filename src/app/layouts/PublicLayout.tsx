import { Link, NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Briefcase, Building2, Compass, Home, LogIn, Search } from 'lucide-react'
import { useAuth, homeFor } from '../../features/auth/AuthContext'
import { BissauStripe, GuineaBissauBadge, PulseDot } from '../../components/ui/MotionPrimitives'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/vagas', label: 'Encontrar emprego', end: false },
  { to: '/empresas', label: 'Empresas', end: false },
  { to: '/formacao', label: 'Cursos & Formação', end: false },
  { to: '/sobre', label: 'Sobre nós', end: false },
]

const footer: { title: string; items: [string, string][] }[] = [
  {
    title: 'Profissionais',
    items: [
      ['/vagas', 'Explorar vagas'],
      ['/vagas?contractType=ESTAGIO', 'Programas de estágio'],
      ['/para-candidatos', 'Construtor de currículo A4'],
      ['/como-funciona', 'Como funciona'],
    ],
  },
  {
    title: 'Empresas & ONGs',
    items: [
      ['/para-empresas', 'Soluções de recrutamento'],
      ['/empresas', 'Diretório de organizações'],
      ['/cadastro/empresa', 'Publicar uma oportunidade'],
    ],
  },
  {
    title: 'Institucional',
    items: [
      ['/sobre', 'Sobre a KANDIDATU'],
      ['/contacto', 'Fale connosco'],
      ['/privacidade', 'Política de privacidade'],
      ['/termos', 'Termos de utilização'],
    ],
  },
]

export function PublicLayout() {
  const { user, logout } = useAuth()
  return (
    <div className="flex min-h-screen flex-col">
      {/* Filete tricolor oficial da Guiné-Bissau no topo */}
      <BissauStripe className="h-1" />

      {/* Topbar institucional com identidade nacional */}
      <div className="hidden border-b border-white/10 bg-brand-900 px-4 py-1.5 text-xs text-white/80 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <PulseDot color="bg-bissau-yellow" />
            <span>Plataforma digital de talentos e oportunidades profissionais da Guiné-Bissau</span>
          </span>
          <span className="text-white/65">Bissau · Bafatá · Gabú · Cacheu · Oio · Biombo · Quinara · Tombali · Bijagós</span>
        </div>
      </div>

      <header
        className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <motion.span
              whileHover={{ rotate: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-brand text-gold shadow-sm"
            >
              <span className="text-sm font-black tracking-tighter text-bissau-yellow">★</span>
              {/* Detalhe lateral com as cores da bandeira */}
              <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-bissau-red" />
              <span aria-hidden className="absolute bottom-0 inset-x-0 h-0.5 bg-bissau-green" />
            </motion.span>
            <div className="leading-none">
              <span className="block text-base font-extrabold tracking-tight text-brand transition group-hover:text-brand-600">
                KANDIDATU
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold tracking-wider text-ink-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-bissau-red" />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-bissau-yellow" />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-bissau-green" />
                GUINÉ-BISSAU
              </span>
            </div>
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 hover:-translate-y-0.5 ${
                    isActive ? 'bg-brand-50 font-semibold text-brand' : 'text-ink-muted hover:bg-canvas hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to={homeFor(user.role)} className="btn-outline">A minha área</Link>
                <button className="btn-outline" onClick={logout}>Sair</button>
              </>
            ) : (
              <Link to="/entrar" className="btn-outline">
                <LogIn className="h-4 w-4" aria-hidden />
                Entrar
              </Link>
            )}
            <Link to={user?.role === 'COMPANY' ? '/empresa/vagas/nova' : '/cadastro/empresa'} className="btn-accent hidden sm:inline-flex">
              Publicar vaga
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-brand-900 px-4 py-14 pb-24 text-white/80 md:pb-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-bissau-yellow">
                <Briefcase className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">KANDIDATU</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
              O talento encontra oportunidades. Conectamos profissionais, empresas, ONGs e organismos internacionais nas 9 regiões da Guiné-Bissau.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <GuineaBissauBadge label="+245 Guiné-Bissau" />
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-gold">Moeda XOF (FCFA)</span>
            </div>
          </div>

          {footer.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gold">{g.title}</p>
              <ul className="space-y-2 text-sm text-white/70">
                {g.items.map(([to, l]) => (
                  <li key={to + l}>
                    <Link to={to} className="inline-block transition hover:translate-x-0.5 hover:text-white">{l}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
          <p>© {new Date().getFullYear()} KANDIDATU Guiné-Bissau. Todos os direitos reservados.</p>
          <p>Português · Kriol · Français</p>
        </div>
      </footer>

      <nav
        aria-label="Navegação móvel"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white/95 backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {[
          ['/', 'Início', Home],
          ['/vagas', 'Vagas', Search],
          ['/empresas', 'Empresas', Building2],
          ['/para-candidatos', 'Carreiras', Compass],
        ].map(([to, label, Icon]) => {
          const I = Icon as typeof Home
          return (
            <NavLink
              key={to as string}
              to={to as string}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                  isActive ? 'font-semibold text-brand' : 'text-ink-muted'
                }`
              }
            >
              <I className="h-5 w-5" aria-hidden />
              {label as string}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
