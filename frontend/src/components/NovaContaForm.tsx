import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

// ── Schema Zod ───────────────────────────────────────────────
const novaContaSchema = z.object({
  descricao: z.string().min(2, 'Descrição obrigatória'),
  valor: z
    .number({ error: 'Informe um valor' })
    .positive('Deve ser maior que zero'),
  vencimento: z.string().min(1, 'Informe a data de vencimento'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
})

type NovaContaFields = z.infer<typeof novaContaSchema>

export default function NovaContaForm({ onSubmit, onCancel }: NovaContaFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NovaContaFields>({
    resolver: zodResolver(novaContaSchema),
    defaultValues: { categoria: categorias[0] },
  })

  async function handleFormSubmit(data: NovaContaFields) {
    const hoje = new Date().toISOString().split('T')[0]
    const status = data.vencimento < hoje ? 'atrasada' : 'a_vencer'
    await onSubmit({ ...data, status })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="sm">
        <TextInput
          label="Descrição"
          placeholder="Ex: Aluguel, Internet..."
          error={errors.descricao?.message}
          {...register('descricao')}
        />

        <Controller
          name="valor"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Valor (R$)"
              min={0.01}
              step={0.01}
              decimalScale={2}
              placeholder="0,00"
              error={errors.valor?.message}
              value={field.value ?? ''}
              onChange={(v) => field.onChange(typeof v === 'number' ? v : undefined)}
            />
          )}
        />

        <TextInput
          label="Vencimento"
          type="date"
          error={errors.vencimento?.message}
          {...register('vencimento')}
        />

        <Controller
          name="categoria"
          control={control}
          render={({ field }) => (
            <Select
              label="Categoria"
              data={categorias}
              error={errors.categoria?.message}
              value={field.value}
              onChange={(v) => field.onChange(v ?? categorias[0])}
            />
          )}
        />

        <Group justify="flex-end" mt="xs">
          <Button type="button" variant="default" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Adicionar
          </Button>
        </Group>
      </Stack>
    </form>
  )
}



