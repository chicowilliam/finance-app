import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import VisaoGeral from './pages/VisaoGeral'
import Contas from './pages/Contas'
import Calendario from './pages/Calendario'
import Alertas from './pages/Alertas'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <Routes>
          <Route path="/"           element={<VisaoGeral />} />
          <Route path="/contas"     element={<Contas />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/alertas"    element={<Alertas />} />
        </Routes>
      </div>
    </>
  )
}