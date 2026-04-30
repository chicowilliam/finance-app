import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ActionIcon, Divider, Group, Modal, Paper, Stack, Text } from '@mantine/core'
import { motion, useReducedMotion } from 'motion/react'
import AppButton from './AppButton'
import { AppCurrencyInput } from './AppInput'
import { useContasContext } from '../context/ContasContext'
import { useSaldo } from '../hooks/useSaldo'
import { formatBRL } from '../utils/formatCurrency'
import { Banknote, Menu, PanelLeftOpen, Plus } from '../lib/icons'

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
  const { saldo, setSaldo } = useSaldo()
  const [saldoOpen, setSaldoOpen] = useState(false)
  const [saldoInput, setSaldoInput] = useState<number | undefined>(undefined)

  const totalAVencer = contas
    .filter(c => c.status === 'a_vencer' || c.status === 'atrasada')
    .reduce((sum, c) => sum + c.valor, 0)
  const contasEmAberto = contas.filter(c => c.status !== 'paga').length
  const saldoAposPagar = saldo !== null ? saldo - totalAVencer : null

  function openSaldoModal() {
    setSaldoInput(saldo ?? undefined)
    setSaldoOpen(true)
  }

  function handleSalvarSaldo() {
    setSaldo(saldoInput ?? null)
    setSaldoOpen(false)
  }

  if (!showTopbar) {
    return null
  }

  return (
    <>
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
          {/* Mobile: hamburger */}
          <ActionIcon
            hiddenFrom="sm"
            variant="subtle"
            onClick={onToggleMobile}
            aria-label="Abrir menu"
          >
            <Menu size={20} strokeWidth={1.8} />
          </ActionIcon>
          {/* Desktop: reabrir sidebar */}
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

          {/* Saldo disponível */}
          <Stack gap={1} className="magic-topbar__metric-card">
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Saldo disponível
            </Text>
            <Text fw={600} className="magic-topbar__metric-value" c={saldo === null ? 'dimmed' : undefined}>
              {saldo !== null ? formatBRL(saldo) : '—'}
            </Text>
            {saldoAposPagar !== null && (
              <Text size="xs" c={saldoAposPagar >= 0 ? 'teal' : 'red'}>
                {saldoAposPagar >= 0 ? '+' : ''}{formatBRL(saldoAposPagar)} após contas
              </Text>
            )}
          </Stack>

          <Divider orientation="vertical" />

          {/* Resumo financeiro */}
          <Stack gap={1} className="magic-topbar__metric-card">
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Resumo financeiro
            </Text>
            <Text fw={600} className="magic-topbar__metric-value">{formatBRL(totalAVencer)}</Text>
            <Text size="xs" c="dimmed">{contasEmAberto} conta(s) em aberto</Text>
          </Stack>

          {/* Ações */}
          <AppButton
            appearance="soft"
            tone="neutral"
            leftSection={<Banknote size={15} strokeWidth={1.8} />}
            onClick={openSaldoModal}
          >
            {saldo !== null ? 'Atualizar saldo' : 'Adicionar saldo'}
          </AppButton>
          <AppButton className="magic-cta-button" leftSection={<Plus size={15} strokeWidth={2} />} onClick={onAddBill}>
            Nova Conta
          </AppButton>
        </Group>
      </Paper>

      <Modal
        opened={saldoOpen}
        onClose={() => setSaldoOpen(false)}
        title="Saldo disponível"
        centered
        radius="md"
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Informe seu saldo atual em conta. Ele será salvo localmente e usado para calcular quanto sobra após pagar as contas.
          </Text>
          <AppCurrencyInput
            label="Saldo (R$)"
            placeholder="0,00"
            value={saldoInput}
            onValueChange={({ floatValue }) => setSaldoInput(floatValue ?? undefined)}
          />
          {saldoInput !== undefined && saldoInput !== null && (
            <Text size="xs" c={saldoInput - totalAVencer >= 0 ? 'teal' : 'red'}>
              Após pagar contas em aberto: {formatBRL(saldoInput - totalAVencer)}
            </Text>
          )}
          <Group justify="flex-end">
            <AppButton appearance="soft" tone="neutral" onClick={() => setSaldoOpen(false)}>Cancelar</AppButton>
            <AppButton onClick={handleSalvarSaldo}>Salvar saldo</AppButton>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}