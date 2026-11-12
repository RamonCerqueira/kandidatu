import { z } from 'zod'
import { api } from '../api/client'
import {
  abuseReportSchema, adminOverviewSchema, adminUserSchema, commercialPlanSchema, locationItemSchema,
  moderationCompanySchema, moderationJobSchema, paymentRecordSchema, platformSettingsSchema, taxonomyItemSchema,
  type CommercialPlan, type PlatformSettings,
} from '../../schemas/admin'

// PROPOSTA de contratos — ver docs/API.md
export const adminService = {
  async overview() {
    return adminOverviewSchema.parse((await api.get('/admin/overview')).data)
  },
  async listUsers(role?: 'CANDIDATE' | 'COMPANY' | 'ADMIN') {
    return z.array(adminUserSchema).parse((await api.get('/admin/users', { params: { role } })).data)
  },
  async toggleUserActive(id: string, active: boolean) {
    await api.patch(`/admin/users/${id}/active`, { active })
  },
  async listCompanies(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return z.array(moderationCompanySchema).parse((await api.get('/admin/companies', { params: { status } })).data)
  },
  async moderateCompany(id: string, decision: 'APPROVED' | 'REJECTED', verified: boolean) {
    await api.post(`/admin/companies/${id}/moderate`, { decision, verified })
  },
  async listJobs(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return z.array(moderationJobSchema).parse((await api.get('/admin/jobs', { params: { status } })).data)
  },
  async moderateJob(id: string, decision: 'APPROVED' | 'REJECTED') {
    await api.post(`/admin/jobs/${id}/moderate`, { decision })
  },
  async listCategories() {
    return z.array(taxonomyItemSchema).parse((await api.get('/admin/categories')).data)
  },
  async createCategory(name: string) {
    await api.post('/admin/categories', { name })
  },
  async deleteCategory(id: string) {
    await api.delete(`/admin/categories/${id}`)
  },
  async listAreas() {
    return z.array(taxonomyItemSchema).parse((await api.get('/admin/areas')).data)
  },
  async createArea(name: string) {
    await api.post('/admin/areas', { name })
  },
  async deleteArea(id: string) {
    await api.delete(`/admin/areas/${id}`)
  },
  async listLocations() {
    return z.array(locationItemSchema).parse((await api.get('/admin/locations')).data)
  },
  async createLocation(region: string, sectorName: string) {
    await api.post('/admin/locations', { region, sectorName })
  },
  async deleteLocation(id: string) {
    await api.delete(`/admin/locations/${id}`)
  },
  async listReports() {
    return z.array(abuseReportSchema).parse((await api.get('/admin/reports')).data)
  },
  async resolveReport(id: string, status: 'RESOLVED' | 'DISMISSED') {
    await api.patch(`/admin/reports/${id}`, { status })
  },
  async listPlans() {
    return z.array(commercialPlanSchema).parse((await api.get('/admin/plans')).data)
  },
  async savePlan(plan: Omit<CommercialPlan, 'id'> & { id?: string }) {
    if (plan.id) await api.put(`/admin/plans/${plan.id}`, plan)
    else await api.post('/admin/plans', plan)
  },
  async listPayments() {
    return z.array(paymentRecordSchema).parse((await api.get('/admin/payments')).data)
  },
  async getSettings() {
    return platformSettingsSchema.parse((await api.get('/admin/settings')).data)
  },
  async saveSettings(s: PlatformSettings) {
    await api.put('/admin/settings', s)
  },
}

