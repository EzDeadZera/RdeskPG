import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAttribute,
  deleteAttribute,
  listAttributes,
  updateAttribute,
} from '@/features/attributes/services/attribute-service'
import type { AttributeInput } from '@/features/attributes/schemas'

const KEY = 'attributes'

export function useAttributes(libraryId: string) {
  return useQuery({ queryKey: [KEY, libraryId], queryFn: () => listAttributes(libraryId) })
}

export function useCreateAttribute(libraryId: string, nextOrdem: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AttributeInput) => createAttribute(libraryId, input, nextOrdem),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, libraryId] }),
  })
}

export function useUpdateAttribute(libraryId: string, id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AttributeInput) => updateAttribute(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, libraryId] }),
  })
}

export function useDeleteAttribute(libraryId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAttribute(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, libraryId] }),
  })
}
