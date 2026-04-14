import { NavLink } from 'react-router-dom'

function Sidebar() {
	return (
		<aside className="sidebar">
			<h2 className="sidebar-title">Finance App</h2>

			<nav className="sidebar-nav">
				<NavLink to="/dashboard" className="sidebar-link">
					Visao geral
				</NavLink>

				<NavLink to="/contas" className="sidebar-link">
					Contas
				</NavLink>

				<NavLink to="/cartoes" className="sidebar-link">
					Cartoes
				</NavLink>

				<NavLink to="/alertas" className="sidebar-link">
					Alertas
				</NavLink>

				<NavLink to="/configuracoes" className="sidebar-link">
					Configuracoes
				</NavLink>
			</nav>
		</aside>
	)
}

export default Sidebar
