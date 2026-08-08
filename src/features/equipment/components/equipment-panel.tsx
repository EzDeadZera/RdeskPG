import { Shield } from 'lucide-react'
import { useEquipmentSlots, useCharacterEquipment, useEquipItem } from '@/features/equipment/hooks/use-equipment'
import { useItems } from '@/features/inventory/hooks/use-items'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'

export function EquipmentPanel({ libraryId, characterId }: { libraryId: string; characterId: string }) {
  const { data: slots, isLoading: loadingSlots } = useEquipmentSlots(libraryId)
  const { data: equipment, isLoading: loadingEquip } = useCharacterEquipment(characterId)
  const { data: items } = useItems(characterId)
  const equipItem = useEquipItem(characterId)

  if (loadingSlots || loadingEquip) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return <EmptyState icon={Shield} title="Sem slots de equipamento" description="Configure na biblioteca." />
  }

  const equippedBySlot = new Map((equipment ?? []).map((e) => [e.slot_id, e.item_id]))

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {slots.map((slot) => (
        <div key={slot.id} className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-medium">{slot.nome}</p>
          <select
            className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
            value={equippedBySlot.get(slot.id) ?? ''}
            onChange={(e) => equipItem.mutate({ slotId: slot.id, itemId: e.target.value || null })}
          >
            <option value="">Vazio</option>
            {(items ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
