import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useContasContext } from '../context/ContasContext'
import { formatBRL, formatData } from '../data/mockContas'
import type { StatusConta } from '../data/mockContas'
import styles from './Contas.module.css'
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

  return (
    <div>
      <h1 className={styles.titulo}>Lista de Contas</h1>

      <div className={styles.filtros}>
        {(['todas', 'paga', 'a_vencer', 'atrasada'] as Filtro[]).map(f => (
          <motion.button
            key={f}
            onClick={() => setFiltro(f)}
            className={`${styles.btn} ${filtro === f ? styles[`ativo_${f}`] : ''}`}
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {f === 'todas' ? 'Todas' : STATUS_LABEL[f as StatusConta]}
          </motion.button>
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
                  <td className={styles.tdDesc}>{c.descricao}</td>
                  <td>{c.categoria}</td>
                  <td>{formatData(c.vencimento)}</td>
                  <td className={styles.tdValor}>{formatBRL(c.valor)}</td>
                  <td><span className={`${styles.badge} ${styles[c.status]}`}>{STATUS_LABEL[c.status]}</span></td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        <AnimatePresence initial={false}>
          {lista.length === 0 && (
            <motion.p
              className={styles.vazio}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              Nenhuma conta encontrada.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}