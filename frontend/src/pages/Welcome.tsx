import { useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle } from '../lib/icons'
import { useAuth } from '../hooks/useAuth'

type Tab = 'login' | 'register'

const tabDirection: Record<string, number> = { login: -1, register: 1 }

const formVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.2 } }),
}

export default function Welcome() {
  const [tab, setTab] = useState<Tab>('login')
  const prevTabRef = useRef<Tab>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { isAuthenticated, enterGuest, login, register } = useAuth()

  const titulo = useMemo(
    () => (tab === 'login' ? 'Entrar na sua conta' : 'Criar nova conta'),
    [tab],
  )

  function handleTabChange(value: Tab) {
    prevTabRef.current = tab
    setTab(value)
  }

  if (isAuthenticated) return <Navigate to="/app" replace />

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    try {
      if (tab === 'login') {
        await login(email, senha)
      } else {
        await register(nome, email, senha)
      }
      navigate('/app')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  function handleGuest() {
    enterGuest()
    navigate('/app')
  }

  return (
    <Container size={520} py={36}>
      <Paper withBorder shadow="sm" radius="lg" p="lg">
        <Stack gap="md">
          <div>
            <Text c="teal" fw={700} size="xs" tt="uppercase">Finance App</Text>
            <Title order={1} size="h2">Controle financeiro sem fricção</Title>
            <Text c="dimmed" mt={6}>Entre, crie sua conta ou continue como convidado para testar tudo agora.</Text>
          </div>

          <Tabs value={tab} onChange={(value) => handleTabChange((value as Tab) ?? 'login')}>
            <Tabs.List grow>
              <Tabs.Tab value="login">Entrar</Tabs.Tab>
              <Tabs.Tab value="register">Criar conta</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence mode="wait" custom={tabDirection[tab]}>
              <motion.div
                key={tab}
                custom={tabDirection[tab]}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <form onSubmit={handleAuthSubmit}>
                  <Stack gap="sm">
                    <Title order={2} size="h4">{titulo}</Title>

                    {tab === 'register' && (
                      <TextInput
                        label="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.currentTarget.value)}
                        placeholder="Seu nome"
                      />
                    )}

                    <TextInput
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      placeholder="voce@email.com"
                    />

                    <PasswordInput
                      label="Senha"
                      value={senha}
                      onChange={(e) => setSenha(e.currentTarget.value)}
                      placeholder="Sua senha"
                    />

                    {erro && (
                      <Alert color="red" variant="light" icon={<AlertCircle size={16} strokeWidth={1.8} />}>
                        {erro}
                      </Alert>
                    )}

                    <Button type="submit" loading={loading}>
                      {tab === 'login' ? 'Entrar' : 'Criar conta'}
                    </Button>
                  </Stack>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>

          <Group justify="space-between" align="center">
            <Button variant="default" onClick={handleGuest}>Continuar como convidado</Button>
            <Text size="xs" c="dimmed">Os dados de convidado ficam neste navegador.</Text>
          </Group>
        </Stack>
      </Paper>
    </Container>
  )
}
