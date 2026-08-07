import { createClient } from '@supabase/supabase-js'
// Depois da Fase 2, rode `supabase gen types typescript` e troque este import
// pelo tipo `Database` gerado, em createClient<Database>(...).

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltam VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY. Copie .env.example para .env e preencha com os dados do seu projeto Supabase.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
