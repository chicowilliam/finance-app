import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

function LoginPage() {
return <h1>Login</h1>
}

function CadastroPage() {
return <h1>Cadastro</h1>
}

function DashboardPage() {
return <h1>Dashboard</h1>
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
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/contas" element={<ContasPage />} />
				<Route path="/calendario" element={<CalendarioPage />} />
				<Route path="/alertas" element={<AlertasPage />} />
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

export default AppRoutes