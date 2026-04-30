import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';
import { DeleteUserDto } from './dto/delete-user.dto';

interface AuthRequest {
  user: { userId: number; email: string; role: 'user' | 'admin' };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Patch('users/:id/active')
  setUserActive(
    @Param('id', ParseIntPipe) id: number,
    @Query('value', ParseBoolPipe) value: boolean,
    @Request() req: AuthRequest,
  ) {
    return this.adminService.setUserActive(req.user.userId, id, value);
  }

  @Delete('users/:id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DeleteUserDto,
    @Request() req: AuthRequest,
  ) {
    return this.adminService.deleteUser(req.user.userId, id, dto);
  }

  @Get('audit-logs')
  listAuditLogs(@Query('limit') limit?: string) {
    const parsed = limit ? Number.parseInt(limit, 10) : 100;
    return this.adminService.listAuditLogs(Number.isFinite(parsed) ? parsed : 100);
  }
}
