import { useState } from 'react'
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { BookFormDialog } from '@/features/books/components/book-form-dialog'
import { useBooks, useCreateBook, useDeleteBook, useUpdateBook } from '@/features/books/hooks/use-books'
import type { Book } from '@/features/books/services/book-service'
import type { BookInput } from '@/features/books/schemas'

export function BookList({ libraryId }: { libraryId: string }) {
  const { data: books, isLoading } = useBooks(libraryId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Book | undefined>()

  const createBook = useCreateBook(libraryId)
  const updateBook = useUpdateBook(libraryId, editing?.id ?? '')
  const deleteBook = useDeleteBook(libraryId)

  function openCreate() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(book: Book) {
    setEditing(book)
    setDialogOpen(true)
  }

  async function handleSubmit(input: BookInput) {
    if (editing) {
      await updateBook.mutateAsync(input)
    } else {
      await createBook.mutateAsync(input)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Novo livro
        </Button>
      </div>

      {!books || books.length === 0 ? (
        <EmptyState icon={BookOpen} title="Nenhum livro ainda" description="Livros de referência dessa biblioteca." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {books.map((book) => (
            <Card key={book.id}>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{book.nome}</p>
                  <p className="truncate text-sm text-muted-foreground">{book.autor || 'Autor desconhecido'}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(book)} aria-label="Editar">
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteBook.mutate(book.id)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BookFormDialog open={dialogOpen} onOpenChange={setDialogOpen} book={editing} onSubmit={handleSubmit} />
    </div>
  )
}
