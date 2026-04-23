import { useContasContext } from '../context/ContasContext'
import { formatBRL, formatData } from '../data/mockContas'
import styles from './VisaoGeral.module.css'
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
    { label: 'Total Pago',    valor: pagas.reduce((s, c) => s + c.valor, 0),     qtd: pagas.length,     cor: styles.verde   },
    { label: 'A Vencer',      valor: aVencer.reduce((s, c) => s + c.valor, 0),   qtd: aVencer.length,   cor: styles.amarelo },
    { label: 'Atrasadas',     valor: atrasadas.reduce((s, c) => s + c.valor, 0), qtd: atrasadas.length, cor: styles.vermelho },
    { label: 'Total do Mês',  valor: contas.reduce((s, c) => s + c.valor, 0), qtd: contas.length, cor: styles.roxo  },
  ]

  return (
    <div>
      <h1 className={styles.titulo}>Visão Geral do Mês</h1>

      <motion.div
        className={styles.grid}
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
        {cards.map(c => (
          <motion.div
            key={c.label}
            className={`${styles.card} ${c.cor}`}
            layout
            variants={{
              hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
              visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
            }}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.24, ease: 'easeOut' }}
          >
            <span className={styles.cardLabel}>{c.label}</span>
            <span className={styles.cardValor}>{formatBRL(c.valor)}</span>
            <span className={styles.cardSub}>{c.qtd} conta{c.qtd !== 1 ? 's' : ''}</span>
          </motion.div>
        ))}
      </motion.div>

      {atrasadas.length > 0 && (
        <motion.section
          className={styles.secao}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease: 'easeOut' }}
        >
          <h2><AlertTriangle size={18} strokeWidth={1.5} /> Contas Atrasadas</h2>
          <ul className={styles.lista}>
            {atrasadas.map((c, idx) => (
              <motion.li
                key={c.id}
                className={styles.itemAtrasado}
                layout
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, delay: shouldReduceMotion ? 0 : idx * 0.04 }}
              >
                <span className={styles.desc}>{c.descricao}</span>
                <span>{formatData(c.vencimento)}</span>
                <span className={styles.valorDest}>{formatBRL(c.valor)}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      )}
    </div>
  )
}