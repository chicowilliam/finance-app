import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

const links = [
  { to: '/',          label: 'Visão Geral' },
  { to: '/contas',    label: 'Contas'      },
  { to: '/calendario', label: 'Calendário' },
  { to: '/alertas',   label: 'Alertas'    },
]

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>💰 FinanceApp</span>
      <div className={styles.links}>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.ativo : ''}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}