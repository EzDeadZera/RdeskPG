import { z } from 'zod'

export const itemModifierSchema = z.object({
  attribute_id: z.string().min(1),
  modificador: z.coerce.number(),
})

export const itemSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(120),
  categoria: z.string().max(60).optional().or(z.literal('')),
  quantidade: z.coerce.number().min(0).default(1),
  peso: z.coerce.number().optional(),
  valor: z.coerce.number().optional(),
  descricao: z.string().max(2000).optional().or(z.literal('')),
  imagem_url: z.string().url('URL inválida').optional().or(z.literal('')),
  modificadores: z.array(itemModifierSchema).default([]),
})
export type ItemFormValues = z.input<typeof itemSchema>
export type ItemInput = z.output<typeof itemSchema>
