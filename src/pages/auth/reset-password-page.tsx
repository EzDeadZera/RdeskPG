import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/common/form-error'
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/schemas'
import { updatePassword } from '@/features/auth/services/auth-service'

// Acessada via link do e-mail de recuperação. O Supabase já estabelece uma
// sessão temporária de recovery a partir do token na URL antes desta página
// montar, então updateUser() abaixo funciona sem precisar de login normal.
export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit(data: ResetPasswordInput) {
    setFormError(null)
    try {
      await updatePassword(data.password)
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erro inesperado.')
    }
  }

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Senha atualizada</CardTitle>
          <CardDescription>Redirecionando para o login...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova senha</CardTitle>
        <CardDescription>Escolha uma nova senha para sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormError message={formError} />

          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Salvar nova senha
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
