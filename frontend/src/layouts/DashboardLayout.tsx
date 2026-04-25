import { useState } from 'react'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import NovaContaForm from '../components/NovaContaForm'
import AppModal from '../components/AppModal'
import { useContas } from '../hooks/useBills'
import { ContasContext } from '../context/ContasContext'
import type { Conta } from '../data/mockContas'

export default function DashboardLayout() {
	const [modalOpen, setModalOpen] = useState(false)
	const contasState = useContas()
	const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false)
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

	async function handleAddConta(conta: Omit<Conta, 'id'>) {
		try {
			await contasState.adicionar(conta)
			toast.success('Conta adicionada com sucesso')
			setModalOpen(false)
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Erro ao salvar conta')
		}
	}

	return (
		<ContasContext.Provider value={contasState}>
			<AppShell
				navbar={{
					width: 280,
					breakpoint: 'md',
					collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
				}}
				padding="lg"
			>
				<AppShell.Navbar
					p={0}
					style={{
						backgroundColor: 'var(--sidebar-bg)',
						borderInlineEnd: '1px solid var(--sidebar-border)',
					}}
				>
					<Sidebar
						onToggleDesktop={toggleDesktop}
						onNavClick={closeMobile}
					/>
				</AppShell.Navbar>
				<AppShell.Main>
					<Navbar
						onAddBill={() => setModalOpen(true)}
						mobileOpened={mobileOpened}
						onToggleMobile={toggleMobile}
						desktopOpened={desktopOpened}
						onToggleDesktop={toggleDesktop}
					/>
					<div style={{ paddingTop: '1rem' }}>
						<Outlet />
					</div>
				</AppShell.Main>

				<AppModal opened={modalOpen} onClose={() => setModalOpen(false)} title="Nova Conta">
					<NovaContaForm
						onSubmit={handleAddConta}
						onCancel={() => setModalOpen(false)}
					/>
				</AppModal>
			</AppShell>
		</ContasContext.Provider>
	)
}
