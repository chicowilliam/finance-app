import { useState, useEffect, useCallback } from 'react';
import { contasService } from '../services/billService';
import { useAuth } from './useAuth';
import type { Conta } from '../data/mockContas';

const GUEST_CONTAS_KEY = 'finance.guest.contas';

function loadGuestContas(): Conta[] {
  try {
    const raw = localStorage.getItem(GUEST_CONTAS_KEY);
    return raw ? (JSON.parse(raw) as Conta[]) : [];
  } catch {
    return [];
  }
}

function saveGuestContas(contas: Conta[]): void {
  localStorage.setItem(GUEST_CONTAS_KEY, JSON.stringify(contas));
}

let guestNextId = -(Date.now());

export function useContas() {
  const { mode } = useAuth();
  const isGuest = mode === 'guest';

  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (isGuest) {
      setContas(loadGuestContas());
      setLoading(false);
      return;
    }
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
  }, [isGuest]);

  useEffect(() => { void carregar(); }, [carregar]);

  async function adicionar(conta: Omit<Conta, 'id'>) {
    if (isGuest) {
      const nova: Conta = { ...conta, id: guestNextId-- };
      const updated = [...contas, nova];
      setContas(updated);
      saveGuestContas(updated);
      return nova;
    }
    const nova = await contasService.criar(conta);
    setContas(prev => [...prev, nova]);
    return nova;
  }

  async function remover(id: number) {
    if (isGuest) {
      const updated = contas.filter(c => c.id !== id);
      setContas(updated);
      saveGuestContas(updated);
      return;
    }
    await contasService.remover(id);
    setContas(prev => prev.filter(c => c.id !== id));
  }

  return { contas, loading, error, carregar, adicionar, remover };
}