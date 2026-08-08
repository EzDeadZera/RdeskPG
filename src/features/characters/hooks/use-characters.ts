import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import {
  createCharacter,
  deleteCharacter,
  getCharacter,
  listCharacters,
  updateCharacter,
  updateCharacterNotes,
} from '@/features/characters/services/character-service'
import type { CharacterInput } from '@/features/characters/schemas'

const KEY = 'characters'

export function useCharacters(campaignId: string) {
  return useQuery({ queryKey: [KEY, campaignId], queryFn: () => listCharacters(campaignId) })
}

export function useCharacter(id: string | undefined) {
  return useQuery({ queryKey: [KEY, 'one', id], queryFn: () => getCharacter(id as string), enabled: Boolean(id) })
}

export function useCreateCharacter(campaignId: string) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: (input: CharacterInput) => createCharacter(campaignId, input, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, campaignId] }),
  })
}

export function useUpdateCharacter(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CharacterInput) => updateCharacter(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, 'one', id] }),
  })
}

export function useUpdateCharacterNotes(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (anotacoes: string) => updateCharacterNotes(id, anotacoes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, 'one', id] }),
  })
}

export function useDeleteCharacter(campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCharacter(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, campaignId] }),
  })
}
