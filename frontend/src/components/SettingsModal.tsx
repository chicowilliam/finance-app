import { useCallback, useEffect, useState } from 'react'
import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Divider,
	Group,
	Modal,
	PasswordInput,
	ScrollArea,
	Select,
	Stack,
	Switch,
	Text,
	TextInput,
	ThemeIcon,
} from '@mantine/core'
import { toast } from 'sonner'
import { Database, Download, FileText, Globe, KeyRound, Moon, Settings, Shield, Sliders, Sun, Timer, Trash2, UserCog, Zap } from '../lib/icons'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { apiChangePassword, apiDeleteOwnAccount, apiUpdateProfile } from '../services/authService'

// ─── Preference keys ──────────────────────────────────────────────────────────
const PREF_HIDE_VALUES    = 'finance.pref.hideValuesByDefault'
const PREF_REDUCE_MOTION  = 'finance.pref.reduceMotion'
const PREF_HIGH_CONTRAST  = 'finance.pref.highContrast'
const PREF_SESSION_TIMEOUT = 'finance.pref.sessionTimeout'
const PREF_NOTIF_BILLS    = 'finance.pref.notifBills'
const PREF_NOTIF_WEEKLY   = 'finance.pref.notifWeekly'
const PREF_DENSITY        = 'finance.pref.density'
const PREF_CURRENCY       = 'finance.pref.currency'
const PREF_ACCENT         = 'finance.pref.accentColor'

function getBool(key: string, def = false): boolean {
	const v = localStorage.getItem(key)
	return v === null ? def : v === 'true'
}
function setBool(key: string, v: boolean) { localStorage.setItem(key, String(v)) }
function getStr(key: string, def: string): string {
	return localStorage.getItem(key) ?? def
}
function setStr(key: string, v: string) { localStorage.setItem(key, v) }

// ─── Accent colors ────────────────────────────────────────────────────────────
const ACCENT_OPTIONS = [
	{ label: 'Teal (padrão)', value: 'teal',   color: '#2ecc8a' },
	{ label: 'Azul',          value: 'blue',   color: '#3b82f6' },
	{ label: 'Roxo',          value: 'violet', color: '#8b5cf6' },
	{ label: 'Laranja',       value: 'orange', color: '#f97316' },
	{ label: 'Rosa',          value: 'pink',   color: '#ec4899' },
]

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
	icon,
	title,
	description,
	color,
	children,
}: {
	icon: React.ReactNode
	title: string
	description?: string
	color: string
	children: React.ReactNode
}) {
	return (
		<Box>
			<Group gap={12} mb={16}>
				<ThemeIcon size={36} radius="md" color={color} variant="light">
					{icon}
				</ThemeIcon>
				<Box>
					<Text fw={600} size="sm">{title}</Text>
					{description && <Text size="xs" c="dimmed">{description}</Text>}
				</Box>
			</Group>
			<Stack gap={14} pl={48}>
				{children}
			</Stack>
		</Box>
	)
}

// ─── Row with label + control ─────────────────────────────────────────────────
function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
	return (
		<Group justify="space-between" wrap="nowrap" gap="xl">
			<Box style={{ minWidth: 0 }}>
				<Text size="sm" fw={500}>{label}</Text>
				{description && <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>{description}</Text>}
			</Box>
			<Box style={{ flexShrink: 0 }}>{children}</Box>
		</Group>
	)
}

// ─── Main component ───────────────────────────────────────────────────────────
interface SettingsModalProps {
	opened: boolean
	onClose: () => void
}

type Tab = 'conta' | 'aparencia' | 'acessibilidade' | 'privacidade' | 'notificacoes' | 'dados'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
	{ id: 'conta',          label: 'Conta',          icon: <UserCog size={16} strokeWidth={1.8} /> },
	{ id: 'aparencia',      label: 'Aparência',      icon: <Sliders size={16} strokeWidth={1.8} /> },
	{ id: 'acessibilidade', label: 'Acessibilidade', icon: <Settings size={16} strokeWidth={1.8} /> },
	{ id: 'privacidade',    label: 'Privacidade',    icon: <Shield size={16} strokeWidth={1.8} /> },
	{ id: 'notificacoes',   label: 'Notificações',   icon: <Zap size={16} strokeWidth={1.8} /> },
	{ id: 'dados',          label: 'Dados',          icon: <Database size={16} strokeWidth={1.8} /> },
]

