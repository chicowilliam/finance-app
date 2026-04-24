import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Badge, Button, Group, Paper, Stack, Table, Text, Title } from '@mantine/core'
import { useContasContext } from '../context/ContasContext'
import { formatBRL, formatData } from '../data/mockContas'
import type { StatusConta } from '../data/mockContas'
import Loader from '../components/Loader'

type Filtro = StatusConta | 'todas'

const STATUS_LABEL: Record<StatusConta, string> = {
  paga: 'Paga', a_vencer: 'A vencer', atrasada: 'Atrasada',
}

export default function Contas() {
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const { contas, loading } = useContasContext()
  const shouldReduceMotion = useReducedMotion()

  if (loading) return <Loader variant="table" />

  const lista = filtro === 'todas' ? contas : contas.filter(c => c.status === filtro)

  const statusColor: Record<StatusConta, string> = {
    paga: 'green',
    a_vencer: 'yellow',
    atrasada: 'red',
  }

  return (
    <Stack>
      <Title order={1} size="h3">Lista de Contas</Title>

      <Group>
        {(['todas', 'paga', 'a_vencer', 'atrasada'] as Filtro[]).map(f => (
          <motion.div
            key={f}
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <Button
              variant={filtro === f ? 'filled' : 'light'}
              color={f === 'todas' ? 'gray' : statusColor[f as StatusConta]}
              onClick={() => setFiltro(f)}
            >
              {f === 'todas' ? 'Todas' : STATUS_LABEL[f as StatusConta]}
            </Button>
          </motion.div>
        ))}
      </Group>

      <Paper withBorder radius="lg" p="sm">
        <Table highlightOnHover striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Descrição</Table.Th>
              <Table.Th>Categoria</Table.Th>
              <Table.Th>Vencimento</Table.Th>
              <Table.Th>Valor</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <AnimatePresence initial={false}>
              {lista.map((c, idx) => (
                <motion.tr
                  key={c.id}
                  layout
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, delay: shouldReduceMotion ? 0 : idx * 0.02 }}
                >
                  <td><Text fw={600}>{c.descricao}</Text></td>
                  <td>{c.categoria}</td>
                  <td>{formatData(c.vencimento)}</td>
                  <td><Text fw={700}>{formatBRL(c.valor)}</Text></td>
                  <td><Badge color={statusColor[c.status]} variant="light">{STATUS_LABEL[c.status]}</Badge></td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </Table.Tbody>
        </Table>
        <AnimatePresence initial={false}>
          {lista.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              <Text c="dimmed" ta="center" py="md">Nenhuma conta encontrada.</Text>
            </motion.p>
          )}
        </AnimatePresence>
      </Paper>
    </Stack>
  )
}