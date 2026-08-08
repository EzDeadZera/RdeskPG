import { useState } from 'react'
import { Backpack, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ItemFormDialog } from '@/features/inventory/components/item-form-dialog'
import { useCreateItem, useDeleteItem, useItems, useUpdateItem } from '@/features/inventory/hooks/use-items'
import type { Item } from '@/features/inventory/services/item-service'
import type { ItemInput } from '@/features/inventory/schemas'
import type { Attribute } from '@/features/attributes/services/attribute-service'

export function ItemList({ characterId, attributes }: { characterId: string; attributes: Attribute[] }) {
  const { data: items, isLoading } = useItems(characterId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Item | undefined>()

  const createItem = useCreateItem(characterId)
  const updateItem = useUpdateItem(characterId, editing?.id ?? '')
  const deleteItem = useDeleteItem(characterId)

  function openCreate() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(item: Item) {
    setEditing(item)
    setDialogOpen(true)
  }

  async function handleSubmit(input: ItemInput) {
    if (editing) await updateItem.mutateAsync(input)
    else await createItem.mutateAsync(input)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Novo item
        </Button>
      </div>

      {!items || items.length === 0 ? (
        <EmptyState icon={Backpack} title="Bolsa vazia" description="Adicione itens ao inventário." />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{item.nome}</p>
                  <span className="text-xs text-muted-foreground">x{item.quantidade}</span>
                  {item.categoria && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {item.categoria}
                    </span>
                  )}
                </div>
                {item.item_attribute_modifiers.length > 0 && (
                  <p className="text-xs text-accent">
                    {item.item_attribute_modifiers.length} modificador(es) de atributo
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label="Editar">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteItem.mutate(item.id)}
                  aria-label="Excluir"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ItemFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editing}
        attributes={attributes}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
