import { useContasContext } from '../context/ContasContext'
import { formatBRL } from '../data/mockContas'
import type { Conta } from '../data/mockContas'
import styles from './Alertas.module.css'
import { AlertCircle, Clock, CheckCircle } from '../lib/icons'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Loader from '../components/Loader'

const hoje = new Date()

const diasAtraso = (c: Conta) =>
  Math.floor((hoje.getTime() - new Date(c.vencimento + 'T00:00:00').getTime()) / 86_400_000)

const diasParaVencer = (c: Conta) =>
  Math.ceil((new Date(c.vencimento + 'T00:00:00').getTime() - hoje.getTime()) / 86_400_000)

export default function Alertas() {
  const { contas, loading } = useContasContext()
  const shouldReduceMotion = useReducedMotion()

  if (loading) return <Loader variant="alerts" />

  const atrasadas = contas.filter(c => c.status === 'atrasada')
  const urgentes  = contas.filter(c => c.status === 'a_vencer' && diasParaVencer(c) <= 5)

  return (
    <div>
      <h1 className={styles.titulo}>Alertas de Risco</h1>

      <AnimatePresence initial={false}>
        {atrasadas.length > 0 && (
        <motion.section
          className={styles.secao}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.22, ease: 'easeOut' }}
        >
          <h2 className={styles.h2Atrasada}>
            <AlertCircle size={18} strokeWidth={1.5} /> Contas Atrasadas ({atrasadas.length})
          </h2>
          <motion.div
            className={styles.cards}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: shouldReduceMotion ? 0 : 0.02,
                  staggerChildren: shouldReduceMotion ? 0 : 0.05,
                },
              },
            }}
          >
            {atrasadas.map(c => (
              <motion.div
                key={c.id}
                layout
                className={`${styles.card} ${styles.cardAtrasada}`}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
                  visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: 'easeOut' }}
              >
                <div className={styles.topo}>
                  <span className={styles.desc}>{c.descricao}</span>
                  <span className={styles.valor}>{formatBRL(c.valor)}</span>
                </div>
                <div className={styles.rodape}>
                  <span className={styles.cat}>{c.categoria}</span>
                  <span className={styles.tagAtrasada}>
                    {diasAtraso(c)} dia{diasAtraso(c) !== 1 ? 's' : ''} em atraso
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
      {urgentes.length > 0 && (
        <motion.section
          className={styles.secao}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.22, ease: 'easeOut' }}
        >
          <h2 className={styles.h2Urgente}>
            <Clock size={18} strokeWidth={1.5} /> Vencem em Breve ({urgentes.length})
          </h2>
          <motion.div
            className={styles.cards}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: shouldReduceMotion ? 0 : 0.02,
                  staggerChildren: shouldReduceMotion ? 0 : 0.05,
                },
              },
            }}
          >
            {urgentes.map(c => {
              const dias = diasParaVencer(c)
              return (
                <motion.div
                  key={c.id}
                  layout
                  className={`${styles.card} ${styles.cardVencer}`}
                  variants={{
                    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
                    visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: 'easeOut' }}
                >
                  <div className={styles.topo}>
                    <span className={styles.desc}>{c.descricao}</span>
                    <span className={styles.valor}>{formatBRL(c.valor)}</span>
                  </div>
                  <div className={styles.rodape}>
                    <span className={styles.cat}>{c.categoria}</span>
                    <span className={styles.tagVencer}>
                      {dias === 0 ? 'Vence hoje!' : `${dias} dia${dias !== 1 ? 's' : ''} para vencer`}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.section>
      )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {atrasadas.length === 0 && urgentes.length === 0 && (
          <motion.p
            className={styles.ok}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <CheckCircle size={18} strokeWidth={1.5} /> Tudo em dia! Nenhum alerta no momento.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}