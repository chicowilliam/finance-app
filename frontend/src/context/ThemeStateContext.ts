import { createContext } from 'react'

export type AppTheme = 'light' | 'dark'

export interface ThemeContextValue {
	theme: AppTheme
	setTheme: (nextTheme: AppTheme) => void
	toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
