import { supabase } from '@/services/supabase/client'

export interface EquipmentSlot {
  id: string
  library_id: string
  nome: string
  ordem: number
}

export interface CharacterEquipment {
  character_id: string
  slot_id: string
  item_id: string | null
}

export async function listEquipmentSlots(libraryId: string): Promise<EquipmentSlot[]> {
  const { data, error } = await supabase
    .from('equipment_slots')
    .select('*')
    .eq('library_id', libraryId)
    .order('ordem', { ascending: true })
  if (error) throw new Error('Não foi possível carregar os slots de equipamento.')
  return data as EquipmentSlot[]
}

export async function listCharacterEquipment(characterId: string): Promise<CharacterEquipment[]> {
  const { data, error } = await supabase.from('character_equipment').select('*').eq('character_id', characterId)
  if (error) throw new Error('Não foi possível carregar os equipamentos.')
  return data as CharacterEquipment[]
}

export async function equipItem(characterId: string, slotId: string, itemId: string | null): Promise<void> {
  const { error } = await supabase
    .from('character_equipment')
    .upsert({ character_id: characterId, slot_id: slotId, item_id: itemId }, { onConflict: 'character_id,slot_id' })
  if (error) throw new Error('Não foi possível atualizar o equipamento.')
}
