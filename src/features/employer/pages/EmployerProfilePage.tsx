import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeCheck, Clock } from 'lucide-react'
import { employerProfileSchema, type EmployerProfile } from '../../../schemas/employer'
import { useEmployerProfile, useSaveEmployerProfile } from '../hooks'
import { FormField } from '../../../components/forms/FormField'
import { PageHeader } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'

export default function EmployerProfilePage() {
  const { data, isLoading } = useEmployerProfile()
  const save = useSaveEmployerProfile()
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<EmployerProfile>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: { phone: '+245', city: 'Bissau', verified: false },
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])
  const verified = watch('verified')

  return (
    <div className="max-w-3xl">
      <Seo title="Perfil da Empresa" />
      <PageHeader
        title="Perfil da empresa"
        subtitle="Dados institucionais, contactos e estado de verificação."
        actions={
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${verified ? 'bg-accent-50 text-accent-600' : 'bg-gold-50 text-yellow-800'}`}>
            {verified ? <BadgeCheck className="h-4 w-4" aria-hidden /> : <Clock className="h-4 w-4" aria-hidden />}
            {verified ? 'Empresa verificada' : 'Verificação pendente'}
          </span>
        }
      />

      {isLoading && <p className="mb-4 text-sm text-ink-muted">A carregar dados da empresa…</p>}
      <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate className="card space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nome empresarial" error={errors.legalName?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('legalName')} />}
          </FormField>
          <FormField label="Nome comercial" error={errors.tradeName?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('tradeName')} />}
          </FormField>
          <FormField label="NIF / identificação fiscal" error={errors.taxId?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('taxId')} />}
          </FormField>
          <FormField label="Setor" error={errors.sector?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('sector')} />}
          </FormField>
          <FormField label="URL do logotipo" error={errors.logoUrl?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('logoUrl')} />}
          </FormField>
          <FormField label="URL da capa" error={errors.coverUrl?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('coverUrl')} />}
          </FormField>
          <FormField label="Cidade" error={errors.city?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('city')} />}
          </FormField>
          <FormField label="Endereço" error={errors.address?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('address')} />}
          </FormField>
          <FormField label="Telefone (+245)" error={errors.phone?.message}>
            {(id, d) => <input id={id} aria-describedby={d} type="tel" className="input" {...register('phone')} />}
          </FormField>
          <FormField label="E-mail" error={errors.email?.message}>
            {(id, d) => <input id={id} aria-describedby={d} type="email" className="input" {...register('email')} />}
          </FormField>
          <FormField label="Website" error={errors.website?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('website')} />}
          </FormField>
          <FormField label="LinkedIn" error={errors.linkedin?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('linkedin')} />}
          </FormField>
        </div>

        <FormField label="Descrição da organização" error={errors.description?.message}>
          {(id, d) => <textarea id={id} aria-describedby={d} rows={4} className="input" {...register('description')} />}
        </FormField>

        {save.isSuccess && <p role="status" className="text-sm text-accent-600">Perfil empresarial atualizado.</p>}
        {save.isError && <p role="alert" className="text-sm text-red-600">Não foi possível guardar os dados.</p>}
        <button className="btn-primary" disabled={isSubmitting || save.isPending}>Guardar alterações</button>
      </form>
    </div>
  )
}

