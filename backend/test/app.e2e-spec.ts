import { Test, TestingModule } from '@nestjs/testing';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { ContasService } from '../src/contas/contas.service';
import { CreateContaDto } from '../src/contas/dto/create-conta.dto';

describe('Contas (e2e)', () => {
  let app: INestApplication<App>;

  const mockAuthGuard: CanActivate = {
    canActivate(context: ExecutionContext): boolean {
      const req = context
        .switchToHttp()
        .getRequest<{ user?: { userId: number; email: string } }>();
      req.user = { userId: 1, email: 'e2e@test.com' };
      return true;
    },
  };

  type ContaStatus = 'paga' | 'a_vencer' | 'atrasada';

  interface E2EConta {
    id: number;
    descricao: string;
    valor: number;
    vencimento: string;
    status: ContaStatus;
    categoria: string;
    userId: number;
  }

  const db: E2EConta[] = [];
  let nextId = 1;

  const contasServiceMock: Pick<ContasService, 'findAll' | 'create'> = {
    findAll: jest.fn(
      (userId: number): Promise<E2EConta[]> =>
        Promise.resolve(db.filter((c) => c.userId === userId)),
    ),
    create: jest.fn(
      (dto: CreateContaDto, userId: number): Promise<E2EConta> => {
        const conta: E2EConta = { id: nextId++, userId, ...dto };
        db.push(conta);
        return Promise.resolve(conta);
      },
    ),
  };

  beforeAll(async () => {
    jest.setTimeout(30000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(ContasService)
      .useValue(contasServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    db.splice(0, db.length);
    nextId = 1;
    jest.clearAllMocks();
  });

  it('GET /api/contas should start empty', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/contas')
      .expect(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/contas should create conta with valid payload', async () => {
    const payload = {
      descricao: 'Aluguel',
      valor: 1800,
      vencimento: '2026-04-20',
      status: 'a_vencer',
      categoria: 'Moradia',
    };

    const res = await request(app.getHttpServer())
      .post('/api/contas')
      .send(payload)
      .expect(201);

    expect(res.body).toMatchObject(payload);

    const listRes = await request(app.getHttpServer())
      .get('/api/contas')
      .expect(200);
    expect(listRes.body).toHaveLength(1);
  });

  it('POST /api/contas should reject invalid payload', async () => {
    const invalidPayload = {
      descricao: '',
      valor: 0,
      vencimento: '20-04-2026',
      status: 'invalido',
      categoria: '',
    };

    await request(app.getHttpServer())
      .post('/api/contas')
      .send(invalidPayload)
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
