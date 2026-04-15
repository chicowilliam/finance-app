import { mockContas, formatBRL, formatData } from '../data/mockContas'
import styles from './VisaoGeral.module.css'

export default function VisaoGeral() {
  const pagas     = mockContas.filter(c => c.status === 'paga')
  const aVencer   = mockContas.filter(c => c.status === 'a_vencer')
  const atrasadas = mockContas.filter(c => c.status === 'atrasada')

  const cards = [
    { label: 'Total Pago',    valor: pagas.reduce((s, c) => s + c.valor, 0),     qtd: pagas.length,     cor: styles.verde   },
    { label: 'A Vencer',      valor: aVencer.reduce((s, c) => s + c.valor, 0),   qtd: aVencer.length,   cor: styles.amarelo },
    { label: 'Atrasadas',     valor: atrasadas.reduce((s, c) => s + c.valor, 0), qtd: atrasadas.length, cor: styles.vermelho },
    { label: 'Total do Mês',  valor: mockContas.reduce((s, c) => s + c.valor, 0), qtd: mockContas.length, cor: styles.roxo  },
  ]

  return (
    <div>
      <h1 className={styles.titulo}>Visão Geral do Mês</h1>

      <div className={styles.grid}>
        {cards.map(c => (
          <div key={c.label} className={`${styles.card} ${c.cor}`}>
            <span className={styles.cardLabel}>{c.label}</span>
            <span className={styles.cardValor}>{formatBRL(c.valor)}</span>
            <span className={styles.cardSub}>{c.qtd} conta{c.qtd !== 1 ? 's' : ''}</span>
          </div>
        ))}
      </div>

      {atrasadas.length > 0 && (
        <section className={styles.secao}>
          <h2>⚠️ Contas Atrasadas</h2>
          <ul className={styles.lista}>
            {atrasadas.map(c => (
              <li key={c.id} className={styles.itemAtrasado}>
                <span className={styles.desc}>{c.descricao}</span>
                <span>{formatData(c.vencimento)}</span>
                <span className={styles.valorDest}>{formatBRL(c.valor)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}