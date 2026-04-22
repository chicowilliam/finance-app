import { post, postAuth } from './api'
import type { Conta } from '../data/mockContas'

export interface AuthResponse {
  access_token: string
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
