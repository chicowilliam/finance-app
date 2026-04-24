import { useState } from 'react'
import styles from './Configuracoes.module.css'
import { Settings, Moon, Sun, UserCircle, Bell, Shield } from '../lib/icons'

export default function Configuracoes() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}><Settings size={18} strokeWidth={1.5} /> Configurações</h1>
        <p className={styles.subtitle}>Central de preferências da aplicação.</p>
      </header>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}><UserCircle size={18} strokeWidth={1.5} /> Perfil</h2>
          <div className={styles.profileRow}>
            <div className={styles.avatar}>W</div>
            <div>
              <p className={styles.profileName}>William Costa</p>
              <p className={styles.profileEmail}>william@email.com</p>
            </div>
          </div>
          <button className="btn btn-secondary" type="button">Alterar foto</button>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>
            {darkMode ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />} Tema
          </h2>
          <label className={styles.toggleRow}>
            <span>Modo noturno</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </label>
          <p className={styles.hint}>Visual por enquanto em preparação.</p>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}><Bell size={18} strokeWidth={1.5} /> Notificações</h2>
          <label className={styles.toggleRow}>
            <span>Lembretes de vencimento</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </label>
          <p className={styles.hint}>Configuração visual (sem persistência ainda).</p>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}><Shield size={18} strokeWidth={1.5} /> Conta</h2>
          <div className={styles.actions}>
            <button className="btn btn-secondary" type="button">Alterar senha</button>
            <button className="btn btn-secondary" type="button">Gerenciar sessão</button>
          </div>
        </article>
      </div>
    </section>
  )
}
