import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { ContasService } from '../contas/contas.service';
import { CreateContaDto } from '../contas/dto/create-conta.dto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly contasService: ContasService,
    private readonly emailService: EmailService,
  ) {}

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private buildAppUrl(path: string): string {
    const base = (process.env.APP_BASE_URL || 'http://localhost:5173').replace(
      /\/+$/,
      '',
    );
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private async createAndSendEmailVerification(email: string, userId: number) {
    const rawToken = this.generateToken();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

    await this.usersService.setEmailVerificationToken(userId, tokenHash, expiresAt);

    const verifyLink = this.buildAppUrl(`/auth/verify-email?token=${rawToken}`);
    await this.emailService.sendEmail(
      email,
      'Confirme seu e-mail',
      `<p>Para confirmar sua conta, clique no link abaixo:</p><p><a href="${verifyLink}">${verifyLink}</a></p><p>Este link expira em 1 hora.</p>`,
    );
  }

  async register(nome: string, email: string, senha: string) {
    const totalUsers = await this.usersService.countUsers();
    const role = totalUsers === 0 ? 'admin' : 'user';
    const user = await this.usersService.create(nome, email, senha, role);

    await this.createAndSendEmailVerification(user.email, user.id);

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async login(email: string, senha: string) {
    const user = await this.usersService.findByEmail(email);
    // Use a same generic message to prevent user enumeration (OWASP A07)
    const invalidCredentials = new UnauthorizedException(
      'E-mail ou senha inválidos',
    );

    if (!user) {
      throw invalidCredentials;
    }

    const valid = await bcrypt.compare(senha, user.passwordHash);
    if (!valid) {
      throw invalidCredentials;
    }

    if (!user.isActive) {
      throw new ForbiddenException('Conta desativada. Fale com o administrador.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  upgradeFromGuest(userId: number, contas: CreateContaDto[]) {
    return this.contasService.createMany(contas, userId);
  }

  async requestEmailVerification(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      return {
        message:
          'Se o e-mail estiver cadastrado, enviaremos um link de confirmacao.',
      };
    }

    await this.createAndSendEmailVerification(user.email, user.id);

    return {
      message:
        'Se o e-mail estiver cadastrado, enviaremos um link de confirmacao.',
    };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    const verified = await this.usersService.verifyEmailByTokenHash(tokenHash);

    if (!verified) {
      throw new UnauthorizedException('Token invalido ou expirado.');
    }

    return { message: 'E-mail confirmado com sucesso.' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      return {
        message:
          'Se o e-mail estiver cadastrado, enviaremos instrucoes de recuperacao.',
      };
    }

    const rawToken = this.generateToken();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await this.usersService.setPasswordResetTokenByEmail(email, tokenHash, expiresAt);

    const resetLink = this.buildAppUrl(`/auth/reset-password?token=${rawToken}`);
    await this.emailService.sendEmail(
      email,
      'Recuperacao de senha',
      `<p>Recebemos uma solicitacao para redefinir sua senha.</p><p><a href="${resetLink}">${resetLink}</a></p><p>Este link expira em 30 minutos.</p>`,
    );

    return {
      message:
        'Se o e-mail estiver cadastrado, enviaremos instrucoes de recuperacao.',
    };
  }

  async resetPassword(token: string, novaSenha: string) {
    const tokenHash = this.hashToken(token);
    const user = await this.usersService.findByPasswordResetTokenHash(tokenHash);

    if (!user) {
      throw new UnauthorizedException('Token invalido ou expirado.');
    }

    await this.usersService.updatePasswordAndClearResetToken(user.id, novaSenha);

    return { message: 'Senha atualizada com sucesso.' };
  }

  async deleteOwnAccount(userId: number, confirmText: string) {
    if (confirmText.trim() !== 'Apagar minha conta') {
      throw new BadRequestException(
        'Texto de confirmacao invalido. Digite exatamente: Apagar minha conta',
      );
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.role === 'admin' && user.isActive) {
      const activeAdmins = await this.usersService.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new BadRequestException(
          'Não é permitido apagar o último admin ativo.',
        );
      }
    }

    try {
      await this.usersService.deleteUser(userId);
      return { message: 'Conta apagada com sucesso.' };
    } catch {
      throw new BadRequestException(
        'Não foi possível apagar esta conta por causa de vínculos de auditoria.',
      );
    }
  }
}
