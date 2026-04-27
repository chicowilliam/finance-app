import { useEffect, useRef, useState } from 'react'
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
import type { Conta } from '../types/Bill'

const SIDEBAR_MIN_WIDTH = 200
const SIDEBAR_MAX_WIDTH = 500
const SIDEBAR_DEFAULT_WIDTH = 280
const SIDEBAR_STORAGE_KEY = 'finance-app:sidebar-width'

export default function DashboardLayout() {
	const [modalOpen, setModalOpen] = useState(false)
	const contasState = useContas()
	const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false)
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
	const [sidebarWidth, setSidebarWidth] = useState(() => {
		const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
		return stored ? Math.min(Math.max(parseInt(stored, 10), SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH) : SIDEBAR_DEFAULT_WIDTH
	})
	const isResizingRef = useRef(false)

	async function handleAddConta(conta: Omit<Conta, 'id'>) {
		try {
			await contasState.adicionar(conta)
			toast.success('Conta adicionada com sucesso')
			setModalOpen(false)
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Erro ao salvar conta')
		}
	}

	const handleMouseDown = () => {
		isResizingRef.current = true
		document.body.style.userSelect = 'none'
		document.body.style.cursor = 'col-resize'
	}

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizingRef.current) return

			const newWidth = e.clientX
			if (newWidth >= SIDEBAR_MIN_WIDTH && newWidth <= SIDEBAR_MAX_WIDTH) {
				setSidebarWidth(newWidth)
				localStorage.setItem(SIDEBAR_STORAGE_KEY, newWidth.toString())
			}
		}

		const handleMouseUp = () => {
			isResizingRef.current = false
			document.body.style.userSelect = ''
			document.body.style.cursor = ''
		}

		if (isResizingRef.current) {
			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mouseup', handleMouseUp)
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [])

	useEffect(() => {
		const openModal = () => setModalOpen(true)
		window.addEventListener('finance:new-bill', openModal)
		return () => window.removeEventListener('finance:new-bill', openModal)
	}, [])

	return (
		<ContasContext.Provider value={contasState}>
			<AppShell
				navbar={{
					width: sidebarWidth,
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
						position: 'relative',
					}}
				>
					<div
						onMouseDown={handleMouseDown}
						className="sidebar-resize-handle"
						title="Arraste para redimensionar a barra lateral"
					/>
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
