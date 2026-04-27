import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import AppWithProviders from './AppWithProviders'
import '@mantine/core/styles.css'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Elemento #root não encontrado no DOM. Verifique o index.html.')
}
createRoot(rootElement).render(
<StrictMode>
<ErrorBoundary>
<BrowserRouter>
<QueryClientProvider client={queryClient}>
<AuthProvider>
<ThemeProvider>
<AppWithProviders />
</ThemeProvider>
</AuthProvider>
</QueryClientProvider>
</BrowserRouter>
</ErrorBoundary>
</StrictMode>,
)