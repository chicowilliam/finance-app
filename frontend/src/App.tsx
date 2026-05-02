import { Suspense, lazy } from 'react'
import { AnimatePresence } from 'motion/react'
import { Center, Loader, Stack, Text } from '@mantine/core'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PageTransition from './components/PageTransition'
import './App.css'

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))
const PrivateRoute = lazy(() => import('./routes/PrivateRoute'))
const AdminRoute = lazy(() => import('./routes/AdminRoute'))
const VisaoGeral = lazy(() => import('./pages/VisaoGeral'))
const Contas = lazy(() => import('./pages/Contas'))
const Calendario = lazy(() => import('./pages/Calendario'))
const Alertas = lazy(() => import('./pages/Alertas'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))
const AdminUsuarios = lazy(() => import('./pages/AdminUsuarios'))
const Welcome = lazy(() => import('./pages/Welcome'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))

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
            path="/app"
            element={(
              <Suspense fallback={<RouteFallback />}>
                <DashboardLayout />
              </Suspense>
            )}
          >
            <Route
              index
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <VisaoGeral />
                  </Suspense>
                </PageTransition>
              )}
            />
            <Route
              path="contas"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <Contas />
                  </Suspense>
                </PageTransition>
              )}
            />
            <Route
              path="calendario"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <Calendario />
                  </Suspense>
                </PageTransition>
              )}
            />
            <Route
              path="alertas"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <Alertas />
                  </Suspense>
                </PageTransition>
              )}
            />
            <Route
              path="configuracoes"
              element={(
                <PageTransition>
                  <Suspense fallback={<RouteFallback />}>
                    <Configuracoes />
                  </Suspense>
                </PageTransition>
              )}
            />

            <Route
              element={(
                <Suspense fallback={<RouteFallback />}>
                  <AdminRoute />
                </Suspense>
              )}
            >
              <Route
                path="admin/usuarios"
                element={(
                  <PageTransition>
                    <Suspense fallback={<RouteFallback />}>
                      <AdminUsuarios />
                    </Suspense>
                  </PageTransition>
                )}
              />
            </Route>
          </Route>
        </Route>

        <Route
          path="/auth/verify-email"
          element={(
            <PageTransition>
              <Suspense fallback={<RouteFallback />}>
                <VerifyEmail />
              </Suspense>
            </PageTransition>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}