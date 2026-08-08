import { useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { useCampaign } from '@/features/campaigns/hooks/use-campaigns'
import { useMap } from '@/features/maps/hooks/use-maps'
import { InteractiveMap } from '@/features/maps/components/interactive-map'
import { Skeleton } from '@/components/ui/skeleton'

export function MapPage() {
  const { mapId, campaignId } = useParams<{ libraryId: string; campaignId: string; mapId: string }>()
  const { user } = useAuth()
  const { data: campaign } = useCampaign(campaignId)
  const { data: map, isLoading } = useMap(mapId)

  if (isLoading || !map) {
    return <Skeleton className="h-96 w-full" />
  }

  const isMaster = campaign?.master_id === user?.id

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{map.nome}</h1>
      <InteractiveMap map={map} isMaster={isMaster} />
    </div>
  )
}
