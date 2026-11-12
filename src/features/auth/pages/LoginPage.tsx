import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../../../schemas/auth'
import { useAuth, homeFor } from '../AuthContext'
import { FormField } from '../../../components/forms/FormField'
import { Seo } from '../../../components/shared/Seo'

export default function LoginPage() {
  const nav = useNavigate()
  const loc = useLocation()
  const { login, previewAsRole, sessionExpired } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const enterPreview = (role: 'CANDIDATE' | 'COMPANY' | 'ADMIN') => {
    previewAsRole(role)
    nav(homeFor(role), { replace: true })
  }

  const onSubmit = async (v: LoginInput) => {
    setError(null)
    try {
      const u = await login(v)
      const from = (loc.state as { from?: string } | null)?.from
      nav(from ?? homeFor(u.role), { replace: true })
    } catch {
      setError('Não foi possível entrar. Verifique os dados ou tente mais tarde.')
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <Seo title="Entrar" />
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6" noValidate>
        <h1 className="text-xl font-bold">Entrar</h1>
        {sessionExpired && <p role="status" className="rounded-lg bg-gold-50 p-3 text-sm">A sua sessão expirou. Entre novamente.</p>}
        <FormField label="E-mail" error={errors.email?.message}>
          {(id, d) => <input id={id} aria-describedby={d} type="email" autoComplete="email" className="input" {...register('email')} />}
        </FormField>
        <FormField label="Palavra-passe" error={errors.password?.message}>
          {(id, d) => <input id={id} aria-describedby={d} type="password" autoComplete="current-password" className="input" {...register('password')} />}
        </FormField>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={isSubmitting}>Entrar</button>
        <p className="text-center text-sm"><Link to="/recuperar-senha" className="text-brand hover:underline">Esqueci a palavra-passe</Link></p>
        <p className="text-center text-sm text-ink-muted">Novo aqui? <Link to="/cadastro" className="font-medium text-brand hover:underline">Criar conta</Link></p>
      </form>

      {import.meta.env.DEV && (
        <div className="card mt-4 space-y-2 border-dashed p-4 text-xs">
          <p className="font-bold text-brand">Acesso rápido de desenvolvimento (sem backend ativo):</p>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => enterPreview('CANDIDATE')} className="btn-outline py-1.5 text-xs">
              Candidato
            </button>
            <button type="button" onClick={() => enterPreview('COMPANY')} className="btn-outline py-1.5 text-xs">
              Empresa
            </button>
            <button type="button" onClick={() => enterPreview('ADMIN')} className="btn-primary py-1.5 text-xs">
              SuperAdmin
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
