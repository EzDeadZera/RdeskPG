import { z } from 'zod'

export const mapSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(120),
  imagem_url: z.string().min(1, 'Obrigatório').url('URL inválida'),
})
export type MapInput = z.infer<typeof mapSchema>

export const waypointSchema = z.object({
  titulo: z.string().min(1, 'Obrigatório').max(120),
  descricao: z.string().max(2000).optional().or(z.literal('')),
  icone: z.string().max(4).optional().or(z.literal('')),
  cor: z.string().max(20).optional().or(z.literal('')),
  imagem_url: z.string().url('URL inválida').optional().or(z.literal('')),
})
export type WaypointInput = z.infer<typeof waypointSchema>
