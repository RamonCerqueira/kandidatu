import { Link } from 'react-router-dom'
import { BissauStripe } from '../../components/ui/MotionPrimitives'
import { Seo } from '../../components/shared/Seo'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <Seo title="Página não encontrada" />
      <div className="card overflow-hidden p-8">
        <BissauStripe className="mb-6 h-1 rounded-full" />
        <p className="text-4xl font-extrabold text-brand">404</p>
        <h1 className="mt-2 text-xl font-bold">Página não encontrada</h1>
        <p className="mt-2 text-sm text-ink-muted">O endereço que tentou aceder não existe ou foi movido.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary">Início</Link>
          <Link to="/vagas" className="btn-outline">Ver vagas</Link>
        </div>
      </div>
    </div>
  )
}

