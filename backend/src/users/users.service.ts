import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '../prisma/prisma-client';

type UserRole = 'user' | 'admin';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    nome: string,
    email: string,
    password: string,
    role: UserRole = 'user',
  ): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { nome, email, passwordHash, role, isActive: true },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  listUsers() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  setUserActive(id: number, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, nome: true, email: true, role: true, isActive: true },
    });
  }

  countActiveAdmins(): Promise<number> {
    return this.prisma.user.count({
      where: { role: 'admin', isActive: true },
    });
  }

  deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
      select: { id: true, nome: true, email: true, role: true, isActive: true },
    });
  }

  countUsers(): Promise<number> {
    return this.prisma.user.count();
  }
}
