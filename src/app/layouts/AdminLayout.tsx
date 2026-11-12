import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3, BookOpen, Briefcase, Building2, CheckSquare, CreditCard, Flag, FolderTree, Layers, LayoutDashboard, LogOut, MapPin, Megaphone, Menu, Settings, ShieldCheck, Users, X,
} from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { BissauStripe } from '../../components/ui/MotionPrimitives'

const items = [
  { to: '/admin', label: 'Dashboard geral', icon: LayoutDashboard, end: true },
  { to: '/admin/usuarios', label: 'Usuários', icon: Users },
  { to: '/admin/candidatos', label: 'Candidatos', icon: Users },
  { to: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { to: '/admin/aprovacao-empresas', label: 'Aprovar empresas', icon: ShieldCheck },
  { to: '/admin/aprovacao-vagas', label: 'Aprovar vagas', icon: CheckSquare },
  { to: '/admin/formacao', label: 'Cursos gratuitos', icon: BookOpen },
  { to: '/admin/publicidade', label: 'Publicidade & Ads', icon: Megaphone },
  { to: '/admin/categorias', label: 'Categorias', icon: FolderTree },
  { to: '/admin/areas', label: 'Áreas de atuação', icon: Layers },
  { to: '/admin/localizacoes', label: 'Localizações', icon: MapPin },
  { to: '/admin/denuncias', label: 'Denúncias', icon: Flag },
  { to: '/admin/planos', label: 'Planos comerciais', icon: Briefcase },
  { to: '/admin/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { to: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export function AdminLayout() {
  const { logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
      isActive ? 'bg-brand text-white' : 'text-ink-muted hover:bg-white hover:text-ink'
    }`

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      {/* Barra superior mobile para o SuperAdmin */}
      <header className="sticky top-0 z-30 border-b border-line bg-white md:hidden">
        <BissauStripe className="h-1" />
        <div className="flex h-14 items-center justify-between px-4">
          <Link to="/" className="font-extrabold text-brand">KANDIDATU · SuperAdmin</Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu administrativo"
            className="btn-outline px-2.5 py-1.5 text-xs"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>
      </header>

      {/* Drawer deslizante mobile */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="relative z-10 flex h-full w-72 flex-col bg-canvas p-4 shadow-lift"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-extrabold text-brand">SuperAdmin</span>
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Fechar menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label="Menu administrativo móvel" className="flex-1 space-y-1 overflow-y-auto">
                {items.map((i) => (
                  <NavLink key={i.to} to={i.to} end={i.end} onClick={() => setDrawerOpen(false)} className={cls}>
                    <i.icon className="h-4 w-4 shrink-0" aria-hidden />
                    {i.label}
                  </NavLink>
                ))}
              </nav>
              <button onClick={logout} className="mt-4 flex items-center gap-2 px-3 py-2 text-xs text-ink-muted hover:text-ink">
                <LogOut className="h-4 w-4" aria-hidden />Sair
              </button>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside className="hidden border-r border-line bg-canvas p-4 md:flex md:flex-col">
        <Link to="/" className="mb-1 font-extrabold text-brand">KANDIDATU</Link>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">SuperAdmin</p>
        <nav aria-label="Menu administrativo" className="space-y-1 overflow-y-auto">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={cls}>
              <i.icon className="h-4 w-4 shrink-0" aria-hidden />
              {i.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="mt-auto flex items-center gap-2 px-3 py-2 text-xs text-ink-muted hover:text-ink">
          <LogOut className="h-4 w-4" aria-hidden />Sair
        </button>
      </aside>

      <main className="px-4 pb-24 pt-6 md:px-8 md:pb-8" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
        <Outlet />
      </main>
    </div>
  )
}
