import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createItem, deleteItem, listItems, updateItem } from '@/features/inventory/services/item-service'
import type { ItemInput } from '@/features/inventory/schemas'

const KEY = 'items'

export function useItems(characterId: string) {
  return useQuery({ queryKey: [KEY, characterId], queryFn: () => listItems(characterId) })
}

export function useCreateItem(characterId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ItemInput) => createItem(characterId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, characterId] }),
  })
}

export function useUpdateItem(characterId: string, id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ItemInput) => updateItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, characterId] })
      queryClient.invalidateQueries({ queryKey: ['equipment', characterId] })
    },
  })
}

export function useDeleteItem(characterId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, characterId] })
      queryClient.invalidateQueries({ queryKey: ['equipment', characterId] })
    },
  })
}
