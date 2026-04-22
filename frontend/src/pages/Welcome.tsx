import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type Tab = 'login' | 'register'

export default function Welcome() {
  const [tab, setTab] = useState<Tab>('login')
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
    <main className="welcome-shell">
      <section className="welcome-card">
        <p className="welcome-kicker">Finance App</p>
        <h1 className="welcome-title">Controle financeiro sem friccao</h1>
        <p className="welcome-subtitle">
          Entre, crie sua conta ou continue como convidado para testar tudo agora.
        </p>

        <div className="welcome-tabs" role="tablist" aria-label="Autenticacao">
          <button
            className={`welcome-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`welcome-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
            type="button"
          >
            Criar conta
          </button>
        </div>

        <form className="welcome-form" onSubmit={handleAuthSubmit}>
          <h2>{titulo}</h2>

          {tab === 'register' && (
            <div className="form-field">
              <label className="form-label" htmlFor="nome">Nome</label>
              <input
                className="form-input"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
          )}

          <div className="form-field">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="senha">Senha</label>
            <input
              className="form-input"
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
            />
          </div>

          {erro && <p className="welcome-error">{erro}</p>}

          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div className="welcome-divider" />

        <button className="btn btn-secondary" onClick={handleGuest} type="button">
          Continuar como convidado
        </button>
        <p className="welcome-note">
          No modo convidado, os dados ficam neste navegador.
        </p>
      </section>
    </main>
  )
}
