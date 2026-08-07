import { Library, Plus } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'

// CRUD de bibliotecas e o botão "Nova Biblioteca" chegam na Fase 2.
export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Suas bibliotecas</h1>
        <p className="text-sm text-muted-foreground">Cada biblioteca é um sistema de RPG com suas próprias regras.</p>
      </div>

      <EmptyState
        icon={Library}
        title="Nenhuma biblioteca ainda"
        description="O CRUD de bibliotecas e o botão “Nova Biblioteca” chegam na Fase 2."
        action={
          <Button disabled className="gap-2">
            <Plus className="size-4" />
            Nova Biblioteca
          </Button>
        }
      />
    </div>
  )
}
