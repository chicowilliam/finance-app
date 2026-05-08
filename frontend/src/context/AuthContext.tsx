import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthStateContext'
import type { AuthMode, AuthRole } from './AuthStateContext'
import { apiLogin, apiMe, apiRegister, apiUpgradeFromGuest } from '../services/authService'
import { AUTH_EXPIRED_EVENT } from '../services/api'
import type { Conta } from '../types/Bill'
import { STORAGE_KEYS } from '../utils/storageKeys'
import { getStr, loadJSON } from '../utils/storageHelpers'

const AUTH_MODE_KEY  = STORAGE_KEYS.AUTH_MODE
const AUTH_ROLE_KEY  = STORAGE_KEYS.AUTH_ROLE

function popGuestContas(): Omit<Conta, 'id'>[] {
  try {
    const contas = loadJSON<Conta[]>(STORAGE_KEYS.GUEST_CONTAS, [])
    localStorage.removeItem(STORAGE_KEYS.GUEST_CONTAS)
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

function parseTimeoutMs(value: string): number | null {
	switch (value) {
		case '15min':
			return 15 * 60 * 1000
		case '30min':
			return 30 * 60 * 1000
		case '1h':
			return 60 * 60 * 1000
		case 'nunca':
		default:
			return null
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [role, setRole] = useState<AuthRole>(() => {
		const hasToken = Boolean(localStorage.getItem('token'))
		const savedMode = localStorage.getItem(AUTH_MODE_KEY)
		if (!hasToken || savedMode !== 'user') {
			localStorage.removeItem(AUTH_ROLE_KEY)
			return null
		}
		const savedRole = localStorage.getItem(AUTH_ROLE_KEY)
		if (savedRole === 'admin' || savedRole === 'user') {
			return savedRole
		}
		return null
	})

	const [mode, setMode] = useState<AuthMode>(() => {
		const hasToken = Boolean(localStorage.getItem('token'))
		const savedMode = localStorage.getItem(AUTH_MODE_KEY) as AuthMode | null
		if (savedMode === 'guest') {
			return 'guest'
		}
		if (savedMode === 'user' && hasToken) {
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
		setUserName(null)
		setUserEmail(null)
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
		setUserName(null)
		setUserEmail(null)
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

	useEffect(() => {
		if (mode === 'anonymous') return

		let timeoutId: ReturnType<typeof setTimeout> | null = null
		let timeoutMs = parseTimeoutMs(getStr(STORAGE_KEYS.PREF_SESSION_TIMEOUT, 'nunca'))

		const clearTimer = () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
				timeoutId = null
			}
		}

		const armTimer = () => {
			clearTimer()
			if (!timeoutMs) return
			timeoutId = setTimeout(() => {
				persistMode('anonymous')
			}, timeoutMs)
		}

		const handleActivity = () => armTimer()
		const handleTimeoutPrefChange = () => {
			timeoutMs = parseTimeoutMs(getStr(STORAGE_KEYS.PREF_SESSION_TIMEOUT, 'nunca'))
			armTimer()
		}

		window.addEventListener('mousemove', handleActivity)
		window.addEventListener('mousedown', handleActivity)
		window.addEventListener('keydown', handleActivity)
		window.addEventListener('scroll', handleActivity, true)
		window.addEventListener('touchstart', handleActivity, true)
		window.addEventListener('finance:pref-session-timeout-changed', handleTimeoutPrefChange)

		armTimer()

		return () => {
			clearTimer()
			window.removeEventListener('mousemove', handleActivity)
			window.removeEventListener('mousedown', handleActivity)
			window.removeEventListener('keydown', handleActivity)
			window.removeEventListener('scroll', handleActivity, true)
			window.removeEventListener('touchstart', handleActivity, true)
			window.removeEventListener('finance:pref-session-timeout-changed', handleTimeoutPrefChange)
		}
	}, [mode, persistMode])

	const value = useMemo(
		() => {
			return {
			mode,
			role,
			isAdmin: mode === 'user' && role === 'admin',
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


