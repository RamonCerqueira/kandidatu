import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, CreditCard, GraduationCap, Landmark, Megaphone, Smartphone, Sparkles } from 'lucide-react'
import { advertisingRequestSchema, type AdvertisingRequestInput } from '../../schemas/auth'
import { api } from '../../services/api/client'
import { FormField } from '../../components/forms/FormField'
import { BissauStripe, GuineaBissauBadge, MotionButton, MotionCard, StaggerGrid, StaggerItem } from '../../components/ui/MotionPrimitives'
import { Seo } from '../../components/shared/Seo'
import { formatXOF } from '../../utils/format'

const PACKAGES = [
  {
    code: 'CURSO_VITRINE' as const,
    tag: 'Escolas & Centros de Formação',
    title: 'Card de Curso Patrocinado',
    priceXof: 35000,
    period: 'por 30 dias',
    features: [
      'Destaque na vitrine /formacao com selo Patrocinado',
      'Botão direto para o WhatsApp (+245) da sua secretaria',
      'Exibição na lateral da pesquisa de vagas',
      'Relatório de impressões e cliques reais',
    ],
  },
  {
    code: 'BANNER_SPOTLIGHT' as const,
    tag: 'Universidades & Institutos',
    title: 'Banner Topo Spotlight + Painel',
    priceXof: 75000,
    period: 'por 30 dias',
    features: [
      'Banner principal no topo da Academia KANDIDATU',
      'Recomendação direta no Dashboard dos candidatos',
      'Prioridade máxima por região e área de estudo',
      'Apoio da nossa equipa na criação da campanha',
    ],
  },
  {
    code: 'PLANO_EMPRESA_PRO' as const,
    tag: 'Empresas, ONGs & Instituições',
    title: 'Recrutamento Empresarial Pro',
    priceXof: 50000,
    period: 'mensal',
    features: [
      'Até 10 vagas ativas simultâneas + 2 em destaque',
      'Kanban de processo seletivo e agenda de entrevistas',
      'Selo oficial de Organização Verificada',
      'Acesso completo à base de currículos A4',
    ],
  },
]

