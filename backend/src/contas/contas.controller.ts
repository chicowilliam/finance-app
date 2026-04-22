import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContasService } from './contas.service';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

interface AuthRequest {
  user: { userId: number; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('api/contas')
export class ContasController {
  constructor(private readonly contasService: ContasService) {}

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.contasService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    return this.contasService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateContaDto, @Request() req: AuthRequest) {
    return this.contasService.create(dto, req.user.userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContaDto,
    @Request() req: AuthRequest,
  ) {
    return this.contasService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    this.contasService.remove(id, req.user.userId);
    return { message: `Conta #${id} removida` };
  }
}
