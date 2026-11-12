import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '../../schemas/company'
import { companyService } from '../../services/companies/companyService'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (v: ContactInput) => {
    try { await companyService.sendContact(v); setStatus('ok'); reset() } catch { setStatus('error') }
  }
  const err = (m?: string) => m && <span role="alert" className="text-xs text-red-600">{m}</span>

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-6">
      <label className="block text-sm font-medium">Nome<input className="input mt-1" {...register('name')} />{err(errors.name?.message)}</label>
      <label className="block text-sm font-medium">E-mail<input type="email" className="input mt-1" {...register('email')} />{err(errors.email?.message)}</label>
      <label className="block text-sm font-medium">Mensagem<textarea rows={5} className="input mt-1" {...register('message')} />{err(errors.message?.message)}</label>
      {status === 'ok' && <p role="status" className="text-sm text-accent-600">Mensagem enviada. Obrigado!</p>}
      {status === 'error' && <p role="alert" className="text-sm text-red-600">Não foi possível enviar. Tente mais tarde.</p>}
      <button className="btn-primary w-full" disabled={isSubmitting}>Enviar</button>
    </form>
  )
}