export default function SettingsModal({ opened, onClose }: SettingsModalProps) {
	const { userName, userEmail, refreshProfile } = useAuth()
	const { theme, toggleTheme } = useTheme()

	const [activeTab, setActiveTab] = useState<Tab>('conta')

	// ── Conta state ──
	const [nome,  setNome]  = useState(userName ?? '')
	const [email, setEmail] = useState(userEmail ?? '')
	// Sync fields whenever the modal opens (userName/userEmail may load after mount)
	useEffect(() => {
		if (opened) {
			setNome(userName ?? '')
			setEmail(userEmail ?? '')
		}
	}, [opened, userName, userEmail])

	const [savingProfile, setSavingProfile] = useState(false)

	const [senhaAtual,  setSenhaAtual]  = useState('')
	const [novaSenha,   setNovaSenha]   = useState('')
	const [confirmSenha, setConfirmSenha] = useState('')
	const [savingPwd, setSavingPwd] = useState(false)

	const [deleteConfirm, setDeleteConfirm] = useState('')
	const [deletingAccount, setDeletingAccount] = useState(false)

	// ── Appearance ──
	const [accent,  setAccent]  = useState(() => getStr(PREF_ACCENT, 'teal'))
	const [density, setDensity] = useState(() => getStr(PREF_DENSITY, 'confortavel'))

	// ── Accessibility ──
	const [reduceMotion, setReduceMotion] = useState(() => getBool(PREF_REDUCE_MOTION))
	const [highContrast, setHighContrast] = useState(() => getBool(PREF_HIGH_CONTRAST))

	// ── Privacy ──
	const [hideValues,      setHideValues]      = useState(() => getBool(PREF_HIDE_VALUES))
	const [sessionTimeout,  setSessionTimeout]  = useState(() => getStr(PREF_SESSION_TIMEOUT, 'nunca'))

	// ── Notifications ──
	const [notifBills,  setNotifBills]  = useState(() => getBool(PREF_NOTIF_BILLS, true))
	const [notifWeekly, setNotifWeekly] = useState(() => getBool(PREF_NOTIF_WEEKLY))

	// ── Data ──
	const [currency, setCurrency] = useState(() => getStr(PREF_CURRENCY, 'BRL'))

	// ── Handlers ──────────────────────────────────────────────────────────────
	const handleSaveProfile = useCallback(async () => {
		setSavingProfile(true)
		try {
			await apiUpdateProfile({ nome, email })
			await refreshProfile()
			toast.success('Perfil atualizado!')
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Erro ao salvar perfil')
		} finally {
			setSavingProfile(false)
		}
	}, [nome, email, refreshProfile])

	const handleChangePassword = useCallback(async () => {
		if (novaSenha !== confirmSenha) {
			toast.error('As senhas não coincidem')
			return
		}
		if (novaSenha.length < 6) {
			toast.error('A nova senha deve ter pelo menos 6 caracteres')
			return
		}
		setSavingPwd(true)
		try {
			await apiChangePassword(senhaAtual, novaSenha)
			toast.success('Senha alterada com sucesso!')
			setSenhaAtual(''); setNovaSenha(''); setConfirmSenha('')
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Erro ao alterar senha')
		} finally {
			setSavingPwd(false)
		}
	}, [senhaAtual, novaSenha, confirmSenha])

	const handleDeleteAccount = useCallback(async () => {
		setDeletingAccount(true)
		try {
			await apiDeleteOwnAccount(deleteConfirm)
			toast.success('Conta excluída')
			onClose()
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Erro ao excluir conta')
		} finally {
			setDeletingAccount(false)
		}
	}, [deleteConfirm, onClose])

	function handleAccentChange(value: string) {
		setAccent(value)
		setStr(PREF_ACCENT, value)
		const accentColor = ACCENT_OPTIONS.find((a) => a.value === value)?.color ?? '#2ecc8a'
		document.documentElement.style.setProperty('--color-brand', accentColor)
	}

	function handleDensityChange(value: string) {
		setDensity(value)
		setStr(PREF_DENSITY, value)
		document.documentElement.dataset.density = value
	}

	function toggleReduceMotion(v: boolean) {
		setReduceMotion(v)
		setBool(PREF_REDUCE_MOTION, v)
		document.documentElement.dataset.reduceMotion = String(v)
	}

	function toggleHighContrast(v: boolean) {
		setHighContrast(v)
		setBool(PREF_HIGH_CONTRAST, v)
		document.documentElement.dataset.highContrast = String(v)
	}

	function toggleHideValues(v: boolean) {
		setHideValues(v)
		setBool(PREF_HIDE_VALUES, v)
	}

	function handleSessionTimeout(v: string | null) {
		const val = v ?? 'nunca'
		setSessionTimeout(val)
		setStr(PREF_SESSION_TIMEOUT, val)
	}

	function handleCurrencyChange(v: string | null) {
		const val = v ?? 'BRL'
		setCurrency(val)
		setStr(PREF_CURRENCY, val)
	}

	// ── Render tabs ────────────────────────────────────────────────────────────
	function renderTab() {
		switch (activeTab) {
			case 'conta':
				return (
					<Stack gap={24}>
						<Section
							icon={<UserCog size={18} strokeWidth={1.8} />}
							title="Informações pessoais"
							description="Nome e e-mail exibidos no app"
							color="teal"
						>
							<Group align="center" gap={16} wrap="nowrap">
								<Avatar size={52} radius="xl" color="teal" variant="filled" style={{ flexShrink: 0 }}>
									{nome ? nome.charAt(0).toUpperCase() : '?'}
								</Avatar>
								<Text size="xs" c="dimmed">Avatar gerado pela inicial do nome</Text>
							</Group>
							<TextInput
								label="Nome"
								value={nome}
								onChange={(e) => setNome(e.currentTarget.value)}
								placeholder="Seu nome completo"
							/>
							<TextInput
								label="E-mail"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.currentTarget.value)}
								placeholder="seu@email.com"
							/>
							<Button
								size="sm"
								color="teal"
								loading={savingProfile}
								onClick={handleSaveProfile}
								style={{ alignSelf: 'flex-start' }}
							>
								Salvar alterações
							</Button>
							<Button
								size="sm"
								variant="default"
								onClick={onClose}
								style={{ alignSelf: 'flex-start' }}
							>
								Fechar
							</Button>
						</Section>

						<Divider />

						<Section
							icon={<KeyRound size={18} strokeWidth={1.8} />}
							title="Alterar senha"
							description="Escolha uma senha forte com pelo menos 6 caracteres"
							color="blue"
						>
							<PasswordInput
								label="Senha atual"
								value={senhaAtual}
								onChange={(e) => setSenhaAtual(e.currentTarget.value)}
								placeholder="••••••••"
							/>
							<PasswordInput
								label="Nova senha"
								value={novaSenha}
								onChange={(e) => setNovaSenha(e.currentTarget.value)}
								placeholder="••••••••"
							/>
							<PasswordInput
								label="Confirmar nova senha"
								value={confirmSenha}
								onChange={(e) => setConfirmSenha(e.currentTarget.value)}
								placeholder="••••••••"
							/>
							<Button
								size="sm"
								color="blue"
								loading={savingPwd}
								onClick={handleChangePassword}
								style={{ alignSelf: 'flex-start' }}
							>
								Alterar senha
							</Button>
						</Section>

						<Divider />

						<Section
							icon={<Trash2 size={18} strokeWidth={1.8} />}
							title="Zona de perigo"
							description="Esta ação é irreversível"
							color="red"
						>
							<Box
								style={{
									border: '1px solid var(--mantine-color-red-4)',
									borderRadius: 10,
									padding: '14px 16px',
									background: 'rgba(239,68,68,0.05)',
								}}
							>
								<Text size="sm" fw={500} c="red" mb={4}>Excluir conta permanentemente</Text>
								<Text size="xs" c="dimmed" mb={12}>
									Todos os seus dados (contas, histórico, configurações) serão deletados e não poderão ser recuperados.
								</Text>
								<TextInput
									placeholder='Digite "excluir minha conta" para confirmar'
									value={deleteConfirm}
									onChange={(e) => setDeleteConfirm(e.currentTarget.value)}
									mb={10}
									size="sm"
								/>
								<Button
									size="sm"
									color="red"
									variant="filled"
									loading={deletingAccount}
									disabled={deleteConfirm !== 'excluir minha conta'}
									onClick={handleDeleteAccount}
								>
									Excluir minha conta
								</Button>
							</Box>
						</Section>
					</Stack>
				)

			case 'aparencia':
				return (
					<Stack gap={24}>
						<Section
							icon={theme === 'dark' ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
							title="Tema"
							description="Escolha entre o modo claro ou escuro"
							color="grape"
						>
							<SettingRow label="Modo escuro" description="Alterna a aparência geral do app">
								<Switch
									checked={theme === 'dark'}
									onChange={() => toggleTheme()}
									color="teal"
									size="md"
								/>
							</SettingRow>
						</Section>

						<Divider />

						<Section
							icon={<Sliders size={18} strokeWidth={1.8} />}
							title="Cor de destaque"
							description="Cor usada em botões, ícones ativos e destaques"
							color="teal"
						>
							<Group gap={10}>
								{ACCENT_OPTIONS.map((opt) => (
									<ActionIcon
										key={opt.value}
										size={32}
										radius="xl"
										onClick={() => handleAccentChange(opt.value)}
										title={opt.label}
										style={{
											background: opt.color,
											outline: accent === opt.value ? `2px solid ${opt.color}` : 'none',
											outlineOffset: 3,
											transition: 'outline 0.15s',
										}}
									>
										{accent === opt.value && (
											<svg viewBox="0 0 24 24" width={14} height={14} stroke="white" strokeWidth={3} fill="none">
												<polyline points="20 6 9 17 4 12" />
											</svg>
										)}
									</ActionIcon>
								))}
							</Group>
							<Text size="xs" c="dimmed">Selecionado: {ACCENT_OPTIONS.find((a) => a.value === accent)?.label}</Text>
						</Section>

						<Divider />

						<Section
							icon={<Globe size={18} strokeWidth={1.8} />}
							title="Densidade"
							description="Controla o espaçamento dos elementos na tela"
							color="indigo"
						>
							<SettingRow label="Compacto" description="Mais conteúdo visível por vez">
								<Switch
									checked={density === 'compacto'}
									onChange={(e) => handleDensityChange(e.currentTarget.checked ? 'compacto' : 'confortavel')}
									color="teal"
									size="md"
								/>
							</SettingRow>
						</Section>
					</Stack>
				)

			case 'acessibilidade':
				return (
					<Stack gap={24}>
						<Section
							icon={<Sliders size={18} strokeWidth={1.8} />}
							title="Acessibilidade visual"
							description="Ajustes para melhorar a experiência de uso"
							color="violet"
						>
							<SettingRow
								label="Reduzir animações"
								description="Desativa transições e efeitos de movimento"
							>
								<Switch
									checked={reduceMotion}
									onChange={(e) => toggleReduceMotion(e.currentTarget.checked)}
									color="teal"
									size="md"
								/>
							</SettingRow>

							<SettingRow
								label="Alto contraste"
								description="Aumenta o contraste de textos e bordas"
							>
								<Switch
									checked={highContrast}
									onChange={(e) => toggleHighContrast(e.currentTarget.checked)}
									color="teal"
									size="md"
								/>
							</SettingRow>
						</Section>
					</Stack>
				)

			case 'privacidade':
				return (
					<Stack gap={24}>
						<Section
							icon={<Shield size={18} strokeWidth={1.8} />}
							title="Exibição de valores"
							description="Controle quando os saldos ficam visíveis"
							color="teal"
						>
							<SettingRow
								label="Ocultar valores ao abrir"
								description="O painel começa com os saldos ocultos por padrão"
							>
								<Switch
									checked={hideValues}
									onChange={(e) => toggleHideValues(e.currentTarget.checked)}
									color="teal"
									size="md"
								/>
							</SettingRow>
						</Section>

						<Divider />

						<Section
							icon={<Timer size={18} strokeWidth={1.8} />}
							title="Sessão automática"
							description="Encerrar sessão após inatividade"
							color="orange"
						>
							<SettingRow
								label="Timeout de sessão"
								description="Após inatividade, você será desconectado automaticamente"
							>
								<Select
									value={sessionTimeout}
									onChange={handleSessionTimeout}
									data={[
										{ label: '15 minutos', value: '15min' },
										{ label: '30 minutos', value: '30min' },
										{ label: '1 hora',     value: '1h' },
										{ label: 'Nunca',      value: 'nunca' },
									]}
									size="xs"
									w={130}
									checkIconPosition="right"
									allowDeselect={false}
								/>
							</SettingRow>
						</Section>
					</Stack>
				)

			case 'notificacoes':
				return (
					<Stack gap={24}>
						<Section
							icon={<Zap size={18} strokeWidth={1.8} />}
							title="Alertas e lembretes"
							description="Escolha os avisos que ajudam você a não perder prazos"
							color="yellow"
						>
							<Box
								style={{
									border: '1px solid rgba(250, 204, 21, 0.28)',
									borderRadius: 12,
									padding: '14px 16px',
									background: 'linear-gradient(135deg, rgba(250,204,21,0.12), rgba(250,204,21,0.04))',
								}}
							>
								<Group justify="space-between" align="flex-start" gap="xl" wrap="nowrap">
									<Box style={{ minWidth: 0 }}>
										<Text size="md" fw={700} style={{ letterSpacing: '0.01em' }}>Contas vencendo</Text>
										<Text size="sm" c="dimmed" style={{ lineHeight: 1.45 }}>
											Receba um alerta quando uma conta estiver perto do vencimento.
										</Text>
									</Box>
									<Switch
										checked={notifBills}
										onChange={(e) => { setNotifBills(e.currentTarget.checked); setBool(PREF_NOTIF_BILLS, e.currentTarget.checked) }}
										color="teal"
										size="lg"
										style={{ flexShrink: 0, marginTop: 2 }}
									/>
								</Group>
							</Box>

							<Box
								style={{
									border: '1px solid rgba(45, 212, 191, 0.28)',
									borderRadius: 12,
									padding: '14px 16px',
									background: 'linear-gradient(135deg, rgba(45,212,191,0.12), rgba(45,212,191,0.04))',
								}}
							>
								<Group justify="space-between" align="flex-start" gap="xl" wrap="nowrap">
									<Box style={{ minWidth: 0 }}>
										<Text size="md" fw={700} style={{ letterSpacing: '0.01em' }}>Resumo semanal</Text>
										<Text size="sm" c="dimmed" style={{ lineHeight: 1.45 }}>
											Receba por e-mail um panorama dos gastos e contas da semana.
										</Text>
									</Box>
									<Switch
										checked={notifWeekly}
										onChange={(e) => { setNotifWeekly(e.currentTarget.checked); setBool(PREF_NOTIF_WEEKLY, e.currentTarget.checked) }}
										color="teal"
										size="lg"
										style={{ flexShrink: 0, marginTop: 2 }}
									/>
								</Group>
							</Box>
						</Section>
					</Stack>
				)

			case 'dados':
				return (
					<Stack gap={24}>
						<Section
							icon={<Globe size={18} strokeWidth={1.8} />}
							title="Moeda padrão"
							description="Formato de exibição dos valores monetários"
							color="teal"
						>
							<SettingRow label="Moeda" description="Afeta a formatação de todos os valores">
								<Select
									value={currency}
									onChange={handleCurrencyChange}
									data={[
										{ label: 'R$ — Real Brasileiro', value: 'BRL' },
										{ label: '$ — Dólar Americano',  value: 'USD' },
										{ label: '€ — Euro',            value: 'EUR' },
										{ label: '£ — Libra Esterlina',  value: 'GBP' },
									]}
									size="xs"
									w={190}
									checkIconPosition="right"
									allowDeselect={false}
								/>
							</SettingRow>
						</Section>

						<Divider />

						<Section
							icon={<Download size={18} strokeWidth={1.8} />}
							title="Exportar dados"
							description="Baixe seus dados em diferentes formatos"
							color="blue"
						>
							<Group gap={10}>
								<Button
									size="sm"
									variant="light"
									color="blue"
									leftSection={<FileText size={15} strokeWidth={1.8} />}
									onClick={() => toast.info('Exportação em CSV em breve!')}
								>
									Exportar CSV
								</Button>
								<Button
									size="sm"
									variant="light"
									color="grape"
									leftSection={<FileText size={15} strokeWidth={1.8} />}
									onClick={() => toast.info('Exportação em PDF em breve!')}
								>
									Exportar PDF
								</Button>
							</Group>
							<Text size="xs" c="dimmed">A exportação inclui todas as contas e histórico registrado.</Text>
						</Section>
					</Stack>
				)

			default:
				return null
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={null}
			size={820}
			padding={0}
			radius={16}
			centered
			withCloseButton={false}
			styles={{
				content: {
					background: 'var(--color-surface, #111)',
					border: '1px solid rgba(255,255,255,0.08)',
					overflow: 'hidden',
				},
				body: { padding: 0 },
			}}
		>
			<Group align="stretch" wrap="nowrap" style={{ minHeight: 540 }}>
				{/* ── Sidebar nav ── */}
				<Box
					style={{
						width: 200,
						flexShrink: 0,
						borderRight: '1px solid rgba(255,255,255,0.07)',
						padding: '20px 10px',
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						background: 'rgba(0,0,0,0.18)',
					}}
				>
					<Text size="11px" fw={700} c="dimmed" px={8} mb={6} style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
						Configurações
					</Text>
					{TABS.map((tab) => (
						<Box
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className="profile-menu-item"
							style={{
								borderRadius: 8,
								padding: '8px 10px',
								cursor: 'pointer',
								background: activeTab === tab.id ? 'rgba(255,255,255,0.07)' : 'transparent',
								border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
								transition: 'background 0.12s',
							}}
						>
							<Group gap={9} wrap="nowrap">
								<Box style={{ color: activeTab === tab.id ? 'var(--color-brand, #2ecc8a)' : 'var(--color-aluminum, #8899aa)', flexShrink: 0 }}>
									{tab.icon}
								</Box>
								<Text size="sm" fw={activeTab === tab.id ? 600 : 400} c={activeTab === tab.id ? 'var(--color-sidebar-text)' : 'dimmed'}>
									{tab.label}
								</Text>
							</Group>
						</Box>
					))}

					{/* Spacer + fechar */}
					<Box mt="auto" pt={16}>
						<Divider color="rgba(255,255,255,0.07)" mb={10} />
						<Box
							onClick={onClose}
							className="profile-menu-item"
							style={{
								borderRadius: 8,
								padding: '8px 10px',
								cursor: 'pointer',
							}}
						>
							<Group gap={9}>
								<Box style={{ color: 'var(--color-aluminum, #8899aa)' }}>
									<svg viewBox="0 0 24 24" width={16} height={16} stroke="currentColor" strokeWidth={1.8} fill="none">
										<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</Box>
								<Text size="sm" c="dimmed">Fechar</Text>
							</Group>
						</Box>
					</Box>
				</Box>

				{/* ── Content ── */}
				<ScrollArea style={{ flex: 1 }} type="scroll">
					<Box p={28}>
						<Group justify="flex-end" mb={4}>
							<ActionIcon variant="subtle" onClick={onClose} aria-label="Fechar configurações" size="sm" style={{ color: 'var(--color-aluminum)' }}>
								<svg viewBox="0 0 24 24" width={16} height={16} stroke="currentColor" strokeWidth={2} fill="none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
							</ActionIcon>
						</Group>
						{renderTab()}
						<Divider my={22} color="rgba(255,255,255,0.08)" />
						<Group justify="flex-end">
							<Button variant="default" onClick={onClose}>
								Fechar configurações
							</Button>
						</Group>
					</Box>
				</ScrollArea>
			</Group>
		</Modal>
	)
}
