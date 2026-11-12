import { useEffect, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { profileSchema, type Profile } from '../../../schemas/candidate'
import { candidateService } from '../../../services/candidates/candidateService'
import { useProfile, useSaveProfile } from '../hooks'
import { FormField } from '../../../components/forms/FormField'
import { PageHeader } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'

export default function ProfilePage() {
  const { data, isLoading } = useProfile()
  const save = useSaveProfile()
  const [photoMsg, setPhotoMsg] = useState('')
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nationality: 'Guineense', phone: '+245', whatsapp: '' },
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await candidateService.uploadPhoto(file)
      setValue('photoUrl', url)
      setPhotoMsg('Fotografia carregada.')
    } catch {
      setPhotoMsg('Não foi possível carregar a fotografia.')
    }
  }

  const photoUrl = watch('photoUrl')

  return (
    <div className="max-w-3xl">
      <Seo title="Meu Perfil" />
      <PageHeader title="Meu perfil" subtitle="Mantenha os seus dados pessoais e objetivos atualizados." />
      {isLoading && <p className="mb-4 text-sm text-ink-muted">A carregar perfil…</p>}
      <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate className="card space-y-5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand-50 font-bold text-brand">
            {photoUrl ? <img src={photoUrl} alt="Fotografia do candidato" className="h-full w-full object-cover" /> : 'Foto'}
          </div>
          <div>
            <label className="btn-outline cursor-pointer">
              <Upload className="h-4 w-4" aria-hidden />
              Alterar fotografia
              <input type="file" accept="image/*" className="sr-only" onChange={onPhoto} />
            </label>
            {photoMsg && <p className="mt-1 text-xs text-ink-muted">{photoMsg}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nome completo" error={errors.fullName?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('fullName')} />}
          </FormField>
          <FormField label="Data de nascimento" error={errors.birthDate?.message}>
            {(id, d) => <input id={id} aria-describedby={d} type="date" className="input" {...register('birthDate')} />}
          </FormField>
          <FormField label="Nacionalidade" error={errors.nationality?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('nationality')} />}
          </FormField>
          <FormField label="Cidade / Região" error={errors.city?.message}>
            {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('city')} />}
          </FormField>
          <FormField label="Telefone (+245)" error={errors.phone?.message}>
            {(id, d) => <input id={id} aria-describedby={d} type="tel" className="input" {...register('phone')} />}
          </FormField>
          <FormField label="WhatsApp (+245)" error={errors.whatsapp?.message}>
            {(id, d) => <input id={id} aria-describedby={d} type="tel" className="input" {...register('whatsapp')} />}
          </FormField>
          <FormField label="E-mail" error={errors.email?.message}>
            {(id, d) => <input id={id} aria-describedby={d} type="email" className="input" {...register('email')} />}
          </FormField>
          <FormField label="Disponibilidade" error={errors.availability?.message}>
            {(id, d) => (
              <select id={id} aria-describedby={d} className="input" {...register('availability')}>
                <option value="">Selecione</option>
                <option value="IMEDIATA">Imediata</option>
                <option value="15_DIAS">Em 15 dias</option>
                <option value="30_DIAS">Em 30 dias</option>
              </select>
            )}
          </FormField>
        </div>

        <FormField label="Endereço" error={errors.address?.message}>
          {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('address')} />}
        </FormField>
        <FormField label="Apresentação profissional" error={errors.summary?.message}>
          {(id, d) => <textarea id={id} aria-describedby={d} rows={4} className="input" {...register('summary')} />}
        </FormField>
        <FormField label="Objetivo profissional" error={errors.objective?.message}>
          {(id, d) => <textarea id={id} aria-describedby={d} rows={3} className="input" {...register('objective')} />}
        </FormField>

        {save.isSuccess && <p role="status" className="text-sm text-accent-600">Perfil guardado com sucesso.</p>}
        {save.isError && <p role="alert" className="text-sm text-red-600">Não foi possível guardar o perfil.</p>}
        <button className="btn-primary" disabled={isSubmitting || save.isPending}>Guardar alterações</button>
      </form>
    </div>
  )
}

