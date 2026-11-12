import { z } from 'zod'
import { jobSchema } from './job'

export const applicationStatuses = ['SENT', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'REJECTED', 'CANCELLED'] as const
export type ApplicationStatus = (typeof applicationStatuses)[number]

export const profileSchema = z.object({
  fullName: z.string().min(3, 'Indique o nome completo'),
  photoUrl: z.string().nullable().optional(),
  birthDate: z.string().min(1, 'Indique a data de nascimento'),
  nationality: z.string().min(2, 'Indique a nacionalidade'),
  city: z.string().min(2, 'Indique a cidade'),
  phone: z.string().regex(/^\+245\d{7,9}$/, 'Use o formato +245XXXXXXX'),
  whatsapp: z.string().regex(/^(\+245\d{7,9})?$/, 'Use o formato +245XXXXXXX').optional(),
  email: z.string().email('E-mail inválido'),
  address: z.string().optional(),
  summary: z.string().max(1000, 'Máximo de 1000 caracteres').optional(),
  objective: z.string().max(500, 'Máximo de 500 caracteres').optional(),
  availability: z.string().optional(),
})
export type Profile = z.infer<typeof profileSchema>

export const applicationSchema = z.object({
  id: z.string(),
  status: z.enum(applicationStatuses),
  appliedAt: z.string(),
  job: z.object({ id: z.string(), title: z.string(), company: z.object({ id: z.string(), name: z.string() }) }),
})
export type Application = z.infer<typeof applicationSchema>

export const interviewSchema = z.object({
  id: z.string(),
  startsAt: z.string(),
  company: z.string(),
  jobTitle: z.string(),
  mode: z.enum(['ONLINE', 'PRESENCIAL']),
  location: z.string().nullable(),
  instructions: z.string().nullable(),
})
export type Interview = z.infer<typeof interviewSchema>

export const notificationSchema = z.object({
  id: z.string(),
  type: z.enum(['NEW_JOB', 'APPLICATION_UPDATE', 'INTERVIEW_INVITE', 'MESSAGE']),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  read: z.boolean(),
})
export type AppNotification = z.infer<typeof notificationSchema>

export const dashboardSchema = z.object({
  profileProgress: z.number().min(0).max(100),
  hasCurriculum: z.boolean(),
  applications: z.number(),
  savedJobs: z.number(),
  interviews: z.number(),
  recommendations: z.array(jobSchema),
  recentApplications: z.array(applicationSchema),
})
export type CandidateDashboard = z.infer<typeof dashboardSchema>

// ---- Currículo ----
const s = z.string()
export const curriculumSchema = z.object({
  template: z.enum(['classico', 'moderno']),
  personal: z.object({ fullName: s.min(3, 'Obrigatório'), email: s.email('E-mail inválido'), phone: s, city: s }),
  summary: s.max(1000, 'Máximo de 1000 caracteres'),
  experiences: z.array(z.object({ role: s.min(1, 'Obrigatório'), company: s.min(1, 'Obrigatório'), period: s, description: s })),
  education: z.array(z.object({ course: s.min(1, 'Obrigatório'), institution: s.min(1, 'Obrigatório'), period: s })),
  courses: z.array(z.object({ name: s.min(1, 'Obrigatório'), institution: s, year: s })),
  certifications: z.array(z.object({ name: s.min(1, 'Obrigatório'), issuer: s, year: s })),
  languages: z.array(z.object({ name: s.min(1, 'Obrigatório'), level: s })),
  skills: z.array(z.object({ name: s.min(1, 'Obrigatório') })),
  references: z.array(z.object({ name: s.min(1, 'Obrigatório'), role: s, contact: s })),
})
export type Curriculum = z.infer<typeof curriculumSchema>

