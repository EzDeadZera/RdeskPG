import { evaluate } from 'mathjs'

// Normaliza "Força" -> "forca", "Modificador de Força" -> "modificador_de_forca"
// pra virar um nome de variável válido dentro da fórmula.
export function attributeVarName(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

export function evaluateFormula(formula: string, scope: Record<string, number>): number {
  const result = evaluate(formula, { ...scope })
  if (typeof result !== 'number' || Number.isNaN(result)) {
    throw new Error('A fórmula não retornou um número.')
  }
  return result
}

// Roda a fórmula com valores de exemplo pra pegar erro de sintaxe ou
// referência a atributo inexistente antes de salvar. Retorna null se ok,
// ou a mensagem de erro.
export function validateFormula(formula: string, availableAttributeNames: string[]): string | null {
  if (!formula.trim()) return null // fórmula é opcional
  const sampleScope = Object.fromEntries(availableAttributeNames.map((name) => [name, 10]))
  try {
    evaluateFormula(formula, sampleScope)
    return null
  } catch (error) {
    return error instanceof Error ? `Fórmula inválida: ${error.message}` : 'Fórmula inválida.'
  }
}
