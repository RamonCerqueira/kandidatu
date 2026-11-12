import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, CheckCircle2, MapPin, ShieldCheck, UserCheck } from 'lucide-react'
import {
  companyRegisterSchema, companySizeRanges, organizationTypes, type CompanyRegisterInput, type OrganizationType,
} from '../../../schemas/auth'
import { regions } from '../../../schemas/job'
import { CATEGORIES, REGION_LABELS } from '../../../constants'
import { authService } from '../../../services/auth/authService'
import { FormField } from '../../../components/forms/FormField'
import { BissauStripe, GuineaBissauBadge, MotionButton } from '../../../components/ui/MotionPrimitives'
import { Seo } from '../../../components/shared/Seo'

const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  EMPRESA_PRIVADA: 'Empresa Privada / Sociedade Comercial',
  ONG: 'ONG Nacional ou Internacional',
  ORGANISMO_INTERNACIONAL: 'Organismo Internacional / Cooperação',
  INSTITUICAO_PUBLICA: 'Instituição Pública / Ministério / Instituto',
  ENSINO_FORMACAO: 'Universidade / Centro de Formação Profissional',
}

const STEPS: { title: string; subtitle: string; icon: typeof Building2; fields: FieldPath<CompanyRegisterInput>[] }[] = [
  {
    title: 'Identificação',
    subtitle: 'Dados legais e setor na Guiné-Bissau',
    icon: Building2,
    fields: ['organizationType', 'legalName', 'tradeName', 'taxId', 'sector', 'sizeRange'],
  },
  {
    title: 'Localização',
    subtitle: 'Região administrativa, setor e morada',
    icon: MapPin,
    fields: ['region', 'citySector', 'addressReference', 'website'],
  },
  {
    title: 'Responsável & Acesso',
    subtitle: 'Contacto em +245 e credenciais da conta',
    icon: UserCheck,
    fields: ['contactName', 'contactRole', 'phone', 'whatsapp', 'email', 'password', 'confirmPassword', 'acceptTerms'],
  },
]

