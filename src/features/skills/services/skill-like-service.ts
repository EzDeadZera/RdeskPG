import { supabase } from '@/services/supabase/client'
import type { SkillLikeInput } from '@/features/skills/schemas'

export interface SkillLike {
  id: string
  character_id: string
  nome: string
  tipo: string | null
  descricao: string | null
  imagem_url: string | null
  dano: string | null
  custo: string | null
  efeitos: string | null
  observacoes: string | null
  created_at: string
}

export type SkillLikeTable = 'skills' | 'spells'

function clean(input: SkillLikeInput) {
  return {
    nome: input.nome,
    tipo: input.tipo || null,
    descricao: input.descricao || null,
    imagem_url: input.imagem_url || null,
    dano: input.dano || null,
    custo: input.custo || null,
    efeitos: input.efeitos || null,
    observacoes: input.observacoes || null,
  }
}

// Skills e Magias têm exatamente o mesmo formato — uma factory evita
// duplicar CRUD pras duas tabelas.
export function makeSkillLikeService(table: SkillLikeTable) {
  return {
    async list(characterId: string): Promise<SkillLike[]> {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false })
      if (error) throw new Error('Não foi possível carregar.')
      return data as SkillLike[]
    },
    async create(characterId: string, input: SkillLikeInput): Promise<SkillLike> {
      const { data, error } = await supabase
        .from(table)
        .insert({ ...clean(input), character_id: characterId })
        .select()
        .single()
      if (error) throw new Error('Não foi possível criar.')
      return data as SkillLike
    },
    async update(id: string, input: SkillLikeInput): Promise<SkillLike> {
      const { data, error } = await supabase.from(table).update(clean(input)).eq('id', id).select().single()
      if (error) throw new Error('Não foi possível atualizar.')
      return data as SkillLike
    },
    async remove(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw new Error('Não foi possível excluir.')
    },
  }
}
