import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
import { skillLikeSchema, type SkillLikeInput } from '@/features/skills/schemas'
import type { SkillLike } from '@/features/skills/services/skill-like-service'

const emptyValues: SkillLikeInput = {
  nome: '',
  tipo: '',
  descricao: '',
  imagem_url: '',
  dano: '',
  custo: '',
  efeitos: '',
  observacoes: '',
}

export function SkillLikeFormDialog({
  open,
  onOpenChange,
  entry,
  label,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: SkillLike
  label: string
  onSubmit: (input: SkillLikeInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillLikeInput>({ resolver: zodResolver(skillLikeSchema), defaultValues: emptyValues })

  useEffect(() => {
    if (open) {
      reset(
        entry
          ? {
              nome: entry.nome,
              tipo: entry.tipo ?? '',
              descricao: entry.descricao ?? '',
              imagem_url: entry.imagem_url ?? '',
              dano: entry.dano ?? '',
              custo: entry.custo ?? '',
              efeitos: entry.efeitos ?? '',
              observacoes: entry.observacoes ?? '',
            }
          : emptyValues,
      )
    }
  }, [open, entry, reset])

  async function handleFormSubmit(data: SkillLikeInput) {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry ? `Editar ${label.toLowerCase()}` : `Nova ${label.toLowerCase()}`}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" {...register('nome')} />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Input id="tipo" {...register('tipo')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={2} {...register('descricao')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dano">Dano</Label>
              <Input id="dano" placeholder="Ex: 2d6+3" {...register('dano')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custo">Custo</Label>
              <Input id="custo" placeholder="Ex: 3 PM" {...register('custo')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="efeitos">Efeitos</Label>
            <Textarea id="efeitos" rows={2} {...register('efeitos')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" rows={2} {...register('observacoes')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem_url">URL da imagem</Label>
            <Input id="imagem_url" placeholder="https://..." {...register('imagem_url')} />
            {errors.imagem_url && <p className="text-sm text-destructive">{errors.imagem_url.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {entry ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
