import { useState } from 'react'
import { Alert, AppShell, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import NovaContaForm from '../components/NovaContaForm'
import { useContas } from '../hooks/useBills'
import { ContasContext } from '../context/ContasContext'
import type { Conta } from '../data/mockContas'

export default function DashboardLayout() {
	const [modalOpen, setModalOpen] = useState(false)
	const contasState = useContas()
	const [formError, setFormError] = useState<string | null>(null)
	const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false)
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

	async function handleAddConta(conta: Omit<Conta, 'id'>) {
		try {
			setFormError(null)
			await contasState.adicionar(conta)
			setModalOpen(false)
		} catch (err) {
			setFormError(err instanceof Error ? err.message : 'Erro ao salvar conta')
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
						backgroundColor: '#0f3d30',
						borderInlineEnd: '1px solid rgba(255, 255, 255, 0.08)',
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

				<Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Nova Conta" centered>
					<NovaContaForm
						onSubmit={handleAddConta}
						onCancel={() => setModalOpen(false)}
					/>
								{formError && (
								<Alert color="red" mt="sm">
										{formError}
								</Alert>
								)}
				</Modal>
			</AppShell>
		</ContasContext.Provider>
	)
}
