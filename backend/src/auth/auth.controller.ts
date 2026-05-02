import {
  Body,
  Controller,
  Get,
  Patch,
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

export class VerifyEmailDto {
  @IsString()
  token: string;
}

export class RequestEmailVerificationDto {
  @IsEmail()
  email: string;
}

export class DeleteOwnAccountDto {
  @IsString()
  confirmText: string;
}

export class UpdateProfileDto {
  @IsString()
  nome?: string;

  @IsEmail()
  email?: string;
}

export class ChangePasswordDto {
  @IsString()
  senhaAtual: string;

  @IsString()
  @MinLength(6)
  novaSenha: string;
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

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('request-email-verification')
  @HttpCode(HttpStatus.OK)
  requestEmailVerification(@Body() dto: RequestEmailVerificationDto) {
    return this.authService.requestEmailVerification(dto.email);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: AuthRequest) {
    return this.authService.getProfile(req.user.userId);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Body() dto: UpdateProfileDto, @Request() req: AuthRequest) {
    return this.authService.updateProfile(req.user.userId, dto.nome, dto.email);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Body() dto: ChangePasswordDto, @Request() req: AuthRequest) {
    return this.authService.changePassword(
      req.user.userId,
      dto.senhaAtual,
      dto.novaSenha,
    );
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

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Post('delete-account')
  @HttpCode(HttpStatus.OK)
  deleteOwnAccount(
    @Body() dto: DeleteOwnAccountDto,
    @Request() req: AuthRequest,
  ) {
    return this.authService.deleteOwnAccount(req.user.userId, dto.confirmText);
  }
}
