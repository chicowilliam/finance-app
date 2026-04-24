import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useContasContext } from '../context/ContasContext'
import { formatBRL } from '../data/mockContas'
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
  const { contas } = useContasContext()
  const totalAVencer = contas
    .filter(c => c.status === 'a_vencer' || c.status === 'atrasada')
    .reduce((sum, c) => sum + c.valor, 0)

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
          <span className="topbar-value">{formatBRL(totalAVencer)}</span>
        </div>
        <button className="add-bill-button" onClick={onAddBill}><Plus size={15} strokeWidth={2} /> Nova Conta</button>
        <button className="btn btn-secondary" onClick={handleLogout}><LogOut size={15} strokeWidth={1.5} /> Sair</button>
      </div>
    </header>
  )
}