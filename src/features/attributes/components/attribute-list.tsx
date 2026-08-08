import { useState } from 'react'
import { Pencil, Plus, Sliders, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { AttributeFormDialog } from '@/features/attributes/components/attribute-form-dialog'
import {
  useAttributes,
  useCreateAttribute,
  useDeleteAttribute,
  useUpdateAttribute,
} from '@/features/attributes/hooks/use-attributes'
import { attributeVarName } from '@/lib/formula-engine'
import type { Attribute } from '@/features/attributes/services/attribute-service'
import type { AttributeInput } from '@/features/attributes/schemas'
import { Skeleton } from '@/components/ui/skeleton'

export function AttributeList({ libraryId }: { libraryId: string }) {
  const { data: attributes, isLoading } = useAttributes(libraryId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Attribute | undefined>()

  const nextOrdem = attributes?.length ?? 0
  const createAttribute = useCreateAttribute(libraryId, nextOrdem)
  const updateAttribute = useUpdateAttribute(libraryId, editing?.id ?? '')
  const deleteAttribute = useDeleteAttribute(libraryId)

  const otherNames = (attributes ?? [])
    .filter((a) => a.id !== editing?.id)
    .map((a) => attributeVarName(a.nome))

  function openCreate() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(attribute: Attribute) {
    setEditing(attribute)
    setDialogOpen(true)
  }

  async function handleSubmit(input: AttributeInput) {
    if (editing) {
      await updateAttribute.mutateAsync(input)
    } else {
      await createAttribute.mutateAsync(input)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Usados nas fichas de personagem desta biblioteca (Fase 5).
        </p>
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Novo atributo
        </Button>
      </div>

      {!attributes || attributes.length === 0 ? (
        <EmptyState icon={Sliders} title="Nenhum atributo ainda" description="Ex: Força, Destreza, Sanidade..." />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {attributes.map((attribute) => (
            <div key={attribute.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{attribute.nome}</p>
                  <span className="text-xs text-muted-foreground">
                    inicial: {attribute.valor_inicial}
                    {(attribute.valor_min !== null || attribute.valor_max !== null) &&
                      ` (${attribute.valor_min ?? '–'} a ${attribute.valor_max ?? '–'})`}
                  </span>
                </div>
                {attribute.formula && (
                  <p className="truncate font-mono text-xs text-accent">{attribute.formula}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(attribute)} aria-label="Editar">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteAttribute.mutate(attribute.id)}
                  aria-label="Excluir"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AttributeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        attribute={editing}
        otherAttributeNames={otherNames}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
