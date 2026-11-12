import { Link, NavLink, Outlet } from 'react-router-dom'
import { Briefcase, Building2, CalendarDays, Kanban, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'

const items = [
  { to: '/empresa', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/empresa/vagas', label: 'Vagas', icon: Briefcase },
  { to: '/empresa/candidatos', label: 'Candidatos', icon: Users },
  { to: '/empresa/processo', label: 'Kanban', icon: Kanban },
  { to: '/empresa/entrevistas', label: 'Entrevistas', icon: CalendarDays },
  { to: '/empresa/perfil', label: 'Empresa', icon: Building2 },
]

export function EmployerLayout() {
  const { logout } = useAuth()
  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-ink-muted hover:bg-white'}`

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-line bg-canvas p-4 md:flex md:flex-col">
        <Link to="/" className="mb-1 font-extrabold text-brand">KANDIDATU</Link>
        <p className="mb-6 text-xs text-ink-muted">Recrutamento empresarial</p>
        <nav aria-label="Área da empresa" className="space-y-1">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={cls}>
              <i.icon className="h-4 w-4" aria-hidden />
              {i.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-ink-muted hover:text-ink">
          <LogOut className="h-4 w-4" aria-hidden />Sair
        </button>
      </aside>
      <main className="px-4 pb-24 pt-6 md:px-8 md:pb-8" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
        <Outlet />
      </main>
      <nav aria-label="Navegação móvel empresarial" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {items.slice(0, 5).map((i) => (
          <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[11px] ${isActive ? 'font-semibold text-brand' : 'text-ink-muted'}`}>
            <i.icon className="h-5 w-5" aria-hidden />
            {i.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

