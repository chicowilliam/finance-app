import { useContasContext } from '../context/ContasContext'
import { formatBRL } from '../data/mockContas'
import type { Conta } from '../data/mockContas'
import { Badge, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { AlertCircle, Clock, Shield } from '../lib/icons'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Loader from '../components/Loader'
import AppPanel from '../components/AppPanel'
import { daysOverdue, daysUntilDue } from '../utils/formatDate'

const diasAtraso = (c: Conta) => daysOverdue(c.vencimento)
const diasParaVencer = (c: Conta) => daysUntilDue(c.vencimento)

const alertCard = (tone: 'rose' | 'amber') => ({
  background: tone === 'rose'
    ? 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, transparent 60%)'
    : 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, transparent 60%)',
  border: `1px solid ${tone === 'rose' ? 'rgba(239,68,68,0.25)' : 'rgba(251,191,36,0.28)'}`,
  borderRadius: 'var(--mantine-radius-lg)',
  padding: '16px',
})

export default function Alertas() {
  const { contas, loading } = useContasContext()
  const shouldReduceMotion = useReducedMotion()

  if (loading) return <Loader variant="alerts" />

  const atrasadas = contas.filter(c => c.status === 'atrasada')
  const urgentes  = contas.filter(c => c.status === 'a_vencer' && diasParaVencer(c) <= 5)
  const allClear  = atrasadas.length === 0 && urgentes.length === 0

  return (
    <Stack>
      <Title order={1} size="h3">Alertas de Risco</Title>

      {/* ─── All clear ─── */}
      <AnimatePresence initial={false}>
        {allClear && (
          <motion.div
            key="all-clear"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.28, ease: 'easeOut' }}
          >
            <AppPanel p="xl" style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.07) 0%, transparent 60%)',
              borderColor: 'rgba(34,197,94,0.3)',
            }}>
              <Group gap="lg" align="center">
                <ThemeIcon radius="xl" size={52} style={{
                  background: 'rgba(34,197,94,0.14)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#16a34a',
                }}>
                  <Shield size={24} strokeWidth={1.5} />
                </ThemeIcon>
                <Stack gap={4}>
                  <Text fw={700} size="lg" style={{ letterSpacing: '-0.01em' }}>Tudo em dia!</Text>
                  <Text c="dimmed" size="sm">Nenhum alerta de risco no momento. Continue assim.</Text>
                </Stack>
              </Group>
            </AppPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Atrasadas ─── */}
      <AnimatePresence initial={false}>
        {atrasadas.length > 0 && (
          <motion.section
            key="atrasadas"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.22, ease: 'easeOut' }}
          >
            <Group mb="sm">
              <ThemeIcon radius="md" size={28} style={{
                background: 'rgba(239,68,68,0.14)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#dc2626',
              }}>
                <AlertCircle size={15} strokeWidth={2} />
              </ThemeIcon>
              <Title order={2} size="h5">Contas Atrasadas ({atrasadas.length})</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
              {atrasadas.map((c, idx) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, delay: shouldReduceMotion ? 0 : idx * 0.05, ease: 'easeOut' }}
                  whileHover={shouldReduceMotion ? undefined : { y: -2, boxShadow: '0 6px 24px rgba(239,68,68,0.18)' }}
                >
                  <div style={alertCard('rose')}>
                    <Stack gap={8}>
                      <Group justify="space-between" wrap="nowrap">
                        <Text fw={600}>{c.descricao}</Text>
                        <Text fw={700} c="red">{formatBRL(c.valor)}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">{c.categoria}</Text>
                        <Badge color="red" variant="light">
                          {diasAtraso(c)} dia{diasAtraso(c) !== 1 ? 's' : ''} em atraso
                        </Badge>
                      </Group>
                    </Stack>
                  </div>
                </motion.div>
              ))}
            </SimpleGrid>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── Urgentes ─── */}
      <AnimatePresence initial={false}>
        {urgentes.length > 0 && (
          <motion.section
            key="urgentes"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.22, ease: 'easeOut', delay: shouldReduceMotion ? 0 : 0.05 }}
          >
            <Group mb="sm">
              <ThemeIcon radius="md" size={28} style={{
                background: 'rgba(251,191,36,0.16)',
                border: '1px solid rgba(251,191,36,0.28)',
                color: '#b45309',
              }}>
                <Clock size={15} strokeWidth={2} />
              </ThemeIcon>
              <Title order={2} size="h5">Vencem em Breve ({urgentes.length})</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
              {urgentes.map((c, idx) => {
                const dias = diasParaVencer(c)
                return (
                  <motion.div
                    key={c.id}
                    layout
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, delay: shouldReduceMotion ? 0 : idx * 0.05, ease: 'easeOut' }}
                    whileHover={shouldReduceMotion ? undefined : { y: -2, boxShadow: '0 6px 24px rgba(251,191,36,0.2)' }}
                  >
                    <div style={alertCard('amber')}>
                      <Stack gap={8}>
                        <Group justify="space-between" wrap="nowrap">
                          <Text fw={600}>{c.descricao}</Text>
                          <Text fw={700} c="yellow.8">{formatBRL(c.valor)}</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">{c.categoria}</Text>
                          <Badge color="yellow" variant="light">
                            {dias === 0 ? 'Vence hoje!' : `${dias} dia${dias !== 1 ? 's' : ''} para vencer`}
                          </Badge>
                        </Group>
                      </Stack>
                    </div>
                  </motion.div>
                )
              })}
            </SimpleGrid>
          </motion.section>
        )}
      </AnimatePresence>
    </Stack>
  )
}