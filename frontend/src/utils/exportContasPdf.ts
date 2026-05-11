import type { Conta } from '../types/Bill'
import { formatBRL } from './formatCurrency'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
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

export function exportContasToPdf(contas: Conta[]): boolean {
  if (!contas.length) return false

  const popup = window.open('', '_blank', 'noopener,noreferrer,width=1024,height=768')
  if (!popup) return false

  const sorted = [...contas].sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  const total = sorted.reduce((acc, conta) => acc + conta.valor, 0)

  const rows = sorted
    .map((conta) => {
      return `
        <tr>
          <td>${escapeHtml(String(conta.id))}</td>
          <td>${escapeHtml(conta.descricao)}</td>
          <td>${escapeHtml(conta.categoria)}</td>
          <td>${escapeHtml(statusLabel(conta.status))}</td>
          <td>${escapeHtml(formatDate(conta.vencimento))}</td>
          <td class="valor">${escapeHtml(formatBRL(conta.valor))}</td>
        </tr>
      `
    })
    .join('')

  const generatedAt = new Date().toLocaleString('pt-BR')

  popup.document.write(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Finance App - Exportacao PDF</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            margin: 28px;
            color: #1f2937;
          }
          h1 {
            margin: 0 0 4px;
            font-size: 22px;
            color: #0f172a;
          }
          .meta {
            margin-bottom: 16px;
            color: #475569;
            font-size: 12px;
          }
          .summary {
            margin: 0 0 18px;
            padding: 10px 12px;
            border: 1px solid #dbe4ec;
            border-radius: 10px;
            background: #f8fafc;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #e2e8f0;
            padding: 7px 8px;
            text-align: left;
            vertical-align: top;
          }
          th {
            background: #f1f5f9;
            color: #0f172a;
            font-weight: 700;
          }
          td.valor {
            text-align: right;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
          }
          @media print {
            body { margin: 14mm; }
            tr { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>Finance App - Relatorio de Contas</h1>
        <div class="meta">Gerado em ${escapeHtml(generatedAt)}</div>
        <div class="summary">
          <strong>Total de contas:</strong> ${escapeHtml(String(sorted.length))}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Valor total:</strong> ${escapeHtml(formatBRL(total))}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descricao</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Vencimento</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <script>
          window.onload = () => {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `)

  popup.document.close()
  return true
}
