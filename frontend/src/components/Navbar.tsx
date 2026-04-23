import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Plus, LogOut } from '../lib/icons'

const pageTitles: Record<string, string> = {
  '/app':            'Visão Geral',
  '/app/contas':     'Contas',
  '/app/calendario': 'Calendário',
  '/app/alertas':    'Alertas',
}

interface NavbarProps {
  onAddBill: () => void
}

export default function Navbar({ onAddBill }: NavbarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { mode, logout } = useAuth()
  const title = pageTitles[pathname] ?? 'Dashboard'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">
          Dashboard {mode === 'guest' ? '• Convidado' : mode === 'user' ? '• Conta' : ''}
        </p>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        <div className="topbar-summary">
          <span className="topbar-label">Total a vencer</span>
          <span className="topbar-value"> R$ 1.840,50</span>
        </div>
        <button className="add-bill-button" onClick={onAddBill}><Plus size={15} strokeWidth={2} /> Nova Conta</button>
        <button className="btn btn-secondary" onClick={handleLogout}><LogOut size={15} strokeWidth={1.5} /> Sair</button>
      </div>
    </header>
  )
}