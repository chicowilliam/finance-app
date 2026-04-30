import { createContext } from 'react'

export interface SettingsModalContextValue {
	opened: boolean
	open: () => void
	close: () => void
}

export const SettingsModalContext = createContext<SettingsModalContextValue | null>(null)
