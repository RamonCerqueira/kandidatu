import { useAuth } from '../auth/AuthContext'
import { Seo } from '../../components/shared/Seo'

const TITLES = { CANDIDATE: 'Área do candidato', COMPANY: 'Área da empresa', ADMIN: 'Administração' } as const

// Ponto de entrada provisório; o conteúdo real chega nas Fases 3 a 5.
export default function AreaHomePage() {
  const { user, logout } = useAuth()
  if (!user) return null
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Seo title={TITLES[user.role]} />
      <h1 className="text-2xl font-bold">{TITLES[user.role]}</h1>
      <p className="mt-2 text-ink-muted">Olá, {user.name}. As funcionalidades desta área serão adicionadas nas próximas fases.</p>
      <button className="btn-outline mt-6" onClick={logout}>Terminar sessão</button>
    </div>
  )
}

