import { z } from 'zod'
import { regions } from './job'

export const organizationTypes = [
  'EMPRESA_PRIVADA',
  'ONG',
  'ORGANISMO_INTERNACIONAL',
  'INSTITUICAO_PUBLICA',
  'ENSINO_FORMACAO',
] as const
export type OrganizationType = (typeof organizationTypes)[number]

export const companySizeRanges = ['1-10', '11-50', '51-200', '200+'] as const

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const candidateRegisterSchema = loginSchema
  .extend({
    fullName: z.string().min(3, 'Indique o nome completo'),
    phone: z.string().regex(/^\+245\d{7,9}$/, 'Use o formato +245XXXXXXX'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { message: 'É necessário aceitar os termos' }),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'As palavras-passe não coincidem' })
export type CandidateRegisterInput = z.infer<typeof candidateRegisterSchema>

export const companyRegisterSchema = loginSchema
  .extend({
    // Etapa 1: Identificação legal na Guiné-Bissau
    organizationType: z.enum(organizationTypes),
    legalName: z.string().min(2, 'Indique a denominação social ou oficial'),
    tradeName: z.string().optional(),
    taxId: z.string().min(5, 'Indique o NIF (DGCI) ou registo legal'),
    sector: z.string().min(2, 'Selecione o setor de atividade'),
    sizeRange: z.enum(companySizeRanges),
    // Etapa 2: Localização na Guiné-Bissau
    region: z.enum(regions),
    citySector: z.string().min(2, 'Indique o setor administrativo ou bairro'),
    addressReference: z.string().min(3, 'Indique a morada ou ponto de referência'),
    website: z.string().optional(),
    // Etapa 3: Responsável e acesso
    contactName: z.string().min(3, 'Indique o nome do responsável'),
    contactRole: z.string().min(2, 'Indique o cargo do responsável'),
    phone: z.string().regex(/^\+245\d{7,9}$/, 'Use o formato +245XXXXXXX'),
    whatsapp: z.string().regex(/^(\+245\d{7,9})?$/, 'Use o formato +245XXXXXXX').optional(),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { message: 'É necessário aceitar os termos' }),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'As palavras-passe não coincidem' })
export type CompanyRegisterInput = z.infer<typeof companyRegisterSchema>

export const forgotPasswordSchema = z.object({ email: z.string().email('E-mail inválido') })
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.enum(['CANDIDATE', 'COMPANY', 'ADMIN']),
})
export type User = z.infer<typeof userSchema>
