import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthStateContext'
import type { AuthMode, AuthRole } from './AuthStateContext'
import { apiLogin, apiMe, apiRegister, apiUpgradeFromGuest } from '../services/authService'
import { AUTH_EXPIRED_EVENT } from '../services/api'
import type { Conta } from '../types/Bill'

const AUTH_MODE_KEY = 'finance.auth.mode'
const AUTH_ROLE_KEY = 'finance.auth.role'
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
	const [role, setRole] = useState<AuthRole>(() => {
		const savedRole = localStorage.getItem(AUTH_ROLE_KEY)
		if (savedRole === 'admin' || savedRole === 'user') {
			return savedRole
		}
		return null
	})

	const [mode, setMode] = useState<AuthMode>(() => {
		const savedMode = localStorage.getItem(AUTH_MODE_KEY) as AuthMode | null
		if (savedMode === 'guest' || savedMode === 'user') {
			return savedMode
		}
		return 'anonymous'
	})

	const isFirstRenderRef = useRef(true)

	const [userName, setUserName] = useState<string | null>(null)
	const [userEmail, setUserEmail] = useState<string | null>(null)

	const persistRole = useCallback((nextRole: AuthRole) => {
		setRole(nextRole)
		if (!nextRole) {
			localStorage.removeItem(AUTH_ROLE_KEY)
			return
		}
		localStorage.setItem(AUTH_ROLE_KEY, nextRole)
	}, [])

	const persistMode = useCallback((nextMode: AuthMode) => {
		setMode(nextMode)

		if (nextMode === 'anonymous') {
			localStorage.removeItem(AUTH_MODE_KEY)
			localStorage.removeItem('token')
			persistRole(null)
			return
		}

		localStorage.setItem(AUTH_MODE_KEY, nextMode)
	}, [persistRole])

	const refreshProfile = useCallback(async () => {
		try {
			const me = await apiMe()
			persistRole(me.role)
			setUserName(me.nome ?? null)
			setUserEmail(me.email ?? null)
			return
		} catch (err) {
			const message = err instanceof Error ? err.message : ''

			if (message.includes('Sessão expirada')) {
				throw err
			}

			persistRole(null)
		}
	}, [persistRole])

	const enterGuest = useCallback(() => {
		persistMode('guest')
		persistRole(null)
		localStorage.removeItem('token')
		localStorage.removeItem(AUTH_ROLE_KEY)
	}, [persistMode, persistRole])

	const login = useCallback(async (email: string, senha: string) => {
		const wasGuest = localStorage.getItem(AUTH_MODE_KEY) === 'guest'
		const guestContas = wasGuest ? popGuestContas() : []

		const { access_token } = await apiLogin(email, senha)
		localStorage.setItem('token', access_token)
		persistMode('user')
		await refreshProfile()

		if (wasGuest && guestContas.length > 0) {
			await apiUpgradeFromGuest(guestContas)
		}
	}, [persistMode, refreshProfile])

	const register = useCallback(async (nome: string, email: string, senha: string) => {
		const wasGuest = localStorage.getItem(AUTH_MODE_KEY) === 'guest'
		const guestContas = wasGuest ? popGuestContas() : []

		const { access_token } = await apiRegister(nome, email, senha)
		localStorage.setItem('token', access_token)
		persistMode('user')
		await refreshProfile()

		if (wasGuest && guestContas.length > 0) {
			await apiUpgradeFromGuest(guestContas)
		}
	}, [persistMode, refreshProfile])

	const logout = useCallback(() => {
		persistMode('anonymous')
	}, [persistMode])

	useEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false
			return
		}

		if (mode !== 'user') {
			return
		}

		let isMounted = true

		// eslint-disable-next-line react-hooks/set-state-in-effect
		void refreshProfile().catch(() => {
			if (isMounted) {
				persistMode('anonymous')
			}
		})

		return () => {
			isMounted = false
		}
	}, [mode, persistMode, refreshProfile])

	useEffect(() => {
		function handleAuthExpired() {
			persistMode('anonymous')
		}

		window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
		return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
	}, [persistMode])

	const value = useMemo(
		() => {
			return {
			mode,
			role,
			isAdmin: role === 'admin',
			isAuthenticated: mode === 'guest' || mode === 'user',
			userName,
			userEmail,
			enterGuest,
			login,
			register,
			logout,
			refreshProfile,
			}
		},
		[mode, role, userName, userEmail, enterGuest, login, register, logout, refreshProfile],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


