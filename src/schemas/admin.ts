import { z } from 'zod'
import { regions } from './job'

export const adminOverviewSchema = z.object({
  totalUsers: z.number(),
  totalCandidates: z.number(),
  totalCompanies: z.number(),
  pendingCompanies: z.number(),
  pendingJobs: z.number(),
  openReports: z.number(),
  activePlans: z.number(),
  monthlyRevenueXof: z.number(),
  growthByMonth: z.array(z.object({ month: z.string(), candidates: z.number(), companies: z.number(), jobs: z.number() })),
  jobsByRegion: z.array(z.object({ region: z.string(), total: z.number() })),
})
export type AdminOverview = z.infer<typeof adminOverviewSchema>

export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['CANDIDATE', 'COMPANY', 'ADMIN']),
  active: z.boolean(),
  createdAt: z.string(),
})
export type AdminUser = z.infer<typeof adminUserSchema>

export const moderationCompanySchema = z.object({
  id: z.string(),
  legalName: z.string(),
  tradeName: z.string().nullable(),
  taxId: z.string(),
  sector: z.string(),
  region: z.enum(regions),
  email: z.string(),
  phone: z.string(),
  verified: z.boolean(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  createdAt: z.string(),
})
export type ModerationCompany = z.infer<typeof moderationCompanySchema>

export const moderationJobSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyName: z.string(),
  category: z.string(),
  region: z.enum(regions),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  publishedAt: z.string(),
})
export type ModerationJob = z.infer<typeof moderationJobSchema>

export const taxonomyItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  active: z.boolean(),
})
export type TaxonomyItem = z.infer<typeof taxonomyItemSchema>

export const locationItemSchema = z.object({
  id: z.string(),
  region: z.enum(regions),
  sectorName: z.string(),
  active: z.boolean(),
})
export type LocationItem = z.infer<typeof locationItemSchema>

export const abuseReportSchema = z.object({
  id: z.string(),
  targetType: z.enum(['JOB', 'COMPANY', 'USER']),
  targetId: z.string(),
  targetTitle: z.string(),
  reason: z.string(),
  reporterEmail: z.string(),
  status: z.enum(['OPEN', 'RESOLVED', 'DISMISSED']),
  createdAt: z.string(),
})
export type AbuseReport = z.infer<typeof abuseReportSchema>

export const commercialPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceXof: z.number(),
  billingCycle: z.enum(['MENSAL', 'TRIMESTRAL', 'ANUAL']),
  jobSlots: z.number(),
  featuredSlots: z.number(),
  active: z.boolean(),
})
export type CommercialPlan = z.infer<typeof commercialPlanSchema>

export const paymentRecordSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  planName: z.string(),
  amountXof: z.number(),
  method: z.string(),
  status: z.enum(['PENDING', 'PAID', 'FAILED']),
  createdAt: z.string(),
})
export type PaymentRecord = z.infer<typeof paymentRecordSchema>

export const platformSettingsSchema = z.object({
  platformName: z.string().min(2),
  supportEmail: z.string().email(),
  supportPhone: z.string(),
  defaultCurrency: z.literal('XOF'),
  defaultLanguage: z.enum(['pt-GW', 'gwc', 'fr']),
  requireCompanyVerification: z.boolean(),
  requireJobModeration: z.boolean(),
  maintenanceMode: z.boolean(),
})
export type PlatformSettings = z.infer<typeof platformSettingsSchema>

