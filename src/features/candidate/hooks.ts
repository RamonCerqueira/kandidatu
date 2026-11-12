import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  applicationService, candidateService, curriculumService, interviewService, notificationService,
} from '../../services/candidates/candidateService'
import type { Curriculum, Profile } from '../../schemas/candidate'

export const useDashboard = () => useQuery({ queryKey: ['cand', 'dashboard'], queryFn: candidateService.dashboard })
export const useProfile = () => useQuery({ queryKey: ['cand', 'profile'], queryFn: candidateService.getProfile })
export const useSavedJobs = () => useQuery({ queryKey: ['cand', 'saved'], queryFn: candidateService.savedJobs })
export const useApplications = () => useQuery({ queryKey: ['cand', 'applications'], queryFn: applicationService.list })
export const useInterviews = () => useQuery({ queryKey: ['cand', 'interviews'], queryFn: interviewService.listMine })
export const useNotifications = () => useQuery({ queryKey: ['notifications'], queryFn: notificationService.list })
export const useCurriculum = () => useQuery({ queryKey: ['cand', 'curriculum'], queryFn: curriculumService.get })

export function useSaveProfile() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (p: Profile) => candidateService.saveProfile(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['cand'] }) })
}
export function useSaveCurriculum() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (c: Curriculum) => curriculumService.save(c), onSuccess: () => qc.invalidateQueries({ queryKey: ['cand', 'curriculum'] }) })
}
export function useApply() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (jobId: string) => applicationService.apply(jobId), onSuccess: () => qc.invalidateQueries({ queryKey: ['cand'] }) })
}
export function useToggleSaved() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, saved }: { jobId: string; saved: boolean }) => (saved ? candidateService.unsaveJob(jobId) : candidateService.saveJob(jobId)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cand', 'saved'] }),
  })
}
export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => notificationService.markRead(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) })
}

