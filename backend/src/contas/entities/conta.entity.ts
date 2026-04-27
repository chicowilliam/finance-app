export { StatusConta } from '../../prisma/prisma-client';

export class Conta {
  id: number;
  userId: number;
  descricao: string;
  valor: number;
  vencimento: string;
  status: string;
  categoria: string;
}
