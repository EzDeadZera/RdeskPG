import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/common/form-error'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'
import { signInWithUsername } from '@/features/auth/services/auth-service'

export function LoginPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setFormError(null)
    try {
      await signInWithUsername(data.username, data.password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erro inesperado.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse suas bibliotecas de RPG.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormError message={formError} />

          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input id="username" autoComplete="username" {...register('username')} />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link to="/recuperar-senha" className="text-xs text-muted-foreground hover:text-foreground">
                Esqueceu a senha?
              </Link>
            </div>
            <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Entrar
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-foreground underline underline-offset-4">
              Cadastre-se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
