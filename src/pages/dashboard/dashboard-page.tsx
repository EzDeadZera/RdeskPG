import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Library, Plus } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LibraryFormDialog } from '@/features/libraries/components/library-form-dialog'
import { useCreateLibrary, useLibraries } from '@/features/libraries/hooks/use-libraries'
import type { LibraryInput } from '@/features/libraries/schemas'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: libraries, isLoading } = useLibraries()
  const createLibrary = useCreateLibrary()
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleCreate(input: LibraryInput) {
    const created = await createLibrary.mutateAsync(input)
    navigate(`/bibliotecas/${created.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Suas bibliotecas</h1>
          <p className="text-sm text-muted-foreground">Cada biblioteca é um sistema de RPG com suas próprias regras.</p>
        </div>
        {libraries && libraries.length > 0 && (
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Nova Biblioteca
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : !libraries || libraries.length === 0 ? (
        <EmptyState
          icon={Library}
          title="Nenhuma biblioteca ainda"
          description="Crie a primeira pra começar a configurar atributos, livros e campanhas."
          action={
            <Button className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              Nova Biblioteca
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {libraries.map((library) => (
            <Card
              key={library.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => navigate(`/bibliotecas/${library.id}`)}
            >
              <CardContent className="p-5">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Library className="size-5" />
                </div>
                <p className="font-medium truncate">{library.nome}</p>
                <p className="text-sm text-muted-foreground truncate">{library.sistema || 'Sistema personalizado'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LibraryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />
    </div>
  )
}
