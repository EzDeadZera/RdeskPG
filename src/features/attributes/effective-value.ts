import { attributeVarName, evaluateFormula } from '@/lib/formula-engine'
import type { Attribute } from '@/features/attributes/services/attribute-service'

export interface CharacterAttributeRow {
  attribute_id: string
  valor: number
  valor_manual: number | null
}

export interface ItemModifier {
  attribute_id: string
  modificador: number
}

// Ordem de prioridade pro valor final de cada atributo:
// 1) valor_manual, se o jogador sobrescreveu manualmente
// 2) resultado da fórmula (usando o "valor" bruto de todos os atributos como escopo)
// 3) o "valor" bruto do próprio atributo
// ...e por cima disso, soma os modificadores dos itens equipados.
export function computeEffectiveValues(
  attributes: Attribute[],
  characterAttributes: CharacterAttributeRow[],
  equippedModifiers: ItemModifier[] = [],
): Record<string, number> {
  const rowById = new Map(characterAttributes.map((row) => [row.attribute_id, row]))

  const scope: Record<string, number> = {}
  for (const attr of attributes) {
    scope[attributeVarName(attr.nome)] = rowById.get(attr.id)?.valor ?? attr.valor_inicial
  }

  const modifierTotals = new Map<string, number>()
  for (const mod of equippedModifiers) {
    modifierTotals.set(mod.attribute_id, (modifierTotals.get(mod.attribute_id) ?? 0) + mod.modificador)
  }

  const result: Record<string, number> = {}
  for (const attr of attributes) {
    const row = rowById.get(attr.id)
    let value: number

    if (row?.valor_manual !== null && row?.valor_manual !== undefined) {
      value = row.valor_manual
    } else if (attr.formula) {
      try {
        value = evaluateFormula(attr.formula, scope)
      } catch {
        value = row?.valor ?? attr.valor_inicial
      }
    } else {
      value = row?.valor ?? attr.valor_inicial
    }

    result[attr.id] = value + (modifierTotals.get(attr.id) ?? 0)
  }
  return result
}
