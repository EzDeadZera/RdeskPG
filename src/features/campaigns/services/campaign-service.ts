import { supabase } from '@/services/supabase/client'
import type { CampaignInput } from '@/features/campaigns/schemas'

export interface Campaign {
  id: string
  library_id: string
  master_id: string
  nome: string
  descricao: string | null
  imagem_url: string | null
  created_at: string
}

export interface CampaignMember {
  campaign_id: string
  user_id: string
  role: 'jogador' | 'mestre'
  profiles: { username: string; nome_exibicao: string | null } | null
}

function clean(input: CampaignInput) {
  return {
    nome: input.nome,
    descricao: input.descricao || null,
    imagem_url: input.imagem_url || null,
  }
}

export async function listCampaigns(libraryId: string): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar as campanhas.')
  return data as Campaign[]
}

export async function getCampaign(id: string): Promise<Campaign> {
  const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single()
  if (error) throw new Error('Campanha não encontrada.')
  return data as Campaign
}

export async function createCampaign(libraryId: string, input: CampaignInput, masterId: string): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ ...clean(input), library_id: libraryId, master_id: masterId })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar a campanha.')
  return data as Campaign
}

export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase.from('campaigns').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir a campanha.')
}

export async function listMembers(campaignId: string): Promise<CampaignMember[]> {
  const { data, error } = await supabase
    .from('campaign_members')
    .select('campaign_id, user_id, role, profiles(username, nome_exibicao)')
    .eq('campaign_id', campaignId)
  if (error) throw new Error('Não foi possível carregar os membros.')
  return data as unknown as CampaignMember[]
}

export async function addMemberByUsername(campaignId: string, username: string): Promise<void> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    throw new Error('Usuário não encontrado.')
  }

  const { error } = await supabase
    .from('campaign_members')
    .insert({ campaign_id: campaignId, user_id: profile.id, role: 'jogador' })

  if (error) {
    if (error.code === '23505') throw new Error('Esse usuário já está na campanha.')
    throw new Error('Não foi possível adicionar o membro.')
  }
}

export async function removeMember(campaignId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('campaign_members')
    .delete()
    .eq('campaign_id', campaignId)
    .eq('user_id', userId)
  if (error) throw new Error('Não foi possível remover o membro.')
}
