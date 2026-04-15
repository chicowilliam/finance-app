import { mockContas, formatBRL } from '../data/mockContas'
import styles from './Calendario.module.css'

export default function Calendario() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = hoje.getMonth()

  const primeiroDia = new Date(ano, mes, 1).getDay()
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()

  const porDia: Record<number, typeof mockContas> = {}
  mockContas.forEach(c => {
    const d = new Date(c.vencimento + 'T00:00:00')
    if (d.getFullYear() === ano && d.getMonth() === mes) {
      const dia = d.getDate()
      porDia[dia] = [...(porDia[dia] ?? []), c]
    }
  })

  const celulas = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ]

  const nomeMes = hoje.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div>
      <h1 className={styles.titulo}>
        Calendário — {nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}
      </h1>
      <div className={styles.legenda}>
        <span className={styles.lPaga}>● Paga</span>
        <span className={styles.lVencer}>● A vencer</span>
        <span className={styles.lAtrasada}>● Atrasada</span>
      </div>
      <div className={styles.grid}>
        {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
          <div key={d} className={styles.cab}>{d}</div>
        ))}
        {celulas.map((dia, i) => {
          if (!dia) return <div key={`v${i}`} />

          const contas = porDia[dia] ?? []
          const temAtrasada = contas.some(c => c.status === 'atrasada')
          const temVencer   = contas.some(c => c.status === 'a_vencer')
          const eHoje = dia === hoje.getDate()

          return (
            <div
              key={dia}
              className={[
                styles.cel,
                eHoje       ? styles.hoje : '',
                temAtrasada ? styles.celAtrasada : '',
                !temAtrasada && temVencer ? styles.celVencer : '',
              ].filter(Boolean).join(' ')}
            >
              <span className={styles.num}>{dia}</span>
              {contas.map(c => (
                <div key={c.id} className={`${styles.tag} ${styles[c.status]}`}>
                  <span className={styles.tagNome}>{c.descricao}</span>
                  <span className={styles.tagVal}>{formatBRL(c.valor)}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}