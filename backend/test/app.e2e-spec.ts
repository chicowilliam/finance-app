import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Contas (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  it('GET /api/contas should start empty', async () => {
    const res = await request(app.getHttpServer()).get('/api/contas').expect(200);
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
    expect(res.body.id).toBeDefined();
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

  afterEach(async () => {
    await app.close();
  });
});
