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
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { librarySchema, type LibraryInput } from '@/features/libraries/schemas'
import type { Library } from '@/features/libraries/services/library-service'

interface LibraryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  library?: Library
  onSubmit: (input: LibraryInput) => Promise<void>
}

const emptyValues: LibraryInput = { nome: '', descricao: '', sistema: '', livro_base: '', imagem_url: '' }

export function LibraryFormDialog({ open, onOpenChange, library, onSubmit }: LibraryFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LibraryInput>({ resolver: zodResolver(librarySchema), defaultValues: emptyValues })

  useEffect(() => {
    if (open) {
      reset(
        library
          ? {
              nome: library.nome,
              descricao: library.descricao ?? '',
              sistema: library.sistema ?? '',
              livro_base: library.livro_base ?? '',
              imagem_url: library.imagem_url ?? '',
            }
          : emptyValues,
      )
    }
  }, [open, library, reset])

  async function handleFormSubmit(data: LibraryInput) {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{library ? 'Editar biblioteca' : 'Nova biblioteca'}</DialogTitle>
          <DialogDescription>Cada biblioteca é um sistema de RPG com suas próprias regras.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Ex: D&D 5e — Mesa de sábado" {...register('nome')} />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sistema">Sistema</Label>
              <Input id="sistema" placeholder="D&D 5e" {...register('sistema')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="livro_base">Livro base</Label>
              <Input id="livro_base" placeholder="Manual do Jogador" {...register('livro_base')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={3} {...register('descricao')} />
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
              {library ? 'Salvar' : 'Criar biblioteca'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
