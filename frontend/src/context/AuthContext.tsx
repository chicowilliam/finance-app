import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthStateContext'
import type { AuthMode } from './AuthStateContext'
import { apiLogin, apiRegister } from '../services/authService'

const AUTH_MODE_KEY = 'finance.auth.mode'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<AuthMode>(() => {
		const savedMode = localStorage.getItem(AUTH_MODE_KEY) as AuthMode | null
		if (savedMode === 'guest' || savedMode === 'user') {
			return savedMode
		}
		return 'anonymous'
	})

	const persistMode = useCallback((nextMode: AuthMode) => {
		setMode(nextMode)

		if (nextMode === 'anonymous') {
			localStorage.removeItem(AUTH_MODE_KEY)
			localStorage.removeItem('token')
			return
		}

		localStorage.setItem(AUTH_MODE_KEY, nextMode)
	}, [])

	const enterGuest = useCallback(() => {
		persistMode('guest')
	}, [persistMode])

	const login = useCallback(async (email: string, senha: string) => {
		const { access_token } = await apiLogin(email, senha)
		localStorage.setItem('token', access_token)
		persistMode('user')
	}, [persistMode])

	const register = useCallback(async (nome: string, email: string, senha: string) => {
		const { access_token } = await apiRegister(nome, email, senha)
		localStorage.setItem('token', access_token)
		persistMode('user')
	}, [persistMode])

	const logout = useCallback(() => {
		persistMode('anonymous')
	}, [persistMode])

	const value = useMemo(
		() => ({
			mode,
			isAuthenticated: mode === 'guest' || mode === 'user',
			enterGuest,
			login,
			register,
			logout,
		}),
		[mode, enterGuest, login, register, logout],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

