import { get, patch, post, postAuth } from './api'
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

export async function apiRequestEmailVerification(email: string): Promise<void> {
  return post<void>('/auth/request-email-verification', { email })
}

export async function apiVerifyEmail(token: string): Promise<void> {
  return post<void>('/auth/verify-email', { token })
}

export async function apiForgotPassword(email: string): Promise<void> {
  return post<void>('/auth/forgot-password', { email })
}

export async function apiResetPassword(token: string, novaSenha: string): Promise<void> {
  return post<void>('/auth/reset-password', { token, novaSenha })
}

export async function apiDeleteOwnAccount(confirmText: string): Promise<void> {
  return postAuth<void>('/auth/delete-account', { confirmText })
}

export interface UpdateProfilePayload {
  nome?: string
  email?: string
}

export async function apiUpdateProfile(payload: UpdateProfilePayload): Promise<AuthMeResponse> {
  return patch<AuthMeResponse>('/auth/me', payload)
}

export async function apiChangePassword(senhaAtual: string, novaSenha: string): Promise<void> {
  return patch<void>('/auth/me/password', { senhaAtual, novaSenha })
}
