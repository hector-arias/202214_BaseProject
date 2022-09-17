import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TiendaEntity]),
  ],
  providers: [TiendaService],
})
export class TiendaModule {}
