import { useLocation, useNavigate } from 'react-router-dom'
import { ActionIcon, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { motion, useReducedMotion } from 'motion/react'
import AppButton from './AppButton'
import { useAuth } from '../hooks/useAuth'
import { useContasContext } from '../context/ContasContext'
import { formatBRL } from '../utils/formatCurrency'
import { LogOut, Menu, PanelLeftOpen, Plus } from '../lib/icons'

const pageTitles: Record<string, string> = {
  '/app':            'Visão Geral',
  '/app/contas':     'Contas',
  '/app/calendario': 'Calendário',
  '/app/alertas':    'Alertas',
  '/app/configuracoes': 'Configurações',
}

interface NavbarProps {
  onAddBill: () => void
  mobileOpened: boolean
  onToggleMobile: () => void
  desktopOpened: boolean
  onToggleDesktop: () => void
}

export default function Navbar({ onAddBill, onToggleMobile, desktopOpened, onToggleDesktop }: NavbarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { mode, logout } = useAuth()
  const shouldReduceMotion = useReducedMotion()
  const title = pageTitles[pathname] ?? 'Dashboard'
  const { contas } = useContasContext()
  const totalAVencer = contas
    .filter(c => c.status === 'a_vencer' || c.status === 'atrasada')
    .reduce((sum, c) => sum + c.valor, 0)
  const contasEmAberto = contas.filter(c => c.status !== 'paga').length
  const possuiContas = contas.length > 0

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <Paper
      component={motion.header}
      withBorder
      radius="xl"
      p="md"
      className="magic-topbar"
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.12 : 0.24, ease: 'easeOut' }}
    >
      <div className="magic-topbar__glow" />
      <Group justify="space-between" align="flex-start" gap="md">
        <Group gap="sm" align="flex-start">
          {/* Mobile: hamburger burger */}
          <ActionIcon
            hiddenFrom="md"
            variant="subtle"
            onClick={onToggleMobile}
            mt={4}
            aria-label="Abrir menu"
          >
            <Menu size={20} strokeWidth={1.8} />
          </ActionIcon>
          {/* Desktop: reabrir sidebar quando recolhida */}
          {!desktopOpened && (
            <ActionIcon
              visibleFrom="md"
              variant="subtle"
              onClick={onToggleDesktop}
              mt={4}
              aria-label="Expandir sidebar"
            >
              <PanelLeftOpen size={20} strokeWidth={1.8} />
            </ActionIcon>
          )}
            <Stack gap={6}>
            <Text c="dimmed" size="sm" fw={600}>
              Dashboard {mode === 'guest' ? '• Convidado' : mode === 'user' ? '• Conta' : ''}
            </Text>
            <Title order={1} size="h2">{title}</Title>
            <Text size="sm" c="dimmed" maw={460}>
              {possuiContas
                ? 'Acompanhe os indicadores do mês com uma leitura mais clara e rápida.'
                : 'Seu espaço financeiro está pronto para receber a primeira conta com um visual mais premium.'}
            </Text>
          </Stack>
        </Group>

          <Group gap="sm" align="center" wrap="wrap" justify="flex-end" className={`magic-topbar__actions ${pathname === '/app/configuracoes' ? 'magic-topbar__actions--no-metric' : ''}`}>
            <Stack gap={1} className={`magic-topbar__metric-card ${pathname === '/app/configuracoes' ? 'magic-topbar__metric-card--hidden' : ''}`}>
              <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                Total a vencer
              </Text>
              <Text fw={600} className="magic-topbar__metric-value">{formatBRL(totalAVencer)}</Text>
              <Text size="xs" c="dimmed">{contasEmAberto} conta(s) em aberto</Text>
            </Stack>
            <AppButton className="magic-cta-button" leftSection={<Plus size={15} strokeWidth={2} />} onClick={onAddBill}>
            Nova Conta
          </AppButton>
          <AppButton appearance="outline" tone="neutral" leftSection={<LogOut size={15} strokeWidth={1.5} />} onClick={handleLogout}>
            Sair
          </AppButton>
        </Group>
      </Group>
    </Paper>
  )
}