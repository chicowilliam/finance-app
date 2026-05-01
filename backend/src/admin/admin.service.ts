import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  listUsers() {
    return this.usersService.listUsers();
  }

  async setUserActive(
    actorUserId: number,
    targetUserId: number,
    isActive: boolean,
  ) {
    if (actorUserId === targetUserId) {
      throw new ForbiddenException(
        'Você não pode alterar o status da própria conta por aqui.',
      );
    }

    const target = await this.usersService.findById(targetUserId);
    if (!target) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (target.role === 'admin' && !isActive) {
      const activeAdmins = await this.usersService.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new BadRequestException(
          'Não é permitido desativar o último admin ativo.',
        );
      }
    }

    const updated = await this.usersService.setUserActive(
      targetUserId,
      isActive,
    );

    await this.prisma.adminAuditLog.create({
      data: {
        action: isActive ? 'user_reactivated' : 'user_deactivated',
        actorUserId,
        targetUserId,
        details: 'Aprovacao em 2 etapas: APROVAR',
      },
    });

    return updated;
  }

  async deleteUser(
    actorUserId: number,
    targetUserId: number,
    dto: DeleteUserDto,
  ) {
    if (actorUserId === targetUserId) {
      throw new ForbiddenException(
        'Você não pode excluir a própria conta por aqui.',
      );
    }

    const target = await this.usersService.findById(targetUserId);
    if (!target) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (target.email !== dto.confirmEmail) {
      throw new BadRequestException('E-mail de confirmação inválido.');
    }

    if (target.role === 'admin') {
      const activeAdmins = await this.usersService.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new BadRequestException(
          'Não é permitido excluir o último admin ativo.',
        );
      }
    }

    const deleted = await this.usersService.deleteUser(targetUserId);

    await this.prisma.adminAuditLog.create({
      data: {
        action: 'user_deleted',
        actorUserId,
        targetUserId,
        details: `Deleted user ${target.email} | Aprovacao em 2 etapas: ${dto.approvalText}`,
      },
    });

    return deleted;
  }

  listAuditLogs(limit = 100) {
    const safeLimit = Math.max(1, Math.min(limit, 200));

    return this.prisma.adminAuditLog.findMany({
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        actorUser: {
          select: { id: true, nome: true, email: true },
        },
        targetUser: {
          select: { id: true, nome: true, email: true },
        },
      },
    });
  }
}
