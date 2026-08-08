import { z } from 'zod'

export const npcSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(120),
  descricao: z.string().max(3000).optional().or(z.literal('')),
  imagem_url: z.string().url('URL inválida').optional().or(z.literal('')),
})
export type NpcInput = z.infer<typeof npcSchema>

export const bestiaryEntrySchema = z.object({
  tipo: z.enum(['monstro', 'boss']),
  nome: z.string().min(1, 'Obrigatório').max(120),
  descricao: z.string().max(3000).optional().or(z.literal('')),
  imagem_url: z.string().url('URL inválida').optional().or(z.literal('')),
})
export type BestiaryEntryInput = z.infer<typeof bestiaryEntrySchema>
