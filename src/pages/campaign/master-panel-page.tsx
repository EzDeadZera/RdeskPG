import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Ghost, Plus, Skull, Trash2, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { useCharacters } from '@/features/characters/hooks/use-characters'
import {
  useBestiary,
  useCreateBestiaryEntry,
  useCreateNpc,
  useDeleteBestiaryEntry,
  useDeleteNpc,
  useNpcs,
} from '@/features/master/hooks/use-master'
import { NpcFormDialog } from '@/features/master/components/npc-form-dialog'
import { BestiaryFormDialog } from '@/features/master/components/bestiary-form-dialog'

export function MasterPanelPage() {
  const { libraryId, campaignId } = useParams<{ libraryId: string; campaignId: string }>()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Painel do mestre</h1>

      <Tabs defaultValue="personagens">
        <TabsList>
          <TabsTrigger value="personagens">Personagens</TabsTrigger>
          <TabsTrigger value="npcs">NPCs</TabsTrigger>
          <TabsTrigger value="monstros">Monstros</TabsTrigger>
          <TabsTrigger value="bosses">Bosses</TabsTrigger>
        </TabsList>

        <TabsContent value="personagens">
          {campaignId && libraryId && <PlayerCharactersReadOnly libraryId={libraryId} campaignId={campaignId} />}
        </TabsContent>
        <TabsContent value="npcs">{campaignId && <NpcsTab campaignId={campaignId} />}</TabsContent>
        <TabsContent value="monstros">
          {campaignId && <BestiaryTab campaignId={campaignId} tipo="monstro" />}
        </TabsContent>
        <TabsContent value="bosses">{campaignId && <BestiaryTab campaignId={campaignId} tipo="boss" />}</TabsContent>
      </Tabs>
    </div>
  )
}

function PlayerCharactersReadOnly({ libraryId, campaignId }: { libraryId: string; campaignId: string }) {
  const { data: characters, isLoading } = useCharacters(campaignId)

  if (isLoading) return <Skeleton className="h-24 w-full" />
  if (!characters || characters.length === 0) {
    return <EmptyState icon={Users} title="Nenhum personagem na campanha ainda" />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {characters.map((character) => (
        <Link key={character.id} to={`/bibliotecas/${libraryId}/campanhas/${campaignId}/personagens/${character.id}`}>
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="p-4">
              <p className="font-medium truncate">{character.nome}</p>
              <p className="text-sm text-muted-foreground truncate">
                {[character.classe, character.raca].filter(Boolean).join(' · ') || 'Sem detalhes'}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function NpcsTab({ campaignId }: { campaignId: string }) {
  const { data: npcs, isLoading } = useNpcs(campaignId)
  const createNpc = useCreateNpc(campaignId)
  const deleteNpc = useDeleteNpc(campaignId)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (isLoading) return <Skeleton className="h-24 w-full" />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          Novo NPC
        </Button>
      </div>
      {!npcs || npcs.length === 0 ? (
        <EmptyState icon={Ghost} title="Nenhum NPC ainda" />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {npcs.map((npc) => (
            <div key={npc.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{npc.nome}</p>
                {npc.descricao && <p className="truncate text-xs text-muted-foreground">{npc.descricao}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => deleteNpc.mutate(npc.id)}
                aria-label="Excluir"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <NpcFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={async (input) => {
          await createNpc.mutateAsync(input)
        }}
      />
    </div>
  )
}

function BestiaryTab({ campaignId, tipo }: { campaignId: string; tipo: 'monstro' | 'boss' }) {
  const { data: entries, isLoading } = useBestiary(campaignId)
  const createEntry = useCreateBestiaryEntry(campaignId)
  const deleteEntry = useDeleteBestiaryEntry(campaignId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const filtered = (entries ?? []).filter((e) => e.tipo === tipo)

  if (isLoading) return <Skeleton className="h-24 w-full" />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          {tipo === 'boss' ? 'Novo boss' : 'Novo monstro'}
        </Button>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Skull} title={tipo === 'boss' ? 'Nenhum boss ainda' : 'Nenhum monstro ainda'} />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {filtered.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{entry.nome}</p>
                {entry.descricao && <p className="truncate text-xs text-muted-foreground">{entry.descricao}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => deleteEntry.mutate(entry.id)}
                aria-label="Excluir"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <BestiaryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultTipo={tipo}
        onSubmit={async (input) => {
          await createEntry.mutateAsync(input)
        }}
      />
    </div>
  )
}
