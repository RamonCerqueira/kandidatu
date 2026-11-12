import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Briefcase, CheckCircle2, FileText, ShieldCheck, User } from 'lucide-react'
import { candidateRegisterSchema, type CandidateRegisterInput } from '../../../schemas/auth'
import { regions } from '../../../schemas/job'
import { CATEGORIES, EDUCATION_LEVELS, EXPERIENCE_LEVELS, REGION_LABELS } from '../../../constants'
import { authService } from '../../../services/auth/authService'
import { FormField } from '../../../components/forms/FormField'
import { BissauStripe, GuineaBissauBadge, MotionButton } from '../../../components/ui/MotionPrimitives'
import { Seo } from '../../../components/shared/Seo'

const STEPS: { title: string; subtitle: string; icon: typeof User; fields: FieldPath<CandidateRegisterInput>[] }[] = [
  {
    title: 'Dados Pessoais',
    subtitle: 'Nome e contactos em +245',
    icon: User,
    fields: ['fullName', 'phone', 'whatsapp'],
  },
  {
    title: 'Perfil & Região',
    subtitle: 'Localização, formação e área',
    icon: Briefcase,
    fields: ['region', 'citySector', 'educationLevel', 'primaryCategory', 'experienceLevel'],
  },
  {
    title: 'Acesso à Conta',
    subtitle: 'E-mail e palavra-passe segura',
    icon: ShieldCheck,
    fields: ['email', 'password', 'confirmPassword', 'acceptTerms'],
  },
]

export default function RegisterCandidatePage() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CandidateRegisterInput>({
    resolver: zodResolver(candidateRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      phone: '+245',
      whatsapp: '',
      region: 'BISSAU',
      educationLevel: EDUCATION_LEVELS[3],
      primaryCategory: CATEGORIES[0],
      experienceLevel: EXPERIENCE_LEVELS[1],
    },
  })

  const nextStep = async () => {
    const valid = await trigger(STEPS[step].fields)
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const onSubmit = async (v: CandidateRegisterInput) => {
    try {
      await authService.registerCandidate(v)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  const region = watch('region')

  if (status === 'ok') {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="card overflow-hidden p-7 text-center">
          <BissauStripe className="mb-5 h-1.5 rounded-full" />
          <CheckCircle2 className="mx-auto h-11 w-11 text-bissau-green" aria-hidden />
          <h1 className="mt-3 text-xl font-extrabold">Conta de candidato criada!</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Já pode entrar, gerar o seu currículo A4 em PDF e candidatar-se gratuitamente às oportunidades.
          </p>
          <Link to="/entrar" className="btn-accent mt-6 w-full">
            Entrar na minha conta
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Seo title="Cadastro de Candidato" />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Coluna lateral explicativa */}
        <aside className="space-y-4">
          <div className="rounded-card bg-brand bg-pinti-grid p-5 text-white shadow-soft">
            <GuineaBissauBadge label="Talentos GB" />
            <h1 className="mt-3 text-xl font-extrabold">Criar Perfil Profissional</h1>
            <p className="mt-1.5 text-xs leading-relaxed text-white/75">
              Em 3 passos rápidos prepara o seu perfil para receber vagas compatíveis na sua região e aceder aos cursos gratuitos.
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
                      active ? 'bg-white/15 font-semibold text-white' : done ? 'text-bissau-yellow' : 'text-white/55'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-extrabold ${
                        active ? 'bg-bissau-yellow text-brand-900' : done ? 'bg-bissau-green text-white' : 'bg-white/10 text-white'
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
              <FileText className="h-4 w-4 text-accent" aria-hidden />
              100% Gratuito para candidatos
            </p>
            <p>Inclui construtor de currículo A4 em PDF e acesso aos cursos básicos de leitura com certificado.</p>
          </div>
        </aside>

        {/* Formulário em etapas */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card overflow-hidden">
          <BissauStripe className="h-1" />

          <div className="p-6 sm:p-8">
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
                  key="cand-step-0"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <FormField label="Nome completo" error={errors.fullName?.message}>
                    {(id, d) => (
                      <input id={id} aria-describedby={d} autoComplete="name" placeholder="Como consta no seu documento" className="input" {...register('fullName')} />
                    )}
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Telefone principal (+245)" hint="Ex: +245955123456" error={errors.phone?.message}>
                      {(id, d) => (
                        <input id={id} aria-describedby={d} type="tel" inputMode="tel" autoComplete="tel" className="input" {...register('phone')} />
                      )}
                    </FormField>

                    <FormField label="WhatsApp (+245)" hint="Opcional, caso seja diferente" error={errors.whatsapp?.message}>
                      {(id, d) => (
                        <input id={id} aria-describedby={d} type="tel" inputMode="tel" className="input" {...register('whatsapp')} />
                      )}
                    </FormField>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="cand-step-1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Região onde reside" error={errors.region?.message}>
                      {(id, d) => (
                        <select id={id} aria-describedby={d} className="input" {...register('region')}>
                          {regions.map((r) => (
                            <option key={r} value={r}>{REGION_LABELS[r]}</option>
                          ))}
                        </select>
                      )}
                    </FormField>

                    <FormField label={region === 'BISSAU' ? 'Bairro em Bissau' : 'Cidade / Setor administrativo'} error={errors.citySector?.message}>
                      {(id, d) => (
                        <input
                          id={id}
                          aria-describedby={d}
                          placeholder={region === 'BISSAU' ? 'Ex: Bairro Militar, Bandim, Praça' : 'Ex: Bafatá, Gabú, Canchungo'}
                          className="input"
                          {...register('citySector')}
                        />
                      )}
                    </FormField>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField label="Escolaridade atual" error={errors.educationLevel?.message}>
                      {(id, d) => (
                        <select id={id} aria-describedby={d} className="input" {...register('educationLevel')}>
                          {EDUCATION_LEVELS.map((e) => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      )}
                    </FormField>

                    <FormField label="Área de interesse" error={errors.primaryCategory?.message}>
                      {(id, d) => (
                        <select id={id} aria-describedby={d} className="input" {...register('primaryCategory')}>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      )}
                    </FormField>

                    <FormField label="Experiência" error={errors.experienceLevel?.message}>
                      {(id, d) => (
                        <select id={id} aria-describedby={d} className="input" {...register('experienceLevel')}>
                          {EXPERIENCE_LEVELS.map((x) => (
                            <option key={x} value={x}>{x}</option>
                          ))}
                        </select>
                      )}
                    </FormField>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="cand-step-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <FormField label="E-mail" error={errors.email?.message}>
                    {(id, d) => (
                      <input id={id} aria-describedby={d} type="email" autoComplete="email" className="input" {...register('email')} />
                    )}
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Palavra-passe" hint="Mínimo de 8 caracteres" error={errors.password?.message}>
                      {(id, d) => (
                        <input id={id} aria-describedby={d} type="password" autoComplete="new-password" className="input" {...register('password')} />
                      )}
                    </FormField>

                    <FormField label="Confirmar palavra-passe" error={errors.confirmPassword?.message}>
                      {(id, d) => (
                        <input id={id} aria-describedby={d} type="password" autoComplete="new-password" className="input" {...register('confirmPassword')} />
                      )}
                    </FormField>
                  </div>

                  <div>
                    <label className="flex items-start gap-2 text-sm">
                      <input type="checkbox" className="mt-1" {...register('acceptTerms')} />
                      <span>
                        Aceito os <Link to="/termos" className="text-brand underline">termos de utilização</Link> e a{' '}
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
                Não foi possível criar a conta. Verifique a ligação ao servidor.
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
                  Criar conta gratuita
                </MotionButton>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
