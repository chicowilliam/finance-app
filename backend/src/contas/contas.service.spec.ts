import { NotFoundException } from '@nestjs/common';
import { ContasService } from './contas.service';

describe('ContasService', () => {
  let service: ContasService;

  beforeEach(() => {
    service = new ContasService();
  });

  it('should create and list contas', () => {
    service.create({
      descricao: 'Aluguel',
      valor: 1800,
      vencimento: '2026-04-20',
      status: 'a_vencer',
      categoria: 'Moradia',
    });

    const contas = service.findAll();
    expect(contas).toHaveLength(1);
    expect(contas[0]).toMatchObject({
      id: 1,
      descricao: 'Aluguel',
      valor: 1800,
    });
  });

  it('should find one conta by id', () => {
    const conta = service.create({
      descricao: 'Internet',
      valor: 120,
      vencimento: '2026-04-21',
      status: 'a_vencer',
      categoria: 'Servicos',
    });

    expect(service.findOne(conta.id).descricao).toBe('Internet');
  });

  it('should update conta fields', () => {
    const conta = service.create({
      descricao: 'Energia',
      valor: 220,
      vencimento: '2026-04-22',
      status: 'a_vencer',
      categoria: 'Moradia',
    });

    const updated = service.update(conta.id, { status: 'paga', valor: 210 });
    expect(updated.status).toBe('paga');
    expect(updated.valor).toBe(210);
  });

  it('should remove conta', () => {
    const conta = service.create({
      descricao: 'Telefone',
      valor: 90,
      vencimento: '2026-04-23',
      status: 'a_vencer',
      categoria: 'Servicos',
    });

    service.remove(conta.id);
    expect(service.findAll()).toHaveLength(0);
  });

  it('should throw NotFoundException for unknown id', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
    expect(() => service.remove(999)).toThrow(NotFoundException);
  });
});
