import { z } from 'zod'
import { regions } from './job'

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string().min(2, 'Indique o título da lição'),
  durationMinutes: z.number().int().min(1),
  content: z.string().min(10, 'Indique o conteúdo de leitura'),
})
export type CourseLesson = z.infer<typeof lessonSchema>

export const freeCourseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string().min(3, 'Indique o título do curso'),
  category: z.string().min(2, 'Selecione a categoria'),
  level: z.enum(['INICIANTE', 'INTERMEDIO', 'AVANCADO']),
  readingMinutes: z.number().int().min(1),
  summary: z.string().min(10, 'Indique o resumo'),
  lessons: z.array(lessonSchema),
  published: z.boolean().default(true),
})
export type FreeCourse = z.infer<typeof freeCourseSchema>

export const createFreeCourseSchema = z.object({
  title: z.string().min(3, 'Indique o título do curso'),
  category: z.string().min(2, 'Indique a categoria'),
  level: z.enum(['INICIANTE', 'INTERMEDIO', 'AVANCADO']),
  readingMinutes: z.coerce.number().int().min(1),
  summary: z.string().min(10, 'Indique o resumo'),
  lessonTitle: z.string().min(3, 'Indique o título da 1ª lição'),
  lessonContent: z.string().min(20, 'Escreva o conteúdo de leitura'),
})
export type CreateFreeCourseInput = z.infer<typeof createFreeCourseSchema>

export const adPlacements = ['SPOTLIGHT_TOP', 'CATALOG_CARD', 'SIDEBAR_BANNER'] as const
export type AdPlacement = (typeof adPlacements)[number]

export const sponsoredCourseAdSchema = z.object({
  id: z.string(),
  partnerName: z.string().min(2, 'Indique o nome da instituição parceira'),
  courseTitle: z.string().min(3, 'Indique o nome do curso ou formação'),
  category: z.string(),
  region: z.enum(regions),
  mode: z.enum(['PRESENCIAL', 'ONLINE', 'HIBRIDO']),
  bannerUrl: z.string().nullable().optional(),
  description: z.string(),
  coursePriceXof: z.number().nullable().optional(),
  adFeePaidXof: z.number().min(0),
  placement: z.enum(adPlacements),
  targetUrl: z.string().min(3, 'Indique o link ou número de WhatsApp'),
  whatsapp: z.string().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  impressions: z.number().int().default(0),
  clicks: z.number().int().default(0),
  active: z.boolean().default(true),
})
export type SponsoredCourseAd = z.infer<typeof sponsoredCourseAdSchema>

export const createSponsoredAdSchema = z.object({
  partnerName: z.string().min(2, 'Indique a escola / instituição anunciante'),
  courseTitle: z.string().min(3, 'Indique o título do curso anunciado'),
  category: z.string().min(2, 'Selecione a categoria'),
  region: z.enum(regions),
  mode: z.enum(['PRESENCIAL', 'ONLINE', 'HIBRIDO']),
  bannerUrl: z.string().optional(),
  description: z.string().min(10, 'Descreva o curso ou propaganda'),
  coursePriceXof: z.coerce.number().nullable().optional(),
  adFeePaidXof: z.coerce.number().min(0, 'Indique o valor cobrado pelo anúncio (XOF)'),
  placement: z.enum(adPlacements),
  targetUrl: z.string().min(4, 'Indique o URL de inscrição ou link'),
  whatsapp: z.string().optional(),
  startsAt: z.string().min(1, 'Data de início'),
  endsAt: z.string().min(1, 'Data de término'),
})
export type CreateSponsoredAdInput = z.infer<typeof createSponsoredAdSchema>

