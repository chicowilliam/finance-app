import { mockContas, formatBRL } from '../data/mockContas'
import type { Conta } from '../data/mockContas'
import styles from './Alertas.module.css'

const hoje = new Date()

const diasAtraso = (c: Conta) =>
  Math.floor((hoje.getTime() - new Date(c.vencimento + 'T00:00:00').getTime()) / 86_400_000)

const diasParaVencer = (c: Conta) =>
  Math.ceil((new Date(c.vencimento + 'T00:00:00').getTime() - hoje.getTime()) / 86_400_000)

export default function Alertas() {
  const atrasadas = mockContas.filter(c => c.status === 'atrasada')
  const urgentes  = mockContas.filter(c => c.status === 'a_vencer' && diasParaVencer(c) <= 5)

  return (
    <div>
      <h1 className={styles.titulo}>Alertas de Risco</h1>

      {atrasadas.length > 0 && (
        <section className={styles.secao}>
          <h2 className={styles.h2Atrasada}>
            <span className={styles.badge}>!</span> Contas Atrasadas ({atrasadas.length})
          </h2>
          <div className={styles.cards}>
            {atrasadas.map(c => (
              <div key={c.id} className={`${styles.card} ${styles.cardAtrasada}`}>
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
              </div>
            ))}
          </div>
        </section>
      )}

      {urgentes.length > 0 && (
        <section className={styles.secao}>
          <h2 className={styles.h2Urgente}>
            <span className={`${styles.badge} ${styles.badgeAmber}`}>~</span> Vencem em Breve ({urgentes.length})
          </h2>
          <div className={styles.cards}>
            {urgentes.map(c => {
              const dias = diasParaVencer(c)
              return (
                <div key={c.id} className={`${styles.card} ${styles.cardVencer}`}>
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
                </div>
              )
            })}
          </div>
        </section>
      )}

      {atrasadas.length === 0 && urgentes.length === 0 && (
        <p className={styles.ok}>✅ Tudo em dia! Nenhum alerta no momento.</p>
      )}
    </div>
  )
}