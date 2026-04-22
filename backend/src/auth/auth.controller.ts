import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpgradeFromGuestDto } from './dto/upgrade-from-guest.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  senha: string;
}

interface AuthRequest {
  user: { userId: number; email: string };
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.nome, dto.email, dto.senha);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.senha);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upgrade-from-guest')
  @HttpCode(HttpStatus.OK)
  upgradeFromGuest(
    @Body() dto: UpgradeFromGuestDto,
    @Request() req: AuthRequest,
  ) {
    return this.authService.upgradeFromGuest(req.user.userId, dto.contas);
  }
}
