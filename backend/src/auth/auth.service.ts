import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ContasService } from '../contas/contas.service';
import { CreateContaDto } from '../contas/dto/create-conta.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly contasService: ContasService,
  ) {}

  async register(nome: string, email: string, senha: string) {
    const totalUsers = await this.usersService.countUsers();
    const role = totalUsers === 0 ? 'admin' : 'user';
    const user = await this.usersService.create(nome, email, senha, role);
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
}
