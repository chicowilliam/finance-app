import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Stack, Text, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import AppPanel from '../components/AppPanel'
import AppButton from '../components/AppButton'
import { AppInput } from '../components/AppInput'
import { apiForgotPassword } from '../services/authService'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})
type Fields = z.infer<typeof schema>

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [enviado, setEnviado] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Fields>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: Fields) {
    try {
      await apiForgotPassword(data.email)
      setEnviado(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar e-mail')
    }
  }

  return (
    <Container size={480} py={64}>
      <AppPanel>
        <Stack gap="md">
          <div>
            <Text c="brand" fw={700} size="xs" tt="uppercase">Finance App</Text>
            <Title order={2} size="h3">Recuperar senha</Title>
          </div>

          {enviado ? (
            <Stack gap="sm" ta="center">
              <Text>Enviamos um link de recuperação para o seu e-mail.</Text>
              <Text c="dimmed" size="sm">
                Verifique sua caixa de entrada (e o spam). O link expira em 1 hora.
              </Text>
              <AppButton appearance="outline" tone="neutral" onClick={() => navigate('/')}>
                Voltar para o login
              </AppButton>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="sm">
                <Text c="dimmed" size="sm">
                  Informe o e-mail da sua conta e enviaremos um link para redefinir a senha.
                </Text>

                <AppInput
                  label="E-mail"
                  type="email"
                  placeholder="voce@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <AppButton type="submit" loading={isSubmitting}>
                  Enviar link de recuperação
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
