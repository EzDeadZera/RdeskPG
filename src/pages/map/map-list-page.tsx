import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useParams } from 'react-router-dom'
import { Loader2, Map as MapIcon, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useCampaign } from '@/features/campaigns/hooks/use-campaigns'
import { useAuth } from '@/contexts/auth-context'
import { useCreateMap, useDeleteMap, useMaps } from '@/features/maps/hooks/use-maps'
import { mapSchema, type MapInput } from '@/features/maps/schemas'

export function MapListPage() {
  const { libraryId, campaignId } = useParams<{ libraryId: string; campaignId: string }>()
  const { user } = useAuth()
  const { data: campaign } = useCampaign(campaignId)
  const { data: maps, isLoading } = useMaps(campaignId ?? '')
  const createMap = useCreateMap(campaignId ?? '')
  const deleteMap = useDeleteMap(campaignId ?? '')
  const [dialogOpen, setDialogOpen] = useState(false)
  const isMaster = campaign?.master_id === user?.id

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MapInput>({ resolver: zodResolver(mapSchema), defaultValues: { nome: '', imagem_url: '' } })

  async function onSubmit(data: MapInput) {
    await createMap.mutateAsync(data)
    reset()
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mapas</h1>
        {isMaster && (
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Novo mapa
          </Button>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : !maps || maps.length === 0 ? (
        <EmptyState
          icon={MapIcon}
          title="Nenhum mapa ainda"
          description={isMaster ? 'Envie uma imagem base pra criar o primeiro mapa interativo.' : 'O mestre ainda não criou um mapa.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {maps.map((map) => (
            <Card key={map.id} className="overflow-hidden">
              <Link to={`/bibliotecas/${libraryId}/campanhas/${campaignId}/mapa/${map.id}`}>
                <img src={map.imagem_url} alt={map.nome} className="h-32 w-full object-cover" />
              </Link>
              <CardContent className="flex items-center justify-between gap-2 p-3">
                <Link to={`/bibliotecas/${libraryId}/campanhas/${campaignId}/mapa/${map.id}`} className="min-w-0">
                  <p className="truncate text-sm font-medium">{map.nome}</p>
                </Link>
                {isMaster && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-destructive hover:text-destructive"
                    onClick={() => deleteMap.mutate(map.id)}
                    aria-label="Excluir mapa"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo mapa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" {...register('nome')} />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imagem_url">URL da imagem base</Label>
              <Input id="imagem_url" placeholder="https://..." {...register('imagem_url')} />
              {errors.imagem_url && <p className="text-sm text-destructive">{errors.imagem_url.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Criar mapa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
