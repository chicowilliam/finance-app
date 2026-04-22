import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private nextId = 1;

  async create(nome: string, email: string, password: string): Promise<User> {
    const existing = this.users.find((u) => u.email === email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = { id: this.nextId++, nome, email, passwordHash };
    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }
}
