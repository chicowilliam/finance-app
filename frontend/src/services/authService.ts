import { get, post, postAuth } from './api'
import type { Conta } from '../types/Bill'

export interface AuthResponse {
  access_token: string
}

export interface AuthMeResponse {
  id: number
  email: string
  role: 'user' | 'admin'
}

export async function apiRegister(
  nome: string,
  email: string,
  senha: string,
): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/register', { nome, email, senha })
}

export async function apiLogin(email: string, senha: string): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', { email, senha })
}

export async function apiUpgradeFromGuest(
  contas: Omit<Conta, 'id'>[],
): Promise<Conta[]> {
  return postAuth<Conta[]>('/auth/upgrade-from-guest', { contas })
}

export async function apiMe(): Promise<AuthMeResponse> {
  return get<AuthMeResponse>('/auth/me')
}
