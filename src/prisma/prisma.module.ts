import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //global modules can be used inside other modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //exporting service so that other modules can use it
})
export class PrismaModule {}
