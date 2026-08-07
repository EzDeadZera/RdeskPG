import { LogOut, Menu, Moon, Sun, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/theme-context'
import { useAuth } from '@/contexts/auth-context'
import { useUIStore } from '@/store/ui-store'
import { signOut } from '@/features/auth/services/auth-service'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Topbar() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { setMobileSidebarOpen } = useUIStore()
  const navigate = useNavigate()

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??'

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-muted-foreground"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="size-4" />
      </Button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              <Avatar>
                <AvatarFallback>
                  {user ? initials : <User className="size-4" />}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email ?? 'Conta'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Perfil (em breve)</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={handleSignOut} className="gap-2">
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
