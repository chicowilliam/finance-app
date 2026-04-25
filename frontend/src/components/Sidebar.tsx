import { NavLink, useLocation } from 'react-router-dom'
import { ActionIcon, Box, Divider, Group, NavLink as MantineNavLink, Stack, Text } from '@mantine/core'
import { Bell, CalendarDays, LayoutDashboard, List, PanelLeftClose, Settings, Wallet } from '../lib/icons'

const mainLinks = [
	{ to: '/app',            label: 'Visão Geral',  icon: LayoutDashboard },
	{ to: '/app/contas',      label: 'Contas',       icon: List },
	{ to: '/app/calendario',  label: 'Calendário',   icon: CalendarDays },
	{ to: '/app/alertas',     label: 'Alertas',      icon: Bell },
]

const bottomLinks = [
	{ to: '/app/configuracoes', label: 'Configurações', icon: Settings },
]

interface SidebarProps {
	desktopOpened: boolean
	onToggleDesktop: () => void
	onNavClick: () => void
}

export default function Sidebar({ desktopOpened, onToggleDesktop, onNavClick }: SidebarProps) {
	const { pathname } = useLocation()

	const isActive = (to: string) => {
		if (to === '/app') return pathname === '/app'
		return pathname.startsWith(to)
	}

	return (
		<Box
			style={{
				height: '100%',
				padding: '24px 12px',
				background: 'transparent',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Group gap={8} mb="md" wrap="nowrap" justify="space-between">
				<Group gap={8} wrap="nowrap">
					<Wallet size={20} strokeWidth={1.5} color="#f0faf6" />
					<Text c="#f0faf6" fw={700} size="lg">FinanceApp</Text>
				</Group>
				{/* Botão de recolher — visível somente desktop */}
				<ActionIcon
					visibleFrom="md"
					variant="subtle"
					onClick={onToggleDesktop}
					aria-label="Recolher menu"
					style={{ color: 'rgba(240,250,246,0.6)' }}
				>
					<PanelLeftClose size={18} strokeWidth={1.8} />
				</ActionIcon>
			</Group>

			<Stack gap={6}>
				{mainLinks.map((l) => (
					<MantineNavLink
						key={l.to}
						component={NavLink}
						to={l.to}
						label={l.label}
						leftSection={<l.icon size={16} strokeWidth={1.5} />}
						active={isActive(l.to)}
						onClick={onNavClick}
						styles={{
							root: {
								borderRadius: 10,
								color: '#d3ebdf',
								background: isActive(l.to) ? 'rgba(255,255,255,0.16)' : 'transparent',
							},
							label: { fontWeight: 600 },
						}}
					/>
				))}
			</Stack>

			<Box mt="auto" pt="md">
				<Divider color="rgba(255,255,255,0.2)" mb="sm" />
				<Stack gap={6}>
					{bottomLinks.map((l) => (
						<MantineNavLink
							key={l.to}
							component={NavLink}
							to={l.to}
							label={l.label}
							leftSection={<l.icon size={16} strokeWidth={1.5} />}
							active={isActive(l.to)}
							onClick={onNavClick}
							styles={{
								root: {
									borderRadius: 10,
									color: '#d3ebdf',
									background: isActive(l.to) ? 'rgba(255,255,255,0.16)' : 'transparent',
								},
								label: { fontWeight: 600 },
							}}
						/>
					))}
				</Stack>
			</Box>
		</Box>
	)
}
