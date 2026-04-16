import { useState } from 'react'
import type { FormEvent } from 'react'
import Input from './Input'
import Button from './Button'
import type { Conta } from '../data/mockContas'

interface NovaContaFormProps {
  onSubmit: (conta: Omit<Conta, 'id'>) => void
  onCancel: () => void
}

const categorias = [
  'Moradia', 'Serviços', 'Cartão', 'Saúde',
  'Entretenimento', 'Transporte', 'Educação', 'Outros',
]

export default function NovaContaForm({ onSubmit, onCancel }: NovaContaFormProps) {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [categoria, setCategoria] = useState(categorias[0])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const hoje = new Date().toISOString().split('T')[0]
    const status = vencimento < hoje ? 'atrasada' : 'a_vencer'

    onSubmit({
      descricao,
      valor: parseFloat(valor),
      vencimento,
      status,
      categoria,
    })
  }

  const formValid = descricao.trim() && valor && parseFloat(valor) > 0 && vencimento

  return (
    <form onSubmit={handleSubmit} className="nova-conta-form">
      <Input
        label="Descrição"
        id="descricao"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
        placeholder="Ex: Aluguel, Internet..."
        required
      />

      <Input
        label="Valor (R$)"
        id="valor"
        type="number"
        min="0.01"
        step="0.01"
        value={valor}
        onChange={e => setValor(e.target.value)}
        placeholder="0,00"
        required
      />

      <Input
        label="Vencimento"
        id="vencimento"
        type="date"
        value={vencimento}
        onChange={e => setVencimento(e.target.value)}
        required
      />

      <div className="form-field">
        <label htmlFor="categoria" className="form-label">Categoria</label>
        <select
          id="categoria"
          className="form-input"
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
        >
          {categorias.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!formValid}>
          Adicionar
        </Button>
      </div>
    </form>
  )
}
