import { createContext } from 'react'

export type AuthMode = 'anonymous' | 'guest' | 'user'
export type AuthRole = 'user' | 'admin' | null

export interface AuthContextValue {
  mode: AuthMode
  role: AuthRole
  isAdmin: boolean
  isAuthenticated: boolean
  enterGuest: () => void
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
