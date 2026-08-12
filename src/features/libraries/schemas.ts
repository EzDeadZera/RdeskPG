import { z } from 'zod'

export const librarySchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(80),
  descricao: z.string().max(2000).optional().or(z.literal('')),
  sistema: z.string().max(80).optional().or(z.literal('')),
  livro_base: z.string().max(80).optional().or(z.literal('')),
  imagem_url: z.string().optional().or(z.literal('')),
})
export type LibraryInput = z.infer<typeof librarySchema>
