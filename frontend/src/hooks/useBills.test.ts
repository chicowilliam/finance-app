import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useContas } from './useBills';
import { contasService } from '../services/billService';

vi.mock('./useAuth', () => ({
  useAuth: () => ({ mode: 'user' }),
}));

vi.mock('../services/billService', () => ({
  contasService: {
    listar: vi.fn(),
    criar: vi.fn(),
    remover: vi.fn(),
  },
}));

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useContas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load contas on mount', async () => {
    vi.mocked(contasService.listar).mockResolvedValue([
      {
        id: 1,
        descricao: 'Aluguel',
        valor: 1800,
        vencimento: '2026-04-20',
        status: 'a_vencer',
        categoria: 'Moradia',
      },
    ]);

    const { result } = renderHook(() => useContas(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.contas).toHaveLength(1);
    expect(contasService.listar).toHaveBeenCalledTimes(1);
  });

  it('should add conta and append it to state', async () => {
    const novaConta = {
      id: 2,
      descricao: 'Internet',
      valor: 120,
      vencimento: '2026-04-20',
      status: 'a_vencer' as const,
      categoria: 'Servicos',
    };
    // primeiro listar retorna vazio; após invalidação retorna a conta criada
    vi.mocked(contasService.listar)
      .mockResolvedValueOnce([])
      .mockResolvedValue([novaConta]);
    vi.mocked(contasService.criar).mockResolvedValue(novaConta);

    const { result } = renderHook(() => useContas(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.adicionar({
        descricao: 'Internet',
        valor: 120,
        vencimento: '2026-04-20',
        status: 'a_vencer',
        categoria: 'Servicos',
      });
    });

    await waitFor(() => expect(result.current.contas).toHaveLength(1));
    expect(result.current.contas[0].descricao).toBe('Internet');
  });
});
