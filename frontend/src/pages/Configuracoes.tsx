import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Grid,
  Group,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { toast } from 'sonner'
import { Settings, Moon, Sun, UserCircle, Bell, Shield, LogOut } from '../lib/icons'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import AppButton from '../components/AppButton'
import AppPanel from '../components/AppPanel'
import AppModal from '../components/AppModal'
import { AppInput } from '../components/AppInput'
import { apiDeleteOwnAccount } from '../services/authService'

export default function Configuracoes() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { mode, logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const darkMode = theme === 'dark'

  const isGuest = mode === 'guest'

  const panelMinHeight = 168
  const canDelete = deleteText.trim() === 'Apagar minha conta'

  async function handleDeleteOwnAccount() {
    if (!canDelete) return

    setDeleting(true)
    try {
      await apiDeleteOwnAccount(deleteText.trim())
      toast.success('Conta apagada com sucesso.')
      logout()
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao apagar conta')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Stack gap="xs">
      <header>
        <Title order={1} size="h3"><Group gap={8}><Settings size={18} strokeWidth={1.5} /> Configurações</Group></Title>
        <Text c="dimmed">Central de preferências da aplicação.</Text>
      </header>

      <Grid gap="sm" align="stretch">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <AppPanel h="100%">
            <Stack align="flex-start" justify="space-between" h="100%" gap="xs" style={{ minHeight: panelMinHeight }}>
              <Title order={2} size="h5"><Group gap={8}><UserCircle size={18} strokeWidth={1.5} /> Perfil</Group></Title>
              {isGuest ? (
                <Text size="sm" c="dimmed">Você está no modo convidado. Crie uma conta para salvar seu perfil.</Text>
              ) : (
                <Group>
                  <Avatar size="lg" radius="xl" color="teal">U</Avatar>
                  <div>
                    <Text fw={700}>Usuário autenticado</Text>
                    <Text size="sm" c="dimmed">Conta ativa</Text>
                  </div>
                </Group>
              )}
            </Stack>
          </AppPanel>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <AppPanel h="100%">
            <Stack align="flex-start" justify="space-between" h="100%" gap="xs" style={{ minHeight: panelMinHeight }}>
              <Title order={2} size="h5">
                <Group gap={8}>{darkMode ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />} Tema</Group>
              </Title>
              <Switch
                checked={darkMode}
                onChange={(e) => setTheme(e.currentTarget.checked ? 'dark' : 'light')}
                label="Modo noturno"
              />
              <Text size="sm" c="dimmed">Tema aplicado globalmente no app.</Text>
            </Stack>
          </AppPanel>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <AppPanel h="100%">
            <Stack align="flex-start" justify="space-between" h="100%" gap="xs" style={{ minHeight: panelMinHeight }}>
              <Title order={2} size="h5"><Group gap={8}><Bell size={18} strokeWidth={1.5} /> Notificações</Group></Title>
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.currentTarget.checked)}
                label="Lembretes de vencimento"
              />
              <Text size="sm" c="dimmed">Configuração visual (sem persistência no servidor).</Text>
            </Stack>
          </AppPanel>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <AppPanel h="100%">
            <Stack align="flex-start" justify="space-between" h="100%" gap="xs" style={{ minHeight: panelMinHeight }}>
              <Title order={2} size="h5"><Group gap={8}><Shield size={18} strokeWidth={1.5} /> Conta</Group></Title>
              <AppButton
                appearance="outline"
                tone="danger"
                onClick={logout}
              >
                <Group gap={6}><LogOut size={16} strokeWidth={1.8} /> Sair da conta</Group>
              </AppButton>
              {!isGuest && (
                <AppButton
                  appearance="soft"
                  tone="danger"
                  onClick={() => {
                    setDeleteText('')
                    setDeleteOpen(true)
                  }}
                >
                  Apagar minha conta
                </AppButton>
              )}
            </Stack>
          </AppPanel>
        </Grid.Col>
      </Grid>

      <AppModal
        opened={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Apagar conta permanentemente"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Para confirmar, digite exatamente: Apagar minha conta
          </Text>
          <AppInput
            label="Texto de confirmação"
            placeholder="Apagar minha conta"
            value={deleteText}
            onChange={(e) => setDeleteText(e.currentTarget.value)}
          />
          <Group justify="flex-end">
            <AppButton appearance="soft" tone="neutral" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </AppButton>
            <AppButton tone="danger" onClick={() => void handleDeleteOwnAccount()} disabled={!canDelete || deleting}>
              Confirmar exclusão
            </AppButton>
          </Group>
        </Stack>
      </AppModal>
    </Stack>
  )
}
