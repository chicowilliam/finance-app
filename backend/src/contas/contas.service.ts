import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Conta } from '@prisma/client';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

@Injectable()
export class ContasService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number): Promise<Conta[]> {
    return this.prisma.conta.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Conta> {
    const conta = await this.prisma.conta.findFirst({ where: { id, userId } });
    if (!conta) {
      throw new NotFoundException(`Conta #${id} não encontrada`);
    }
    return conta;
  }

  async create(dto: CreateContaDto, userId: number): Promise<Conta> {
    return this.prisma.conta.create({ data: { ...dto, userId } });
  }

  async createMany(dtos: CreateContaDto[], userId: number): Promise<Conta[]> {
    return Promise.all(dtos.map((dto) => this.create(dto, userId)));
  }

  async update(
    id: number,
    dto: UpdateContaDto,
    userId: number,
  ): Promise<Conta> {
    await this.findOne(id, userId);
    return this.prisma.conta.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    await this.prisma.conta.delete({ where: { id } });
  }
}
