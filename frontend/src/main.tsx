import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider, createTheme } from '@mantine/core'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './hooks/useTheme'
import '@mantine/core/styles.css'
import './index.css'
import App from './App'

const mantineTheme = createTheme({
	primaryColor: 'teal',
	defaultRadius: 'md',
	fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
})

function AppWithProviders() {
	const { theme } = useTheme()

	return (
		<MantineProvider theme={mantineTheme} forceColorScheme={theme}>
			<App />
			<Analytics />
		</MantineProvider>
	)
}

createRoot(document.getElementById('root')!).render(
<StrictMode>
<BrowserRouter>
<AuthProvider>
<ThemeProvider>
<AppWithProviders />
</ThemeProvider>
</AuthProvider>
</BrowserRouter>
</StrictMode>,
)