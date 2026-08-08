import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { bestiaryEntrySchema, type BestiaryEntryInput } from '@/features/master/schemas'

export function BestiaryFormDialog({
  open,
  onOpenChange,
  defaultTipo,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTipo: 'monstro' | 'boss'
  onSubmit: (input: BestiaryEntryInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BestiaryEntryInput>({
    resolver: zodResolver(bestiaryEntrySchema),
    defaultValues: { tipo: defaultTipo, nome: '', descricao: '', imagem_url: '' },
  })

  async function handleFormSubmit(data: BestiaryEntryInput) {
    await onSubmit(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultTipo === 'boss' ? 'Novo boss' : 'Novo monstro'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <input type="hidden" {...register('tipo')} value={defaultTipo} />
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register('nome')} />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição / estatísticas</Label>
            <Textarea id="descricao" rows={4} {...register('descricao')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagem_url">URL da imagem</Label>
            <Input id="imagem_url" placeholder="https://..." {...register('imagem_url')} />
            {errors.imagem_url && <p className="text-sm text-destructive">{errors.imagem_url.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
