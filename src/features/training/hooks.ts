import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trainingService } from '../../services/training/trainingService'
import type { CreateFreeCourseInput, CreateSponsoredAdInput } from '../../schemas/training'

export const useFreeCourses = () =>
  useQuery({ queryKey: ['training', 'free'], queryFn: trainingService.listFreeCourses })

export const useFreeCourse = (slug: string) =>
  useQuery({ queryKey: ['training', 'free', slug], queryFn: () => trainingService.getFreeCourseBySlug(slug), enabled: !!slug })

export const useSponsoredAds = () =>
  useQuery({ queryKey: ['training', 'ads'], queryFn: trainingService.listSponsoredAds })

export function useTrainingAdminActions() {
  const qc = useQueryClient()
  const invFree = () => qc.invalidateQueries({ queryKey: ['training', 'free'] })
  const invAds = () => qc.invalidateQueries({ queryKey: ['training', 'ads'] })

  return {
    createCourse: useMutation({ mutationFn: (i: CreateFreeCourseInput) => trainingService.createFreeCourse(i), onSuccess: invFree }),
    deleteCourse: useMutation({ mutationFn: (id: string) => trainingService.deleteFreeCourse(id), onSuccess: invFree }),
    createAd: useMutation({ mutationFn: (i: CreateSponsoredAdInput) => trainingService.createSponsoredAd(i), onSuccess: invAds }),
    toggleAd: useMutation({
      mutationFn: ({ id, active }: { id: string; active: boolean }) => trainingService.toggleSponsoredAd(id, active),
      onSuccess: invAds,
    }),
    deleteAd: useMutation({ mutationFn: (id: string) => trainingService.deleteSponsoredAd(id), onSuccess: invAds }),
  }
}

