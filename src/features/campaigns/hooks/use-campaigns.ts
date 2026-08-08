import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import {
  addMemberByUsername,
  createCampaign,
  deleteCampaign,
  getCampaign,
  listCampaigns,
  listMembers,
  removeMember,
} from '@/features/campaigns/services/campaign-service'
import type { CampaignInput } from '@/features/campaigns/schemas'

const KEY = 'campaigns'
const MEMBERS_KEY = 'campaign-members'

export function useCampaigns(libraryId: string) {
  return useQuery({ queryKey: [KEY, libraryId], queryFn: () => listCampaigns(libraryId) })
}

export function useCampaign(id: string | undefined) {
  return useQuery({ queryKey: [KEY, 'one', id], queryFn: () => getCampaign(id as string), enabled: Boolean(id) })
}

export function useCreateCampaign(libraryId: string) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: (input: CampaignInput) => createCampaign(libraryId, input, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, libraryId] }),
  })
}

export function useDeleteCampaign(libraryId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, libraryId] }),
  })
}

export function useCampaignMembers(campaignId: string) {
  return useQuery({ queryKey: [MEMBERS_KEY, campaignId], queryFn: () => listMembers(campaignId) })
}

export function useAddMember(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (username: string) => addMemberByUsername(campaignId, username),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MEMBERS_KEY, campaignId] }),
  })
}

export function useRemoveMember(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => removeMember(campaignId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MEMBERS_KEY, campaignId] }),
  })
}
