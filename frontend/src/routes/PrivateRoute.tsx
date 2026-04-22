import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function PrivateRoute() {
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated) {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}

export default PrivateRoute