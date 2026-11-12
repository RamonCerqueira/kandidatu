import { z } from 'zod'
import { api } from '../api/client'
import {
  applicationSchema, curriculumSchema, dashboardSchema, interviewSchema, notificationSchema, profileSchema,
  type Curriculum, type Profile,
} from '../../schemas/candidate'
import { jobSchema } from '../../schemas/job'

// PROPOSTA de contratos — ver docs/API.md
export const candidateService = {
  async dashboard() { return dashboardSchema.parse((await api.get('/candidate/dashboard')).data) },
  async getProfile() { return profileSchema.parse((await api.get('/candidate/profile')).data) },
  async saveProfile(p: Profile) { await api.put('/candidate/profile', p) },
  async uploadPhoto(file: File): Promise<string> {
    const fd = new FormData(); fd.append('file', file)
    return z.object({ url: z.string() }).parse((await api.post('/candidate/profile/photo', fd)).data).url
  },
  async savedJobs() { return z.array(jobSchema).parse((await api.get('/candidate/saved-jobs')).data) },
  async saveJob(jobId: string) { await api.put(`/candidate/saved-jobs/${jobId}`) },
  async unsaveJob(jobId: string) { await api.delete(`/candidate/saved-jobs/${jobId}`) },
}

export const curriculumService = {
  async get(): Promise<Curriculum | null> {
    const { data } = await api.get('/candidate/curriculum')
    return data ? curriculumSchema.parse(data) : null
  },
  async save(c: Curriculum) { await api.put('/candidate/curriculum', c) },
}

export const applicationService = {
  async list() { return z.array(applicationSchema).parse((await api.get('/candidate/applications')).data) },
  async apply(jobId: string) { await api.post('/applications', { jobId }) },
  async cancel(id: string) { await api.post(`/candidate/applications/${id}/cancel`) },
}

export const interviewService = {
  async listMine() { return z.array(interviewSchema).parse((await api.get('/candidate/interviews')).data) },
}

export const notificationService = {
  async list() { return z.array(notificationSchema).parse((await api.get('/notifications')).data) },
  async markRead(id: string) { await api.post(`/notifications/${id}/read`) },
}

