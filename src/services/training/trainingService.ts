import { z } from 'zod'
import { api } from '../api/client'
import {
  freeCourseSchema, sponsoredCourseAdSchema,
  type CreateFreeCourseInput, type CreateSponsoredAdInput, type FreeCourse, type SponsoredCourseAd,
} from '../../schemas/training'

// PROPOSTA de contratos — ver docs/API.md
export const trainingService = {
  async listFreeCourses(): Promise<FreeCourse[]> {
    const { data } = await api.get('/training/free-courses')
    return z.array(freeCourseSchema).parse(data)
  },
  async getFreeCourseBySlug(slug: string): Promise<FreeCourse> {
    const { data } = await api.get(`/training/free-courses/${slug}`)
    return freeCourseSchema.parse(data)
  },
  async listSponsoredAds(): Promise<SponsoredCourseAd[]> {
    const { data } = await api.get('/training/sponsored-ads')
    return z.array(sponsoredCourseAdSchema).parse(data)
  },
  async trackAdClick(id: string): Promise<void> {
    await api.post(`/training/sponsored-ads/${id}/click`)
  },
  // SuperAdmin endpoints
  async createFreeCourse(input: CreateFreeCourseInput): Promise<void> {
    await api.post('/admin/training/free-courses', input)
  },
  async deleteFreeCourse(id: string): Promise<void> {
    await api.delete(`/admin/training/free-courses/${id}`)
  },
  async createSponsoredAd(input: CreateSponsoredAdInput): Promise<void> {
    await api.post('/admin/training/sponsored-ads', input)
  },
  async toggleSponsoredAd(id: string, active: boolean): Promise<void> {
    await api.patch(`/admin/training/sponsored-ads/${id}/active`, { active })
  },
  async deleteSponsoredAd(id: string): Promise<void> {
    await api.delete(`/admin/training/sponsored-ads/${id}`)
  },
}