export default function AdvertisePage() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdvertisingRequestInput>({
    resolver: zodResolver(advertisingRequestSchema),
    defaultValues: {
      phone: '+245',
      packageType: 'CURSO_VITRINE',
      paymentMethod: 'ORANGE_MONEY',
    },
  })

  const onSubmit = async (v: AdvertisingRequestInput) => {
    try {
      await api.post('/advertising-requests', v)
      setStatus('ok')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <Seo
        title="Anunciar Cursos & Planos Empresariais"
        description="Divulgue os cursos da sua instituição ou contrate planos de recrutamento em Franco CFA (XOF) na Guiné-Bissau."
      />

      <section className="bg-brand-900 bg-pinti-grid px-4 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2">
            <GuineaBissauBadge label="Publicidade & Planos em XOF" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-bissau-yellow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Monetização & Parcerias
            </span>
          </div>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
            Alcance milhares de profissionais e estudantes em toda a Guiné-Bissau.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            Tem um centro de formação, universidade, escola de idiomas ou empresa? Anuncie os seus cursos ou ative o seu plano de recrutamento com pagamento facilitado em Franco CFA (XOF).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        {/* TABELA DE PACOTES */}
        <section>
          <h2 className="text-2xl font-extrabold">Pacotes de Publicidade & Recrutamento</h2>
          <p className="mt-1 text-sm text-ink-muted">Valores transparentes em Franco CFA da África Ocidental (XOF).</p>

          <StaggerGrid className="mt-6 grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <StaggerItem key={pkg.code}>
                <MotionCard className="flex h-full flex-col justify-between overflow-hidden p-6">
                  <div>
                    <BissauStripe className="mb-4 h-1 rounded-full" />
                    <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand">{pkg.tag}</span>
                    <h3 className="mt-3 text-lg font-extrabold">{pkg.title}</h3>
                    <p className="mt-2 text-2xl font-extrabold text-brand">
                      {formatXOF(pkg.priceXof)} <span className="text-xs font-normal text-ink-muted">{pkg.period}</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-ink-muted">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bissau-green" aria-hidden />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#solicitar-campanha"
                    onClick={() => setValue('packageType', pkg.code)}
                    className="btn-primary mt-6 w-full"
                  >
                    Selecionar pacote
                  </a>
                </MotionCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>

        {/* MEIOS DE PAGAMENTO LOCAIS NA GUINÉ-BISSAU */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="card flex items-start gap-3.5 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-brand">
              <Smartphone className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-bold">Orange Money Guiné-Bissau</h3>
              <p className="mt-1 text-xs text-ink-muted">Pagamento móvel rápido em XOF com ativação imediata da campanha pelo SuperAdmin.</p>
            </div>
          </div>

          <div className="card flex items-start gap-3.5 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
              <CreditCard className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-bold">MTN Mobile Money (MoMo)</h3>
              <p className="mt-1 text-xs text-ink-muted">Transferência direta via carteira móvel +245 com comprovativo digital.</p>
            </div>
          </div>

          <div className="card flex items-start gap-3.5 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
              <Landmark className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-bold">Transferência Bancária Local</h3>
              <p className="mt-1 text-xs text-ink-muted">BAO, Ecobank, Orabank ou BDU para contratos empresariais e institucionais.</p>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO DE SOLICITAÇÃO */}
        <section id="solicitar-campanha" className="grid items-start gap-8 lg:grid-cols-[1fr_460px]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-600">
              <GraduationCap className="h-4 w-4" aria-hidden />
              Parceria Comercial KANDIDATU
            </span>
            <h2 className="text-2xl font-extrabold">Solicite a publicação da sua propaganda ou plano</h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Preencha os dados ao lado. A nossa equipa de administração entrará em contacto pelo telefone/WhatsApp <code>+245</code> indicado para recolher o banner do seu curso e confirmar o pagamento em XOF.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <Megaphone className="h-4 w-4 text-bissau-red" aria-hidden />
              Pedido de anúncio / plano
            </h3>

            <FormField label="Nome da escola, instituição ou empresa" error={errors.organizationName?.message}>
              {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('organizationName')} />}
            </FormField>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Pessoa de contacto" error={errors.contactName?.message}>
                {(id, d) => <input id={id} aria-describedby={d} className="input" {...register('contactName')} />}
              </FormField>
              <FormField label="Telefone / WhatsApp (+245)" error={errors.phone?.message}>
                {(id, d) => <input id={id} aria-describedby={d} type="tel" className="input" {...register('phone')} />}
              </FormField>
            </div>

            <FormField label="E-mail" error={errors.email?.message}>
              {(id, d) => <input id={id} aria-describedby={d} type="email" className="input" {...register('email')} />}
            </FormField>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Pacote desejado" error={errors.packageType?.message}>
                {(id, d) => (
                  <select id={id} aria-describedby={d} className="input" {...register('packageType')}>
                    <option value="CURSO_VITRINE">Card de Curso (35.000 XOF)</option>
                    <option value="BANNER_SPOTLIGHT">Banner Spotlight (75.000 XOF)</option>
                    <option value="PLANO_EMPRESA_PRO">Empresa Pro (50.000 XOF)</option>
                    <option value="PARCERIA_INSTITUCIONAL">Parceria Institucional</option>
                  </select>
                )}
              </FormField>

              <FormField label="Meio de pagamento preferido" error={errors.paymentMethod?.message}>
                {(id, d) => (
                  <select id={id} aria-describedby={d} className="input" {...register('paymentMethod')}>
                    <option value="ORANGE_MONEY">Orange Money</option>
                    <option value="MTN_MOMO">MTN Mobile Money</option>
                    <option value="TRANSFERENCIA_BANCARIA">Transferência Bancária</option>
                  </select>
                )}
              </FormField>
            </div>

            <FormField label="Detalhes do curso ou campanha (opcional)" error={errors.notes?.message}>
              {(id, d) => <textarea id={id} aria-describedby={d} rows={3} className="input" {...register('notes')} />}
            </FormField>

            {status === 'ok' && (
              <p role="status" className="text-sm font-medium text-accent-600">
                Pedido enviado! Entraremos em contacto em breve pelo seu número +245.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="text-sm text-red-600">
                Não foi possível registar o pedido agora. Tente novamente mais tarde.
              </p>
            )}

            <MotionButton type="submit" className="btn-accent w-full" disabled={isSubmitting}>
              Enviar solicitação comercial
            </MotionButton>
          </form>
        </section>
      </div>
    </div>
  )
}

