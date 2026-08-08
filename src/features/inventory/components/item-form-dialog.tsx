import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
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
import { itemSchema, type ItemFormValues, type ItemInput } from '@/features/inventory/schemas'
import type { Item } from '@/features/inventory/services/item-service'
import type { Attribute } from '@/features/attributes/services/attribute-service'

const emptyValues: ItemFormValues = {
  nome: '',
  categoria: '',
  quantidade: 1,
  peso: undefined,
  valor: undefined,
  descricao: '',
  imagem_url: '',
  modificadores: [],
}

export function ItemFormDialog({
  open,
  onOpenChange,
  item,
  attributes,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: Item
  attributes: Attribute[]
  onSubmit: (input: ItemInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues, unknown, ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: emptyValues,
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'modificadores' })

  useEffect(() => {
    if (open) {
      reset(
        item
          ? {
              nome: item.nome,
              categoria: item.categoria ?? '',
              quantidade: item.quantidade,
              peso: item.peso ?? undefined,
              valor: item.valor ?? undefined,
              descricao: item.descricao ?? '',
              imagem_url: item.imagem_url ?? '',
              modificadores: item.item_attribute_modifiers.map((m) => ({
                attribute_id: m.attribute_id,
                modificador: m.modificador,
              })),
            }
          : emptyValues,
      )
    }
  }, [open, item, reset])

  async function handleFormSubmit(data: ItemInput) {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? 'Editar item' : 'Novo item'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register('nome')} />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="col-span-1 space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input id="categoria" {...register('categoria')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Qtd.</Label>
              <Input id="quantidade" type="number" step="any" {...register('quantidade')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso</Label>
              <Input id="peso" type="number" step="any" {...register('peso')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input id="valor" type="number" step="any" {...register('valor')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={2} {...register('descricao')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem_url">URL da imagem</Label>
            <Input id="imagem_url" placeholder="https://..." {...register('imagem_url')} />
            {errors.imagem_url && <p className="text-sm text-destructive">{errors.imagem_url.message}</p>}
          </div>

          {attributes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Modifica atributos ao equipar</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => append({ attribute_id: attributes[0].id, modificador: 1 })}
                >
                  <Plus className="size-3" />
                  Adicionar
                </Button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <select
                    className="h-8 flex-1 rounded-md border border-input bg-transparent px-2 text-sm"
                    {...register(`modificadores.${index}.attribute_id` as const)}
                  >
                    {attributes.map((attr) => (
                      <option key={attr.id} value={attr.id}>
                        {attr.nome}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    step="any"
                    className="h-8 w-20"
                    {...register(`modificadores.${index}.modificador` as const)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {item ? 'Salvar' : 'Adicionar item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
