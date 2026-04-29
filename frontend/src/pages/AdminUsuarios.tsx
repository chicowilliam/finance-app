import { useEffect, useMemo, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { toast } from 'sonner'
import AppButton from '../components/AppButton'
import AppModal from '../components/AppModal'
import AppPanel from '../components/AppPanel'
import { AppInput } from '../components/AppInput'
import {
  deleteAdminUser,
  listAdminAuditLogs,
  listAdminUsers,
  setAdminUserActive,
  type AdminAuditLog,
  type AdminUser,
} from '../services/adminService'
import { CheckCircle, Shield, UserCircle, X } from '../lib/icons'

type DeleteModalState = {
  open: boolean
  user: AdminUser | null
}

const ACTION_LABEL: Record<AdminAuditLog['action'], string> = {
  user_deactivated: 'Desativou',
  user_reactivated: 'Reativou',
  user_deleted: 'Excluiu',
}

export default function AdminUsuarios() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingLogs, setLoadingLogs] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteState, setDeleteState] = useState<DeleteModalState>({ open: false, user: null })
  const [confirmEmail, setConfirmEmail] = useState('')
  const [confirmText, setConfirmText] = useState('')

  const canDelete = useMemo(() => {
    return Boolean(
      deleteState.user &&
      confirmText === 'DELETE' &&
      confirmEmail.trim().toLowerCase() === deleteState.user.email.toLowerCase(),
    )
  }, [deleteState.user, confirmEmail, confirmText])

  async function loadUsers() {
    setLoadingUsers(true)
    try {
      setUsers(await listAdminUsers())
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar usuários')
    } finally {
      setLoadingUsers(false)
    }
  }

  async function loadAuditLogs() {
    setLoadingLogs(true)
    try {
      setAuditLogs(await listAdminAuditLogs(80))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar auditoria')
    } finally {
      setLoadingLogs(false)
    }
  }

  useEffect(() => {
    void loadUsers()
    void loadAuditLogs()
  }, [])

  async function handleToggleActive(user: AdminUser) {
    try {
      await setAdminUserActive(user.id, !user.isActive)
      toast.success(`Conta ${!user.isActive ? 'reativada' : 'desativada'}: ${user.email}`)
      await Promise.all([loadUsers(), loadAuditLogs()])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao alterar status da conta')
    }
  }

  function openDeleteModal(user: AdminUser) {
    setDeleteState({ open: true, user })
    setConfirmEmail('')
    setConfirmText('')
  }

  function closeDeleteModal() {
    setDeleteState({ open: false, user: null })
    setConfirmEmail('')
    setConfirmText('')
  }

  async function handleDeleteUser() {
    if (!deleteState.user || !canDelete) return

    setDeleting(true)
    try {
      await deleteAdminUser(deleteState.user.id, confirmEmail.trim())
      toast.success(`Usuário excluído: ${deleteState.user.email}`)
      closeDeleteModal()
      await Promise.all([loadUsers(), loadAuditLogs()])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao excluir usuário')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Stack>
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={1} size="h3">
            <Group gap={8}><Shield size={18} strokeWidth={1.5} /> Painel Admin</Group>
          </Title>
          <Text c="dimmed">Gerencie usuários, acesso e trilha de auditoria.</Text>
        </div>
        <Group gap="xs">
          <AppButton appearance="soft" onClick={() => void loadAuditLogs()}>Atualizar auditoria</AppButton>
          <AppButton appearance="outline" onClick={() => void loadUsers()}>Atualizar usuários</AppButton>
        </Group>
      </Group>

      <AppPanel p={0}>
        <ScrollArea>
          <Table highlightOnHover striped style={{ minWidth: 760 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Usuário</Table.Th>
                <Table.Th>E-mail</Table.Th>
                <Table.Th>Permissão</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap={8} wrap="nowrap">
                      <UserCircle size={17} strokeWidth={1.6} />
                      <Text fw={600}>{user.nome}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>
                    <Badge color={user.role === 'admin' ? 'violet' : 'blue'} variant="light">
                      {user.role === 'admin' ? 'Admin' : 'Usuário'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={user.isActive ? 'green' : 'gray'} variant="light">
                      {user.isActive ? 'Ativa' : 'Desativada'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6} wrap="nowrap">
                      <ActionIcon
                        color={user.isActive ? 'yellow' : 'green'}
                        variant="light"
                        aria-label={user.isActive ? 'Desativar conta' : 'Reativar conta'}
                        onClick={() => void handleToggleActive(user)}
                      >
                        {user.isActive ? <X size={14} strokeWidth={2} /> : <CheckCircle size={14} strokeWidth={2} />}
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="light"
                        aria-label="Excluir conta"
                        onClick={() => openDeleteModal(user)}
                      >
                        <Text fw={800} size="xs">DEL</Text>
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        {!loadingUsers && users.length === 0 && (
          <Text c="dimmed" size="sm" ta="center" py="lg">Nenhum usuário encontrado.</Text>
        )}
        {loadingUsers && (
          <Text c="dimmed" size="sm" ta="center" py="lg">Carregando usuários...</Text>
        )}
      </AppPanel>

      <AppPanel p={0}>
        <ScrollArea>
          <Table highlightOnHover striped style={{ minWidth: 760 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Quando</Table.Th>
                <Table.Th>Ação</Table.Th>
                <Table.Th>Admin</Table.Th>
                <Table.Th>Alvo</Table.Th>
                <Table.Th>Detalhes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {auditLogs.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>{new Date(log.createdAt).toLocaleString('pt-BR')}</Table.Td>
                  <Table.Td>{ACTION_LABEL[log.action]}</Table.Td>
                  <Table.Td>{log.actorUser.email}</Table.Td>
                  <Table.Td>{log.targetUser.email}</Table.Td>
                  <Table.Td>{log.details ?? '-'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        {!loadingLogs && auditLogs.length === 0 && (
          <Text c="dimmed" size="sm" ta="center" py="lg">Sem eventos de auditoria.</Text>
        )}
        {loadingLogs && (
          <Text c="dimmed" size="sm" ta="center" py="lg">Carregando auditoria...</Text>
        )}
      </AppPanel>

      <AppModal
        opened={deleteState.open}
        onClose={closeDeleteModal}
        title="Confirmar exclusão definitiva"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Esta ação remove a conta de forma permanente. Digite o e-mail e o texto DELETE para confirmar.
          </Text>
          <AppInput
            label="E-mail do usuário"
            placeholder="usuario@email.com"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.currentTarget.value)}
          />
          <AppInput
            label="Texto de confirmação"
            placeholder="DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.currentTarget.value)}
          />
          <Group justify="flex-end">
            <AppButton appearance="soft" tone="neutral" onClick={closeDeleteModal}>Cancelar</AppButton>
            <AppButton
              tone="danger"
              onClick={() => void handleDeleteUser()}
              disabled={!canDelete || deleting}
            >
              Excluir definitivamente
            </AppButton>
          </Group>
        </Stack>
      </AppModal>
    </Stack>
  )
}
