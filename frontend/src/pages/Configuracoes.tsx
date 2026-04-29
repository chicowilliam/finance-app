import { useState } from 'react'
import {
  Avatar,
  Grid,
  Group,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { Settings, Moon, Sun, UserCircle, Bell, Shield, LogOut } from '../lib/icons'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import AppButton from '../components/AppButton'
import AppPanel from '../components/AppPanel'

export default function Configuracoes() {
  const { theme, setTheme } = useTheme()
  const { mode, logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const darkMode = theme === 'dark'

  const isGuest = mode === 'guest'

  const panelMinHeight = 168

  return (
    <Stack gap="xs">
      <header>
        <Title order={1} size="h3"><Group gap={8}><Settings size={18} strokeWidth={1.5} /> Configurações</Group></Title>
        <Text c="dimmed">Central de preferências da aplicação.</Text>
      </header>

      <Grid gutter="sm" align="stretch">
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
            </Stack>
          </AppPanel>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
