import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBook, deleteBook, listBooks, updateBook } from '@/features/books/services/book-service'
import type { BookInput } from '@/features/books/schemas'

const KEY = 'books'

export function useBooks(libraryId: string) {
  return useQuery({ queryKey: [KEY, libraryId], queryFn: () => listBooks(libraryId) })
}

export function useCreateBook(libraryId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BookInput) => createBook(libraryId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, libraryId] }),
  })
}

export function useUpdateBook(libraryId: string, id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BookInput) => updateBook(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, libraryId] }),
  })
}

export function useDeleteBook(libraryId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, libraryId] }),
  })
}
