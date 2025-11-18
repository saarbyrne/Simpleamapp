import { Providers } from './app/providers'
import { Dashboard } from './components/dashboard/dashboard'
import { Toaster } from 'sonner@2.0.3'

export default function App() {
  return (
    <Providers>
      <Dashboard />
      <Toaster 
        position="bottom-center"
        expand={true}
        richColors={true}
        closeButton={true}
      />
    </Providers>
  )
}