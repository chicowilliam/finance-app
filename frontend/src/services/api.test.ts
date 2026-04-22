import { describe, it, expect, vi, afterEach } from 'vitest';
import { get, post } from './api';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api service', () => {
  it('should perform GET request and return parsed json', async () => {
    const mockResponse = [{ id: 1, descricao: 'Aluguel' }];
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const data = await get('/contas');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/contas', {
      headers: {},
    });
    expect(data).toEqual(mockResponse);
  });

  it('should perform POST request with payload', async () => {
    const payload = {
      descricao: 'Internet',
      valor: 120,
      vencimento: '2026-04-20',
      status: 'a_vencer',
      categoria: 'Servicos',
    };

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, ...payload }),
    } as Response);

    const data = await post('/contas', payload);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/contas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    expect(data).toEqual({ id: 1, ...payload });
  });
});
