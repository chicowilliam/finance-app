import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContasModule } from './contas/contas.module';

@Module({
  imports: [ContasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
