import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute() {
	const isAuthenticated = Boolean(localStorage.getItem('token'))

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	return <Outlet />
}

export default PrivateRoute