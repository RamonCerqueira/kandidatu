import { Link } from 'react-router-dom'
import { Building2, User } from 'lucide-react'
import { Seo } from '../../../components/shared/Seo'

export default function SignupChoicePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Seo title="Criar conta" />
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <p className="mt-1 text-ink-muted">Como pretende usar a KANDIDATU?</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link to="/cadastro/candidato" className="card p-6 transition hover:shadow-lift"><User className="h-5 w-5 text-accent" aria-hidden /><h2 className="mt-3 font-semibold">Procuro emprego</h2><p className="mt-1 text-sm text-ink-muted">Crie o seu perfil e candidate-se.</p></Link>
        <Link to="/cadastro/empresa" className="card p-6 transition hover:shadow-lift"><Building2 className="h-5 w-5 text-brand" aria-hidden /><h2 className="mt-3 font-semibold">Quero contratar</h2><p className="mt-1 text-sm text-ink-muted">Registe a sua empresa ou organização.</p></Link>
      </div>
    </div>
  )
}

