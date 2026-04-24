import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core'
import type { Conta } from '../data/mockContas'

interface NovaContaFormProps {
  onSubmit: (conta: Omit<Conta, 'id'>) => Promise<void> | void
  onCancel: () => void
}

const categorias = [
  'Moradia', 'Serviços', 'Cartão', 'Saúde',
  'Entretenimento', 'Transporte', 'Educação', 'Outros',
]

export default function NovaContaForm({ onSubmit, onCancel }: NovaContaFormProps) {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState<string | number>('')
  const [vencimento, setVencimento] = useState('')
  const [categoria, setCategoria] = useState(categorias[0])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const hoje = new Date().toISOString().split('T')[0]
    const status = vencimento < hoje ? 'atrasada' : 'a_vencer'

    void onSubmit({
      descricao,
      valor: Number(valor),
      vencimento,
      status,
      categoria,
    })
  }

  const formValid = descricao.trim() && Number(valor) > 0 && vencimento

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
      <TextInput
        label="Descrição"
        value={descricao}
        onChange={e => setDescricao(e.currentTarget.value)}
        placeholder="Ex: Aluguel, Internet..."
        required
      />

      <NumberInput
        label="Valor (R$)"
        value={valor}
        onChange={(value) => setValor(value)}
        min={0.01}
        step={0.01}
        placeholder="0,00"
        required
      />

      <TextInput
        label="Vencimento"
        type="date"
        value={vencimento}
        onChange={e => setVencimento(e.currentTarget.value)}
        required
      />

      <Select
        label="Categoria"
        data={categorias}
        value={categoria}
        onChange={(value) => setCategoria(value ?? categorias[0])}
      />

      <Group justify="flex-end" mt="xs">
        <Button type="button" variant="default" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!formValid}>
          Adicionar
        </Button>
      </Group>
      </Stack>
    </form>
  )
}
