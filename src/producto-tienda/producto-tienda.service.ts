import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoTiendaService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
    
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) {}

    async addStoreToProduct(productoId: string, tiendas: TiendaEntity[]): Promise<ProductoEntity> {

       for (let index = 0; index < tiendas.length; index++) {
       
            
            const tiendanew: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendas[index].id}});
            if (!tiendanew)
              throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND);
          
            const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]})
            if (!producto)
              throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
        
            producto.tiendas = [...producto.tiendas, tiendanew];
            return await this.productoRepository.save(producto);

        };
      }

    
    async findStoreFromProduct(productoId: string): Promise<TiendaEntity> {
        const tiendanew: TiendaEntity = await this.tiendaRepository.findOne({where: {id: productoId}});

        if (!tiendanew)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
       
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
   
        const productoTiendaNew: TiendaEntity = producto.tiendas.find(e => e.id === tiendanew.id);
   
        if (!productoTiendaNew)
          throw new BusinessLogicException("The tienda with the given id is not associated to the producto", BusinessError.PRECONDITION_FAILED)
   
        return productoTiendaNew;
    }

    
    async findStoresFromProduct(productoId: string, tiendaId: string): Promise<TiendaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
       
        return producto.tiendas.find(e => e.id === tiendaId);
    }
    
    async updateStoresFromProduct(productoId: string, tiendas: TiendaEntity[]): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
    
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < tiendas.length; i++) {
          const tiendanew: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendas[i].id}});
          if (!tiendanew)
            throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        producto.tiendas = tiendas;
        return await this.productoRepository.save(producto);
      }
    
    async deleteStoreFromProduct(productoId: string,  tiendaId: string){
        const tiendanew: TiendaEntity = await this.tiendaRepository.findOne({where: {id: productoId}});
        if (!tiendanew)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
    
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
    
        const productoTiendaNew: TiendaEntity = producto.tiendas.find(e => e.id === tiendanew.id);
    
        if (!productoTiendaNew)
            throw new BusinessLogicException("The tienda with the given id is not associated to the producto", BusinessError.PRECONDITION_FAILED)
 
        producto.tiendas = producto.tiendas.filter(e => e.id !== tiendaId);
        await this.productoRepository.save(producto);
    }  
 }
