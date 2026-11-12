import { z } from 'zod'
import { contractTypes, regions, workModes } from './job'

export const employerJobStatuses = ['ACTIVE', 'PAUSED', 'CLOSED', 'DRAFT'] as const
export type EmployerJobStatus = (typeof employerJobStatuses)[number]

export const recruitmentStages = ['NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'REJECTED'] as const
export type RecruitmentStage = (typeof recruitmentStages)[number]

export const employerDashboardSchema = z.object({
  publishedJobs: z.number(),
  activeJobs: z.number(),
  totalCandidates: z.number(),
  applicationsReceived: z.number(),
  scheduledInterviews: z.number(),
  closedJobs: z.number(),
  applicationsByPeriod: z.array(z.object({ period: z.string(), total: z.number() })),
  candidatesPerJob: z.array(z.object({ jobTitle: z.string(), candidates: z.number() })),
  hiringEvolution: z.array(z.object({ month: z.string(), hires: z.number() })),
})
export type EmployerDashboard = z.infer<typeof employerDashboardSchema>

export const employerProfileSchema = z.object({
  legalName: z.string().min(2, 'Indique o nome empresarial'),
  tradeName: z.string().min(2, 'Indique o nome comercial'),
  taxId: z.string().min(5, 'Indique o NIF / identificação fiscal'),
  logoUrl: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  sector: z.string().min(2, 'Indique o setor'),
  description: z.string().min(10, 'Indique a descrição'),
  address: z.string().optional(),
  city: z.string().min(2, 'Indique a cidade'),
  phone: z.string().regex(/^\+245\d{7,9}$/, 'Use o formato +245XXXXXXX'),
  email: z.string().email('E-mail inválido'),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  verified: z.boolean().default(false),
})
export type EmployerProfile = z.infer<typeof employerProfileSchema>

export const jobFormSchema = z.object({
  title: z.string().min(3, 'Indique o título da vaga'),
  category: z.string().min(2, 'Selecione a categoria'),
  description: z.string().min(20, 'Descreva a vaga'),
  responsibilities: z.string().min(5, 'Indique as responsabilidades (uma por linha)'),
  requirements: z.string().min(5, 'Indique os requisitos (um por linha)'),
  education: z.string().min(2, 'Selecione a escolaridade'),
  experience: z.string().min(2, 'Selecione a experiência'),
  vacancies: z.coerce.number().int().min(1, 'Mínimo 1 vaga'),
  region: z.enum(regions),
  city: z.string().optional(),
  salaryMin: z.coerce.number().nullable().optional(),
  salaryMax: z.coerce.number().nullable().optional(),
  currency: z.literal('XOF'),
  contractType: z.enum(contractTypes),
  workload: z.string().min(2, 'Indique a jornada'),
  workMode: z.enum(workModes),
  benefits: z.string().optional(),
  deadline: z.string().min(1, 'Indique o prazo de candidatura'),
})
export type JobFormInput = z.infer<typeof jobFormSchema>

export const employerJobItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  region: z.enum(regions),
  contractType: z.enum(contractTypes),
  workMode: z.enum(workModes),
  status: z.enum(employerJobStatuses),
  candidatesCount: z.number(),
  publishedAt: z.string(),
  deadline: z.string().nullable(),
})
export type EmployerJobItem = z.infer<typeof employerJobItemSchema>

export const applicantSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  jobId: z.string(),
  jobTitle: z.string(),
  photoUrl: z.string().nullable(),
  fullName: z.string(),
  desiredRole: z.string(),
  location: z.string(),
  experience: z.string(),
  education: z.string(),
  skills: z.array(z.string()),
  curriculumUrl: z.string().nullable(),
  appliedAt: z.string(),
  stage: z.enum(recruitmentStages),
  favorite: z.boolean(),
  notes: z.string().nullable().optional(),
})
export type Applicant = z.infer<typeof applicantSchema>

export const employerInterviewSchema = z.object({
  id: z.string(),
  applicantId: z.string(),
  candidateName: z.string(),
  jobTitle: z.string(),
  startsAt: z.string(),
  mode: z.enum(['ONLINE', 'PRESENCIAL']),
  location: z.string(),
  instructions: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CANCELLED']).default('SCHEDULED'),
})
export type EmployerInterview = z.infer<typeof employerInterviewSchema>

export const scheduleInterviewSchema = z.object({
  applicantId: z.string().min(1, 'Selecione o candidato'),
  startsAt: z.string().min(1, 'Indique data e hora'),
  mode: z.enum(['ONLINE', 'PRESENCIAL']),
  location: z.string().min(2, 'Indique o local ou link'),
  instructions: z.string().optional(),
})
export type ScheduleInterviewInput = z.infer<typeof scheduleInterviewSchema>

