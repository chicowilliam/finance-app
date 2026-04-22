import { Module } from '@nestjs/common';
import { ContasController } from './contas.controller';
import { ContasService } from './contas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContasController],
  providers: [ContasService],
  exports: [ContasService],
})
export class ContasModule {}
