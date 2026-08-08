import { z } from 'zod'

export const bookSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(120),
  autor: z.string().max(120).optional().or(z.literal('')),
  descricao: z.string().max(2000).optional().or(z.literal('')),
  sistema: z.string().max(80).optional().or(z.literal('')),
  imagem_capa_url: z.string().url('URL inválida').optional().or(z.literal('')),
  arquivo_url: z.string().url('URL inválida').optional().or(z.literal('')),
})
export type BookInput = z.infer<typeof bookSchema>
