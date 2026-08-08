import { supabase } from '@/services/supabase/client'
import type { AttributeInput } from '@/features/attributes/schemas'

export interface Attribute {
  id: string
  library_id: string
  nome: string
  valor_inicial: number
  valor_min: number | null
  valor_max: number | null
  formula: string | null
  descricao: string | null
  ordem: number
  created_at: string
}

function clean(input: AttributeInput) {
  return {
    nome: input.nome,
    valor_inicial: input.valor_inicial,
    valor_min: input.valor_min ?? null,
    valor_max: input.valor_max ?? null,
    formula: input.formula || null,
    descricao: input.descricao || null,
  }
}

export async function listAttributes(libraryId: string): Promise<Attribute[]> {
  const { data, error } = await supabase
    .from('attributes')
    .select('*')
    .eq('library_id', libraryId)
    .order('ordem', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw new Error('Não foi possível carregar os atributos.')
  return data as Attribute[]
}

export async function createAttribute(libraryId: string, input: AttributeInput, ordem: number): Promise<Attribute> {
  const { data, error } = await supabase
    .from('attributes')
    .insert({ ...clean(input), library_id: libraryId, ordem })
    .select()
    .single()
  if (error) throw new Error('Não foi possível criar o atributo.')
  return data as Attribute
}

export async function updateAttribute(id: string, input: AttributeInput): Promise<Attribute> {
  const { data, error } = await supabase.from('attributes').update(clean(input)).eq('id', id).select().single()
  if (error) throw new Error('Não foi possível atualizar o atributo.')
  return data as Attribute
}

export async function deleteAttribute(id: string): Promise<void> {
  const { error } = await supabase.from('attributes').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o atributo.')
}
