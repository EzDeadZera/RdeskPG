import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { waypointSchema, type WaypointInput } from '@/features/maps/schemas'
import type { Waypoint } from '@/features/maps/services/map-service'

const COLOR_OPTIONS = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

interface WaypointDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  waypoint?: Waypoint
  isMaster: boolean
  onSubmit?: (input: WaypointInput) => Promise<void>
  onDelete?: () => void
}

const emptyValues: WaypointInput = { titulo: '', descricao: '', icone: '', cor: COLOR_OPTIONS[0], imagem_url: '' }

export function WaypointDialog({ open, onOpenChange, waypoint, isMaster, onSubmit, onDelete }: WaypointDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WaypointInput>({ resolver: zodResolver(waypointSchema), defaultValues: emptyValues })

  const cor = watch('cor')

  useEffect(() => {
    if (open) {
      reset(
        waypoint
          ? {
              titulo: waypoint.titulo,
              descricao: waypoint.descricao ?? '',
              icone: waypoint.icone ?? '',
              cor: waypoint.cor ?? COLOR_OPTIONS[0],
              imagem_url: waypoint.imagem_url ?? '',
            }
          : emptyValues,
      )
    }
  }, [open, waypoint, reset])

  async function handleFormSubmit(data: WaypointInput) {
    await onSubmit?.(data)
    onOpenChange(false)
  }

  // Jogador (ou mestre só espiando) vê modo leitura: título, imagem, descrição.
  if (!isMaster) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{waypoint?.titulo || 'Ponto sem título'}</DialogTitle>
          </DialogHeader>
          {waypoint?.imagem_url && (
            <img src={waypoint.imagem_url} alt={waypoint.titulo} className="mb-3 max-h-64 w-full rounded-lg object-cover" />
          )}
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{waypoint?.descricao || 'Sem descrição.'}</p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{waypoint ? 'Editar ponto' : 'Novo ponto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" {...register('titulo')} />
            {errors.titulo && <p className="text-sm text-destructive">{errors.titulo.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={3} {...register('descricao')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icone">Ícone (emoji)</Label>
              <Input id="icone" placeholder="🏰" {...register('icone')} />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-1.5 pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setValue('cor', c)}
                    className="size-6 rounded-full border-2"
                    style={{ backgroundColor: c, borderColor: cor === c ? 'var(--foreground)' : 'transparent' }}
                    aria-label={`Cor ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem_url">URL da imagem</Label>
            <Input id="imagem_url" placeholder="https://..." {...register('imagem_url')} />
            {errors.imagem_url && <p className="text-sm text-destructive">{errors.imagem_url.message}</p>}
          </div>

          <DialogFooter className={onDelete ? 'sm:justify-between' : undefined}>
            {onDelete && (
              <Button type="button" variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={onDelete}>
                <Trash2 className="size-4" />
                Excluir
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
