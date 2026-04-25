import { useContasContext } from '../context/ContasContext'
import { formatBRL, formatData } from '../data/mockContas'
import { Box, Card, Group, List, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
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

  const torresData = [
    { label: 'Pagas', valor: cards[0].valor, cor: '#2f9e44' },
    { label: 'A vencer', valor: cards[1].valor, cor: '#f08c00' },
    { label: 'Atrasadas', valor: cards[2].valor, cor: '#e03131' },
  ]
  const maxTorre = Math.max(...torresData.map((item) => item.valor), 1)

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

      <motion.section
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease: 'easeOut' }}
      >
        <Paper withBorder radius="lg" p="md">
          <Stack gap="xs" mb="md">
            <Title order={2} size="h5">Torres de Controle Financeiro</Title>
            <Text size="sm" c="dimmed">Comparativo de valores por status das contas no mês.</Text>
          </Stack>

          <Group align="end" justify="space-around" style={{ minHeight: 250 }}>
            {torresData.map((item, idx) => {
              const altura = item.valor === 0 ? 0 : Math.max((item.valor / maxTorre) * 180, 16)

              return (
                <Stack key={item.label} align="center" gap={8} style={{ flex: 1, maxWidth: 180 }}>
                  <Text size="sm" fw={700}>{formatBRL(item.valor)}</Text>
                  <Box
                    style={{
                      width: '100%',
                      maxWidth: 72,
                      minWidth: 56,
                      height: 190,
                      display: 'flex',
                      alignItems: 'end',
                    }}
                  >
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, height: altura }
                      }
                      transition={{
                        duration: shouldReduceMotion ? 0.12 : 0.35,
                        delay: shouldReduceMotion ? 0 : idx * 0.06,
                        ease: 'easeOut',
                      }}
                      style={{
                        width: '100%',
                        height: shouldReduceMotion ? altura : undefined,
                        background: `linear-gradient(180deg, ${item.cor}, ${item.cor}CC)`,
                        borderRadius: '10px 10px 4px 4px',
                        boxShadow: `0 10px 20px ${item.cor}33`,
                      }}
                    />
                  </Box>
                  <Text size="sm" fw={600}>{item.label}</Text>
                </Stack>
              )
            })}
          </Group>
        </Paper>
      </motion.section>

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