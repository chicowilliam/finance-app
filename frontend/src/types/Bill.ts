export type StatusConta = 'paga' | 'a_vencer' | 'atrasada'

export interface Conta {
  id: number
  descricao: string
  valor: number
  vencimento: string
  status: StatusConta
  categoria: string
}
