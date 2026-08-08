import { z } from 'zod'

// Campo numérico opcional vindo de <input type="number">: string vazia,
// undefined ou NaN viram "não definido".
const optionalNumber = z.preprocess((val) => {
  if (val === '' || val === undefined || (typeof val === 'number' && Number.isNaN(val))) return undefined
  return val
}, z.coerce.number().optional())

export const attributeSchema = z
  .object({
    nome: z.string().min(1, 'Obrigatório').max(60),
    valor_inicial: z.coerce.number(),
    valor_min: optionalNumber,
    valor_max: optionalNumber,
    formula: z.string().max(500).optional().or(z.literal('')),
    descricao: z.string().max(1000).optional().or(z.literal('')),
  })
  .refine(
    (data) => data.valor_min === undefined || data.valor_max === undefined || data.valor_min <= data.valor_max,
    { message: 'O valor mínimo não pode ser maior que o máximo', path: ['valor_min'] },
  )

// input = formato cru dos campos do form (antes da coerção); output = já
// convertido pro tipo final (o que onSubmit recebe).
export type AttributeFormValues = z.input<typeof attributeSchema>
export type AttributeInput = z.output<typeof attributeSchema>
