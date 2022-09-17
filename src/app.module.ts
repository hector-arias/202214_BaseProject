import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoEntity } from './producto/producto.entity';
import { TiendaEntity } from './tienda/tienda.entity';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';

@Module({
  imports: [
    ProductoModule,
    TiendaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'StoreDB_201910708',
      entities: [
        ProductoEntity,
        TiendaEntity
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    ProductoModule,
    TiendaModule,
    ProductoTiendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
