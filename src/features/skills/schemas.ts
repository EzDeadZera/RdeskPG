import { z } from 'zod'

// Mesmo shape pra Skills e Magias — o enunciado pede "magias semelhante às skills".
export const skillLikeSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(120),
  tipo: z.string().max(60).optional().or(z.literal('')),
  descricao: z.string().max(2000).optional().or(z.literal('')),
  imagem_url: z.string().url('URL inválida').optional().or(z.literal('')),
  dano: z.string().max(60).optional().or(z.literal('')),
  custo: z.string().max(60).optional().or(z.literal('')),
  efeitos: z.string().max(1000).optional().or(z.literal('')),
  observacoes: z.string().max(1000).optional().or(z.literal('')),
})
export type SkillLikeInput = z.infer<typeof skillLikeSchema>
