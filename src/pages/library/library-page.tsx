import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LibraryFormDialog } from '@/features/libraries/components/library-form-dialog'
import { useLibrary, useUpdateLibrary, useDeleteLibrary } from '@/features/libraries/hooks/use-libraries'
import type { LibraryInput } from '@/features/libraries/schemas'
import { AttributeList } from '@/features/attributes/components/attribute-list'
import { BookList } from '@/features/books/components/book-list'
import { CampaignList } from '@/features/campaigns/components/campaign-list'

export function LibraryPage() {
  const { libraryId } = useParams<{ libraryId: string }>()
  const navigate = useNavigate()
  const { data: library, isLoading } = useLibrary(libraryId)
  const updateLibrary = useUpdateLibrary(libraryId ?? '')
  const deleteLibrary = useDeleteLibrary()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading || !library) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  async function handleUpdate(input: LibraryInput) {
    await updateLibrary.mutateAsync(input)
  }

  async function handleDelete() {
    if (!libraryId) return
    if (!confirm(`Excluir "${library!.nome}"? Isso remove atributos, livros e campanhas junto.`)) return
    await deleteLibrary.mutateAsync(libraryId)
    navigate('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{library.nome}</h1>
          <p className="text-sm text-muted-foreground">{library.sistema || 'Sistema personalizado'}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="icon" onClick={() => setEditOpen(true)} aria-label="Editar biblioteca">
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
            aria-label="Excluir biblioteca"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="informacoes">
        <TabsList>
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="atributos">Atributos</TabsTrigger>
          <TabsTrigger value="livros">Livros</TabsTrigger>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-3">
          <InfoRow label="Descrição" value={library.descricao} />
          <InfoRow label="Livro base" value={library.livro_base} />
          <InfoRow label="Imagem" value={library.imagem_url} />
        </TabsContent>

        <TabsContent value="atributos">
          <AttributeList libraryId={library.id} />
        </TabsContent>

        <TabsContent value="livros">
          <BookList libraryId={library.id} />
        </TabsContent>

        <TabsContent value="campanhas">
          <CampaignList libraryId={library.id} />
        </TabsContent>
      </Tabs>

      <LibraryFormDialog open={editOpen} onOpenChange={setEditOpen} library={library} onSubmit={handleUpdate} />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value || '—'}</p>
    </div>
  )
}
