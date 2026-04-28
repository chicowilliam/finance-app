import { useEffect, useState } from 'react'
import { Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import NovaContaForm from '../components/NovaContaForm'
import AppModal from '../components/AppModal'
import { useContas } from '../hooks/useBills'
import { ContasContext } from '../context/ContasContext'
import type { Conta } from '../types/Bill'

const SIDEBAR_DEFAULT_WIDTH = 280

export default function DashboardLayout() {
	const [modalOpen, setModalOpen] = useState(false)
	const contasState = useContas()
	const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false)
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
	const [sidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)

	async function handleAddConta(conta: Omit<Conta, 'id'>) {
		try {
			await contasState.adicionar(conta)
			toast.success('Conta adicionada com sucesso')
			setModalOpen(false)
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Erro ao salvar conta')
		}
	}

	useEffect(() => {
		const openModal = () => setModalOpen(true)
		window.addEventListener('finance:new-bill', openModal)
		return () => window.removeEventListener('finance:new-bill', openModal)
	}, [])

	return (
		<ContasContext.Provider value={contasState}>
			<div className="dashboard-layout-shell">
				{desktopOpened && (
					<aside
						className="dashboard-sidebar-shell dashboard-sidebar-shell--desktop"
						style={{ width: sidebarWidth }}
					>
						<Sidebar
							onToggleDesktop={toggleDesktop}
							onNavClick={closeMobile}
						/>
					</aside>
				)}

				<Drawer
					opened={mobileOpened}
					onClose={closeMobile}
					size={sidebarWidth}
					padding={0}
					withCloseButton={false}
					hiddenFrom="md"
					overlayProps={{ opacity: 0.45, blur: 3 }}
					styles={{
						content: { background: 'var(--sidebar-bg)' },
						body: { padding: 0, height: '100%' },
					}}
				>
					<Sidebar
						onToggleDesktop={toggleDesktop}
						onNavClick={closeMobile}
					/>
				</Drawer>

				<div
					className="dashboard-content-shell"
					style={{ ['--dashboard-sidebar-width' as string]: desktopOpened ? `${sidebarWidth}px` : '0px' }}
				>
					<main className="dashboard-main-shell">
						<Navbar
							onAddBill={() => setModalOpen(true)}
							mobileOpened={mobileOpened}
							onToggleMobile={toggleMobile}
							desktopOpened={desktopOpened}
							onToggleDesktop={toggleDesktop}
						/>
						<div className="dashboard-page-shell">
							<Outlet />
						</div>
					</main>
				</div>

				<AppModal opened={modalOpen} onClose={() => setModalOpen(false)} title="Nova Conta">
					<NovaContaForm
						onSubmit={handleAddConta}
						onCancel={() => setModalOpen(false)}
					/>
				</AppModal>
			</div>
		</ContasContext.Provider>
	)
}
