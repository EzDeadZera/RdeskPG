import { createClient } from '@supabase/supabase-js'
// Depois da Fase 2, rode `supabase gen types typescript` e troque este import
// pelo tipo `Database` gerado, em createClient<Database>(...).

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase não configurado: crie um arquivo .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
