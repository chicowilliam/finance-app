import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import PrivateRoute from './routes/PrivateRoute'
import VisaoGeral from './pages/VisaoGeral'
import Contas from './pages/Contas'
import Calendario from './pages/Calendario'
import Alertas from './pages/Alertas'
import Welcome from './pages/Welcome'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/app" element={<VisaoGeral />} />
          <Route path="/app/contas" element={<Contas />} />
          <Route path="/app/calendario" element={<Calendario />} />
          <Route path="/app/alertas" element={<Alertas />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}