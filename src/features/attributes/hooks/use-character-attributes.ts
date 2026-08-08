import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listCharacterAttributes,
  updateCharacterAttribute,
} from '@/features/attributes/services/character-attribute-service'

const KEY = 'character-attributes'

export function useCharacterAttributes(characterId: string) {
  return useQuery({ queryKey: [KEY, characterId], queryFn: () => listCharacterAttributes(characterId) })
}

export function useUpdateCharacterAttribute(characterId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ attributeId, patch }: { attributeId: string; patch: { valor?: number; valor_manual?: number | null } }) =>
      updateCharacterAttribute(characterId, attributeId, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, characterId] }),
  })
}
