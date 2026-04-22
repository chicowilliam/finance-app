import { Test, TestingModule } from '@nestjs/testing';
import { ContasController } from './contas.controller';
import { ContasService } from './contas.service';

describe('ContasController', () => {
  let controller: ContasController;

  const contasServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasController],
      providers: [
        {
          provide: ContasService,
          useValue: contasServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ContasController>(ContasController);
    jest.clearAllMocks();
  });

  it('should list contas', () => {
    contasServiceMock.findAll.mockReturnValue([
      { id: 1, descricao: 'Aluguel' },
    ]);
    expect(controller.findAll()).toEqual([{ id: 1, descricao: 'Aluguel' }]);
    expect(contasServiceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('should create conta', () => {
    const dto = {
      descricao: 'Internet',
      valor: 120,
      vencimento: '2026-04-20',
      status: 'a_vencer' as const,
      categoria: 'Servicos',
    };
    contasServiceMock.create.mockReturnValue({ id: 1, ...dto });

    expect(controller.create(dto)).toEqual({ id: 1, ...dto });
    expect(contasServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should return success message on remove', () => {
    contasServiceMock.remove.mockImplementation(() => undefined);
    expect(controller.remove(1)).toEqual({ message: 'Conta #1 removida' });
    expect(contasServiceMock.remove).toHaveBeenCalledWith(1);
  });
});
