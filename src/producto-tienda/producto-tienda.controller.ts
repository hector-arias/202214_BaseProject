import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaDto } from '../tienda/tienda.dto';
import { TiendaEntity } from '../tienda/tienda.entity';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
    constructor(private readonly productoTiendaService: ProductoTiendaService){}

    @Post(':product_id/stores/:store_id')
    async addStoreToProduct(@Param('product_id') product_id: string, @Param('store_id') store_id: TiendaEntity[]){
        return await this.productoTiendaService.addStoreToProduct(product_id, store_id);
    }

    @Get(':product_id/stores/:store_id')
    async findStoresFromProduct(@Param('product_id') product_id: string, @Param('store_id') store_id: string){
        return await this.productoTiendaService.findStoresFromProduct(product_id, store_id);
    }

    @Get(':product_id/stores')
    async findStoreFromProduct(@Param('product_id') product_id: string){
        return await this.productoTiendaService.findStoreFromProduct(product_id);
    }

    @Put(':product_id/stores')
    async updateStoresFromProduct(@Body() artworksDto: TiendaDto[], @Param('product_id') product_id: string){
        const stores = plainToInstance(TiendaEntity, artworksDto)
        return await this.productoTiendaService.updateStoresFromProduct(product_id, stores);
    }
    
    @Delete(':product_id/stores/:store_id')
    @HttpCode(204)
    async deleteStoresFromProduct(@Param('product_id') product_id: string, @Param('store_id') store_id: string){
        return await this.productoTiendaService.deleteStoreFromProduct(product_id, store_id);
    }
}