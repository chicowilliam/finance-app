import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import NovaContaForm from '../components/NovaContaForm'
import type { Conta } from '../data/mockContas'

export default function DashboardLayout() {
	const [modalOpen, setModalOpen] = useState(false)

	function handleAddConta(conta: Omit<Conta, 'id'>) {
		console.log('Nova conta:', conta)
		setModalOpen(false)
	}

	return (
		<div className="dashboard-shell">
			<Sidebar />

			<div className="dashboard-main">
				<Navbar onAddBill={() => setModalOpen(true)} />

				<main className="dashboard-content">
					<Outlet />
				</main>
			</div>

			<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Conta">
				<NovaContaForm
					onSubmit={handleAddConta}
					onCancel={() => setModalOpen(false)}
				/>
			</Modal>
		</div>
	)
}
