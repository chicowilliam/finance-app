import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthStateContext'
import type { AuthMode } from './AuthStateContext'
import { apiLogin, apiRegister, apiUpgradeFromGuest } from '../services/authService'
import { AUTH_EXPIRED_EVENT } from '../services/api'
import type { Conta } from '../data/mockContas'

const AUTH_MODE_KEY = 'finance.auth.mode'
const GUEST_CONTAS_KEY = 'finance.guest.contas'

function popGuestContas(): Omit<Conta, 'id'>[] {
  try {
    const raw = localStorage.getItem(GUEST_CONTAS_KEY)
    const contas = raw ? (JSON.parse(raw) as Conta[]) : []
    localStorage.removeItem(GUEST_CONTAS_KEY)
    return contas.map(({ descricao, valor, vencimento, status, categoria }) => ({
      descricao,
      valor,
      vencimento,
      status,
      categoria,
    }))
  } catch {
    return []
  }
}

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
		const wasGuest = localStorage.getItem(AUTH_MODE_KEY) === 'guest'
		const guestContas = wasGuest ? popGuestContas() : []

		const { access_token } = await apiLogin(email, senha)
		localStorage.setItem('token', access_token)
		persistMode('user')

		if (wasGuest && guestContas.length > 0) {
			await apiUpgradeFromGuest(guestContas)
		}
	}, [persistMode])

	const register = useCallback(async (nome: string, email: string, senha: string) => {
		const wasGuest = localStorage.getItem(AUTH_MODE_KEY) === 'guest'
		const guestContas = wasGuest ? popGuestContas() : []

		const { access_token } = await apiRegister(nome, email, senha)
		localStorage.setItem('token', access_token)
		persistMode('user')

		if (wasGuest && guestContas.length > 0) {
			await apiUpgradeFromGuest(guestContas)
		}
	}, [persistMode])

	const logout = useCallback(() => {
		persistMode('anonymous')
	}, [persistMode])

	useEffect(() => {
		function handleAuthExpired() {
			persistMode('anonymous')
		}

		window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
		return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
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


