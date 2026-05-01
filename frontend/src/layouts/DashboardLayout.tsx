import { useEffect, useRef, useState } from 'react'
import { ActionIcon, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import { PanelLeftOpen } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import NovaContaForm from '../components/NovaContaForm'
import AppModal from '../components/AppModal'
import SettingsModal from '../components/SettingsModal'
import { useContas } from '../hooks/useBills'
import { ContasContext } from '../context/ContasContext'
import type { Conta } from '../types/Bill'

const SIDEBAR_DEFAULT_WIDTH = 280
const SIDEBAR_MIN_WIDTH = 220
const SIDEBAR_MAX_WIDTH = 460
const SIDEBAR_STORAGE_KEY = 'finance-app:sidebar-width'

export default function DashboardLayout() {
	const [modalOpen, setModalOpen] = useState(false)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const contasState = useContas()
	const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false)
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
	const [sidebarWidth, setSidebarWidth] = useState(() => {
		if (typeof window === 'undefined') return SIDEBAR_DEFAULT_WIDTH
		try {
			const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
			const parsed = stored ? Number.parseInt(stored, 10) : NaN
			if (!Number.isFinite(parsed)) return SIDEBAR_DEFAULT_WIDTH
			return Math.min(Math.max(parsed, SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH)
		} catch {
			return SIDEBAR_DEFAULT_WIDTH
		}
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

	useEffect(() => {
		const openModal = () => setModalOpen(true)
		const openSettings = () => setSettingsOpen(true)
		window.addEventListener('finance:new-bill', openModal)
		window.addEventListener('finance:open-settings', openSettings)
		return () => {
			window.removeEventListener('finance:new-bill', openModal)
			window.removeEventListener('finance:open-settings', openSettings)
		}
	}, [])

	const handleMouseDown = () => {
		isResizingRef.current = true
		document.body.style.userSelect = 'none'
		document.body.style.cursor = 'col-resize'
	}

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizingRef.current) return

			const nextWidth = Math.min(Math.max(e.clientX, SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH)
			setSidebarWidth(nextWidth)
			window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextWidth))
		}

		const handleMouseUp = () => {
			if (!isResizingRef.current) return
			isResizingRef.current = false
			document.body.style.userSelect = ''
			document.body.style.cursor = ''
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
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
						<div
							className="sidebar-resize-handle"
							title="Arraste para redimensionar a barra lateral"
							onMouseDown={handleMouseDown}
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
					{/* Botão para reabrir a sidebar — aparece em todas as páginas quando fechada */}
					{!desktopOpened && (
						<ActionIcon
							visibleFrom="md"
							variant="subtle"
							onClick={toggleDesktop}
							aria-label="Abrir sidebar"
							style={{
								position: 'fixed',
								top: 14,
								left: 14,
								zIndex: 200,
								background: 'var(--color-surface, #111)',
								border: '1px solid rgba(255,255,255,0.1)',
								color: 'var(--color-aluminum)',
							}}
						>
							<PanelLeftOpen size={18} strokeWidth={1.8} />
						</ActionIcon>
					)}
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

				<SettingsModal opened={settingsOpen} onClose={() => setSettingsOpen(false)} />
			</div>
		</ContasContext.Provider>
	)
}
