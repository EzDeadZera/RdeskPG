import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

const username = 'admin'
const email = 'admin@rpg-dashboard.local'
const password = '12345678'

async function ensureAdminUser() {
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    throw new Error(`Não foi possível consultar usuários: ${listError.message}`)
  }

  const existingUser = existingUsers.users.find((user) => user.email === email)

  if (existingUser) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...existingUser.user_metadata,
        username,
      },
      app_metadata: {
        ...existingUser.app_metadata,
        role: 'admin',
      },
    })

    if (updateError) {
      throw new Error(`Não foi possível atualizar o usuário admin: ${updateError.message}`)
    }

    console.log(`Usuário admin atualizado com sucesso: ${username} / ${email} / ${password}`)
    return
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
    app_metadata: { role: 'admin' },
  })

  if (error) {
    throw new Error(`Não foi possível criar o usuário admin: ${error.message}`)
  }

  console.log(`Usuário admin criado com sucesso: ${username} / ${email} / ${password}`)
  console.log(`UUID: ${data.user?.id ?? 'indisponível'}`)
}

try {
  await ensureAdminUser()
} catch (error) {
  const message = error instanceof Error ? error.message : 'Erro ao criar usuário admin.'
  console.error(message)
  process.exit(1)
}
