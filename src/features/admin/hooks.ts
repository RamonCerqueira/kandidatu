import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/admin/adminService'
import type { CommercialPlan, PlatformSettings } from '../../schemas/admin'

export const useAdminOverview = () => useQuery({ queryKey: ['adm', 'overview'], queryFn: adminService.overview })
export const useAdminUsers = (role?: 'CANDIDATE' | 'COMPANY' | 'ADMIN') =>
  useQuery({ queryKey: ['adm', 'users', role], queryFn: () => adminService.listUsers(role) })
export const useAdminCompanies = (status?: 'PENDING' | 'APPROVED' | 'REJECTED') =>
  useQuery({ queryKey: ['adm', 'companies', status], queryFn: () => adminService.listCompanies(status) })
export const useAdminJobs = (status?: 'PENDING' | 'APPROVED' | 'REJECTED') =>
  useQuery({ queryKey: ['adm', 'jobs', status], queryFn: () => adminService.listJobs(status) })
export const useAdminCategories = () => useQuery({ queryKey: ['adm', 'categories'], queryFn: adminService.listCategories })
export const useAdminAreas = () => useQuery({ queryKey: ['adm', 'areas'], queryFn: adminService.listAreas })
export const useAdminLocations = () => useQuery({ queryKey: ['adm', 'locations'], queryFn: adminService.listLocations })
export const useAdminReports = () => useQuery({ queryKey: ['adm', 'reports'], queryFn: adminService.listReports })
export const useAdminPlans = () => useQuery({ queryKey: ['adm', 'plans'], queryFn: adminService.listPlans })
export const useAdminPayments = () => useQuery({ queryKey: ['adm', 'payments'], queryFn: adminService.listPayments })
export const useAdminSettings = () => useQuery({ queryKey: ['adm', 'settings'], queryFn: adminService.getSettings })

export function useAdminActions() {
  const qc = useQueryClient()
  const inv = (k: string) => () => qc.invalidateQueries({ queryKey: ['adm', k] })
  return {
    toggleUser: useMutation({ mutationFn: ({ id, active }: { id: string; active: boolean }) => adminService.toggleUserActive(id, active), onSuccess: inv('users') }),
    moderateCompany: useMutation({
      mutationFn: ({ id, decision, verified }: { id: string; decision: 'APPROVED' | 'REJECTED'; verified: boolean }) =>
        adminService.moderateCompany(id, decision, verified),
      onSuccess: inv('companies'),
    }),
    moderateJob: useMutation({
      mutationFn: ({ id, decision }: { id: string; decision: 'APPROVED' | 'REJECTED' }) => adminService.moderateJob(id, decision),
      onSuccess: inv('jobs'),
    }),
    addCategory: useMutation({ mutationFn: (name: string) => adminService.createCategory(name), onSuccess: inv('categories') }),
    delCategory: useMutation({ mutationFn: (id: string) => adminService.deleteCategory(id), onSuccess: inv('categories') }),
    addArea: useMutation({ mutationFn: (name: string) => adminService.createArea(name), onSuccess: inv('areas') }),
    delArea: useMutation({ mutationFn: (id: string) => adminService.deleteArea(id), onSuccess: inv('areas') }),
    addLocation: useMutation({ mutationFn: ({ region, sectorName }: { region: string; sectorName: string }) => adminService.createLocation(region, sectorName), onSuccess: inv('locations') }),
    delLocation: useMutation({ mutationFn: (id: string) => adminService.deleteLocation(id), onSuccess: inv('locations') }),
    resolveReport: useMutation({ mutationFn: ({ id, status }: { id: string; status: 'RESOLVED' | 'DISMISSED' }) => adminService.resolveReport(id, status), onSuccess: inv('reports') }),
    savePlan: useMutation({ mutationFn: (p: Omit<CommercialPlan, 'id'> & { id?: string }) => adminService.savePlan(p), onSuccess: inv('plans') }),
    saveSettings: useMutation({ mutationFn: (s: PlatformSettings) => adminService.saveSettings(s), onSuccess: inv('settings') }),
  }
}

