import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider, createTheme } from '@mantine/core'
import { Analytics } from '@vercel/analytics/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './hooks/useTheme'
import { ErrorBoundary } from './components/ErrorBoundary'
import '@mantine/core/styles.css'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
})

const mantineTheme = createTheme({
	primaryColor: 'brand',
	colors: {
		brand: [
			'#edf8f3',
			'#d7f1e5',
			'#b0e2cc',
			'#87d2b2',
			'#65c39b',
			'#4fb98d',
			'#3cb38a',
			'#278567',
			'#1e7a5d',
			'#165e48',
		],
	},
	defaultRadius: 'md',
	fontFamily: 'var(--font-sans)',
	headings: {
		fontFamily: 'var(--font-sans)',
	},
	radius: {
		xs: 'var(--radius-sm)',
		sm: 'var(--radius-sm)',
		md: 'var(--radius-md)',
		lg: 'var(--radius-lg)',
		xl: 'var(--radius-xl)',
	},
	shadows: {
		xs: 'var(--shadow-xs)',
		sm: 'var(--shadow-sm)',
		md: 'var(--shadow-md)',
	},
})

function AppWithProviders() {
	const { theme } = useTheme()

	return (
		<MantineProvider theme={mantineTheme} forceColorScheme={theme}>
			<App />
			<Toaster
				position="top-right"
				richColors
				closeButton
				duration={3000}
			/>
			<Analytics />
		</MantineProvider>
	)
}

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