import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/common/form-error'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas'
import { requestPasswordReset } from '@/features/auth/services/auth-service'

export function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(data: ForgotPasswordInput) {
    setFormError(null)
    try {
      await requestPasswordReset(data.email)
      setSent(true)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erro inesperado.')
    }
  }

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verifique seu e-mail</CardTitle>
          <CardDescription>
            Se houver uma conta com esse e-mail, enviamos um link pra redefinir a senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Voltar para o login</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>Informe o e-mail usado no cadastro.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormError message={formError} />

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Enviar link de recuperação
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-foreground underline underline-offset-4">
              Voltar para o login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
