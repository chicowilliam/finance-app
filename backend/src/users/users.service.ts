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

  async setEmailVerificationToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: expiresAt,
      },
    });
  }

  async verifyEmailByTokenHash(tokenHash: string): Promise<boolean> {
    const now = new Date();
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: { gt: now },
      },
      select: { id: true },
    });

    if (!user) return false;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: now,
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
    });

    return true;
  }

  async setPasswordResetTokenByEmail(
    email: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<boolean> {
    const result = await this.prisma.user.updateMany({
      where: { email },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetTokenExpiresAt: expiresAt,
      },
    });

    return result.count > 0;
  }

  async findByPasswordResetTokenHash(tokenHash: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetTokenExpiresAt: { gt: new Date() },
      },
    });
  }

  async updatePasswordAndClearResetToken(
    userId: number,
    newPassword: string,
  ): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetTokenExpiresAt: null,
      },
    });
  }

  async updateProfile(userId: number, data: { nome?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.nome ? { nome: data.nome } : {}),
        ...(data.email ? { email: data.email } : {}),
      },
      select: { id: true, nome: true, email: true, role: true, isActive: true },
    });
  }

  async updatePasswordById(userId: number, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
