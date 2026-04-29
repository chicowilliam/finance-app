import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Stack, Text, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import AppPanel from '../components/AppPanel'
import AppButton from '../components/AppButton'
import { AppPasswordInput } from '../components/AppInput'
import { apiResetPassword } from '../services/authService'

const schema = z.object({
  novaSenha: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmarSenha: z.string(),
}).refine((d) => d.novaSenha === d.confirmarSenha, {
  path: ['confirmarSenha'],
  message: 'As senhas não coincidem',
})
type Fields = z.infer<typeof schema>

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [concluido, setConcluido] = useState(false)
  const token = searchParams.get('token') ?? ''

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Fields>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: Fields) {
    if (!token) {
      toast.error('Link inválido ou expirado.')
      return
    }
    try {
      await apiResetPassword(token, data.novaSenha)
      setConcluido(true)
      toast.success('Senha redefinida com sucesso!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao redefinir senha')
    }
  }

  if (!token) {
    return (
      <Container size={480} py={64}>
        <AppPanel>
          <Stack gap="md" ta="center">
            <Text c="brand" fw={700} size="xs" tt="uppercase">Finance App</Text>
            <Title order={2} size="h3">Link inválido</Title>
            <Text c="dimmed">Este link de redefinição é inválido ou já expirou.</Text>
            <AppButton appearance="outline" tone="neutral" onClick={() => navigate('/')}>
              Voltar para o login
            </AppButton>
          </Stack>
        </AppPanel>
      </Container>
    )
  }

  return (
    <Container size={480} py={64}>
      <AppPanel>
        <Stack gap="md">
          <div>
            <Text c="brand" fw={700} size="xs" tt="uppercase">Finance App</Text>
            <Title order={2} size="h3">Redefinir senha</Title>
          </div>

          {concluido ? (
            <Stack gap="sm" ta="center">
              <Text>Senha redefinida com sucesso!</Text>
              <Text c="dimmed" size="sm">Agora você pode entrar com a nova senha.</Text>
              <AppButton onClick={() => navigate('/')}>Ir para o login</AppButton>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="sm">
                <AppPasswordInput
                  label="Nova senha"
                  placeholder="Mínimo 6 caracteres"
                  error={errors.novaSenha?.message}
                  {...register('novaSenha')}
                />

                <AppPasswordInput
                  label="Confirmar nova senha"
                  placeholder="Repita a nova senha"
                  error={errors.confirmarSenha?.message}
                  {...register('confirmarSenha')}
                />

                <AppButton type="submit" loading={isSubmitting}>
                  Redefinir senha
                </AppButton>

                <Text size="xs" ta="center">
                  <Link to="/" style={{ color: 'var(--mantine-color-brand-5)' }}>
                    Voltar para o login
                  </Link>
                </Text>
              </Stack>
            </form>
          )}
        </Stack>
      </AppPanel>
    </Container>
  )
}
