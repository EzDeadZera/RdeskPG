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
import { characterSchema, type CharacterFormValues, type CharacterInput } from '@/features/characters/schemas'
import type { Character } from '@/features/characters/services/character-service'

const emptyValues: CharacterFormValues = {
  nome: '',
  classe: '',
  raca: '',
  nivel: undefined,
  idade: '',
  aparencia: '',
  historia: '',
  retrato_url: '',
}

export function CharacterFormDialog({
  open,
  onOpenChange,
  character,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  character?: Character
  onSubmit: (input: CharacterInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CharacterFormValues, unknown, CharacterInput>({
    resolver: zodResolver(characterSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        character
          ? {
              nome: character.nome,
              classe: character.classe ?? '',
              raca: character.raca ?? '',
              nivel: character.nivel ?? undefined,
              idade: character.idade ?? '',
              aparencia: character.aparencia ?? '',
              historia: character.historia ?? '',
              retrato_url: character.retrato_url ?? '',
            }
          : emptyValues,
      )
    }
  }, [open, character, reset])

  async function handleFormSubmit(data: CharacterInput) {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{character ? 'Editar personagem' : 'Novo personagem'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register('nome')} />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="classe">Classe</Label>
              <Input id="classe" {...register('classe')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="raca">Raça</Label>
              <Input id="raca" {...register('raca')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivel">Nível</Label>
              <Input id="nivel" type="number" step="any" {...register('nivel')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idade">Idade</Label>
            <Input id="idade" {...register('idade')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aparencia">Aparência</Label>
            <Textarea id="aparencia" rows={2} {...register('aparencia')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="historia">História</Label>
            <Textarea id="historia" rows={3} {...register('historia')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retrato_url">URL do retrato</Label>
            <Input id="retrato_url" placeholder="https://..." {...register('retrato_url')} />
            {errors.retrato_url && <p className="text-sm text-destructive">{errors.retrato_url.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {character ? 'Salvar' : 'Criar personagem'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
