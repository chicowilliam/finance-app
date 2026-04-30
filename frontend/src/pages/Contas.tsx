import { useState, useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ActionIcon, Badge, Group, Pagination, Paper, ScrollArea, SimpleGrid, Stack, Table, Text, Title, Tooltip } from '@mantine/core'
import { toast } from 'sonner'
import { useContasContext } from '../context/ContasContext'
import { formatBRL } from '../utils/formatCurrency'
import { formatData } from '../data/mockContas'
import type { Conta, StatusConta } from '../types/Bill'
import AppPanel from '../components/AppPanel'
import Loader from '../components/Loader'
import { ChevronUp, ChevronDown, ChevronsUpDown, CheckCircle, Plus, Trash2 } from '../lib/icons'
import AppButton from '../components/AppButton'
import { AppSelect } from '../components/AppInput'

type Filtro = StatusConta | 'todas'
type SortKey = 'descricao' | 'categoria' | 'vencimento' | 'valor' | 'status'
type SortDir = 'asc' | 'desc'

const STATUS_LABEL: Record<StatusConta, string> = {
  paga: 'Paga', a_vencer: 'A vencer', atrasada: 'Atrasada',
}

const STATUS_COLOR: Record<StatusConta, string> = {
  paga: '#2f9e44', a_vencer: '#f08c00', atrasada: '#e03131',
}

const PAGE_SIZE_OPTIONS = ['5', '10', '20', '50']

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={14} strokeWidth={1.5} style={{ opacity: 0.35 }} />
  return sortDir === 'asc'
    ? <ChevronUp size={14} strokeWidth={2} />
    : <ChevronDown size={14} strokeWidth={2} />
}

function diasRelativo(vencimento: string): { label: string; color: string } {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const venc = new Date(vencimento + 'T00:00:00')
  const diff = Math.round((venc.getTime() - hoje.getTime()) / 86_400_000)
  if (diff === 0) return { label: 'Hoje', color: '#f08c00' }
  if (diff === 1) return { label: 'Amanhã', color: '#f08c00' }
  if (diff > 0) return { label: `em ${diff}d`, color: '#2f9e44' }
  return { label: `${Math.abs(diff)}d atrás`, color: '#e03131' }
}

