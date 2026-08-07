import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useUIStore } from '@/store/ui-store'

export function DashboardLayout() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar className="hidden md:flex" />

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <Sidebar forceExpanded />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
