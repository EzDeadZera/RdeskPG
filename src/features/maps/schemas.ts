import { z } from 'zod'

// imagem_url do mapa continua obrigatória de propósito: sem uma imagem base
// não tem como clicar pra criar waypoint — mas não exige mais formato
// estrito de URL, só que não esteja vazio.
export const mapSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(120),
  imagem_url: z.string().min(1, 'Cole o link da imagem base do mapa'),
})
export type MapInput = z.infer<typeof mapSchema>

export const waypointSchema = z.object({
  titulo: z.string().max(120).optional().or(z.literal('')),
  descricao: z.string().max(2000).optional().or(z.literal('')),
  icone: z.string().max(4).optional().or(z.literal('')),
  cor: z.string().max(20).optional().or(z.literal('')),
  imagem_url: z.string().optional().or(z.literal('')),
})
export type WaypointInput = z.infer<typeof waypointSchema>