export default function Contas() {
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { contas, loading, atualizarStatus, remover } = useContasContext()
  const shouldReduceMotion = useReducedMotion()

  const filtrada = useMemo(
    () => (filtro === 'todas' ? contas : contas.filter(c => c.status === filtro)),
    [contas, filtro],
  )

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

  const stats = useMemo(() => {
    const pagas    = contas.filter(c => c.status === 'paga')
    const aVencer  = contas.filter(c => c.status === 'a_vencer')
    const atrasadas = contas.filter(c => c.status === 'atrasada')
    return [
      { label: 'Total', qtd: contas.length,    valor: contas.reduce((s, c) => s + c.valor, 0),    color: 'var(--mantine-color-teal-6)',   bg: 'var(--mantine-color-teal-0)' },
      { label: 'Pagas', qtd: pagas.length,      valor: pagas.reduce((s, c) => s + c.valor, 0),     color: '#2f9e44', bg: '#f0fdf4' },
      { label: 'A vencer', qtd: aVencer.length, valor: aVencer.reduce((s, c) => s + c.valor, 0),   color: '#f08c00', bg: '#fffbeb' },
      { label: 'Atrasadas', qtd: atrasadas.length, valor: atrasadas.reduce((s, c) => s + c.valor, 0), color: '#e03131', bg: '#fff5f5' },
    ]
  }, [contas])

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

  const totalPages = Math.max(1, Math.ceil(ordenada.length / pageSize))
  const pagina = ordenada.slice((page - 1) * pageSize, page * pageSize)

  const cols: { key: SortKey; label: string }[] = [
    { key: 'descricao', label: 'Descrição' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'vencimento', label: 'Vencimento' },
    { key: 'valor', label: 'Valor' },
    { key: 'status', label: 'Status' },
  ]

  async function handlePagar(c: Conta) {
    try {
      await atualizarStatus(c.id, 'paga')
      toast.success(`"${c.descricao}" marcada como paga`)
    } catch {
      toast.error('Erro ao atualizar o status da conta')
    }
  }

  async function handleRemover(c: Conta) {
    try {
      await remover(c.id)
      toast.success(`"${c.descricao}" removida`)
    } catch {
      toast.error('Erro ao remover a conta')
    }
  }

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={1} size="h3">Lista de Contas</Title>
        <AppButton
          leftSection={<Plus size={15} strokeWidth={2} />}
          onClick={() => window.dispatchEvent(new Event('finance:new-bill'))}
        >
          Nova Conta
        </AppButton>
      </Group>

      {/* Mini stat strip */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
        {stats.map(s => (
          <motion.div
            key={s.label}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Paper
              p="sm"
              radius="md"
              withBorder
              style={{ borderColor: s.color, background: s.bg, borderLeftWidth: 3 }}
            >
              <Text size="xs" fw={700} style={{ color: s.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {s.label}
              </Text>
              <Text fw={800} size="sm" mt={2}>{formatBRL(s.valor)}</Text>
              <Text size="xs" c="dimmed">{s.qtd} conta{s.qtd !== 1 ? 's' : ''}</Text>
            </Paper>
          </motion.div>
        ))}
      </SimpleGrid>

      {/* Filtros */}
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

      <AppPanel p={0}>
        <ScrollArea>
          <Table highlightOnHover style={{ minWidth: 620 }}>
            <Table.Thead>
              <Table.Tr>
                {/* Indicador colorido */}
                <Table.Th style={{ width: 4, padding: 0 }} />
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
                <Table.Th><Text size="sm" fw={600}>Ações</Text></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <AnimatePresence initial={false}>
                {pagina.map((c, idx) => {
                  const rel = diasRelativo(c.vencimento)
                  return (
                    <motion.tr
                      key={c.id}
                      layout
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, delay: shouldReduceMotion ? 0 : idx * 0.025 }}
                    >
                      {/* Faixa colorida de status */}
                      <td style={{ width: 4, padding: 0, backgroundColor: STATUS_COLOR[c.status] }} />
                      <td>
                        <Stack gap={0}>
                          <Text fw={600} size="sm">{c.descricao}</Text>
                          <Text size="xs" c="dimmed">{c.categoria}</Text>
                        </Stack>
                      </td>
                      <td>
                        <Badge variant="dot" color={c.status === 'paga' ? 'teal' : c.status === 'a_vencer' ? 'violet' : 'gray'} size="sm">
                          {c.categoria}
                        </Badge>
                      </td>
                      <td>
                        <Stack gap={0}>
                          <Text size="sm">{formatData(c.vencimento)}</Text>
                          {c.status !== 'paga' && (
                            <Text size="xs" fw={600} style={{ color: rel.color }}>{rel.label}</Text>
                          )}
                        </Stack>
                      </td>
                      <td><Text fw={700} size="sm">{formatBRL(c.valor)}</Text></td>
                      <td>
                        <Badge
                          color={c.status === 'paga' ? 'green' : c.status === 'a_vencer' ? 'yellow' : 'red'}
                          variant="light"
                          size="sm"
                        >
                          {STATUS_LABEL[c.status]}
                        </Badge>
                      </td>
                      <td>
                        <Group gap={4} wrap="nowrap">
                          {c.status !== 'paga' && (
                            <Tooltip label="Marcar como paga" withArrow openDelay={300}>
                              <ActionIcon
                                variant="filled"
                                color="green"
                                size="md"
                                radius="md"
                                onClick={() => void handlePagar(c)}
                                aria-label="Marcar como paga"
                              >
                                <CheckCircle size={16} strokeWidth={2} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          <Tooltip label="Remover conta" withArrow openDelay={300}>
                            <ActionIcon
                              variant="filled"
                              color="red"
                              size="md"
                              radius="md"
                              onClick={() => void handleRemover(c)}
                              aria-label="Remover conta"
                            >
                              <Trash2 size={15} strokeWidth={2} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <AnimatePresence initial={false}>
          {pagina.length === 0 && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease: 'easeOut' }}
              style={{ textAlign: 'center', padding: '40px 16px' }}
            >
              <Text c="dimmed" size="sm" fw={500}>Nenhuma conta encontrada para o filtro selecionado.</Text>
              <div style={{ marginTop: 8 }}>
                <AppButton
                  appearance="soft"
                  tone="neutral"
                  size="xs"
                  leftSection={<Plus size={13} strokeWidth={2} />}
                  onClick={() => window.dispatchEvent(new Event('finance:new-bill'))}
                >
                  Adicionar conta
                </AppButton>
              </div>
            </motion.div>
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