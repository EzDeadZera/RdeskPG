import { Link, useLocation } from 'react-router-dom'
import { Dices, Library, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Nav do nível raiz (lista de bibliotecas). Quando o usuário entra numa
// biblioteca/campanha específica, esta lista passa a ganhar seções extras
// (Atributos, Livros, Campanhas...) — isso chega na Fase 2.
const navItems = [{ label: 'Bibliotecas', href: '/dashboard', icon: Library }]

export function Sidebar({
  className,
  forceExpanded = false,
}: {
  className?: string
  forceExpanded?: boolean
}) {
  const { pathname } = useLocation()
  const { sidebarCollapsed: storeCollapsed, toggleSidebar } = useUIStore()
  const sidebarCollapsed = forceExpanded ? false : storeCollapsed

  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-card border-r border-border transition-[width] duration-200',
        sidebarCollapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Dices className="size-4" />
        </div>
        {!sidebarCollapsed && <span className="text-sm font-semibold truncate">RPG Dashboard</span>}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground',
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {!forceExpanded && (
        <>
          <Separator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full justify-center text-muted-foreground"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </Button>
          </div>
        </>
      )}
    </aside>
  )
}
