import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, homeFor } from './AuthContext'
import type { User } from '../../schemas/auth'

// Proteção apenas de UX: a autorização real DEVE ser aplicada pelo backend.
export function RequireRole({ role }: { role: User['role'] }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <p className="p-8 text-center text-sm text-ink-muted">A verificar sessão…</p>
  if (!user) return <Navigate to="/entrar" replace state={{ from: loc.pathname }} />
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return <Outlet />
}

