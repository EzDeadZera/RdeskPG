import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateCharacterNotes } from '@/features/characters/hooks/use-characters'

export function NotesEditor({ characterId, initialValue }: { characterId: string; initialValue: string | null }) {
  const [value, setValue] = useState(initialValue ?? '')
  const [saved, setSaved] = useState(false)
  const updateNotes = useUpdateCharacterNotes(characterId)

  useEffect(() => {
    setValue(initialValue ?? '')
  }, [initialValue])

  async function handleBlur() {
    if (value === (initialValue ?? '')) return
    await updateNotes.mutateAsync(value)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="space-y-2">
      <Textarea
        rows={10}
        placeholder="Anotações livres sobre o personagem..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
      />
      <p className="flex h-4 items-center gap-1 text-xs text-muted-foreground">
        {saved && (
          <>
            <Check className="size-3 text-accent" /> Salvo
          </>
        )}
      </p>
    </div>
  )
}
