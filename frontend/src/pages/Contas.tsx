import { useState, useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ActionIcon, Badge, Group, Pagination, Paper, Stack, Table, Text, Title } from '@mantine/core'
import { useContasContext } from '../context/ContasContext'
import { formatBRL, formatData } from '../data/mockContas'
import type { Conta, StatusConta } from '../data/mockContas'
import AppPanel from '../components/AppPanel'
import Loader from '../components/Loader'
import { ChevronUp, ChevronDown, ChevronsUpDown } from '../lib/icons'
import AppButton from '../components/AppButton'
import { AppSelect } from '../components/AppInput'

type Filtro = StatusConta | 'todas'
type SortKey = 'descricao' | 'categoria' | 'vencimento' | 'valor' | 'status'
type SortDir = 'asc' | 'desc'

const STATUS_LABEL: Record<StatusConta, string> = {
  paga: 'Paga', a_vencer: 'A vencer', atrasada: 'Atrasada',
}

const PAGE_SIZE_OPTIONS = ['5', '10', '20', '50']

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={14} strokeWidth={1.5} style={{ opacity: 0.35 }} />
  return sortDir === 'asc'
    ? <ChevronUp size={14} strokeWidth={2} />
    : <ChevronDown size={14} strokeWidth={2} />
}

export default function Contas() {
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { contas, loading } = useContasContext()
  const shouldReduceMotion = useReducedMotion()

  if (loading) return <Loader variant="table" />

  const statusTone: Record<StatusConta, 'success' | 'warning' | 'danger'> = {
    paga: 'success', a_vencer: 'warning', atrasada: 'danger',
  }

  function handleSort(col: SortKey) {
    if (sortKey === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(col)
      setSortDir('asc')
    }
    setPage(1)
  }

  function handleFiltro(f: Filtro) {
    setFiltro(f)
    setPage(1)
  }

  const filtrada = filtro === 'todas' ? contas : contas.filter(c => c.status === filtro)

  const ordenada = useMemo(() => {
    if (!sortKey) return filtrada
    return [...filtrada].sort((a, b) => {
      const av = a[sortKey as keyof Conta]
      const bv = b[sortKey as keyof Conta]
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), 'pt-BR')
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtrada, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(ordenada.length / pageSize))
  const pagina = ordenada.slice((page - 1) * pageSize, page * pageSize)

  const cols: { key: SortKey; label: string }[] = [
    { key: 'descricao', label: 'Descrição' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'vencimento', label: 'Vencimento' },
    { key: 'valor', label: 'Valor' },
    { key: 'status', label: 'Status' },
  ]

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
            <AppButton
              appearance={filtro === f ? 'solid' : 'soft'}
              tone={f === 'todas' ? 'neutral' : statusTone[f as StatusConta]}
              onClick={() => handleFiltro(f)}
            >
              {f === 'todas' ? 'Todas' : STATUS_LABEL[f as StatusConta]}
            </AppButton>
          </motion.div>
        ))}
      </Group>

      <AppPanel p="sm">
        <Table highlightOnHover striped>
          <Table.Thead>
            <Table.Tr>
              {cols.map(({ key, label }) => (
                <Table.Th key={key}>
                  <Group gap={4} wrap="nowrap" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort(key)}>
                    <Text size="sm" fw={600}>{label}</Text>
                    <ActionIcon variant="transparent" size="xs" color="gray">
                      <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                    </ActionIcon>
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <AnimatePresence initial={false}>
              {pagina.map((c, idx) => (
                <motion.tr
                  key={c.id}
                  layout
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, delay: shouldReduceMotion ? 0 : idx * 0.02 }}
                >
                  <td><Text fw={600}>{c.descricao}</Text></td>
                  <td>{c.categoria}</td>
                  <td>{formatData(c.vencimento)}</td>
                  <td><Text fw={700}>{formatBRL(c.valor)}</Text></td>
                  <td><Badge color={c.status === 'paga' ? 'green' : c.status === 'a_vencer' ? 'yellow' : 'red'} variant="light">{STATUS_LABEL[c.status]}</Badge></td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </Table.Tbody>
        </Table>

        <AnimatePresence initial={false}>
          {pagina.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <Text c="dimmed" ta="center" py="md">Nenhuma conta encontrada.</Text>
            </motion.p>
          )}
        </AnimatePresence>

        {ordenada.length > 0 && (
          <Group justify="space-between" align="center" mt="md" px="xs">
            <Group gap="xs" align="center">
              <Text size="sm" c="dimmed">Linhas por página:</Text>
              <AppSelect
                size="xs"
                w={70}
                data={PAGE_SIZE_OPTIONS}
                value={String(pageSize)}
                onChange={(v) => { setPageSize(Number(v ?? 10)); setPage(1) }}
                allowDeselect={false}
              />
              <Text size="sm" c="dimmed">
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, ordenada.length)} de {ordenada.length}
              </Text>
            </Group>
            <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
          </Group>
        )}
      </AppPanel>
    </Stack>
  )
}