import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'

function LoginPage() {
return <h1>Login</h1>
}

function CadastroPage() {
return <h1>Cadastro</h1>
}

function DashboardPage() {
return (
	<section className="dashboard-page-grid">
		<article className="dashboard-card">
			<h3>Total pago no mes</h3>
			<p>R$ 2.150,00</p>
		</article>

		<article className="dashboard-card">
			<h3>Total a vencer</h3>
			<p>R$ 1.840,50</p>
		</article>

		<article className="dashboard-card">
			<h3>Contas em risco</h3>
			<p>2 contas com vencimento em ate 3 dias</p>
		</article>

		<article className="dashboard-card">
			<h3>Proximos vencimentos</h3>
			<ul>
				<li>15/04 - Cartao Nubank - R$ 620,00</li>
				<li>18/04 - Energia - R$ 210,50</li>
				<li>20/04 - Aluguel - R$ 1.010,00</li>
			</ul>
		</article>
	</section>
)
}

function ContasPage() {
return <h1>Contas</h1>
}

function CalendarioPage() {
return <h1>Calendario</h1>
}

function AlertasPage() {
return <h1>Alertas</h1>
}

function CartoesPage() {
return <h1>Cartoes</h1>
}

function ConfiguracoesPage() {
return <h1>Configuracoes</h1>
}

function NotFoundPage() {
return <h1>Pagina nao encontrada</h1>
}

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/dashboard" replace />} />

			<Route path="/login" element={<LoginPage />} />
			<Route path="/cadastro" element={<CadastroPage />} />

			<Route element={<PrivateRoute />}>
				<Route element={<DashboardLayout />}>
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/contas" element={<ContasPage />} />
					<Route path="/calendario" element={<CalendarioPage />} />
					<Route path="/alertas" element={<AlertasPage />} />
					<Route path="/cartoes" element={<CartoesPage />} />
					<Route path="/configuracoes" element={<ConfiguracoesPage />} />
				</Route>
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

export default AppRoutes