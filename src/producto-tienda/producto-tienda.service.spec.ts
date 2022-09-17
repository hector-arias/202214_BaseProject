import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { Repository } from 'typeorm';

import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendaList : TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productRepository.clear();

    tiendaList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await tiendaRepository.save({
          nombre: faker.company.name(), 
          ciudad: faker.address.city(), 
          direccion: faker.address.secondaryAddress()
        })
        tiendaList.push(tienda);
    }

    producto = await productRepository.save({
      nombre: faker.company.name(), 
      precio: parseInt(faker.random.numeric()),
      tipo:  faker.word.adjective(), 
      tiendas: tiendaList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add an tienda to a producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.address.city(), 
      direccion: faker.address.secondaryAddress()
    });

    const newProduct: ProductoEntity = await productRepository.save({
      nombre: faker.company.name(), 
      precio: parseInt(faker.random.numeric()),
      tipo:  faker.word.adjective(), 
    })

    const result: ProductoEntity = await service.addStoreToProduct(newProduct.id, tiendaList);
    
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(result.tiendas[0].nombre)
    expect(result.tiendas[0].ciudad).toBe(result.tiendas[0].ciudad)
    expect(result.tiendas[0].direccion).toBe(result.tiendas[0].direccion)
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an invalid tienda', async () => {
    await expect(()=> service.findStoreFromProduct(producto.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });


  it('deleteArtworkToMuseum should thrown an exception for an invalid tienda', async () => {
    await expect(()=> service.deleteStoreFromProduct(producto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteArtworkToMuseum should thrown an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await expect(()=> service.deleteStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteArtworkToMuseum should thrown an exception for an non asocciated tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.address.city(), 
      direccion: faker.address.secondaryAddress()
    });

    await expect(()=> service.deleteStoreFromProduct(producto.id, newTienda.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  }); 

});