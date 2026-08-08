import { supabase } from '@/services/supabase/client'
import type { MapInput, WaypointInput } from '@/features/maps/schemas'

export interface CampaignMap {
  id: string
  campaign_id: string
  nome: string
  imagem_url: string
  created_at: string
}

export interface Waypoint {
  id: string
  map_id: string
  pos_x: number
  pos_y: number
  titulo: string
  descricao: string | null
  icone: string | null
  cor: string | null
  imagem_url: string | null
}

export async function listMaps(campaignId: string): Promise<CampaignMap[]> {
  const { data, error } = await supabase.from('maps').select('*').eq('campaign_id', campaignId).order('created_at')
  if (error) throw new Error('Não foi possível carregar os mapas.')
  return data as CampaignMap[]
}

export async function getMap(id: string): Promise<CampaignMap> {
  const { data, error } = await supabase.from('maps').select('*').eq('id', id).single()
  if (error) throw new Error('Mapa não encontrado.')
  return data as CampaignMap
}

export async function createMap(campaignId: string, input: MapInput): Promise<CampaignMap> {
  const { data, error } = await supabase
    .from('maps')
    .insert({ campaign_id: campaignId, nome: input.nome, imagem_url: input.imagem_url })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar o mapa.')
  return data as CampaignMap
}

export async function deleteMap(id: string): Promise<void> {
  const { error } = await supabase.from('maps').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o mapa.')
}

export async function listWaypoints(mapId: string): Promise<Waypoint[]> {
  const { data, error } = await supabase.from('waypoints').select('*').eq('map_id', mapId)
  if (error) throw new Error('Não foi possível carregar os pontos do mapa.')
  return data as Waypoint[]
}

export async function createWaypoint(
  mapId: string,
  posX: number,
  posY: number,
  input: WaypointInput,
): Promise<Waypoint> {
  const { data, error } = await supabase
    .from('waypoints')
    .insert({
      map_id: mapId,
      pos_x: posX,
      pos_y: posY,
      titulo: input.titulo,
      descricao: input.descricao || null,
      icone: input.icone || null,
      cor: input.cor || null,
      imagem_url: input.imagem_url || null,
    })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar o ponto.')
  return data as Waypoint
}

export async function updateWaypoint(id: string, input: WaypointInput): Promise<Waypoint> {
  const { data, error } = await supabase
    .from('waypoints')
    .update({
      titulo: input.titulo,
      descricao: input.descricao || null,
      icone: input.icone || null,
      cor: input.cor || null,
      imagem_url: input.imagem_url || null,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error('Não foi possível atualizar o ponto.')
  return data as Waypoint
}

export async function deleteWaypoint(id: string): Promise<void> {
  const { error } = await supabase.from('waypoints').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o ponto.')
}
