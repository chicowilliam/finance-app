import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type AppTheme = 'light' | 'dark'

interface ThemeContextValue {
	theme: AppTheme
	setTheme: (nextTheme: AppTheme) => void
	toggleTheme: () => void
}

const THEME_KEY = 'finance.theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<AppTheme>(() => {
		const stored = localStorage.getItem(THEME_KEY)
		return stored === 'dark' ? 'dark' : 'light'
	})

	useEffect(() => {
		document.documentElement.dataset.theme = theme
		document.documentElement.style.colorScheme = theme
	}, [theme])

	const setTheme = useCallback((nextTheme: AppTheme) => {
		setThemeState(nextTheme)
		localStorage.setItem(THEME_KEY, nextTheme)
	}, [])

	const toggleTheme = useCallback(() => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}, [theme, setTheme])

	const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
