import { useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateWaypoint, useDeleteWaypoint, useUpdateWaypoint, useWaypoints } from '@/features/maps/hooks/use-maps'
import { WaypointDialog } from '@/features/maps/components/waypoint-dialog'
import type { CampaignMap, Waypoint } from '@/features/maps/services/map-service'
import type { WaypointInput } from '@/features/maps/schemas'

export function InteractiveMap({ map, isMaster }: { map: CampaignMap; isMaster: boolean }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const { data: waypoints } = useWaypoints(map.id)
  const createWaypoint = useCreateWaypoint(map.id)
  const updateWaypoint = useUpdateWaypoint(map.id)
  const deleteWaypoint = useDeleteWaypoint(map.id)

  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null)
  const [selected, setSelected] = useState<Waypoint | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
    if (!isMaster || !imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPendingPos({ x, y })
    setSelected(null)
    setDialogOpen(true)
  }

  function handlePinClick(e: React.MouseEvent, waypoint: Waypoint) {
    e.stopPropagation()
    setSelected(waypoint)
    setPendingPos(null)
    setDialogOpen(true)
  }

  async function handleSubmit(input: WaypointInput) {
    if (selected) {
      await updateWaypoint.mutateAsync({ id: selected.id, input })
    } else if (pendingPos) {
      await createWaypoint.mutateAsync({ posX: pendingPos.x, posY: pendingPos.y, input })
    }
  }

  function handleDelete() {
    if (!selected) return
    deleteWaypoint.mutate(selected.id)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-2">
      {isMaster && (
        <p className="text-xs text-muted-foreground">Clique em qualquer ponto do mapa pra criar um marcador.</p>
      )}
      <div className="relative inline-block w-full overflow-hidden rounded-xl border border-border">
        <img
          ref={imgRef}
          src={map.imagem_url}
          alt={map.nome}
          onClick={handleImageClick}
          className={cn('w-full select-none', isMaster && 'cursor-crosshair')}
          draggable={false}
        />
        {waypoints?.map((wp) => (
          <button
            key={wp.id}
            onClick={(e) => handlePinClick(e, wp)}
            style={{ left: `${wp.pos_x}%`, top: `${wp.pos_y}%`, backgroundColor: wp.cor || 'var(--primary)' }}
            className="absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-sm shadow-lg transition-transform hover:scale-110"
            aria-label={wp.titulo || 'Ponto sem título'}
            title={wp.titulo || 'Ponto sem título'}
          >
            {wp.icone || <MapPin className="size-3.5 text-white" />}
          </button>
        ))}
      </div>

      <WaypointDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        waypoint={selected ?? undefined}
        isMaster={isMaster}
        onSubmit={handleSubmit}
        onDelete={selected ? handleDelete : undefined}
      />
    </div>
  )
}
