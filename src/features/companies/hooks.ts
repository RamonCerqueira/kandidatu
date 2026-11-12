import { useQuery } from '@tanstack/react-query'
import { companyService, type CompanySearch } from '../../services/companies/companyService'

export const useCompanies = (p: CompanySearch) => useQuery({ queryKey: ['companies', p], queryFn: () => companyService.search(p) })
export const useCompany = (id: string) => useQuery({ queryKey: ['company', id], queryFn: () => companyService.getById(id), enabled: !!id })
export const useStats = () => useQuery({ queryKey: ['stats'], queryFn: () => companyService.stats() })

