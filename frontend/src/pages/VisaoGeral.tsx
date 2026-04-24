import { useContasContext } from '../context/ContasContext'
import { formatBRL, formatData } from '../data/mockContas'
import { Card, Group, List, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { AlertTriangle } from '../lib/icons'
import { motion, useReducedMotion } from 'motion/react'
import Loader from '../components/Loader'

export default function VisaoGeral() {
  const { contas, loading } = useContasContext()
  const shouldReduceMotion = useReducedMotion()

  if (loading) return <Loader variant="dashboard" />

  const pagas     = contas.filter(c => c.status === 'paga')
  const aVencer   = contas.filter(c => c.status === 'a_vencer')
  const atrasadas = contas.filter(c => c.status === 'atrasada')

  const cards = [
    { label: 'Total Pago', valor: pagas.reduce((s, c) => s + c.valor, 0), qtd: pagas.length, color: 'green' },
    { label: 'A Vencer', valor: aVencer.reduce((s, c) => s + c.valor, 0), qtd: aVencer.length, color: 'yellow' },
    { label: 'Atrasadas', valor: atrasadas.reduce((s, c) => s + c.valor, 0), qtd: atrasadas.length, color: 'red' },
    { label: 'Total do Mês', valor: contas.reduce((s, c) => s + c.valor, 0), qtd: contas.length, color: 'teal' },
  ]

  return (
    <Stack>
      <Title order={1} size="h3">Visão Geral do Mês</Title>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: shouldReduceMotion ? 0 : 0.05,
              staggerChildren: shouldReduceMotion ? 0 : 0.06,
            },
          },
        }}
      >
        <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="md">
          {cards.map(c => (
            <motion.div
              key={c.label}
              layout
              variants={{
                hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
                visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              transition={{ duration: shouldReduceMotion ? 0.12 : 0.24, ease: 'easeOut' }}
            >
              <Card withBorder radius="lg" shadow="sm" padding="md">
                <Stack gap={4}>
                  <Text c="dimmed" size="sm">{c.label}</Text>
                  <Text fw={800} size="xl">{formatBRL(c.valor)}</Text>
                  <Text c={c.color} fw={600} size="sm">{c.qtd} conta{c.qtd !== 1 ? 's' : ''}</Text>
                </Stack>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>
      </motion.div>

      {atrasadas.length > 0 && (
        <motion.section
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease: 'easeOut' }}
        >
          <Paper withBorder radius="lg" p="md">
            <Group mb="sm"><AlertTriangle size={18} strokeWidth={1.5} /> <Title order={2} size="h5">Contas Atrasadas</Title></Group>
            <List spacing="xs">
            {atrasadas.map((c, idx) => (
              <motion.div
                key={c.id}
                layout
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, delay: shouldReduceMotion ? 0 : idx * 0.04 }}
              >
                <List.Item>
                  <Group justify="space-between" wrap="nowrap">
                    <Text fw={600}>{c.descricao}</Text>
                    <Text size="sm" c="dimmed">{formatData(c.vencimento)}</Text>
                    <Text fw={700} c="red">{formatBRL(c.valor)}</Text>
                  </Group>
                </List.Item>
              </motion.div>
            ))}
            </List>
          </Paper>
        </motion.section>
      )}
    </Stack>
  )
}