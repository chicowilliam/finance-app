import { useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ActionIcon, Avatar, Box, Divider, Group, NavLink as MantineNavLink, Stack, Text, Tooltip } from '@mantine/core'
import { Bell, CalendarDays, Eye, EyeOff, LayoutDashboard, List, LogOut, PanelLeftClose, Settings, TrendingUp, Wallet } from '../lib/icons'
import { useContasContext } from '../context/ContasContext'
import { useAuth } from '../hooks/useAuth'
import { formatBRL } from '../utils/formatCurrency'

const mainLinks = [
	{ to: '/app',            label: 'Visão Geral',  icon: LayoutDashboard },
	{ to: '/app/contas',      label: 'Contas',       icon: List },
	{ to: '/app/calendario',  label: 'Calendário',   icon: CalendarDays },
	{ to: '/app/alertas',     label: 'Alertas',      icon: Bell },
]

interface SidebarProps {
	onToggleDesktop: () => void
	onNavClick: () => void
}

export default function Sidebar({ onToggleDesktop, onNavClick }: SidebarProps) {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [showValues, setShowValues] = useState(true)
	const { isAdmin, userName, userEmail, logout } = useAuth()
	const { contas } = useContasContext()
	const showSidebarSummary = pathname !== '/app'
	const bottomLinks = useMemo(() => {
		const links: Array<{ to: string; label: string; icon: typeof Settings }> = [
			{ to: '/app/configuracoes', label: 'Configurações', icon: Settings },
		]

		if (isAdmin) {
			links.unshift({ to: '/app/admin/usuarios', label: 'Painel Admin', icon: Settings })
		}

		return links
	}, [isAdmin])

	const totais = useMemo(() => {
		const saldoProjetado = contas.reduce((acc, conta) => acc + conta.valor, 0)
		const emAberto = contas
			.filter((conta) => conta.status !== 'paga')
			.reduce((acc, conta) => acc + conta.valor, 0)

		return {
			saldoProjetado,
			emAberto,
		}
	}, [contas])

	const isActive = (to: string) => {
		if (to === '/app') return pathname === '/app'
		return pathname.startsWith(to)
	}

	return (
		<Box
			className="sidebar-shell"
			style={{
				height: '100%',
				padding: 'var(--space-3) var(--space-2)',
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
			<Group gap={8} mb="sm" wrap="nowrap" justify="space-between">
				<Group gap={8} wrap="nowrap">
					<Wallet size={20} strokeWidth={1.5} color="var(--color-sidebar-text)" />
					<div
						style={{
							width: 8,
							height: 8,
							borderRadius: 999,
							background: 'var(--color-brand)',
							boxShadow: '0 0 0 3px rgba(30, 122, 93, 0.22)',
						}}
					/>
					<div style={{ height: 28, width: 160, display: 'flex', alignItems: 'center' }}>
						<Text c="var(--color-sidebar-text)" fw={600} size="sm">FinanceApp</Text>
					</div>
				</Group>
				{/* Botão de recolher — visível somente desktop */}
				<ActionIcon
					visibleFrom="md"
					variant="subtle"
					onClick={onToggleDesktop}
					aria-label="Recolher menu"
					style={{ color: 'var(--sidebar-icon)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
				>
					<PanelLeftClose size={18} strokeWidth={1.8} />
				</ActionIcon>
			</Group>

			{showSidebarSummary && (
				<Box
					className="matte-surface brushed-edge"
					style={{
						border: '1px solid rgba(255, 255, 255, 0.08)',
						borderRadius: 14,
						padding: '12px 12px 10px',
						marginBottom: 16,
					}}
				>
					<Group justify="space-between" align="center" mb={6}>
						<Text size="10px" fw={700} c="var(--color-aluminum)" className="sidebar-section-label">Resumo</Text>
						<ActionIcon
							variant="subtle"
							size="sm"
							onClick={() => setShowValues((v) => !v)}
							aria-label={showValues ? 'Ocultar valores' : 'Exibir valores'}
							style={{ color: 'var(--sidebar-icon)' }}
						>
							{showValues ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
						</ActionIcon>
					</Group>
					<Text size="xs" c="var(--color-aluminum)">Saldo projetado</Text>
					<Text size="xl" fw={500} c="var(--color-sidebar-text)" className="sidebar-balance-value" style={{ letterSpacing: '-0.01em' }}>
						{showValues ? formatBRL(totais.saldoProjetado) : 'R$ ••••••'}
					</Text>
					<Group gap={6} mt={6} wrap="nowrap">
						<TrendingUp size={14} strokeWidth={1.9} color="var(--color-brand)" />
						<Text size="xs" c="var(--color-aluminum)">
							Em aberto: {showValues ? formatBRL(totais.emAberto) : 'R$ ••••••'}
						</Text>
					</Group>
				</Box>
			)}

			<Stack gap={4} mb="md">
				<Text size="10px" fw={700} c="var(--color-aluminum)" className="sidebar-section-label" px={8}>Navegação</Text>
				{mainLinks.map((l) => (
					<MantineNavLink
						key={l.to}
						component={NavLink}
						to={l.to}
						label={(
							<Group gap={10} wrap="nowrap">
								<div
									style={{
										width: 6,
										height: 6,
										borderRadius: 999,
										background: isActive(l.to) ? 'var(--color-brand)' : 'var(--color-carbon-800)',
									}}
								/>
								<span>{l.label}</span>
							</Group>
						)}
						leftSection={<l.icon size={16} strokeWidth={1.5} />}
						active={isActive(l.to)}
						onClick={onNavClick}
						styles={{
							root: {
								borderRadius: 10,
								paddingBlock: 11,
								paddingInline: 10,
								minHeight: 42,
								border: '1px solid transparent',
								color: 'var(--color-sidebar-text)',
								background: isActive(l.to) ? 'var(--sidebar-link-bg-active)' : 'transparent',
								backdropFilter: isActive(l.to) ? 'blur(6px)' : 'none',
								borderColor: isActive(l.to) ? 'var(--sidebar-link-border-active)' : 'transparent',
								'@media (max-width: 48rem)': {
									paddingBlock: 13,
									paddingInline: 12,
									minHeight: 48,
								},
							},
							label: {
								fontWeight: isActive(l.to) ? 500 : 400,
								opacity: 1,
								fontSize: '0.92rem',
								color: isActive(l.to) ? 'var(--color-sidebar-text)' : 'var(--color-aluminum)',
								'@media (max-width: 48rem)': {
									fontSize: '1rem',
								},
							},
							section: { opacity: 1, color: 'var(--color-sidebar-text)' },
						}}
					/>
				))}
			</Stack>

			<Box mt="auto" pt="md">
				<Divider color="var(--sidebar-border)" mb="sm" />
				<Stack gap={4}>
					<Text size="10px" fw={700} c="var(--color-aluminum)" className="sidebar-section-label" px={8}>Sistema</Text>
					{bottomLinks.map((l) => (
						<MantineNavLink
							key={l.to}
							component={NavLink}
							to={l.to}
							label={(
								<Group gap={10} wrap="nowrap">
									<div
										style={{
											width: 6,
											height: 6,
											borderRadius: 999,
											background: isActive(l.to) ? 'var(--color-brand)' : 'var(--color-carbon-800)',
										}}
									/>
									<span>{l.label}</span>
								</Group>
							)}
							leftSection={<l.icon size={16} strokeWidth={1.5} />}
							active={isActive(l.to)}
							onClick={onNavClick}
							styles={{
								root: {
									borderRadius: 10,
									paddingBlock: 11,
									paddingInline: 10,
									minHeight: 42,
									border: '1px solid transparent',
									color: 'var(--color-sidebar-text)',
									background: isActive(l.to) ? 'var(--sidebar-link-bg-active)' : 'transparent',
									backdropFilter: isActive(l.to) ? 'blur(6px)' : 'none',
									borderColor: isActive(l.to) ? 'var(--sidebar-link-border-active)' : 'transparent',
									'@media (max-width: 48rem)': {
										paddingBlock: 13,
										paddingInline: 12,
										minHeight: 48,
									},
								},
								label: {
									fontWeight: isActive(l.to) ? 500 : 400,
									opacity: 1,
									fontSize: '0.92rem',
									color: isActive(l.to) ? 'var(--color-sidebar-text)' : 'var(--color-aluminum)',
									'@media (max-width: 48rem)': {
										fontSize: '1rem',
									},
								},
								section: { opacity: 1, color: 'var(--color-sidebar-text)' },
							}}
						/>
					))}
				</Stack>

				{/* Card de perfil */}
				<Box
					mt="sm"
					style={{
						border: '1px solid rgba(255,255,255,0.08)',
						borderRadius: 12,
						padding: '10px 12px',
						background: 'rgba(255,255,255,0.03)',
						cursor: 'pointer',
					}}
					onClick={() => { navigate('/app/configuracoes'); onNavClick() }}
				>
					<Group justify="space-between" wrap="nowrap">
						<Group gap={10} wrap="nowrap" style={{ minWidth: 0 }}>
							<Avatar size={32} radius="xl" color="teal" variant="filled" style={{ flexShrink: 0 }}>
								{userName ? userName.charAt(0).toUpperCase() : '?'}
							</Avatar>
							<Box style={{ minWidth: 0 }}>
								<Text size="xs" fw={600} c="var(--color-sidebar-text)" style={{ lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
									{userName ?? 'Usuário'}
								</Text>
								<Text size="10px" c="var(--color-aluminum)" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
									{userEmail ?? ''}
								</Text>
							</Box>
						</Group>
						<Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
							<Tooltip label="Configurações" withArrow openDelay={400} position="top">
								<ActionIcon
									variant="subtle"
									size="sm"
									onClick={(e) => { e.stopPropagation(); navigate('/app/configuracoes'); onNavClick() }}
									style={{ color: 'var(--color-aluminum)' }}
								>
									<Settings size={15} strokeWidth={1.8} />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Sair" withArrow openDelay={400} position="top">
								<ActionIcon
									variant="subtle"
									size="sm"
									onClick={(e) => { e.stopPropagation(); logout() }}
									style={{ color: 'var(--color-aluminum)' }}
								>
									<LogOut size={15} strokeWidth={1.8} />
								</ActionIcon>
							</Tooltip>
						</Group>
					</Group>
				</Box>
			</Box>
		</Box>
	)
}
