import { useState, useEffect, useCallback } from 'react';
import { contasService } from '../services/billService';
import type { Conta } from '../data/mockContas';

export function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contasService.listar();
      setContas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function adicionar(conta: Omit<Conta, 'id'>) {
    const nova = await contasService.criar(conta);
    setContas(prev => [...prev, nova]);
    return nova;
  }

  async function remover(id: number) {
    await contasService.remover(id);
    setContas(prev => prev.filter(c => c.id !== id));
  }

  return { contas, loading, error, carregar, adicionar, remover };
}