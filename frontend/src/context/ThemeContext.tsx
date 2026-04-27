import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './ThemeStateContext'
import type { AppTheme } from './ThemeStateContext'

const THEME_KEY = 'finance.theme'

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