export default function RegisterCompanyPage() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyRegisterInput>({
    resolver: zodResolver(companyRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      organizationType: 'EMPRESA_PRIVADA',
      sector: CATEGORIES[0],
      sizeRange: '11-50',
      region: 'BISSAU',
      phone: '+245',
      whatsapp: '',
    },
  })

  const nextStep = async () => {
    const valid = await trigger(STEPS[step].fields)
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const onSubmit = async (v: CompanyRegisterInput) => {
    try {
      await authService.registerCompany(v)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  const orgType = watch('organizationType')
  const region = watch('region')

  if (status === 'ok') {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="card overflow-hidden p-7 text-center">
          <BissauStripe className="mb-5 h-1.5 rounded-full" />
          <CheckCircle2 className="mx-auto h-11 w-11 text-bissau-green" aria-hidden />
          <h1 className="mt-3 text-xl font-extrabold">Organização registada com sucesso</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Os dados foram enviados para verificação da equipa KANDIDATU. Já pode iniciar sessão e preparar as suas vagas.
          </p>
          <Link to="/entrar" className="btn-primary mt-6 w-full">
            Entrar na área empresarial
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Seo title="Cadastro de Empresa ou Organização" />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Coluna lateral explicativa e indicador de progresso */}
        <aside className="space-y-4">
          <div className="rounded-card bg-brand bg-pinti-grid p-5 text-white shadow-soft">
            <GuineaBissauBadge label="Recrutamento GB" />
            <h1 className="mt-3 text-xl font-extrabold">Registar Organização</h1>
            <p className="mt-1.5 text-xs leading-relaxed text-white/75">
              Cadastre a sua empresa, ONG ou instituição em 3 etapas rápidas para publicar oportunidades em Franco CFA (XOF).
            </p>

            <ol className="mt-6 space-y-3">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const active = i === step
                const done = i < step
                return (
                  <li
                    key={s.title}
                    className={`flex items-start gap-3 rounded-lg p-2.5 text-xs transition ${
                      active ? 'bg-white/15 text-white font-semibold' : done ? 'text-bissau-yellow' : 'text-white/55'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-extrabold ${
                        active
                          ? 'bg-bissau-yellow text-brand-900'
                          : done
                          ? 'bg-bissau-green text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 font-bold">
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                        {s.title}
                      </p>
                      <p className="mt-0.5 text-[11px] opacity-80">{s.subtitle}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="card space-y-2 p-4 text-xs text-ink-muted">
            <p className="flex items-center gap-1.5 font-bold text-ink">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden />
              Verificação institucional
            </p>
            <p>
              Validamos o NIF (DGCI) ou estatuto da ONG/instituição para atribuir o selo de{' '}
              <span className="inline-flex items-center gap-0.5 font-semibold text-accent-600">
                <BadgeCheck className="h-3.5 w-3.5" /> Organização Verificada
              </span>.
            </p>
          </div>
        </aside>

        {/* Formulário em etapas */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card overflow-hidden">
          <BissauStripe className="h-1" />

          <div className="p-6 sm:p-8">
            {/* Barra de progresso percentual */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
                <span>Etapa {step + 1} de {STEPS.length}: {STEPS[step].title}</span>
                <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <FormField label="Tipo de organização na Guiné-Bissau" error={errors.organizationType?.message}>
                    {(id, d) => (
                      <select id={id} aria-describedby={d} className="input" {...register('organizationType')}>
                        {organizationTypes.map((t) => (
                          <option key={t} value={t}>{ORG_TYPE_LABELS[t]}</option>
                        ))}
                      </select>
                    )}
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label={orgType === 'EMPRESA_PRIVADA' ? 'Nome empresarial (Firma)' : 'Denominação oficial'}
                      error={errors.legalName?.message}
                    >
                      {(id, d) => (
                        <input
                          id={id}
                          aria-describedby={d}
                          placeholder="Ex: Sociedade Comercial Bissau Lda"
                          className="input"
                          {...register('legalName')}
                        />
                      )}
                    </FormField>

                    <FormField label="Nome comercial ou Sigla" hint="Opcional" error={errors.tradeName?.message}>
                      {(id, d) => (
                        <input
                          id={id}
                          aria-describedby={d}
                          placeholder="Ex: SCB / Sigla da ONG"
                          className="input"
                          {...register('tradeName')}
                        />
                      )}
                    </FormField>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      label="NIF (DGCI) / Registo legal"
                      hint="Identificação fiscal na Guiné-Bissau"
                      error={errors.taxId?.message}
                    >
                      {(id, d) => (
                        <input id={id} aria-describedby={d} placeholder="Ex: 510012345" className="input" {...register('taxId')} />
                      )}
                    </FormField>

                    <FormField label="Setor de atividade" error={errors.sector?.message}>
                      {(id, d) => (
                        <select id={id} aria-describedby={d} className="input" {...register('sector')}>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      )}
                    </FormField>

                    <FormField label="Nº de colaboradores" error={errors.sizeRange?.message}>
                      {(id, d) => (
                        <select id={id} aria-describedby={d} className="input" {...register('sizeRange')}>
                          {companySizeRanges.map((s) => (
                            <option key={s} value={s}>{s} colaboradores</option>
                          ))}
                        </select>
                      )}
                    </FormField>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Região administrativa" error={errors.region?.message}>
                      {(id, d) => (
                        <select id={id} aria-describedby={d} className="input" {...register('region')}>
                          {regions.map((r) => (
                            <option key={r} value={r}>{REGION_LABELS[r]}</option>
                          ))}
                        </select>
                      )}
                    </FormField>

                    <FormField
                      label={region === 'BISSAU' ? 'Bairro / Zona em Bissau' : 'Setor administrativo / Cidade'}
                      error={errors.citySector?.message}
                    >
                      {(id, d) => (
                        <input
                          id={id}
                          aria-describedby={d}
                          placeholder={region === 'BISSAU' ? 'Ex: Praça, Chão de Papel, Alto Bandim' : 'Ex: Bafatá Sede, Gabú, Canchungo'}
                          className="input"
                          {...register('citySector')}
                        />
                      )}
                    </FormField>
                  </div>

                  <FormField
                    label="Morada ou ponto de referência"
                    hint="Indique a avenida, rua ou ponto de referência conhecido"
                    error={errors.addressReference?.message}
                  >
                    {(id, d) => (
                      <input
                        id={id}
                        aria-describedby={d}
                        placeholder="Ex: Av. Amílcar Cabral, próximo ao Banco…"
                        className="input"
                        {...register('addressReference')}
                      />
                    )}
                  </FormField>

                  <FormField label="Website ou página oficial" hint="Opcional" error={errors.website?.message}>
                    {(id, d) => (
                      <input
                        id={id}
                        aria-describedby={d}
                        type="url"
                        placeholder="https://www.organizacao.gw"
                        className="input"
                        {...register('website')}
                      />
                    )}
                  </FormField>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Nome do responsável" error={errors.contactName?.message}>
                      {(id, d) => (
                        <input id={id} aria-describedby={d} autoComplete="name" className="input" {...register('contactName')} />
                      )}
                    </FormField>

                    <FormField label="Cargo / Função" error={errors.contactRole?.message}>
                      {(id, d) => (
                        <input
                          id={id}
                          aria-describedby={d}
                          placeholder="Ex: Diretor de RH, Coordenador"
                          className="input"
                          {...register('contactRole')}
                        />
                      )}
                    </FormField>

                    <FormField label="Telefone principal (+245)" hint="Ex: +245955123456" error={errors.phone?.message}>
                      {(id, d) => (
                        <input id={id} aria-describedby={d} type="tel" inputMode="tel" className="input" {...register('phone')} />
                      )}
                    </FormField>

                    <FormField label="WhatsApp (+245)" hint="Opcional" error={errors.whatsapp?.message}>
                      {(id, d) => (
                        <input id={id} aria-describedby={d} type="tel" inputMode="tel" className="input" {...register('whatsapp')} />
                      )}
                    </FormField>
                  </div>

                  <FormField label="E-mail institucional / corporativo" error={errors.email?.message}>
                    {(id, d) => (
                      <input id={id} aria-describedby={d} type="email" autoComplete="email" className="input" {...register('email')} />
                    )}
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Palavra-passe" hint="Mínimo de 8 caracteres" error={errors.password?.message}>
                      {(id, d) => (
                        <input
                          id={id}
                          aria-describedby={d}
                          type="password"
                          autoComplete="new-password"
                          className="input"
                          {...register('password')}
                        />
                      )}
                    </FormField>

                    <FormField label="Confirmar palavra-passe" error={errors.confirmPassword?.message}>
                      {(id, d) => (
                        <input
                          id={id}
                          aria-describedby={d}
                          type="password"
                          autoComplete="new-password"
                          className="input"
                          {...register('confirmPassword')}
                        />
                      )}
                    </FormField>
                  </div>

                  <div>
                    <label className="flex items-start gap-2 text-sm">
                      <input type="checkbox" className="mt-1" {...register('acceptTerms')} />
                      <span>
                        Confirmo a veracidade dos dados e aceito os{' '}
                        <Link to="/termos" className="text-brand underline">termos de utilização</Link> e a{' '}
                        <Link to="/privacidade" className="text-brand underline">política de privacidade</Link>.
                      </span>
                    </label>
                    {errors.acceptTerms && <p role="alert" className="mt-1 text-xs text-red-600">{errors.acceptTerms.message}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {status === 'error' && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                Não foi possível concluir o registo neste momento. Verifique a ligação ao servidor.
              </p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
              {step > 0 ? (
                <button type="button" className="btn-outline" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Anterior
                </button>
              ) : (
                <Link to="/cadastro" className="text-xs font-medium text-ink-muted hover:text-ink">
                  ← Alterar tipo de conta
                </Link>
              )}

              {step < STEPS.length - 1 ? (
                <MotionButton type="button" className="btn-primary" onClick={nextStep}>
                  Seguinte
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </MotionButton>
              ) : (
                <MotionButton type="submit" className="btn-accent" disabled={isSubmitting}>
                  Concluir registo
                </MotionButton>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
