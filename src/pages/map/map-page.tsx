import { useParams } from 'react-router-dom'
import { Map as MapIcon } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'

// Upload de imagem base e waypoints clicáveis chegam na Fase 7.
export function MapPage() {
  const { mapId } = useParams()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Mapa</h1>
        <p className="text-sm text-muted-foreground">ID: {mapId}</p>
      </div>

      <EmptyState
        icon={MapIcon}
        title="Mapa interativo chega na Fase 7"
        description="Upload de imagem base e waypoints clicáveis com título, descrição, ícone e cor."
      />
    </div>
  )
}
