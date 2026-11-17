import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordInput } from '../../../schemas/auth'
import { authService } from '../../../services/auth/authService'
import { FormField } from '../../../components/forms/FormField'
import { BissauStripe } from '../../../components/ui/MotionPrimitives'
import { Seo } from '../../../components/shared/Seo'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (v: ResetPasswordInput) => {
    try {
      await authService.resetPassword(token, v.password)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-4 py-12 text-center">
        <h1 className="text-xl font-bold">Ligação inválida</h1>
        <p className="mt-2 text-sm text-ink-muted">Solicite uma nova recuperação de palavra-passe.</p>
        <Link to="/recuperar-senha" className="btn-primary mt-4">Recuperar palavra-passe</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <Seo title="Redefinir palavra-passe" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card overflow-hidden">
        <BissauStripe className="h-1" />
        <div className="space-y-4 p-6">
          <h1 className="text-xl font-bold">Nova palavra-passe</h1>
          {status === 'ok' ? (
            <div className="space-y-4">
              <p role="status" className="text-sm font-medium text-accent-600">Palavra-passe atualizada com sucesso.</p>
              <Link to="/entrar" className="btn-primary w-full">Entrar</Link>
            </div>
          ) : (
            <>
              <FormField label="Nova palavra-passe" hint="Mínimo de 8 caracteres" error={errors.password?.message}>
                {(id, d) => <input id={id} aria-describedby={d} type="password" autoComplete="new-password" className="input" {...register('password')} />}
              </FormField>
              <FormField label="Confirmar palavra-passe" error={errors.confirmPassword?.message}>
                {(id, d) => <input id={id} aria-describedby={d} type="password" autoComplete="new-password" className="input" {...register('confirmPassword')} />}
              </FormField>
              {status === 'error' && <p role="alert" className="text-sm text-red-600">Não foi possível redefinir. O token pode ter expirado.</p>}
              <button className="btn-primary w-full" disabled={isSubmitting}>Guardar nova palavra-passe</button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

