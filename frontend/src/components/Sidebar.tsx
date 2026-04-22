import { NavLink } from 'react-router-dom'

const links = [
	{ to: '/app',            label: 'Visão Geral' },
	{ to: '/app/contas',      label: 'Contas' },
	{ to: '/app/calendario',  label: 'Calendário' },
	{ to: '/app/alertas',     label: 'Alertas' },
]

export default function Sidebar() {
	return (
		<aside className="sidebar">
			<h2 className="sidebar-title">💰 FinanceApp</h2>

			<nav className="sidebar-nav">
				{links.map(l => (
					<NavLink
						key={l.to}
						to={l.to}
						end={l.to === '/app'}
						className={({ isActive }) =>
							`sidebar-link ${isActive ? 'active' : ''}`
						}
					>
						{l.label}
					</NavLink>
				))}
			</nav>
		</aside>
	)
}
