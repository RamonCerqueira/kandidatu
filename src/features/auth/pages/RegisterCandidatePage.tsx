import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { candidateRegisterSchema, type CandidateRegisterInput } from '../../../schemas/auth'
import { authService } from '../../../services/auth/authService'
import { FormField } from '../../../components/forms/FormField'
import { Seo } from '../../../components/shared/Seo'

export default function RegisterCandidatePage() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CandidateRegisterInput>({
    resolver: zodResolver(candidateRegisterSchema), defaultValues: { phone: '+245' },
  })
  const onSubmit = async (v: CandidateRegisterInput) => {
    try { await authService.registerCandidate(v); setStatus('ok') } catch { setStatus('error') }
  }

  if (status === 'ok') {
    return <div className="mx-auto max-w-sm px-4 py-12 text-center"><h1 className="text-xl font-bold">Conta criada</h1><p className="mt-2 text-sm text-ink-muted">Já pode entrar com o seu e-mail.</p><Link to="/entrar" className="btn-primary mt-6">Entrar</Link></div>
  }
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Seo title="Cadastro de candidato" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-6">
        <h1 className="text-xl font-bold">Criar conta de candidato</h1>
        <FormField label="Nome completo" error={errors.fullName?.message}>{(id, d) => <input id={id} aria-describedby={d} autoComplete="name" className="input" {...register('fullName')} />}</FormField>
        <FormField label="E-mail" error={errors.email?.message}>{(id, d) => <input id={id} aria-describedby={d} type="email" autoComplete="email" className="input" {...register('email')} />}</FormField>
        <FormField label="Telefone" hint="Código internacional +245" error={errors.phone?.message}>{(id, d) => <input id={id} aria-describedby={d} type="tel" inputMode="tel" autoComplete="tel" className="input" {...register('phone')} />}</FormField>
        <FormField label="Palavra-passe" hint="Mínimo de 8 caracteres" error={errors.password?.message}>{(id, d) => <input id={id} aria-describedby={d} type="password" autoComplete="new-password" className="input" {...register('password')} />}</FormField>
        <FormField label="Confirmar palavra-passe" error={errors.confirmPassword?.message}>{(id, d) => <input id={id} aria-describedby={d} type="password" autoComplete="new-password" className="input" {...register('confirmPassword')} />}</FormField>
        <div>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" {...register('acceptTerms')} />
            <span>Aceito os <Link to="/termos" className="text-brand underline">termos</Link> e a <Link to="/privacidade" className="text-brand underline">política de privacidade</Link>.</span></label>
          {errors.acceptTerms && <p role="alert" className="mt-1 text-xs text-red-600">{errors.acceptTerms.message}</p>}
        </div>
        {status === 'error' && <p role="alert" className="text-sm text-red-600">Não foi possível criar a conta. Tente mais tarde.</p>}
        <button className="btn-accent w-full" disabled={isSubmitting}>Criar conta</button>
        <p className="text-center text-sm text-ink-muted">Já tem conta? <Link to="/entrar" className="font-medium text-brand hover:underline">Entrar</Link></p>
      </form>
    </div>
  )
}

