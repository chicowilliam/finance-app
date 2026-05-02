import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Container,
  Group,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import AppButton from '../components/AppButton'
import { AppInput, AppPasswordInput } from '../components/AppInput'
import AppPanel from '../components/AppPanel'

type Tab = 'login' | 'register'

const tabDirection: Record<string, number> = { login: -1, register: 1 }

const formVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.2 } }),
}

// ── Schemas Zod ──────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
})

const registerSchema = z.object({
  nome: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  path: ['confirmarSenha'],
  message: 'As senhas não coincidem',
})

type LoginFields = z.infer<typeof loginSchema>
type RegisterFields = z.infer<typeof registerSchema>

export default function Welcome() {
  const [tab, setTab] = useState<Tab>('login')
  const prevTabRef = useRef<Tab>('login')

  const navigate = useNavigate()
  const { isAuthenticated, enterGuest, login, register } = useAuth()

  const loginForm = useForm<LoginFields>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterFields>({ resolver: zodResolver(registerSchema) })

  if (isAuthenticated) return <Navigate to="/app" replace />

  function handleTabChange(value: Tab) {
    prevTabRef.current = tab
    setTab(value)
  }

  async function handleLogin(data: LoginFields) {
    try {
      await login(data.email, data.senha)
      toast.success('Login realizado com sucesso')
      navigate('/app')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao entrar')
    }
  }

  async function handleRegister(data: RegisterFields) {
    try {
      await register(data.nome, data.email, data.senha)
      toast.success('Conta criada com sucesso')
      navigate('/app')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao criar conta')
    }
  }

  function handleGuest() {
    enterGuest()
    toast.success('Modo convidado ativado')
    navigate('/app')
  }

  return (
    <Container size={520} py={36}>
      <AppPanel>
        <Stack gap="md">
          <div>
            <Text c="brand" fw={700} size="xs" tt="uppercase">Finance App</Text>
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
                {tab === 'login' ? (
                  <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                    <Stack gap="sm">
                      <Title order={2} size="h4">Entrar na sua conta</Title>

                      <AppInput
                        label="Email"
                        type="email"
                        placeholder="voce@email.com"
                        error={loginForm.formState.errors.email?.message}
                        {...loginForm.register('email')}
                      />

                      <AppPasswordInput
                        label="Senha"
                        placeholder="Sua senha"
                        error={loginForm.formState.errors.senha?.message}
                        {...loginForm.register('senha')}
                      />

                      <AppButton type="submit" loading={loginForm.formState.isSubmitting}>
                        Entrar
                      </AppButton>
                    </Stack>
                  </form>
                ) : (
                  <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                    <Stack gap="sm">
                      <Title order={2} size="h4">Criar nova conta</Title>

                      <AppInput
                        label="Nome"
                        placeholder="Seu nome"
                        error={registerForm.formState.errors.nome?.message}
                        {...registerForm.register('nome')}
                      />

                      <AppInput
                        label="Email"
                        type="email"
                        placeholder="voce@email.com"
                        error={registerForm.formState.errors.email?.message}
                        {...registerForm.register('email')}
                      />

                      <AppPasswordInput
                        label="Senha"
                        placeholder="Mínimo 6 caracteres"
                        error={registerForm.formState.errors.senha?.message}
                        {...registerForm.register('senha')}
                      />

                      <AppPasswordInput
                        label="Confirmar senha"
                        placeholder="Repita a senha"
                        error={registerForm.formState.errors.confirmarSenha?.message}
                        {...registerForm.register('confirmarSenha')}
                      />

                      <AppButton type="submit" loading={registerForm.formState.isSubmitting}>
                        Criar conta
                      </AppButton>
                    </Stack>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <Group justify="space-between" align="center">
            <AppButton appearance="outline" tone="neutral" onClick={handleGuest}>Continuar como convidado</AppButton>
            <Text size="xs" c="dimmed">Os dados de convidado ficam neste navegador.</Text>
          </Group>
        </Stack>
      </AppPanel>
    </Container>
  )
}



