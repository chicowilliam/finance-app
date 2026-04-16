import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/':           'Visão Geral',
  '/contas':     'Contas',
  '/calendario': 'Calendário',
  '/alertas':    'Alertas',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'Dashboard'

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">Dashboard</p>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        <div className="topbar-summary">
          <span className="topbar-label">Total a vencer</span>
          <span className="topbar-value"> R$ 1.840,50</span>
        </div>
        <button className="add-bill-button">+ Nova Conta</button>
      </div>
    </header>
  )
}