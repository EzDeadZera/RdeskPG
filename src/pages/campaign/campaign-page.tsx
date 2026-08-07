import { useParams } from 'react-router-dom'
import { Swords } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'

// Os três módulos (Player, Master, Mapa) chegam nas Fases 5, 6 e 7.
export function CampaignPage() {
  const { campaignId } = useParams()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Campanha</h1>
        <p className="text-sm text-muted-foreground">ID: {campaignId}</p>
      </div>

      <EmptyState
        icon={Swords}
        title="Player, Master e Mapa chegam a seguir"
        description="Fase 5 (ficha de personagem), Fase 6 (painel do mestre) e Fase 7 (mapa interativo)."
      />
    </div>
  )
}
