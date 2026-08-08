import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import {
  createLibrary,
  deleteLibrary,
  getLibrary,
  listLibraries,
  updateLibrary,
} from '@/features/libraries/services/library-service'
import type { LibraryInput } from '@/features/libraries/schemas'

const KEY = 'libraries'

export function useLibraries() {
  return useQuery({ queryKey: [KEY], queryFn: listLibraries })
}

export function useLibrary(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => getLibrary(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateLibrary() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: (input: LibraryInput) => createLibrary(input, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  })
}

export function useUpdateLibrary(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LibraryInput) => updateLibrary(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] })
      queryClient.invalidateQueries({ queryKey: [KEY, id] })
    },
  })
}

export function useDeleteLibrary() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteLibrary(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  })
}
