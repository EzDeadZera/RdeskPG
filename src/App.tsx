import { AppProviders } from '@/app/providers/app-providers'
import { AppRouter } from '@/app/router'
import { ThemedToaster } from '@/app/providers/themed-toaster'

function App() {
  return (
    <AppProviders>
      <AppRouter />
      <ThemedToaster />
    </AppProviders>
  )
}

export default App
