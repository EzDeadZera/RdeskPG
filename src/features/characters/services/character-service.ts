import { supabase } from '@/services/supabase/client'
import type { CharacterInput } from '@/features/characters/schemas'

export interface Character {
  id: string
  campaign_id: string
  user_id: string
  nome: string
  classe: string | null
  raca: string | null
  nivel: number | null
  historia: string | null
  idade: string | null
  aparencia: string | null
  retrato_url: string | null
  anotacoes: string | null
  created_at: string
}

function clean(input: CharacterInput) {
  return {
    nome: input.nome,
    classe: input.classe || null,
    raca: input.raca || null,
    nivel: input.nivel ?? null,
    idade: input.idade || null,
    aparencia: input.aparencia || null,
    historia: input.historia || null,
    retrato_url: input.retrato_url || null,
  }
}

export async function listCharacters(campaignId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar os personagens.')
  return data as Character[]
}

export async function getCharacter(id: string): Promise<Character> {
  const { data, error } = await supabase.from('characters').select('*').eq('id', id).single()
  if (error) throw new Error('Personagem não encontrado.')
  return data as Character
}

export async function createCharacter(campaignId: string, input: CharacterInput, userId: string): Promise<Character> {
  const { data, error } = await supabase
    .from('characters')
    .insert({ ...clean(input), campaign_id: campaignId, user_id: userId })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar o personagem.')
  return data as Character
}

export async function updateCharacter(id: string, input: CharacterInput): Promise<Character> {
  const { data, error } = await supabase.from('characters').update(clean(input)).eq('id', id).select().single()
  if (error) throw new Error('Não foi possível atualizar o personagem.')
  return data as Character
}

export async function updateCharacterNotes(id: string, anotacoes: string): Promise<void> {
  const { error } = await supabase.from('characters').update({ anotacoes }).eq('id', id)
  if (error) throw new Error('Não foi possível salvar as anotações.')
}

export async function deleteCharacter(id: string): Promise<void> {
  const { error } = await supabase.from('characters').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o personagem.')
}
