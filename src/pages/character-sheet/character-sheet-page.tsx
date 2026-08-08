import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'
import { useCharacter, useDeleteCharacter, useUpdateCharacter } from '@/features/characters/hooks/use-characters'
import { CharacterFormDialog } from '@/features/characters/components/character-form-dialog'
import type { CharacterInput } from '@/features/characters/schemas'
import { CharacterAttributePanel } from '@/features/attributes/components/character-attribute-panel'
import { useAttributes } from '@/features/attributes/hooks/use-attributes'
import { ItemList } from '@/features/inventory/components/item-list'
import { EquipmentPanel } from '@/features/equipment/components/equipment-panel'
import { NotesEditor } from '@/features/characters/components/notes-editor'
import { useSkillLike } from '@/features/skills/hooks/use-skill-like'
import { SkillLikeFormDialog } from '@/features/skills/components/skill-like-form-dialog'
import type { SkillLikeTable, SkillLike } from '@/features/skills/services/skill-like-service'
import type { SkillLikeInput } from '@/features/skills/schemas'
import { EmptyState } from '@/components/common/empty-state'
import { Sparkles, Wand2, Pencil as PencilIcon, Trash2 as TrashIcon } from 'lucide-react'

export function CharacterSheetPage() {
  const { libraryId, campaignId, characterId } = useParams<{
    libraryId: string
    campaignId: string
    characterId: string
  }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: character, isLoading } = useCharacter(characterId)
  const { data: attributes } = useAttributes(libraryId ?? '')
  const updateCharacter = useUpdateCharacter(characterId ?? '')
  const deleteCharacter = useDeleteCharacter(campaignId ?? '')
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading || !character) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  const isOwner = character.user_id === user?.id

  async function handleUpdate(input: CharacterInput) {
    await updateCharacter.mutateAsync(input)
  }

  async function handleDelete() {
    if (!characterId) return
    if (!confirm(`Excluir "${character!.nome}"?`)) return
    await deleteCharacter.mutateAsync(characterId)
    navigate(`/bibliotecas/${libraryId}/campanhas/${campaignId}/personagens`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            <AvatarImage src={character.retrato_url ?? undefined} />
            <AvatarFallback className="text-lg">{character.nome.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{character.nome}</h1>
            <p className="text-sm text-muted-foreground">
              {[character.classe, character.raca, character.nivel && `nível ${character.nivel}`]
                .filter(Boolean)
                .join(' · ') || 'Sem detalhes'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {isOwner ? (
            <>
              <Button variant="outline" size="icon" onClick={() => setEditOpen(true)} aria-label="Editar">
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
                aria-label="Excluir"
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          ) : (
            <span className="self-center text-xs text-muted-foreground">Visualização do mestre</span>
          )}
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="atributos">Atributos</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="inventario">Inventário</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="magias">Magias</TabsTrigger>
          <TabsTrigger value="anotacoes">Anotações</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-3">
          <InfoRow label="Idade" value={character.idade} />
          <InfoRow label="Aparência" value={character.aparencia} />
          <InfoRow label="História" value={character.historia} />
        </TabsContent>

        <TabsContent value="atributos">
          {libraryId && characterId && <CharacterAttributePanel libraryId={libraryId} characterId={characterId} />}
        </TabsContent>

        <TabsContent value="skills">
          {characterId && <SkillLikeTab table="skills" characterId={characterId} label="Skill" emptyIcon={Sparkles} />}
        </TabsContent>

        <TabsContent value="inventario">
          {characterId && <ItemList characterId={characterId} attributes={attributes ?? []} />}
        </TabsContent>

        <TabsContent value="equipamentos">
          {libraryId && characterId && <EquipmentPanel libraryId={libraryId} characterId={characterId} />}
        </TabsContent>

        <TabsContent value="magias">
          {characterId && <SkillLikeTab table="spells" characterId={characterId} label="Magia" emptyIcon={Wand2} />}
        </TabsContent>

        <TabsContent value="anotacoes">
          {characterId && isOwner && <NotesEditor characterId={characterId} initialValue={character.anotacoes} />}
          {characterId && !isOwner && (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {character.anotacoes || 'Sem anotações.'}
            </p>
          )}
        </TabsContent>
      </Tabs>

      <CharacterFormDialog open={editOpen} onOpenChange={setEditOpen} character={character} onSubmit={handleUpdate} />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="whitespace-pre-wrap text-sm">{value || '—'}</p>
    </div>
  )
}

function SkillLikeTab({
  table,
  characterId,
  label,
  emptyIcon,
}: {
  table: SkillLikeTable
  characterId: string
  label: string
  emptyIcon: typeof Sparkles
}) {
  const { list, create, update, remove } = useSkillLike(table, characterId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SkillLike | undefined>()

  async function handleSubmit(input: SkillLikeInput) {
    if (editing) await update.mutateAsync({ id: editing.id, input })
    else await create.mutateAsync(input)
  }

  if (list.isLoading) return <Skeleton className="h-24 w-full" />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            setEditing(undefined)
            setDialogOpen(true)
          }}
        >
          Nova {label.toLowerCase()}
        </Button>
      </div>

      {!list.data || list.data.length === 0 ? (
        <EmptyState icon={emptyIcon} title={`Nenhuma ${label.toLowerCase()} ainda`} />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {list.data.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{entry.nome}</p>
                  {entry.tipo && <span className="text-xs text-muted-foreground">{entry.tipo}</span>}
                  {entry.dano && <span className="text-xs text-accent">{entry.dano}</span>}
                </div>
                {entry.descricao && <p className="truncate text-xs text-muted-foreground">{entry.descricao}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(entry)
                    setDialogOpen(true)
                  }}
                  aria-label="Editar"
                >
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove.mutate(entry.id)}
                  aria-label="Excluir"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SkillLikeFormDialog open={dialogOpen} onOpenChange={setDialogOpen} entry={editing} label={label} onSubmit={handleSubmit} />
    </div>
  )
}
