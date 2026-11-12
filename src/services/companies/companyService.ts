import { api } from '../api/client'
import { companySchema, statsSchema, type Company, type ContactInput } from '../../schemas/company'
import { pageSchema } from '../../schemas/job'

export interface CompanySearch { q?: string; sector?: string; region?: string; verified?: boolean; page?: number }

// PROPOSTA de contrato — ver docs/API.md
export const companyService = {
  async search(params: CompanySearch) {
    const { data } = await api.get('/companies', { params })
    return pageSchema(companySchema).parse(data)
  },
  async getById(id: string): Promise<Company> {
    const { data } = await api.get(`/companies/${id}`)
    return companySchema.parse(data)
  },
  async stats() {
    const { data } = await api.get('/stats')
    return statsSchema.parse(data)
  },
  async sendContact(input: ContactInput): Promise<void> {
    await api.post('/contact', input)
  },
}
