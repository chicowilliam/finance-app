import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Stack, Text, Title } from '@mantine/core'
import { toast } from 'sonner'
import AppPanel from '../components/AppPanel'
import AppButton from '../components/AppButton'
import { apiVerifyEmail } from '../services/authService'

type Estado = 'verificando' | 'sucesso' | 'erro'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [estado, setEstado] = useState<Estado>('verificando')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setEstado('erro')
      setMensagem('Link de verificação inválido ou expirado.')
      return
    }

    apiVerifyEmail(token)
      .then(() => {
        setEstado('sucesso')
        toast.success('E-mail verificado com sucesso!')
      })
      .catch((err: unknown) => {
        setEstado('erro')
        setMensagem(
          err instanceof Error ? err.message : 'Não foi possível verificar o e-mail.',
        )
      })
  }, [searchParams])

  return (
    <Container size={480} py={64}>
      <AppPanel>
        <Stack gap="md" align="center" ta="center">
          <Text c="brand" fw={700} size="xs" tt="uppercase">Finance App</Text>

          {estado === 'verificando' && (
            <>
              <Title order={2} size="h3">Verificando e-mail…</Title>
              <Text c="dimmed">Aguarde um instante.</Text>
            </>
          )}

          {estado === 'sucesso' && (
            <>
              <Title order={2} size="h3">E-mail verificado!</Title>
              <Text c="dimmed">Sua conta está confirmada. Agora você pode entrar normalmente.</Text>
              <AppButton onClick={() => navigate('/')}>Ir para o login</AppButton>
            </>
          )}

          {estado === 'erro' && (
            <>
              <Title order={2} size="h3">Verificação falhou</Title>
              <Text c="dimmed">{mensagem || 'O link pode ter expirado ou já foi usado.'}</Text>
              <AppButton appearance="outline" tone="neutral" onClick={() => navigate('/')}>
                Voltar para o início
              </AppButton>
            </>
          )}
        </Stack>
      </AppPanel>
    </Container>
  )
}
