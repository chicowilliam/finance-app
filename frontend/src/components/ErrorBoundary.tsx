import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button, Center, Stack, Text, Title } from '@mantine/core'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Center style={{ minHeight: '100dvh' }}>
          <Stack align="center" gap="sm" maw={480} px="lg" style={{ textAlign: 'center' }}>
            <Title order={2} size="h3">Algo deu errado</Title>
            <Text c="dimmed" size="sm">{this.state.message}</Text>
            <Button
              variant="light"
              color="teal"
              onClick={() => window.location.reload()}
            >
              Recarregar página
            </Button>
          </Stack>
        </Center>
      )
    }

    return this.props.children
  }
}
