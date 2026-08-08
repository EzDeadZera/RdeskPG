import { z } from 'zod'

// Username: minúsculo, sem espaços, só letras/números/underscore/hífen —
// evita problemas de URL/exibição e mantém consistência.
const usernameSchema = z
  .string()
  .min(3, 'Mínimo de 3 caracteres')
  .max(24, 'Máximo de 24 caracteres')
  .regex(/^[a-z0-9_-]+$/, 'Use só letras minúsculas, números, "_" ou "-"')

const passwordSchema = z.string().min(8, 'Mínimo de 8 caracteres')

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, 'Informe sua senha'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    username: usernameSchema,
    email: z.string().email('E-mail inválido'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
export type SignupInput = z.infer<typeof signupSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
