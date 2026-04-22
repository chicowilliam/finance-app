import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useContas } from './useBills';
import { contasService } from '../services/billService';

vi.mock('../services/billService', () => ({
  contasService: {
    listar: vi.fn(),
    criar: vi.fn(),
    remover: vi.fn(),
  },
}));

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

    const { result } = renderHook(() => useContas());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.contas).toHaveLength(1);
    expect(contasService.listar).toHaveBeenCalledTimes(1);
  });

  it('should add conta and append it to state', async () => {
    vi.mocked(contasService.listar).mockResolvedValue([]);
    vi.mocked(contasService.criar).mockResolvedValue({
      id: 2,
      descricao: 'Internet',
      valor: 120,
      vencimento: '2026-04-20',
      status: 'a_vencer',
      categoria: 'Servicos',
    });

    const { result } = renderHook(() => useContas());
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

    expect(result.current.contas).toHaveLength(1);
    expect(result.current.contas[0].descricao).toBe('Internet');
  });
});
