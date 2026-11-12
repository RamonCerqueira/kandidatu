import { NavLink, Outlet } from 'react-router-dom'
import { Bell, Bookmark, Briefcase, CalendarDays, FileText, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { Link } from 'react-router-dom'

const items = [
  { to: '/candidato', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/candidato/candidaturas', label: 'Candidaturas', icon: Briefcase },
  { to: '/candidato/salvas', label: 'Salvas', icon: Bookmark },
  { to: '/candidato/entrevistas', label: 'Entrevistas', icon: CalendarDays },
  { to: '/candidato/curriculo', label: 'Currículo', icon: FileText },
  { to: '/candidato/perfil', label: 'Perfil', icon: User },
  { to: '/candidato/notificacoes', label: 'Avisos', icon: Bell },
]
const mobile = items.filter((i) => ['Painel', 'Candidaturas', 'Currículo', 'Avisos', 'Perfil'].includes(i.label))

export function CandidateLayout() {
  const { logout } = useAuth()
  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-ink-muted hover:bg-white'}`
  return (
    <div className="min-h-screen md:grid md:grid-cols-[230px_1fr]">
      <aside className="hidden border-r border-line bg-canvas p-4 md:flex md:flex-col">
        <Link to="/" className="mb-6 font-extrabold text-brand">KANDIDATU</Link>
        <nav aria-label="Área do candidato" className="space-y-1">
          {items.map((i) => <NavLink key={i.to} to={i.to} end={i.end} className={cls}><i.icon className="h-4 w-4" aria-hidden />{i.label}</NavLink>)}
        </nav>
        <button onClick={logout} className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-ink-muted hover:text-ink"><LogOut className="h-4 w-4" aria-hidden />Sair</button>
      </aside>
      <main className="px-4 pb-24 pt-6 md:px-8 md:pb-8" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}><Outlet /></main>
      <nav aria-label="Navegação móvel" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {mobile.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[11px] ${isActive ? 'font-semibold text-brand' : 'text-ink-muted'}`}>
            <i.icon className="h-5 w-5" aria-hidden />{i.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

