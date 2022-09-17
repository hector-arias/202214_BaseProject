import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ProductoEntity } from './producto.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ){}
 
    async findAll(): Promise<ProductoEntity[]> {
        return await this.productoRepository.find({ relations: ["tiendas"] });
    }
 
    async findOne(id: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}, relations: ["tiendas"] } );
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
   
        return producto;
    }
   
    async create(producto: ProductoEntity): Promise<ProductoEntity> {
        if (producto.tipo == "Perecedero" || producto.tipo == "No perecedero"){
            return await this.productoRepository.save(producto);
        }else{
            throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
        }
    }
 
    async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
        const persistedproducto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!persistedproducto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
       
        producto.id = id; 
        if (producto.tipo == "Perecedero" || producto.tipo == "No perecedero"){
            return await this.productoRepository.save(producto);
        }else{
            throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
        }
    }
 
    async delete(id: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.productoRepository.remove(producto);
    }
 }
