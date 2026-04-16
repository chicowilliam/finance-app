import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import NovaContaForm from '../components/NovaContaForm'
import { useContas } from '../hooks/useBills'
import { ContasContext } from '../context/ContasContext'
import type { Conta } from '../data/mockContas'

export default function DashboardLayout() {
	const [modalOpen, setModalOpen] = useState(false)
	const contasState = useContas()

	async function handleAddConta(conta: Omit<Conta, 'id'>) {
		await contasState.adicionar(conta)
		setModalOpen(false)
	}

	return (
		<ContasContext.Provider value={contasState}>
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
		</ContasContext.Provider>
	)
}
