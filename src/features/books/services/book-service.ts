import { supabase } from '@/services/supabase/client'
import type { BookInput } from '@/features/books/schemas'

export interface Book {
  id: string
  library_id: string
  nome: string
  autor: string | null
  descricao: string | null
  sistema: string | null
  imagem_capa_url: string | null
  arquivo_url: string | null
  created_at: string
}

function clean(input: BookInput) {
  return {
    nome: input.nome,
    autor: input.autor || null,
    descricao: input.descricao || null,
    sistema: input.sistema || null,
    imagem_capa_url: input.imagem_capa_url || null,
    arquivo_url: input.arquivo_url || null,
  }
}

export async function listBooks(libraryId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar os livros.')
  return data as Book[]
}

export async function createBook(libraryId: string, input: BookInput): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert({ ...clean(input), library_id: libraryId })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar o livro.')
  return data as Book
}

export async function updateBook(id: string, input: BookInput): Promise<Book> {
  const { data, error } = await supabase.from('books').update(clean(input)).eq('id', id).select().single()
  if (error) throw new Error('Não foi possível atualizar o livro.')
  return data as Book
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o livro.')
}
