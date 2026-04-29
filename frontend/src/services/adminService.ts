import { delWithBody, get, patch } from './api'

export interface AdminUser {
  id: number
  nome: string
  email: string
  role: 'user' | 'admin'
  isActive: boolean
}

export interface AdminAuditLog {
  id: number
  action: 'user_deactivated' | 'user_reactivated' | 'user_deleted'
  actorUserId: number
  targetUserId: number
  createdAt: string
  details: string | null
  actorUser: { id: number; nome: string; email: string }
  targetUser: { id: number; nome: string; email: string }
}

export function listAdminUsers(): Promise<AdminUser[]> {
  return get<AdminUser[]>('/admin/users')
}

export function setAdminUserActive(id: number, value: boolean): Promise<AdminUser> {
  return patch<AdminUser>(`/admin/users/${id}/active?value=${value}`, {})
}

export function deleteAdminUser(id: number, confirmEmail: string): Promise<AdminUser> {
  return delWithBody<AdminUser>(`/admin/users/${id}`, {
    confirmEmail,
    confirmText: 'DELETE',
  })
}

export function listAdminAuditLogs(limit = 100): Promise<AdminAuditLog[]> {
  return get<AdminAuditLog[]>(`/admin/audit-logs?limit=${limit}`)
}
