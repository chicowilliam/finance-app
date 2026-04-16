import { Injectable, NotFoundException } from '@nestjs/common';
import { Conta } from './entities/conta.entity';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

@Injectable()
export class ContasService {
  private contas: Conta[] = [];
  private nextId = 1;

  findAll(): Conta[] {
    return this.contas;
  }

  findOne(id: number): Conta {
    const conta = this.contas.find((c) => c.id === id);
    if (!conta) {
      throw new NotFoundException(`Conta #${id} não encontrada`);
    }
    return conta;
  }

  create(dto: CreateContaDto): Conta {
    const conta: Conta = {
      id: this.nextId++,
      ...dto,
    };
    this.contas.push(conta);
    return conta;
  }

  update(id: number, dto: UpdateContaDto): Conta {
    const conta = this.findOne(id);
    Object.assign(conta, dto);
    return conta;
  }

  remove(id: number): void {
    const index = this.contas.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Conta #${id} não encontrada`);
    }
    this.contas.splice(index, 1);
  }
}
