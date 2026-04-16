import { useState } from 'react'
import { useContasContext } from '../context/ContasContext'
import { formatBRL, formatData } from '../data/mockContas'
import type { StatusConta } from '../data/mockContas'
import styles from './Contas.module.css'

type Filtro = StatusConta | 'todas'

const STATUS_LABEL: Record<StatusConta, string> = {
  paga: 'Paga', a_vencer: 'A vencer', atrasada: 'Atrasada',
}

export default function Contas() {
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const { contas, loading } = useContasContext()

  if (loading) return <p>Carregando...</p>

  const lista = filtro === 'todas' ? contas : contas.filter(c => c.status === filtro)

  return (
    <div>
      <h1 className={styles.titulo}>Lista de Contas</h1>

      <div className={styles.filtros}>
        {(['todas', 'paga', 'a_vencer', 'atrasada'] as Filtro[]).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`${styles.btn} ${filtro === f ? styles[`ativo_${f}`] : ''}`}
          >
            {f === 'todas' ? 'Todas' : STATUS_LABEL[f as StatusConta]}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Vencimento</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(c => (
              <tr key={c.id}>
                <td className={styles.tdDesc}>{c.descricao}</td>
                <td>{c.categoria}</td>
                <td>{formatData(c.vencimento)}</td>
                <td className={styles.tdValor}>{formatBRL(c.valor)}</td>
                <td><span className={`${styles.badge} ${styles[c.status]}`}>{STATUS_LABEL[c.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {lista.length === 0 && <p className={styles.vazio}>Nenhuma conta encontrada.</p>}
      </div>
    </div>
  )
}