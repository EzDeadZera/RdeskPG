import { useMemo, useState } from 'react'
import { useAttributes } from '@/features/attributes/hooks/use-attributes'
import {
  useCharacterAttributes,
  useUpdateCharacterAttribute,
} from '@/features/attributes/hooks/use-character-attributes'
import { useItems } from '@/features/inventory/hooks/use-items'
import { useCharacterEquipment } from '@/features/equipment/hooks/use-equipment'
import { computeEffectiveValues } from '@/features/attributes/effective-value'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { Sliders } from 'lucide-react'

export function CharacterAttributePanel({ libraryId, characterId }: { libraryId: string; characterId: string }) {
  const { data: attributes, isLoading: loadingAttrs } = useAttributes(libraryId)
  const { data: charAttrs, isLoading: loadingCharAttrs } = useCharacterAttributes(characterId)
  const { data: items } = useItems(characterId)
  const { data: equipment } = useCharacterEquipment(characterId)
  const updateAttr = useUpdateCharacterAttribute(characterId)
  const [editing, setEditing] = useState<Record<string, string>>({})

  const equippedModifiers = useMemo(() => {
    const equippedItemIds = new Set((equipment ?? []).map((e) => e.item_id).filter(Boolean))
    return (items ?? [])
      .filter((item) => equippedItemIds.has(item.id))
      .flatMap((item) => item.item_attribute_modifiers)
      .map((m) => ({ attribute_id: m.attribute_id, modificador: m.modificador }))
  }, [items, equipment])

  const effectiveValues = useMemo(() => {
    if (!attributes || !charAttrs) return {}
    return computeEffectiveValues(attributes, charAttrs, equippedModifiers)
  }, [attributes, charAttrs, equippedModifiers])

  const charAttrById = useMemo(() => new Map((charAttrs ?? []).map((c) => [c.attribute_id, c])), [charAttrs])

  if (loadingAttrs || loadingCharAttrs) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    )
  }

  if (!attributes || attributes.length === 0) {
    return (
      <EmptyState
        icon={Sliders}
        title="Essa biblioteca ainda não tem atributos"
        description="Configure atributos na aba Atributos da biblioteca primeiro."
      />
    )
  }

  function fieldKey(attributeId: string, field: 'valor' | 'valor_manual') {
    return `${attributeId}:${field}`
  }

  function handleBlur(attributeId: string, field: 'valor' | 'valor_manual') {
    const key = fieldKey(attributeId, field)
    const raw = editing[key]
    if (raw === undefined) return
    const parsed = raw.trim() === '' ? null : Number(raw)
    if (parsed !== null && Number.isNaN(parsed)) return
    if (field === 'valor') {
      updateAttr.mutate({ attributeId, patch: { valor: parsed ?? 0 } })
    } else {
      updateAttr.mutate({ attributeId, patch: { valor_manual: parsed } })
    }
    setEditing((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {attributes.map((attr) => {
        const row = charAttrById.get(attr.id)
        const valorKey = fieldKey(attr.id, 'valor')
        const manualKey = fieldKey(attr.id, 'valor_manual')
        return (
          <div key={attr.id} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-sm font-medium">{attr.nome}</p>
              <p className="text-2xl font-semibold tabular-nums text-primary">
                {effectiveValues[attr.id] ?? '—'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={valorKey} className="text-xs text-muted-foreground">
                  Valor base
                </Label>
                <Input
                  id={valorKey}
                  type="number"
                  step="any"
                  className="h-8 text-sm"
                  value={editing[valorKey] ?? row?.valor ?? attr.valor_inicial}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [valorKey]: e.target.value }))}
                  onBlur={() => handleBlur(attr.id, 'valor')}
                />
              </div>
              <div>
                <Label htmlFor={manualKey} className="text-xs text-muted-foreground">
                  Override manual
                </Label>
                <Input
                  id={manualKey}
                  type="number"
                  step="any"
                  placeholder="—"
                  className="h-8 text-sm"
                  value={editing[manualKey] ?? row?.valor_manual ?? ''}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [manualKey]: e.target.value }))}
                  onBlur={() => handleBlur(attr.id, 'valor_manual')}
                />
              </div>
            </div>
            {attr.formula && <p className="mt-2 truncate font-mono text-xs text-accent">{attr.formula}</p>}
          </div>
        )
      })}
    </div>
  )
}
