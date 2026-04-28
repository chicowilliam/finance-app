import { useLocation } from 'react-router-dom'
import { ActionIcon, Group, Paper, Stack, Text } from '@mantine/core'
import { motion, useReducedMotion } from 'motion/react'
import AppButton from './AppButton'
import { useContasContext } from '../context/ContasContext'
import { formatBRL } from '../utils/formatCurrency'
import { Menu, PanelLeftOpen, Plus } from '../lib/icons'

interface NavbarProps {
  onAddBill: () => void
  mobileOpened: boolean
  onToggleMobile: () => void
  desktopOpened: boolean
  onToggleDesktop: () => void
}

export default function Navbar({ onAddBill, onToggleMobile, desktopOpened, onToggleDesktop }: NavbarProps) {
  const { pathname } = useLocation()
  const shouldReduceMotion = useReducedMotion()
  const showTopbar = pathname === '/app'
  const { contas } = useContasContext()
  const totalAVencer = contas
    .filter(c => c.status === 'a_vencer' || c.status === 'atrasada')
    .reduce((sum, c) => sum + c.valor, 0)
  const contasEmAberto = contas.filter(c => c.status !== 'paga').length

  if (!showTopbar) {
    return null
  }

  return (
    <Paper
      component={motion.header}
      withBorder
      radius="xl"
      p="sm"
      className="magic-topbar"
      initial={false}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.12 : 0.24, ease: 'easeOut' }}
    >
      <Group gap="sm" align="center" wrap="wrap" justify="flex-start" className="magic-topbar__actions">
        {/* Mobile: hamburger burger */}
        <ActionIcon
          hiddenFrom="sm"
          variant="subtle"
          onClick={onToggleMobile}
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
            aria-label="Expandir sidebar"
          >
            <PanelLeftOpen size={20} strokeWidth={1.8} />
          </ActionIcon>
        )}
          <Stack gap={1} className="magic-topbar__metric-card">
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Resumo financeiro
            </Text>
            <Text fw={600} className="magic-topbar__metric-value">{formatBRL(totalAVencer)}</Text>
            <Text size="xs" c="dimmed">{contasEmAberto} conta(s) em aberto</Text>
          </Stack>
          <AppButton className="magic-cta-button" leftSection={<Plus size={15} strokeWidth={2} />} onClick={onAddBill}>
            Nova Conta
          </AppButton>
      </Group>
    </Paper>
  )
}