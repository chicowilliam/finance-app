import { get, postAuth, put, del } from './api';
import type { Conta } from '../data/mockContas';

export const contasService = {
  listar: () => get<Conta[]>('/contas'),
  buscar: (id: number) => get<Conta>(`/contas/${id}`),
  criar: (conta: Omit<Conta, 'id'>) => postAuth<Conta>('/contas', conta),
  atualizar: (id: number, conta: Partial<Omit<Conta, 'id'>>) => put<Conta>(`/contas/${id}`, conta),
  remover: (id: number) => del(`/contas/${id}`),
};