import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { plainToInstance } from 'class-transformer';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {

     constructor(private readonly productoService: ProductoService) {}
    
      @Get()
      async findAll() {
        return await this.productoService.findAll();
      }
    
      @Get(':product_id')
      async findOne(@Param('product_id') product_id: string) {
        return await this.productoService.findOne(product_id);
      }
    
      @Post()
      async create(@Body() productoDto: ProductoDto) {
        const museum: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
        return await this.productoService.create(museum);
      }
    
      @Put(':product_id')
      async update(@Param('product_id') product_id: string, @Body() productoDto: ProductoDto) {
        const museum: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
        return await this.productoService.update(product_id, museum);
      }
    
      @Delete(':product_id')
      @HttpCode(204)
      async delete(@Param('product_id') product_id: string) {
        return await this.productoService.delete(product_id);
      }
}