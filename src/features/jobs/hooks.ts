import { useQuery } from '@tanstack/react-query'
import { jobService } from '../../services/jobs/jobService'
import type { JobSearch } from '../../schemas/job'

export const useJobs = (params: Partial<JobSearch>) =>
  useQuery({ queryKey: ['jobs', params], queryFn: () => jobService.search(params) })

export const useJob = (id: string) =>
  useQuery({ queryKey: ['job', id], queryFn: () => jobService.getById(id), enabled: !!id })

