import { z } from 'zod'

export const campaignSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(120),
  descricao: z.string().max(2000).optional().or(z.literal('')),
  imagem_url: z.string().optional().or(z.literal('')),
})
export type CampaignInput = z.infer<typeof campaignSchema>

export const addMemberSchema = z.object({
  username: z.string().min(1, 'Informe um username'),
})
export type AddMemberInput = z.infer<typeof addMemberSchema>
