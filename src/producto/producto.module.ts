import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoEntity]),
  ],
  providers: [ProductoService],
})
export class ProductoModule {}
