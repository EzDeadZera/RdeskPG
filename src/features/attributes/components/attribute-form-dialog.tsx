import { useEffect, useMemo, useState } from 'react'
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
import { attributeSchema, type AttributeFormValues, type AttributeInput } from '@/features/attributes/schemas'
import type { Attribute } from '@/features/attributes/services/attribute-service'
import { attributeVarName, validateFormula } from '@/lib/formula-engine'

interface AttributeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attribute?: Attribute
  otherAttributeNames: string[] // nomes (já em formato de variável) dos outros atributos da biblioteca
  onSubmit: (input: AttributeInput) => Promise<void>
}

const emptyValues: AttributeFormValues = {
  nome: '',
  valor_inicial: 10,
  valor_min: undefined,
  valor_max: undefined,
  formula: '',
  descricao: '',
}

export function AttributeFormDialog({
  open,
  onOpenChange,
  attribute,
  otherAttributeNames,
  onSubmit,
}: AttributeFormDialogProps) {
  const [formulaError, setFormulaError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AttributeFormValues, unknown, AttributeInput>({
    resolver: zodResolver(attributeSchema),
    defaultValues: emptyValues,
  })

  const formula = watch('formula')
  const nome = watch('nome')

  const availableNames = useMemo(() => {
    const names = [...otherAttributeNames]
    if (nome) names.push(attributeVarName(nome))
    return names
  }, [otherAttributeNames, nome])

  useEffect(() => {
    if (open) {
      reset(
        attribute
          ? {
              nome: attribute.nome,
              valor_inicial: attribute.valor_inicial,
              valor_min: attribute.valor_min ?? undefined,
              valor_max: attribute.valor_max ?? undefined,
              formula: attribute.formula ?? '',
              descricao: attribute.descricao ?? '',
            }
          : emptyValues,
      )
      setFormulaError(null)
    }
  }, [open, attribute, reset])

  useEffect(() => {
    setFormulaError(validateFormula(formula ?? '', availableNames))
  }, [formula, availableNames])

  async function handleFormSubmit(data: AttributeInput) {
    if (validateFormula(data.formula ?? '', availableNames)) return
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{attribute ? 'Editar atributo' : 'Novo atributo'}</DialogTitle>
          <DialogDescription>
            A fórmula (opcional) pode usar o nome de qualquer atributo da biblioteca como variável.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Ex: Força, Modificador de Força..." {...register('nome')} />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
            {nome && <p className="text-xs text-muted-foreground">Variável na fórmula: {attributeVarName(nome)}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="valor_inicial">Valor inicial</Label>
              <Input id="valor_inicial" type="number" step="any" {...register('valor_inicial')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_min">Mínimo</Label>
              <Input id="valor_min" type="number" step="any" {...register('valor_min')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_max">Máximo</Label>
              <Input id="valor_max" type="number" step="any" {...register('valor_max')} />
            </div>
          </div>
          {errors.valor_min && <p className="text-sm text-destructive">{errors.valor_min.message}</p>}

          <div className="space-y-2">
            <Label htmlFor="formula">Fórmula de cálculo (opcional)</Label>
            <Input id="formula" placeholder="Ex: floor((forca-10)/2)" {...register('formula')} className="font-mono text-sm" />
            {formulaError ? (
              <p className="text-sm text-destructive">{formulaError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Deixe em branco pra usar direto o valor do atributo, sem cálculo.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={2} {...register('descricao')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || Boolean(formulaError)} className="gap-2">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {attribute ? 'Salvar' : 'Adicionar atributo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
