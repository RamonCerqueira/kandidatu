import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../../services/auth/authService'
import type { LoginInput, User } from '../../schemas/auth'

interface AuthState {
  user: User | null
  loading: boolean
  sessionExpired: boolean
  login: (input: LoginInput) => Promise<User>
  previewAsRole: (role: User['role']) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export const homeFor = (role: User['role']): string =>
  role === 'ADMIN' ? '/admin' : role === 'COMPANY' ? '/empresa' : '/candidato'

const DEV_PREVIEW_KEY = 'kandidatu.dev.preview'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (!import.meta.env.DEV) return null
    try {
      const raw = sessionStorage.getItem(DEV_PREVIEW_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState<boolean>(authService.hasToken())
  const [sessionExpired, setExpired] = useState(false)

  useEffect(() => {
    if (!authService.hasToken()) return
    authService.me().then(setUser).catch(() => authService.logout()).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onExpired = () => { setUser(null); setExpired(true) }
    window.addEventListener('session-expired', onExpired)
    return () => window.removeEventListener('session-expired', onExpired)
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const u = await authService.login(input)
    if (import.meta.env.DEV) sessionStorage.removeItem(DEV_PREVIEW_KEY)
    setUser(u)
    setExpired(false)
    return u
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    if (import.meta.env.DEV) sessionStorage.removeItem(DEV_PREVIEW_KEY)
    setUser(null)
  }, [])

  // Permite ao desenvolvedor aceder aos painéis (SuperAdmin / Empresa / Candidato) enquanto o backend Java não está conectado
  const previewAsRole = useCallback((role: User['role']) => {
    const names: Record<User['role'], string> = {
      ADMIN: 'SuperAdmin KANDIDATU',
      COMPANY: 'Gestor Empresarial GB',
      CANDIDATE: 'Candidato Guiné-Bissau',
    }
    const devUser: User = { id: `dev-${role.toLowerCase()}`, email: `${role.toLowerCase()}@kandidatu.gw`, name: names[role], role }
    if (import.meta.env.DEV) sessionStorage.setItem(DEV_PREVIEW_KEY, JSON.stringify(devUser))
    setUser(devUser)
  }, [])

  const value = useMemo(() => ({ user, loading, sessionExpired, login, previewAsRole, logout }), [user, loading, sessionExpired, login, previewAsRole, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}

