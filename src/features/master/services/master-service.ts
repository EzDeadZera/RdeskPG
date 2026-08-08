import { supabase } from '@/services/supabase/client'
import type { NpcInput, BestiaryEntryInput } from '@/features/master/schemas'

export interface Npc {
  id: string
  campaign_id: string
  nome: string
  descricao: string | null
  imagem_url: string | null
  created_at: string
}

export interface BestiaryEntry {
  id: string
  campaign_id: string
  tipo: 'monstro' | 'boss'
  nome: string
  descricao: string | null
  imagem_url: string | null
  created_at: string
}

export async function listNpcs(campaignId: string): Promise<Npc[]> {
  const { data, error } = await supabase.from('npcs').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar os NPCs.')
  return data as Npc[]
}

export async function createNpc(campaignId: string, input: NpcInput): Promise<Npc> {
  const { data, error } = await supabase
    .from('npcs')
    .insert({ campaign_id: campaignId, nome: input.nome, descricao: input.descricao || null, imagem_url: input.imagem_url || null })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar o NPC.')
  return data as Npc
}

export async function deleteNpc(id: string): Promise<void> {
  const { error } = await supabase.from('npcs').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o NPC.')
}

export async function listBestiary(campaignId: string): Promise<BestiaryEntry[]> {
  const { data, error } = await supabase.from('bestiary').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar o bestiário.')
  return data as BestiaryEntry[]
}

export async function createBestiaryEntry(campaignId: string, input: BestiaryEntryInput): Promise<BestiaryEntry> {
  const { data, error } = await supabase
    .from('bestiary')
    .insert({
      campaign_id: campaignId,
      tipo: input.tipo,
      nome: input.nome,
      descricao: input.descricao || null,
      imagem_url: input.imagem_url || null,
    })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar o registro.')
  return data as BestiaryEntry
}

export async function deleteBestiaryEntry(id: string): Promise<void> {
  const { error } = await supabase.from('bestiary').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o registro.')
}
