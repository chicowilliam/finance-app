import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import VisaoGeral from './pages/VisaoGeral'
import Contas from './pages/Contas'
import Calendario from './pages/Calendario'
import Alertas from './pages/Alertas'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/"           element={<VisaoGeral />} />
        <Route path="/contas"     element={<Contas />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/alertas"    element={<Alertas />} />
      </Route>
    </Routes>
  )
}