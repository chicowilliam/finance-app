import { NavLink } from 'react-router-dom'
import { LayoutDashboard, List, CalendarDays, Bell, Wallet, Settings } from '../lib/icons'

const mainLinks = [
	{ to: '/app',            label: 'Visão Geral',  icon: LayoutDashboard },
	{ to: '/app/contas',      label: 'Contas',       icon: List },
	{ to: '/app/calendario',  label: 'Calendário',   icon: CalendarDays },
	{ to: '/app/alertas',     label: 'Alertas',      icon: Bell },
]

const bottomLinks = [
	{ to: '/app/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar() {
	return (
		<aside className="sidebar">
			<h2 className="sidebar-title"><Wallet size={20} strokeWidth={1.5} /> FinanceApp</h2>

			<nav className="sidebar-nav">
				{mainLinks.map(l => (
					<NavLink
						key={l.to}
						to={l.to}
						end={l.to === '/app'}
						className={({ isActive }) =>
							`sidebar-link ${isActive ? 'active' : ''}`
						}
					>
						<l.icon size={16} strokeWidth={1.5} />
						{l.label}
					</NavLink>
				))}
			</nav>

			<nav className="sidebar-nav sidebar-nav-bottom">
				{bottomLinks.map(l => (
					<NavLink
						key={l.to}
						to={l.to}
						className={({ isActive }) =>
							`sidebar-link ${isActive ? 'active' : ''}`
						}
					>
						<l.icon size={16} strokeWidth={1.5} />
						{l.label}
					</NavLink>
				))}
			</nav>
		</aside>
	)
}
