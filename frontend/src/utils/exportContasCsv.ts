import type { Conta } from '../types/Bill'

function escapeCsv(value: string): string {
  const normalized = value.replace(/\r?\n/g, ' ').trim()
  const escaped = normalized.replace(/"/g, '""')
  return `"${escaped}"`
}

function statusLabel(status: Conta['status']): string {
  switch (status) {
    case 'paga':
      return 'Paga'
    case 'a_vencer':
      return 'A vencer'
    case 'atrasada':
      return 'Atrasada'
    default:
      return status
  }
}

function formatDate(value: string): string {
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value
  return dt.toLocaleDateString('pt-BR')
}

function formatValue(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function exportContasToCsv(contas: Conta[]): boolean {
  if (!contas.length) return false

  const sorted = [...contas].sort((a, b) => a.vencimento.localeCompare(b.vencimento))

  const headers = [
    'ID',
    'Descricao',
    'Categoria',
    'Status',
    'Vencimento',
    'Valor',
  ]

  const rows = sorted.map((conta) => [
    String(conta.id),
    conta.descricao,
    conta.categoria,
    statusLabel(conta.status),
    formatDate(conta.vencimento),
    formatValue(conta.valor),
  ])

  const csv = [
    headers.map(escapeCsv).join(';'),
    ...rows.map((row) => row.map((cell) => escapeCsv(String(cell))).join(';')),
  ].join('\r\n')

  const dateTag = new Date().toISOString().slice(0, 10)
  const filename = `finance-contas-${dateTag}.csv`

  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return true
}
