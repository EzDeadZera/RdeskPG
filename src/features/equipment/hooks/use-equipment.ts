import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  equipItem,
  listCharacterEquipment,
  listEquipmentSlots,
} from '@/features/equipment/services/equipment-service'

export function useEquipmentSlots(libraryId: string) {
  return useQuery({ queryKey: ['equipment-slots', libraryId], queryFn: () => listEquipmentSlots(libraryId) })
}

export function useCharacterEquipment(characterId: string) {
  return useQuery({ queryKey: ['equipment', characterId], queryFn: () => listCharacterEquipment(characterId) })
}

export function useEquipItem(characterId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ slotId, itemId }: { slotId: string; itemId: string | null }) =>
      equipItem(characterId, slotId, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipment', characterId] }),
  })
}
