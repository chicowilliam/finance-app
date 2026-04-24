import { AnimatePresence } from 'motion/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import PrivateRoute from './routes/PrivateRoute'
import VisaoGeral from './pages/VisaoGeral'
import Contas from './pages/Contas'
import Calendario from './pages/Calendario'
import Alertas from './pages/Alertas'
import Configuracoes from './pages/Configuracoes'
import Welcome from './pages/Welcome'
import PageTransition from './components/PageTransition'
import './App.css'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Welcome /></PageTransition>} />

        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<PageTransition><VisaoGeral /></PageTransition>} />
            <Route path="/app/contas" element={<PageTransition><Contas /></PageTransition>} />
            <Route path="/app/calendario" element={<PageTransition><Calendario /></PageTransition>} />
            <Route path="/app/alertas" element={<PageTransition><Alertas /></PageTransition>} />
            <Route path="/app/configuracoes" element={<PageTransition><Configuracoes /></PageTransition>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}