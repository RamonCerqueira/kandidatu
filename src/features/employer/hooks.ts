import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employerService, type ApplicantFilter } from '../../services/companies/employerService'
import type { EmployerJobStatus, EmployerProfile, JobFormInput, RecruitmentStage, ScheduleInterviewInput } from '../../schemas/employer'

export const useEmployerDashboard = () => useQuery({ queryKey: ['emp', 'dashboard'], queryFn: employerService.dashboard })
export const useEmployerProfile = () => useQuery({ queryKey: ['emp', 'profile'], queryFn: employerService.getProfile })
export const useEmployerJobs = () => useQuery({ queryKey: ['emp', 'jobs'], queryFn: employerService.listJobs })
export const useApplicants = (f: ApplicantFilter) => useQuery({ queryKey: ['emp', 'applicants', f], queryFn: () => employerService.listApplicants(f) })
export const useEmployerInterviews = () => useQuery({ queryKey: ['emp', 'interviews'], queryFn: employerService.listInterviews })

export function useSaveEmployerProfile() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (p: EmployerProfile) => employerService.saveProfile(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['emp', 'profile'] }) })
}

export function useSaveJob(jobId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: JobFormInput) => (jobId ? employerService.updateJob(jobId, input) : employerService.createJob(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emp', 'jobs'] }),
  })
}

export function useJobActions() {
  const qc = useQueryClient()
  const inv = () => qc.invalidateQueries({ queryKey: ['emp', 'jobs'] })
  return {
    duplicate: useMutation({ mutationFn: (id: string) => employerService.duplicateJob(id), onSuccess: inv }),
    setStatus: useMutation({ mutationFn: ({ id, status }: { id: string; status: EmployerJobStatus }) => employerService.setJobStatus(id, status), onSuccess: inv }),
    remove: useMutation({ mutationFn: (id: string) => employerService.deleteJob(id), onSuccess: inv }),
  }
}

export function useApplicantActions() {
  const qc = useQueryClient()
  const inv = () => qc.invalidateQueries({ queryKey: ['emp', 'applicants'] })
  return {
    setStage: useMutation({ mutationFn: ({ id, stage }: { id: string; stage: RecruitmentStage }) => employerService.updateApplicantStage(id, stage), onSuccess: inv }),
    saveNote: useMutation({ mutationFn: ({ id, notes }: { id: string; notes: string }) => employerService.saveApplicantNote(id, notes), onSuccess: inv }),
    toggleFav: useMutation({ mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) => employerService.toggleFavorite(id, favorite), onSuccess: inv }),
  }
}

export function useInterviewActions() {
  const qc = useQueryClient()
  const inv = () => qc.invalidateQueries({ queryKey: ['emp', 'interviews'] })
  return {
    create: useMutation({ mutationFn: (i: ScheduleInterviewInput) => employerService.createInterview(i), onSuccess: inv }),
    update: useMutation({ mutationFn: ({ id, data }: { id: string; data: ScheduleInterviewInput }) => employerService.updateInterview(id, data), onSuccess: inv }),
    cancel: useMutation({ mutationFn: (id: string) => employerService.cancelInterview(id), onSuccess: inv }),
  }
}

