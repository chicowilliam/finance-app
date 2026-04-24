import { useContasContext } from '../context/ContasContext'
import { formatBRL } from '../data/mockContas'
import type { Conta } from '../data/mockContas'
import { Badge, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { AlertCircle, Clock, CheckCircle } from '../lib/icons'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Loader from '../components/Loader'

const hoje = new Date()

const diasAtraso = (c: Conta) =>
  Math.floor((hoje.getTime() - new Date(c.vencimento + 'T00:00:00').getTime()) / 86_400_000)

const diasParaVencer = (c: Conta) =>
  Math.ceil((new Date(c.vencimento + 'T00:00:00').getTime() - hoje.getTime()) / 86_400_000)

export default function Alertas() {
  const { contas, loading } = useContasContext()
  const shouldReduceMotion = useReducedMotion()

  if (loading) return <Loader variant="alerts" />

  const atrasadas = contas.filter(c => c.status === 'atrasada')
  const urgentes  = contas.filter(c => c.status === 'a_vencer' && diasParaVencer(c) <= 5)

  return (
    <Stack>
      <Title order={1} size="h3">Alertas de Risco</Title>

      <AnimatePresence initial={false}>
        {atrasadas.length > 0 && (
        <motion.section
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.22, ease: 'easeOut' }}
        >
          <Group mb="sm">
            <AlertCircle size={18} strokeWidth={1.5} />
            <Title order={2} size="h5">Contas Atrasadas ({atrasadas.length})</Title>
          </Group>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: shouldReduceMotion ? 0 : 0.02,
                  staggerChildren: shouldReduceMotion ? 0 : 0.05,
                },
              },
            }}
          >
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
            {atrasadas.map(c => (
              <motion.div
                key={c.id}
                layout
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
                  visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: 'easeOut' }}
              >
                <Card withBorder radius="lg" shadow="sm">
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
                </Card>
              </motion.div>
            ))}
            </SimpleGrid>
          </motion.div>
        </motion.section>
      )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
      {urgentes.length > 0 && (
        <motion.section
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.22, ease: 'easeOut' }}
        >
          <Group mb="sm">
            <Clock size={18} strokeWidth={1.5} />
            <Title order={2} size="h5">Vencem em Breve ({urgentes.length})</Title>
          </Group>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: shouldReduceMotion ? 0 : 0.02,
                  staggerChildren: shouldReduceMotion ? 0 : 0.05,
                },
              },
            }}
          >
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
            {urgentes.map(c => {
              const dias = diasParaVencer(c)
              return (
                <motion.div
                  key={c.id}
                  layout
                  variants={{
                    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
                    visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: 'easeOut' }}
                >
                  <Card withBorder radius="lg" shadow="sm">
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
                  </Card>
                </motion.div>
              )
            })}
            </SimpleGrid>
          </motion.div>
        </motion.section>
      )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {atrasadas.length === 0 && urgentes.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <Paper withBorder radius="lg" p="md">
              <Group><CheckCircle size={18} strokeWidth={1.5} /> <Text fw={600}>Tudo em dia! Nenhum alerta no momento.</Text></Group>
            </Paper>
          </motion.p>
        )}
      </AnimatePresence>
    </Stack>
  )
}