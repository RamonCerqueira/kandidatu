import { api } from '../api/client'
import { jobSchema, pageSchema, type Job, type JobSearch } from '../../schemas/job'

const jobPage = pageSchema(jobSchema)

// PROPOSTA de contrato — ver docs/API.md. Depende de confirmação do backend.
export const jobService = {
  async search(params: Partial<JobSearch>) {
    const { data } = await api.get('/jobs', { params })
    return jobPage.parse(data)
  },
  async getById(id: string): Promise<Job> {
    const { data } = await api.get(`/jobs/${id}`)
    return jobSchema.parse(data)
  },
}

