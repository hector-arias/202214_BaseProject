import { Controller } from '@nestjs/common';
import { Body, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';
import { TiendaDto } from './tienda.dto';
import { plainToInstance } from 'class-transformer';


@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {

    constructor(private readonly tiendaService: TiendaService) {}
    
    @Get()
    async findAll() {
      return await this.tiendaService.findAll();
    }
  
    @Get(':store_id')
    async findOne(@Param('store_id') store_id: string) {
      return await this.tiendaService.findOne(store_id);
    }
  
    @Post()
    async create(@Body() tiendaDto: TiendaDto) {
      const museum: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
      return await this.tiendaService.create(museum);
    }
  
    @Put(':store_id')
    async update(@Param('store_id') store_id: string, @Body() tiendaDto: TiendaDto) {
      const museum: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
      return await this.tiendaService.update(store_id, museum);
    }
  
    @Delete(':store_id')
    @HttpCode(204)
    async delete(@Param('store_id') store_id: string) {
      return await this.tiendaService.delete(store_id);
    }
}