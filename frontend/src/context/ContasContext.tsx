import { createContext, useContext } from 'react';
import type { Conta } from '../data/mockContas';

interface ContasContextType {
  contas: Conta[];
  loading: boolean;
  error: string | null;
  carregar: () => Promise<void>;
  adicionar: (conta: Omit<Conta, 'id'>) => Promise<Conta>;
  remover: (id: number) => Promise<void>;
}

export const ContasContext = createContext<ContasContextType | null>(null);

export function useContasContext() {
  const ctx = useContext(ContasContext);
  if (!ctx) throw new Error('useContasContext must be used inside ContasProvider');
  return ctx;
}
