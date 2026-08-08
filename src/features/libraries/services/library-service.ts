import { supabase } from '@/services/supabase/client'
import type { LibraryInput } from '@/features/libraries/schemas'

export interface Library {
  id: string
  owner_id: string
  nome: string
  descricao: string | null
  sistema: string | null
  livro_base: string | null
  imagem_url: string | null
  created_at: string
}

function clean(input: LibraryInput) {
  return {
    nome: input.nome,
    descricao: input.descricao || null,
    sistema: input.sistema || null,
    livro_base: input.livro_base || null,
    imagem_url: input.imagem_url || null,
  }
}

export async function listLibraries(): Promise<Library[]> {
  const { data, error } = await supabase.from('libraries').select('*').order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar as bibliotecas.')
  return data as Library[]
}

export async function getLibrary(id: string): Promise<Library> {
  const { data, error } = await supabase.from('libraries').select('*').eq('id', id).single()
  if (error) throw new Error('Biblioteca não encontrada.')
  return data as Library
}

export async function createLibrary(input: LibraryInput, ownerId: string): Promise<Library> {
  const { data, error } = await supabase
    .from('libraries')
    .insert({ ...clean(input), owner_id: ownerId })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar a biblioteca.')
  return data as Library
}

export async function updateLibrary(id: string, input: LibraryInput): Promise<Library> {
  const { data, error } = await supabase.from('libraries').update(clean(input)).eq('id', id).select().single()
  if (error) throw new Error('Não foi possível atualizar a biblioteca.')
  return data as Library
}

export async function deleteLibrary(id: string): Promise<void> {
  const { error } = await supabase.from('libraries').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir a biblioteca.')
}
