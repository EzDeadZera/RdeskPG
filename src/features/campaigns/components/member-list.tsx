import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import {
  useAddMember,
  useCampaignMembers,
  useRemoveMember,
} from '@/features/campaigns/hooks/use-campaigns'
import { addMemberSchema, type AddMemberInput } from '@/features/campaigns/schemas'

// Erros de mutation (username não encontrado, já está na campanha, etc.)
// aparecem via toast global — não precisa de estado de erro local aqui.
export function MemberList({ campaignId, isMaster }: { campaignId: string; isMaster: boolean }) {
  const { user } = useAuth()
  const { data: members, isLoading } = useCampaignMembers(campaignId)
  const addMember = useAddMember(campaignId)
  const removeMember = useRemoveMember(campaignId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberInput>({ resolver: zodResolver(addMemberSchema) })

  async function onSubmit(data: AddMemberInput) {
    try {
      await addMember.mutateAsync(data.username)
      reset()
    } catch {
      // já reportado pelo toast global (mutationCache.onError)
    }
  }

  if (isLoading) return null

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {members?.map((member) => (
          <div
            key={member.user_id}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-sm"
          >
            <span>{member.profiles?.username ?? 'usuário'}</span>
            <span className="text-xs text-muted-foreground">
              {member.role === 'mestre' ? 'mestre' : 'jogador'}
            </span>
            {isMaster && member.user_id !== user?.id && (
              <button
                onClick={() => removeMember.mutate(member.user_id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remover"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {isMaster && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2" noValidate>
          <div className="flex-1">
            <Input placeholder="Adicionar por username" {...register('username')} />
            {errors.username && <p className="mt-1 text-sm text-destructive">{errors.username.message}</p>}
          </div>
          <Button type="submit" variant="outline" size="icon" disabled={addMember.isPending} aria-label="Adicionar">
            {addMember.isPending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
          </Button>
        </form>
      )}
    </div>
  )
}
