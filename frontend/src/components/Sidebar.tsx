import { NavLink } from 'react-router-dom'

const links = [
	{ to: '/',            label: 'Visão Geral' },
	{ to: '/contas',      label: 'Contas' },
	{ to: '/calendario',  label: 'Calendário' },
	{ to: '/alertas',     label: 'Alertas' },
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
						end={l.to === '/'}
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
