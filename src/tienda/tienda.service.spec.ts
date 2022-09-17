import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(), 
        ciudad: faker.address.city(), 
        direccion: faker.address.secondaryAddress()})
        tiendasList.push(tienda);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne should return a tienda by id', async () => {
    const storedtienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedtienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedtienda.nombre)
    expect(tienda.ciudad).toEqual(storedtienda.ciudad)
    expect(tienda.direccion).toEqual(storedtienda.direccion)
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });

  it('create should return a new tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.company.name(), 
      ciudad: faker.address.city(),
      direccion: faker.address.secondaryAddress(), 
      productos: []
    }

    const newtienda: TiendaEntity = await service.create(tienda);
    expect(newtienda).not.toBeNull();

    const storedtienda: TiendaEntity = await repository.findOne({where: {id: newtienda.id}})
    expect(storedtienda).not.toBeNull();
    expect(storedtienda.nombre).toEqual(newtienda.nombre)
    expect(storedtienda.ciudad).toEqual(newtienda.ciudad)
    expect(storedtienda.direccion).toEqual(newtienda.direccion)
  });

  it('update should modify a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = "Nuevo nombre";
    tienda.direccion = "Nueva direccion";
  
    const updatedtienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedtienda).not.toBeNull();
  
    const storedtienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(storedtienda).not.toBeNull();
    expect(storedtienda.nombre).toEqual(tienda.nombre)
    expect(storedtienda.direccion).toEqual(tienda.direccion)
  });
 
  it('update should throw an exception for an invalid tienda', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda, nombre: "Nuevo nombre", direccion: "Nueva direccion"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });

  it('delete should remove a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
  
    const deletedtienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedtienda).toBeNull();
  });

  it('delete should throw an exception for an invalid tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });
 
});