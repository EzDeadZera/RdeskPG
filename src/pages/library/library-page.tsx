import { useParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'

// Abas de Informações, Atributos configuráveis, Livros e Campanhas chegam
// nas Fases 2, 3 e 4.
export function LibraryPage() {
  const { libraryId } = useParams()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Biblioteca</h1>
        <p className="text-sm text-muted-foreground">ID: {libraryId}</p>
      </div>

      <EmptyState
        icon={BookOpen}
        title="Atributos, livros e campanhas chegam a seguir"
        description="Fase 2 (atributos configuráveis), Fase 3 (livros) e Fase 4 (campanhas)."
      />
    </div>
  )
}
