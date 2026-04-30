import { useContasContext } from '../context/ContasContext'
import { useSaldo } from '../hooks/useSaldo'
import { formatBRL } from '../utils/formatCurrency'
import { formatData } from '../data/mockContas'
import { Group, List, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { AlertTriangle, Banknote, Clock, Plus, Wallet } from '../lib/icons'
import { motion, useReducedMotion } from 'motion/react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AppPanel from '../components/AppPanel'
import Loader from '../components/Loader'
import MagicEmptyState from '../components/MagicEmptyState'
import MagicStatCard from '../components/MagicStatCard'

export default function VisaoGeral() {
  const { contas, loading } = useContasContext()
  const { saldo } = useSaldo()
  const shouldReduceMotion = useReducedMotion()

  if (loading) return <Loader variant="dashboard" />

  const pagas     = contas.filter(c => c.status === 'paga')
  const aVencer   = contas.filter(c => c.status === 'a_vencer')
  const atrasadas = contas.filter(c => c.status === 'atrasada')
  const isEmpty = contas.length === 0
  const totalEmAberto = aVencer.reduce((s, c) => s + c.valor, 0) + atrasadas.reduce((s, c) => s + c.valor, 0)
  const saldoAposPagar = saldo !== null ? saldo - totalEmAberto : null

  const cards = [
    {
      label: 'Saldo Disponível',
      valor: saldo ?? 0,
      qtd: 0,
      tone: 'teal' as const,
      description: saldoAposPagar !== null
        ? `Após pagar contas: ${formatBRL(saldoAposPagar)}`
        : 'Adicione seu saldo na barra superior',
      icon: <Banknote size={18} strokeWidth={1.8} />,
    },
    {
      label: 'Total Pago',
      valor: pagas.reduce((s, c) => s + c.valor, 0),
      qtd: pagas.length,
      tone: 'emerald' as const,
      description: 'Liquidadas sem pendências',
      icon: <Wallet size={18} strokeWidth={1.8} />,
    },
    {
      label: 'A Vencer',
      valor: aVencer.reduce((s, c) => s + c.valor, 0),
      qtd: aVencer.length,
      tone: 'amber' as const,
      description: 'Precisam de atenção nos próximos dias',
      icon: <Clock size={18} strokeWidth={1.8} />,
    },
    {
      label: 'Atrasadas',
      valor: atrasadas.reduce((s, c) => s + c.valor, 0),
      qtd: atrasadas.length,
      tone: 'rose' as const,
      description: 'Exigem ação imediata',
      icon: <AlertTriangle size={18} strokeWidth={1.8} />,
    },
  ]

  const torresData = [
    { label: 'Pagas', valor: cards[0].valor, cor: '#2f9e44' },
    { label: 'A vencer', valor: cards[1].valor, cor: '#f08c00' },
    { label: 'Atrasadas', valor: cards[2].valor, cor: '#e03131' },
  ]

  return (
    <Stack>
      <Title order={1} size="h3">Visão Geral do Mês</Title>

      {isEmpty ? (
        <MagicEmptyState
          eyebrow="Pronto para começar"
          title="Nenhuma conta cadastrada ainda"
          description="Assim que você criar a primeira conta, este painel mostra totais, alertas e indicadores com profundidade visual sem perder a clareza financeira."
          icon={<Wallet size={28} strokeWidth={1.8} />}
          primaryActionLabel="Criar primeira conta"
          onPrimaryAction={() => window.dispatchEvent(new Event('finance:new-bill'))}
        />
      ) : (
      <>
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
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
              }}
            >
              <MagicStatCard
                label={c.label}
                value={c.valor}
                quantity={c.qtd}
                tone={c.tone}
                description={c.description}
                formatter={formatBRL}
                icon={c.icon}
              />
            </motion.div>
          ))}
        </SimpleGrid>
      </motion.div>

      <motion.section
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease: 'easeOut' }}
      >
        <AppPanel className="magic-chart-panel">
          <Stack gap="xs" mb="md">
            <Title order={2} size="h5">Torres de Controle Financeiro</Title>
            <Text size="sm" c="dimmed">Comparativo de valores por status das contas no mês.</Text>
          </Stack>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={torresData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatBRL(value as number)}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--panel-border)',
                    background: 'var(--panel-bg)',
                  }}
                  formatter={(value) => [formatBRL(Number(value ?? 0)), 'Total']}
                />
                <Bar dataKey="valor" radius={[10, 10, 4, 4]}>
                  {torresData.map((entry) => (
                    <Cell key={entry.label} fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AppPanel>
      </motion.section>

      {atrasadas.length > 0 && (
        <motion.section
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease: 'easeOut' }}
        >
            <AppPanel className="magic-alert-panel">
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
          </AppPanel>
        </motion.section>
      )}
      </>
      )}
    </Stack>
  )
}