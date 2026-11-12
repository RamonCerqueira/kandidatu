import { z } from 'zod'
import { api } from '../api/client'
import {
  applicantSchema, employerDashboardSchema, employerInterviewSchema, employerJobItemSchema, employerProfileSchema,
  type EmployerJobStatus, type EmployerProfile, type JobFormInput, type RecruitmentStage, type ScheduleInterviewInput,
} from '../../schemas/employer'

export interface ApplicantFilter {
  jobId?: string
  experience?: string
  education?: string
  skill?: string
  location?: string
  stage?: RecruitmentStage
}

const toLines = (v?: string) => (v ? v.split('\n').map((s) => s.trim()).filter(Boolean) : [])

// PROPOSTA de contratos — ver docs/API.md
export const employerService = {
  async dashboard() {
    return employerDashboardSchema.parse((await api.get('/employer/dashboard')).data)
  },
  async getProfile() {
    return employerProfileSchema.parse((await api.get('/employer/profile')).data)
  },
  async saveProfile(p: EmployerProfile) {
    await api.put('/employer/profile', p)
  },
  async listJobs() {
    return z.array(employerJobItemSchema).parse((await api.get('/employer/jobs')).data)
  },
  async createJob(input: JobFormInput) {
    const payload = {
      ...input,
      responsibilities: toLines(input.responsibilities),
      requirements: toLines(input.requirements),
      benefits: toLines(input.benefits),
    }
    await api.post('/employer/jobs', payload)
  },
  async updateJob(id: string, input: JobFormInput) {
    const payload = {
      ...input,
      responsibilities: toLines(input.responsibilities),
      requirements: toLines(input.requirements),
      benefits: toLines(input.benefits),
    }
    await api.put(`/employer/jobs/${id}`, payload)
  },
  async duplicateJob(id: string) {
    await api.post(`/employer/jobs/${id}/duplicate`)
  },
  async setJobStatus(id: string, status: EmployerJobStatus) {
    await api.patch(`/employer/jobs/${id}/status`, { status })
  },
  async deleteJob(id: string) {
    await api.delete(`/employer/jobs/${id}`)
  },
  async listApplicants(params: ApplicantFilter) {
    return z.array(applicantSchema).parse((await api.get('/employer/applicants', { params })).data)
  },
  async updateApplicantStage(id: string, stage: RecruitmentStage) {
    await api.patch(`/employer/applicants/${id}/stage`, { stage })
  },
  async saveApplicantNote(id: string, notes: string) {
    await api.put(`/employer/applicants/${id}/notes`, { notes })
  },
  async toggleFavorite(id: string, favorite: boolean) {
    await api.patch(`/employer/applicants/${id}/favorite`, { favorite })
  },
  async listInterviews() {
    return z.array(employerInterviewSchema).parse((await api.get('/employer/interviews')).data)
  },
  async createInterview(input: ScheduleInterviewInput) {
    await api.post('/employer/interviews', input)
  },
  async updateInterview(id: string, input: ScheduleInterviewInput) {
    await api.put(`/employer/interviews/${id}`, input)
  },
  async cancelInterview(id: string) {
    await api.post(`/employer/interviews/${id}/cancel`)
  },
}

