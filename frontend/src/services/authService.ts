import api from './api'

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
