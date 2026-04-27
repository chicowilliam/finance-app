import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contasService } from '../services/billService';
import { contasKeys } from '../services/queryKeys';
import { useAuth } from './useAuth';
import type { Conta } from '../types/Bill';

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
  const queryClient = useQueryClient();

  const [guestContas, setGuestContas] = useState<Conta[]>(loadGuestContas);

  const query = useQuery({
    queryKey: contasKeys.list('auth'),
    queryFn: () => contasService.listar(),
    enabled: !isGuest,
  });

  const adicionarMutation = useMutation({
    mutationFn: (conta: Omit<Conta, 'id'>) => contasService.criar(conta),
    onMutate: async (conta) => {
      await queryClient.cancelQueries({ queryKey: contasKeys.all });
      const previous = queryClient.getQueryData<Conta[]>(contasKeys.list('auth')) ?? [];
      const optimistic: Conta = { ...conta, id: -Date.now() };
      queryClient.setQueryData<Conta[]>(contasKeys.list('auth'), [...previous, optimistic]);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(contasKeys.list('auth'), ctx.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: contasKeys.all }),
  });

  const removerMutation = useMutation({
    mutationFn: (id: number) => contasService.remover(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: contasKeys.all });
      const previous = queryClient.getQueryData<Conta[]>(contasKeys.list('auth')) ?? [];
      queryClient.setQueryData<Conta[]>(
        contasKeys.list('auth'),
        previous.filter((conta) => conta.id !== id),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(contasKeys.list('auth'), ctx.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: contasKeys.all }),
  });

  async function adicionar(conta: Omit<Conta, 'id'>): Promise<Conta> {
    if (isGuest) {
      const nova: Conta = { ...conta, id: guestNextId-- };
      const updated = [...guestContas, nova];
      setGuestContas(updated);
      saveGuestContas(updated);
      return nova;
    }
    return adicionarMutation.mutateAsync(conta);
  }

  async function remover(id: number): Promise<void> {
    if (isGuest) {
      const updated = guestContas.filter(c => c.id !== id);
      setGuestContas(updated);
      saveGuestContas(updated);
      return;
    }
    await removerMutation.mutateAsync(id);
  }

  return {
    contas: isGuest ? guestContas : (query.data ?? []),
    loading: isGuest ? false : query.isLoading,
    error: isGuest ? null : (query.error instanceof Error ? query.error.message : null),
    carregar: () => queryClient.invalidateQueries({ queryKey: contasKeys.all }),
    adicionar,
    remover,
  };
}