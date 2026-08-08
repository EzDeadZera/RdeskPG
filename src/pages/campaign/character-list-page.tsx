import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, ScrollText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { CharacterFormDialog } from '@/features/characters/components/character-form-dialog'
import { useCharacters, useCreateCharacter } from '@/features/characters/hooks/use-characters'
import type { CharacterInput } from '@/features/characters/schemas'

export function CharacterListPage() {
  const { libraryId, campaignId } = useParams<{ libraryId: string; campaignId: string }>()
  const navigate = useNavigate()
  const { data: characters, isLoading } = useCharacters(campaignId ?? '')
  const createCharacter = useCreateCharacter(campaignId ?? '')
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleCreate(input: CharacterInput) {
    const created = await createCharacter.mutateAsync(input)
    navigate(`/bibliotecas/${libraryId}/campanhas/${campaignId}/personagens/${created.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Personagens</h1>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          Novo personagem
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : !characters || characters.length === 0 ? (
        <EmptyState icon={ScrollText} title="Nenhum personagem ainda" description="Crie o primeiro pra essa campanha." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <Card
              key={character.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => navigate(`/bibliotecas/${libraryId}/campanhas/${campaignId}/personagens/${character.id}`)}
            >
              <CardContent className="p-4">
                <p className="font-medium truncate">{character.nome}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {[character.classe, character.raca, character.nivel && `nível ${character.nivel}`]
                    .filter(Boolean)
                    .join(' · ') || 'Sem detalhes'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CharacterFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />
    </div>
  )
}
