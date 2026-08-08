import { Link, useParams } from 'react-router-dom'
import { Map as MapIcon, ScrollText, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-context'
import { useCampaign } from '@/features/campaigns/hooks/use-campaigns'
import { MemberList } from '@/features/campaigns/components/member-list'

export function CampaignPage() {
  const { libraryId, campaignId } = useParams<{ libraryId: string; campaignId: string }>()
  const { user } = useAuth()
  const { data: campaign, isLoading } = useCampaign(campaignId)

  if (isLoading || !campaign) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  const isMaster = campaign.master_id === user?.id

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{campaign.nome}</h1>
        {campaign.descricao && <p className="text-sm text-muted-foreground">{campaign.descricao}</p>}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Membros</p>
        <MemberList campaignId={campaign.id} isMaster={isMaster} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ModuleCard
          to={`/bibliotecas/${libraryId}/campanhas/${campaignId}/personagens`}
          icon={ScrollText}
          title="Player"
          description="Fichas de personagem"
        />
        {isMaster && (
          <ModuleCard
            to={`/bibliotecas/${libraryId}/campanhas/${campaignId}/mestre`}
            icon={Shield}
            title="Master"
            description="NPCs, monstros e bosses"
          />
        )}
        <ModuleCard
          to={`/bibliotecas/${libraryId}/campanhas/${campaignId}/mapa`}
          icon={MapIcon}
          title="Mapa"
          description="Mapa interativo"
        />
      </div>
    </div>
  )
}

function ModuleCard({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string
  icon: typeof ScrollText
  title: string
  description: string
}) {
  return (
    <Link to={to}>
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="p-5">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Icon className="size-5" />
          </div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
