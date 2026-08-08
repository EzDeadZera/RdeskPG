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
import { bookSchema, type BookInput } from '@/features/books/schemas'
import type { Book } from '@/features/books/services/book-service'

interface BookFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book?: Book
  onSubmit: (input: BookInput) => Promise<void>
}

const emptyValues: BookInput = {
  nome: '',
  autor: '',
  descricao: '',
  sistema: '',
  imagem_capa_url: '',
  arquivo_url: '',
}

export function BookFormDialog({ open, onOpenChange, book, onSubmit }: BookFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookInput>({ resolver: zodResolver(bookSchema), defaultValues: emptyValues })

  useEffect(() => {
    if (open) {
      reset(
        book
          ? {
              nome: book.nome,
              autor: book.autor ?? '',
              descricao: book.descricao ?? '',
              sistema: book.sistema ?? '',
              imagem_capa_url: book.imagem_capa_url ?? '',
              arquivo_url: book.arquivo_url ?? '',
            }
          : emptyValues,
      )
    }
  }, [open, book, reset])

  async function handleFormSubmit(data: BookInput) {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book ? 'Editar livro' : 'Novo livro'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register('nome')} />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="autor">Autor</Label>
              <Input id="autor" {...register('autor')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sistema">Sistema</Label>
              <Input id="sistema" {...register('sistema')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={3} {...register('descricao')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem_capa_url">URL da capa</Label>
            <Input id="imagem_capa_url" placeholder="https://..." {...register('imagem_capa_url')} />
            {errors.imagem_capa_url && <p className="text-sm text-destructive">{errors.imagem_capa_url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="arquivo_url">URL do arquivo (opcional)</Label>
            <Input id="arquivo_url" placeholder="https://..." {...register('arquivo_url')} />
            {errors.arquivo_url && <p className="text-sm text-destructive">{errors.arquivo_url.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {book ? 'Salvar' : 'Adicionar livro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
