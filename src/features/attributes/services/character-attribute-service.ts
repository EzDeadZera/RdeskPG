import { supabase } from '@/services/supabase/client'
import type { CharacterAttributeRow } from '@/features/attributes/effective-value'

export async function listCharacterAttributes(characterId: string): Promise<CharacterAttributeRow[]> {
  const { data, error } = await supabase
    .from('character_attributes')
    .select('attribute_id, valor, valor_manual')
    .eq('character_id', characterId)
  if (error) throw new Error('Não foi possível carregar os atributos do personagem.')
  return data as CharacterAttributeRow[]
}

export async function updateCharacterAttribute(
  characterId: string,
  attributeId: string,
  patch: { valor?: number; valor_manual?: number | null },
): Promise<void> {
  const { error } = await supabase
    .from('character_attributes')
    .update(patch)
    .eq('character_id', characterId)
    .eq('attribute_id', attributeId)
  if (error) throw new Error('Não foi possível salvar o atributo.')
}
