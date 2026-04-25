import { useLocation, useNavigate } from 'react-router-dom'
import { Badge, Burger, Button, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { useAuth } from '../hooks/useAuth'
import { useContasContext } from '../context/ContasContext'
import { formatBRL } from '../data/mockContas'
import { Plus, LogOut } from '../lib/icons'

const pageTitles: Record<string, string> = {
  '/app':            'Visão Geral',
  '/app/contas':     'Contas',
  '/app/calendario': 'Calendário',
  '/app/alertas':    'Alertas',
  '/app/configuracoes': 'Configurações',
}

interface NavbarProps {
  onAddBill: () => void
  sidebarOpened: boolean
  onToggleSidebar: () => void
}

export default function Navbar({ onAddBill, sidebarOpened, onToggleSidebar }: NavbarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { mode, logout } = useAuth()
  const title = pageTitles[pathname] ?? 'Dashboard'
  const { contas } = useContasContext()
  const totalAVencer = contas
    .filter(c => c.status === 'a_vencer' || c.status === 'atrasada')
    .reduce((sum, c) => sum + c.valor, 0)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <Paper component="header" withBorder radius={0} p="md">
      <Group justify="space-between" align="flex-start" gap="md">
        <Group gap="sm" align="flex-start">
          <Burger
            opened={sidebarOpened}
            onClick={onToggleSidebar}
            size="sm"
            aria-label="Toggle sidebar"
            mt={4}
          />
          <Stack gap={4}>
          <Text c="dimmed" size="sm">
            Dashboard {mode === 'guest' ? '• Convidado' : mode === 'user' ? '• Conta' : ''}
          </Text>
          <Title order={1} size="h2">{title}</Title>
          </Stack>
        </Group>

        <Group gap="sm" align="center">
          <Stack gap={2}>
            <Text size="xs" c="dimmed">Total a vencer</Text>
            <Badge color="yellow" variant="light" size="lg">{formatBRL(totalAVencer)}</Badge>
          </Stack>
          <Button leftSection={<Plus size={15} strokeWidth={2} />} onClick={onAddBill}>
            Nova Conta
          </Button>
          <Button variant="default" leftSection={<LogOut size={15} strokeWidth={1.5} />} onClick={handleLogout}>
            Sair
          </Button>
        </Group>
      </Group>
    </Paper>
  )
}