import { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { Settings, Moon, Sun, UserCircle, Bell, Shield } from '../lib/icons'
import { useTheme } from '../hooks/useTheme'

export default function Configuracoes() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const darkMode = theme === 'dark'

  return (
    <Stack gap="md">
      <header>
        <Title order={1} size="h3"><Group gap={8}><Settings size={18} strokeWidth={1.5} /> Configurações</Group></Title>
        <Text c="dimmed">Central de preferências da aplicação.</Text>
      </header>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg" shadow="sm">
            <Stack>
              <Title order={2} size="h5"><Group gap={8}><UserCircle size={18} strokeWidth={1.5} /> Perfil</Group></Title>
              <Group>
                <Avatar size="lg" radius="xl" color="teal">W</Avatar>
                <div>
                  <Text fw={700}>William Costa</Text>
                  <Text size="sm" c="dimmed">william@email.com</Text>
                </div>
              </Group>
              <Button variant="default">Alterar foto</Button>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg" shadow="sm">
            <Stack>
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
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg" shadow="sm">
            <Stack>
              <Title order={2} size="h5"><Group gap={8}><Bell size={18} strokeWidth={1.5} /> Notificações</Group></Title>
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.currentTarget.checked)}
                label="Lembretes de vencimento"
              />
              <Text size="sm" c="dimmed">Configuração visual (sem persistência no servidor).</Text>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg" shadow="sm">
            <Stack>
              <Title order={2} size="h5"><Group gap={8}><Shield size={18} strokeWidth={1.5} /> Conta</Group></Title>
              <Group>
                <Button variant="default">Alterar senha</Button>
                <Button variant="default">Gerenciar sessão</Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
