import { Injectable, NotFoundException } from '@nestjs/common';
import { Conta } from './entities/conta.entity';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

@Injectable()
export class ContasService {
  private contas: Conta[] = [];
  private nextId = 1;

  findAll(userId: number): Conta[] {
    return this.contas.filter((c) => c.userId === userId);
  }

  findOne(id: number, userId: number): Conta {
    const conta = this.contas.find((c) => c.id === id && c.userId === userId);
    if (!conta) {
      throw new NotFoundException(`Conta #${id} não encontrada`);
    }
    return conta;
  }

  create(dto: CreateContaDto, userId: number): Conta {
    const conta: Conta = {
      id: this.nextId++,
      userId,
      ...dto,
    };
    this.contas.push(conta);
    return conta;
  }

  createMany(dtos: CreateContaDto[], userId: number): Conta[] {
    return dtos.map((dto) => this.create(dto, userId));
  }

  update(id: number, dto: UpdateContaDto, userId: number): Conta {
    const conta = this.findOne(id, userId);
    Object.assign(conta, dto);
    return conta;
  }

  remove(id: number, userId: number): void {
    const index = this.contas.findIndex(
      (c) => c.id === id && c.userId === userId,
    );
    if (index === -1) {
      throw new NotFoundException(`Conta #${id} não encontrada`);
    }
    this.contas.splice(index, 1);
  }
}
