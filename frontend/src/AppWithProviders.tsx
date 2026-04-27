import { MantineProvider, createTheme } from '@mantine/core'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
import { useTheme } from './hooks/useTheme'
import App from './App'

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

export default function AppWithProviders() {
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
