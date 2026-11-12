import { z } from 'zod'

export const contractTypes = ['CLT', 'TEMPORARIO', 'ESTAGIO', 'FREELANCE', 'VOLUNTARIADO'] as const
export const workModes = ['PRESENCIAL', 'REMOTO', 'HIBRIDO'] as const
export const regions = ['BISSAU', 'BAFATA', 'GABU', 'CACHEU', 'OIO', 'BIOMBO', 'QUINARA', 'TOMBALI', 'BOLAMA_BIJAGOS'] as const

export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()),
  category: z.string(),
  contractType: z.enum(contractTypes),
  workMode: z.enum(workModes),
  region: z.enum(regions),
  city: z.string().optional(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  currency: z.literal('XOF'),
  deadline: z.string().nullable(),
  publishedAt: z.string(),
  verified: z.boolean(),
  experience: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  company: z.object({ id: z.string(), name: z.string(), logoUrl: z.string().nullable() }),
})
export type Job = z.infer<typeof jobSchema>

export const pageSchema = <T extends z.ZodType>(item: T) =>
  z.object({ items: z.array(item), page: z.number(), pageSize: z.number(), total: z.number() })

export const jobSearchSchema = z.object({
  q: z.string().optional(),
  region: z.enum(regions).optional(),
  category: z.string().optional(),
  contractType: z.enum(contractTypes).optional(),
  workMode: z.enum(workModes).optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  postedWithinDays: z.number().int().optional(),
  salaryMin: z.number().int().optional(),
  companyId: z.string().optional(),
  page: z.number().int().min(1).default(1),
  sort: z.enum(['recent', 'salary']).default('recent'),
})
export type JobSearch = z.infer<typeof jobSearchSchema>

