import { z } from 'zod'

export const characterSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(120),
  classe: z.string().max(80).optional().or(z.literal('')),
  raca: z.string().max(80).optional().or(z.literal('')),
  nivel: z.coerce.number().optional(),
  idade: z.string().max(40).optional().or(z.literal('')),
  aparencia: z.string().max(2000).optional().or(z.literal('')),
  historia: z.string().max(5000).optional().or(z.literal('')),
  retrato_url: z.string().url('URL inválida').optional().or(z.literal('')),
})
export type CharacterFormValues = z.input<typeof characterSchema>
export type CharacterInput = z.output<typeof characterSchema>
