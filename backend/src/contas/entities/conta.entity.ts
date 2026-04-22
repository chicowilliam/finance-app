export type StatusConta = 'paga' | 'a_vencer' | 'atrasada';

export class Conta {
  id: number;
  userId: number;
  descricao: string;
  valor: number;
  vencimento: string;
  status: StatusConta;
  categoria: string;
}
