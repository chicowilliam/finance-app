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
	onToggleDesktop: () => void
	onNavClick: () => void
}

export default function Sidebar({ onToggleDesktop, onNavClick }: SidebarProps) {
	const { pathname } = useLocation()

	const isActive = (to: string) => {
		if (to === '/app') return pathname === '/app'
		return pathname.startsWith(to)
	}

	return (
		<Box
			style={{
				height: '100%',
				padding: 'var(--space-3) var(--space-2)',
				background: 'transparent',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Group gap={8} mb="md" wrap="nowrap" justify="space-between">
				<Group gap={8} wrap="nowrap">
					<Wallet size={20} strokeWidth={1.5} color="var(--sidebar-text)" />
					<Text c="var(--sidebar-text)" fw={700} size="lg">FinanceApp</Text>
				</Group>
				{/* Botão de recolher — visível somente desktop */}
				<ActionIcon
					visibleFrom="md"
					variant="subtle"
					onClick={onToggleDesktop}
					aria-label="Recolher menu"
					style={{ color: 'var(--sidebar-icon)' }}
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
								color: 'var(--sidebar-text)',
								background: isActive(l.to) ? 'var(--sidebar-link-bg-active)' : 'transparent',
							},
							label: { fontWeight: 600 },
						}}
					/>
				))}
			</Stack>

			<Box mt="auto" pt="md">
				<Divider color="var(--sidebar-border)" mb="sm" />
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
									color: 'var(--sidebar-text)',
									background: isActive(l.to) ? 'var(--sidebar-link-bg-active)' : 'transparent',
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
