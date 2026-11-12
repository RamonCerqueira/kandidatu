import { z } from 'zod'
import { regions } from './job'

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable(),
  coverUrl: z.string().nullable(),
  sector: z.string(),
  description: z.string(),
  region: z.enum(regions),
  city: z.string().nullable().optional(),
  website: z.string().nullable(),
  socials: z.array(z.object({ network: z.string(), url: z.string() })).default([]),
  employees: z.number().nullable(),
  verified: z.boolean(),
  openJobs: z.number(),
})
export type Company = z.infer<typeof companySchema>

export const statsSchema = z.object({ jobs: z.number(), companies: z.number(), candidates: z.number() })
export type PlatformStats = z.infer<typeof statsSchema>

export const contactSchema = z.object({
  name: z.string().min(2, 'Indique o seu nome'),
  email: z.string().email('E-mail inválido'),
  message: z.string().min(10, 'Escreva pelo menos 10 caracteres'),
})
export type ContactInput = z.infer<typeof contactSchema>

