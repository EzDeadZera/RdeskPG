import { supabase } from '@/services/supabase/client'

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('username_available', { check_username: username })
  if (error) throw new Error('Não foi possível checar o username agora. Tente de novo.')
  return Boolean(data)
}

// Mensagem de erro sempre genérica de propósito (login e senha inválidos),
// tanto pra username inexistente quanto pra senha errada — evita dar pista
// de quais usernames existem no sistema.
export async function signInWithUsername(username: string, password: string) {
  const { data: email, error: lookupError } = await supabase.rpc('get_email_for_username', {
    input_username: username,
  })

  if (lookupError || !email) {
    throw new Error('Usuário ou senha inválidos.')
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw new Error('Usuário ou senha inválidos.')
  }
}

export async function signUpWithUsername({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const normalizedUsername = username.trim().toLowerCase()
  const email = `${normalizedUsername}@rpg-dashboard.local`

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: normalizedUsername } },
  })

  if (error) {
    const message = error.message.toLowerCase()
    if (message.includes('already registered') || message.includes('already exists')) {
      throw new Error('Esse usuário já está cadastrado.')
    }
    if (message.includes('username')) {
      throw new Error('Esse username já está em uso.')
    }
    throw new Error('Não foi possível criar a conta. Tente de novo.')
  }
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  })
  if (error) {
    throw new Error('Não foi possível enviar o e-mail de recuperação.')
  }
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    throw new Error('Não foi possível atualizar a senha. O link pode ter expirado.')
  }
}

export async function signOut() {
  await supabase.auth.signOut()
}
