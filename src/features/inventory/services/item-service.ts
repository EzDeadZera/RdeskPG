import { supabase } from '@/services/supabase/client'
import type { ItemInput } from '@/features/inventory/schemas'

export interface ItemModifier {
  id: string
  item_id: string
  attribute_id: string
  modificador: number
}

export interface Item {
  id: string
  character_id: string
  nome: string
  categoria: string | null
  quantidade: number
  peso: number | null
  valor: number | null
  descricao: string | null
  imagem_url: string | null
  created_at: string
  item_attribute_modifiers: ItemModifier[]
}

function clean(input: ItemInput) {
  return {
    nome: input.nome,
    categoria: input.categoria || null,
    quantidade: input.quantidade,
    peso: input.peso ?? null,
    valor: input.valor ?? null,
    descricao: input.descricao || null,
    imagem_url: input.imagem_url || null,
  }
}

export async function listItems(characterId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_attribute_modifiers(*)')
    .eq('character_id', characterId)
    .order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar o inventário.')
  return data as unknown as Item[]
}

async function saveModifiers(itemId: string, modifiers: ItemInput['modificadores']) {
  const { error: deleteError } = await supabase.from('item_attribute_modifiers').delete().eq('item_id', itemId)
  if (deleteError) throw new Error('Item salvo, mas não foi possível atualizar os modificadores antigos.')
  const rows = modifiers.filter((m) => m.attribute_id).map((m) => ({ item_id: itemId, ...m }))
  if (rows.length > 0) {
    const { error } = await supabase.from('item_attribute_modifiers').insert(rows)
    if (error) throw new Error('Item salvo, mas os modificadores não puderam ser salvos.')
  }
}

export async function createItem(characterId: string, input: ItemInput): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .insert({ ...clean(input), character_id: characterId })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar o item.')
  await saveModifiers(data.id, input.modificadores)
  return data as Item
}

export async function updateItem(id: string, input: ItemInput): Promise<Item> {
  const { data, error } = await supabase.from('items').update(clean(input)).eq('id', id).select().single()
  if (error) throw new Error('Não foi possível atualizar o item.')
  await saveModifiers(id, input.modificadores)
  return data as Item
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o item.')
}
