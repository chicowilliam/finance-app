import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

function DashboardLayout() {
	return (
		<div className="dashboard-shell">
			<Sidebar />

			<div className="dashboard-main">
				<Navbar />

				<main className="dashboard-content">
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default DashboardLayout
