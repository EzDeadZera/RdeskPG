import { useParams } from 'react-router-dom'
import { ScrollText } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'

// Info, atributos, skills, inventário, equipamentos, magias e anotações
// chegam na Fase 5.
export function CharacterSheetPage() {
  const { characterId } = useParams()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Ficha do personagem</h1>
        <p className="text-sm text-muted-foreground">ID: {characterId}</p>
      </div>

      <EmptyState
        icon={ScrollText}
        title="Ficha completa chega na Fase 5"
        description="Info, atributos, skills, inventário, equipamentos, magias e anotações."
      />
    </div>
  )
}
