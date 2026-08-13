import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Library, Loader2, Plus, Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LibraryFormDialog } from '@/features/libraries/components/library-form-dialog'
import { useCreateLibrary, useLibraries, useSeedExampleLibraries } from '@/features/libraries/hooks/use-libraries'
import type { LibraryInput } from '@/features/libraries/schemas'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: libraries, isLoading } = useLibraries()
  const createLibrary = useCreateLibrary()
  const seedExamples = useSeedExampleLibraries()
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleCreate(input: LibraryInput) {
    const created = await createLibrary.mutateAsync(input)
    navigate(`/bibliotecas/${created.id}`)
  }

  async function handleSeedExamples() {
    const result = await seedExamples.mutateAsync()
    if (result.created.length > 0) {
      toast.success(`Adicionadas: ${result.created.join(', ')}`)
    }
    if (result.skipped.length > 0) {
      toast.info(`Já existiam (não duplicadas): ${result.skipped.join(', ')}`)
    }
  }

  const seedButton = (
    <Button variant="outline" className="gap-2" onClick={handleSeedExamples} disabled={seedExamples.isPending}>
      {seedExamples.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
      Bibliotecas de exemplo
    </Button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Suas bibliotecas</h1>
          <p className="text-sm text-muted-foreground">Cada biblioteca é um sistema de RPG com suas próprias regras.</p>
        </div>
        {libraries && libraries.length > 0 && (
          <div className="flex gap-2">
            {seedButton}
            <Button className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              Nova Biblioteca
            </Button>
          </div>
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
          description="Crie a sua do zero, ou carregue Ordem Paranormal, Call of Cthulhu e D&D 5e já prontas, com atributos e fórmulas configurados."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {seedButton}
              <Button className="gap-2" onClick={() => setDialogOpen(true)}>
                <Plus className="size-4" />
                Nova Biblioteca
              </Button>
            </div>
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
