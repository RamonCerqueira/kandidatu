import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordInput } from '../../../schemas/auth'
import { authService } from '../../../services/auth/authService'
import { FormField } from '../../../components/forms/FormField'
import { Seo } from '../../../components/shared/Seo'

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })
  const onSubmit = async (v: ForgotPasswordInput) => {
    try { await authService.forgotPassword(v); setStatus('ok') } catch { setStatus('error') }
  }
  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <Seo title="Recuperar palavra-passe" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-6">
        <h1 className="text-xl font-bold">Recuperar palavra-passe</h1>
        <p className="text-sm text-ink-muted">Indique o seu e-mail para receber instruções.</p>
        <FormField label="E-mail" error={errors.email?.message}>{(id, d) => <input id={id} aria-describedby={d} type="email" autoComplete="email" className="input" {...register('email')} />}</FormField>
        {status === 'ok' && <p role="status" className="text-sm text-accent-600">Se o e-mail existir, receberá as instruções em breve.</p>}
        {status === 'error' && <p role="alert" className="text-sm text-red-600">Não foi possível enviar. Tente mais tarde.</p>}
        <button className="btn-primary w-full" disabled={isSubmitting}>Enviar instruções</button>
        <p className="text-center text-sm"><Link to="/entrar" className="text-brand hover:underline">Voltar a entrar</Link></p>
      </form>
    </div>
  )
}

