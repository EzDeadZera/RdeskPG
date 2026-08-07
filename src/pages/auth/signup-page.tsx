import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Check, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/common/form-error'
import { signupSchema, type SignupInput } from '@/features/auth/schemas'
import { checkUsernameAvailable, signUpWithUsername } from '@/features/auth/services/auth-service'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken'

export function SignupPage() {
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

  async function handleUsernameBlur() {
    const username = getValues('username')
    // Só checa se o formato já é válido (evita bater na API por nada)
    if (!username || username.length < 3 || !/^[a-z0-9_-]+$/.test(username)) {
      setUsernameStatus('idle')
      return
    }
    setUsernameStatus('checking')
    try {
      const available = await checkUsernameAvailable(username)
      setUsernameStatus(available ? 'available' : 'taken')
    } catch {
      setUsernameStatus('idle')
    }
  }

  async function onSubmit(data: SignupInput) {
    setFormError(null)
    try {
      await signUpWithUsername(data)
      setDone(true)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erro inesperado.')
    }
  }

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confira seu e-mail</CardTitle>
          <CardDescription>
            Enviamos um link de confirmação. Depois de confirmar, é só entrar com seu usuário e senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/login">Ir para o login</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Comece sua biblioteca de RPG.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormError message={formError} />

          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <div className="relative">
              <Input
                id="username"
                autoComplete="username"
                {...register('username', { onBlur: handleUsernameBlur })}
              />
              {usernameStatus === 'checking' && (
                <Loader2 className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
              {usernameStatus === 'available' && (
                <Check className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-accent" />
              )}
              {usernameStatus === 'taken' && (
                <X className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-destructive" />
              )}
            </div>
            {errors.username ? (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            ) : usernameStatus === 'taken' ? (
              <p className="text-sm text-destructive">Esse username já está em uso.</p>
            ) : (
              <p className="text-xs text-muted-foreground">Só letras minúsculas, números, "_" ou "-".</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            <p className="text-xs text-muted-foreground">
              Usado só para confirmação de conta e recuperação de senha.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
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
            Criar conta
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link to="/login" className="text-foreground underline underline-offset-4">
              Entrar
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
