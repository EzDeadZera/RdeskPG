import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { makeSkillLikeService, type SkillLikeTable } from '@/features/skills/services/skill-like-service'
import type { SkillLikeInput } from '@/features/skills/schemas'

export function useSkillLike(table: SkillLikeTable, characterId: string) {
  const service = makeSkillLikeService(table)
  const queryClient = useQueryClient()
  const key = [table, characterId]

  const list = useQuery({ queryKey: key, queryFn: () => service.list(characterId) })

  const create = useMutation({
    mutationFn: (input: SkillLikeInput) => service.create(characterId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  })

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: SkillLikeInput }) => service.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => service.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  })

  return { list, create, update, remove }
}
