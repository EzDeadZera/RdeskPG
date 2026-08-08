import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBestiaryEntry,
  createNpc,
  deleteBestiaryEntry,
  deleteNpc,
  listBestiary,
  listNpcs,
} from '@/features/master/services/master-service'
import type { BestiaryEntryInput, NpcInput } from '@/features/master/schemas'

export function useNpcs(campaignId: string) {
  return useQuery({ queryKey: ['npcs', campaignId], queryFn: () => listNpcs(campaignId) })
}

export function useCreateNpc(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NpcInput) => createNpc(campaignId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['npcs', campaignId] }),
  })
}

export function useDeleteNpc(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNpc(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['npcs', campaignId] }),
  })
}

export function useBestiary(campaignId: string) {
  return useQuery({ queryKey: ['bestiary', campaignId], queryFn: () => listBestiary(campaignId) })
}

export function useCreateBestiaryEntry(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BestiaryEntryInput) => createBestiaryEntry(campaignId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bestiary', campaignId] }),
  })
}

export function useDeleteBestiaryEntry(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBestiaryEntry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bestiary', campaignId] }),
  })
}
