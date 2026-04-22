import api from './api'
import type { Conta } from '../data/mockContas'

export interface AuthResponse {
  access_token: string
}

export async function apiRegister(
  nome: string,
  email: string,
  senha: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { nome, email, senha })
  return data
}

export async function apiLogin(email: string, senha: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, senha })
  return data
}

export async function apiUpgradeFromGuest(
  contas: Omit<Conta, 'id'>[],
): Promise<Conta[]> {
  const { data } = await api.post<Conta[]>('/auth/upgrade-from-guest', { contas })
  return data
}
