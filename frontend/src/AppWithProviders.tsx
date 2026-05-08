import { useEffect } from 'react'
import { MantineProvider, createTheme } from '@mantine/core'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
import { useTheme } from './hooks/useTheme'
import { STORAGE_KEYS } from './utils/storageKeys'
import { getBool, getStr } from './utils/storageHelpers'
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

	useEffect(() => {
		const root = document.documentElement
		const accent = getStr(STORAGE_KEYS.PREF_ACCENT, 'teal')
		const accentPalette: Record<string, { color: string; strong: string }> = {
			teal: { color: '#2ecc8a', strong: '#1e7a5d' },
			blue: { color: '#3b82f6', strong: '#1d4ed8' },
			violet: { color: '#8b5cf6', strong: '#6d28d9' },
			orange: { color: '#f97316', strong: '#c2410c' },
			pink: { color: '#ec4899', strong: '#be185d' },
		}
		const selected = accentPalette[accent] ?? accentPalette.teal

		root.style.setProperty('--color-brand', selected.color)
		root.style.setProperty('--color-brand-strong', selected.strong)
		root.dataset.density = getStr(STORAGE_KEYS.PREF_DENSITY, 'confortavel')
		root.dataset.reduceMotion = String(getBool(STORAGE_KEYS.PREF_REDUCE_MOTION))
		root.dataset.highContrast = String(getBool(STORAGE_KEYS.PREF_HIGH_CONTRAST))
	}, [])

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
