import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { CampaignFormDialog } from '@/features/campaigns/components/campaign-form-dialog'
import { useCampaigns, useCreateCampaign } from '@/features/campaigns/hooks/use-campaigns'
import type { CampaignInput } from '@/features/campaigns/schemas'

export function CampaignList({ libraryId }: { libraryId: string }) {
  const navigate = useNavigate()
  const { data: campaigns, isLoading } = useCampaigns(libraryId)
  const createCampaign = useCreateCampaign(libraryId)
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleCreate(input: CampaignInput) {
    const created = await createCampaign.mutateAsync(input)
    navigate(`/bibliotecas/${libraryId}/campanhas/${created.id}`)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          Nova campanha
        </Button>
      </div>

      {!campaigns || campaigns.length === 0 ? (
        <EmptyState icon={Swords} title="Nenhuma campanha ainda" description="Crie uma pra reunir seu grupo." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => navigate(`/bibliotecas/${libraryId}/campanhas/${campaign.id}`)}
            >
              <CardContent className="p-4">
                <p className="font-medium truncate">{campaign.nome}</p>
                <p className="truncate text-sm text-muted-foreground">{campaign.descricao || 'Sem descrição'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CampaignFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />
    </div>
  )
}
