import { Suspense, lazy } from 'react'
import { AnimatePresence } from 'motion/react'
import { Center, Loader, Stack, Text } from '@mantine/core'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PageTransition from './components/PageTransition'
import './App.css'

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))
const PrivateRoute = lazy(() => import('./routes/PrivateRoute'))
const VisaoGeral = lazy(() => import('./pages/VisaoGeral'))
const Contas = lazy(() => import('./pages/Contas'))
const Calendario = lazy(() => import('./pages/Calendario'))
const Alertas = lazy(() => import('./pages/Alertas'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))
const Welcome = lazy(() => import('./pages/Welcome'))

function RouteFallback() {
  return (
    <Center py={64}>
      <Stack align="center" gap="xs">
        <Loader color="teal" />
        <Text c="dimmed" size="sm">Carregando interface...</Text>
      </Stack>
    </Center>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={(
            <PageTransition>
              <Suspense fallback={<RouteFallback />}>
                <Welcome />
              </Suspense>
            </PageTransition>
          )}
        />

        <Route
          element={(
            <Suspense fallback={<RouteFallback />}>
              <PrivateRoute />
            </Suspense>
          )}
        >
          <Route
            element={(
              <Suspense fallback={<RouteFallback />}>
                <DashboardLayout />
              </Suspense>
            )}
          >
            <Route
              path="/app"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <VisaoGeral />
                  </Suspense>
                </PageTransition>
              )}
            />
            <Route
              path="/app/contas"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <Contas />
                  </Suspense>
                </PageTransition>
              )}
            />
            <Route
              path="/app/calendario"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <Calendario />
                  </Suspense>
                </PageTransition>
              )}
            />
            <Route
              path="/app/alertas"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <Alertas />
                  </Suspense>
                </PageTransition>
              )}
            />
            <Route
              path="/app/configuracoes"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <Configuracoes />
                  </Suspense>
                </PageTransition>
              )}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}