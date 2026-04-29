import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthStateContext'
import type { AuthMode, AuthRole } from './AuthStateContext'
import { apiLogin, apiMe, apiRegister, apiUpgradeFromGuest } from '../services/authService'
import { AUTH_EXPIRED_EVENT } from '../services/api'
import type { Conta } from '../types/Bill'

const AUTH_MODE_KEY = 'finance.auth.mode'
const AUTH_ROLE_KEY = 'finance.auth.role'
const GUEST_CONTAS_KEY = 'finance.guest.contas'
const ADMIN_EMAIL_OVERRIDES = ['vini_9256@outlook.com.br']

function parseRoleFromToken(): AuthRole {
	const token = localStorage.getItem('token')
	if (!token) return null

	try {
		const parts = token.split('.')
		if (parts.length < 2) return 'user'
		const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
		return payload?.role === 'admin' ? 'admin' : 'user'
	} catch {
		return 'user'
	}
}

function parseEmailFromToken(): string | null {
	const token = localStorage.getItem('token')
	if (!token) return null

	try {
		const parts = token.split('.')
		if (parts.length < 2) return null
		const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
		return typeof payload?.email === 'string' ? payload.email : null
	} catch {
		return null
	}
}

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
			return
		} catch (err) {
			const message = err instanceof Error ? err.message : ''

			// Compatibilidade com backends antigos sem /auth/me.
			if (message.includes('GET /auth/me failed: 404') || message.includes('Cannot GET /api/auth/me')) {
				persistRole(parseRoleFromToken())
				return
			}

			if (message.includes('Sessão expirada')) {
				throw err
			}

			persistRole(parseRoleFromToken())
		}
	}, [persistRole])

	const enterGuest = useCallback(() => {
		persistMode('guest')
		persistRole(null)
		localStorage.removeItem('token')
		localStorage.removeItem(AUTH_ROLE_KEY)
	}, [persistMode])

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
		if (mode !== 'user') {
			return
		}

		void refreshProfile().catch(() => {
			persistMode('anonymous')
		})
	}, [mode, refreshProfile, persistMode])

	useEffect(() => {
		function handleAuthExpired() {
			persistMode('anonymous')
		}

		window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
		return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
	}, [persistMode])

	const value = useMemo(
		() => {
			const tokenEmail = parseEmailFromToken()?.toLowerCase()
			const hasEmailAdminOverride = Boolean(
				tokenEmail && ADMIN_EMAIL_OVERRIDES.includes(tokenEmail),
			)

			return {
			mode,
			role,
			isAdmin: role === 'admin' || (mode === 'user' && hasEmailAdminOverride),
			isAuthenticated: mode === 'guest' || mode === 'user',
			enterGuest,
			login,
			register,
			logout,
			}
		},
		[mode, role, enterGuest, login, register, logout],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


