import { NavLink, useLocation } from 'react-router-dom'
import { Box, Divider, Group, NavLink as MantineNavLink, Stack, Text } from '@mantine/core'
import { LayoutDashboard, List, CalendarDays, Bell, Wallet, Settings } from '../lib/icons'

const mainLinks = [
	{ to: '/app',            label: 'Visão Geral',  icon: LayoutDashboard },
	{ to: '/app/contas',      label: 'Contas',       icon: List },
	{ to: '/app/calendario',  label: 'Calendário',   icon: CalendarDays },
	{ to: '/app/alertas',     label: 'Alertas',      icon: Bell },
]

const bottomLinks = [
	{ to: '/app/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar() {
	const { pathname } = useLocation()

	const isActive = (to: string) => {
		if (to === '/app') return pathname === '/app'
		return pathname.startsWith(to)
	}

	return (
		<Box
			style={{
				height: '100%',
				padding: '12px',
				background: '#0f3d30',
				borderRadius: 12,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Group gap={8} mb="md" wrap="nowrap">
				<Wallet size={20} strokeWidth={1.5} color="#f0faf6" />
				<Text c="#f0faf6" fw={700} size="lg">FinanceApp</Text>
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
