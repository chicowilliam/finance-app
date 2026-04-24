import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const user = await this.usersService.create(nome, email, senha);
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async login(email: string, senha: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const valid = await bcrypt.compare(senha, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  upgradeFromGuest(userId: number, contas: CreateContaDto[]) {
    return this.contasService.createMany(contas, userId);
  }
}
