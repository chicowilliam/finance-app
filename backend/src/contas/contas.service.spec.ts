import { NotFoundException } from '@nestjs/common';
import { ContasService } from './contas.service';
import type { PrismaService } from '../prisma/prisma.service';

type ContaStatus = 'paga' | 'a_vencer' | 'atrasada';

interface TestConta {
  id: number;
  userId: number;
  descricao: string;
  valor: number;
  vencimento: string;
  status: ContaStatus;
  categoria: string;
}

type CreateContaData = Omit<TestConta, 'id'>;

describe('ContasService', () => {
  let service: ContasService;

  const db: Record<number, TestConta> = {};
  let nextId = 1;

  const mockPrisma = {
    conta: {
      findMany: jest.fn(({ where }: { where: { userId: number } }) =>
        Promise.resolve(
          Object.values(db).filter((c) => c.userId === where.userId),
        ),
      ),
      findFirst: jest.fn(
        ({ where }: { where: { id: number; userId: number } }) =>
          Promise.resolve(
            Object.values(db).find(
              (c) => c.id === where.id && c.userId === where.userId,
            ) ?? null,
          ),
      ),
      create: jest.fn(({ data }: { data: CreateContaData }) => {
        const conta: TestConta = { id: nextId++, ...data };
        db[conta.id] = conta;
        return Promise.resolve(conta);
      }),
      update: jest.fn(
        ({
          where,
          data,
        }: {
          where: { id: number };
          data: Partial<CreateContaData>;
        }) => {
          db[where.id] = { ...db[where.id], ...data };
          return Promise.resolve(db[where.id]);
        },
      ),
      delete: jest.fn(({ where }: { where: { id: number } }) => {
        delete db[where.id];
        return Promise.resolve(undefined);
      }),
    },
  } as unknown as PrismaService;

  beforeEach(() => {
    Object.keys(db).forEach((k) => delete db[k]);
    nextId = 1;
    jest.clearAllMocks();
    service = new ContasService(mockPrisma);
  });

  it('should create and list contas', async () => {
    await service.create(
      {
        descricao: 'Aluguel',
        valor: 1800,
        vencimento: '2026-04-20',
        status: 'a_vencer',
        categoria: 'Moradia',
      },
      1,
    );
    const contas = await service.findAll(1);
    expect(contas).toHaveLength(1);
    expect(contas[0]).toMatchObject({
      id: 1,
      descricao: 'Aluguel',
      valor: 1800,
    });
  });

  it('should find one conta by id', async () => {
    const conta = await service.create(
      {
        descricao: 'Internet',
        valor: 120,
        vencimento: '2026-04-21',
        status: 'a_vencer',
        categoria: 'Servicos',
      },
      1,
    );
    const found = await service.findOne(conta.id, 1);
    expect(found.descricao).toBe('Internet');
  });

  it('should update conta fields', async () => {
    const conta = await service.create(
      {
        descricao: 'Energia',
        valor: 220,
        vencimento: '2026-04-22',
        status: 'a_vencer',
        categoria: 'Moradia',
      },
      1,
    );
    const updated = await service.update(
      conta.id,
      { status: 'paga', valor: 210 },
      1,
    );
    expect(updated.status).toBe('paga');
    expect(updated.valor).toBe(210);
  });

  it('should remove conta', async () => {
    const conta = await service.create(
      {
        descricao: 'Telefone',
        valor: 90,
        vencimento: '2026-04-23',
        status: 'a_vencer',
        categoria: 'Servicos',
      },
      1,
    );
    await service.remove(conta.id, 1);
    expect(await service.findAll(1)).toHaveLength(0);
  });

  it('should throw NotFoundException for unknown id', async () => {
    await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
  });
});
