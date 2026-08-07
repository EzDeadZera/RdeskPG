import { Outlet } from 'react-router-dom'
import { Dices, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'

export function AuthLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 text-muted-foreground"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      >
        {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>

      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Dices className="size-5" />
        </div>
        <span className="text-lg font-semibold">RPG Dashboard</span>
      </div>

      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
