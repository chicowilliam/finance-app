import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
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
  user: { userId: number; email: string; role: 'user' | 'admin' };
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.nome, dto.email, dto.senha);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.senha);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: AuthRequest) {
    return {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    };
  }

  @SkipThrottle()
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
