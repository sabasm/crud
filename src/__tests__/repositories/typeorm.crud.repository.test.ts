import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMCRUDRepository } from '../../repositories/typeorm.crud.repository';
import { IEntity } from '@smendivil/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';

class TestEntity implements IEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

describe('TypeORMCRUDRepository', () => {
    let repository: TypeORMCRUDRepository<TestEntity>;
    let typeormRepository: Repository<TestEntity>;
    let testEntity: TestEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(TestEntity),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        find: jest.fn(),
                    },
                },
                TypeORMCRUDRepository.forEntity(TestEntity),
            ],
        }).compile();

        repository = module.get<TypeORMCRUDRepository<TestEntity>>('ICRUDRepository');
        typeormRepository = module.get<Repository<TestEntity>>(getRepositoryToken(TestEntity));
        testEntity = new TestEntity('1', 'Test Entity');
    });

    describe('create', () => {
        it('should create an entity', async () => {
            jest.spyOn(typeormRepository, 'save').mockResolvedValue(testEntity);

            const result = await repository.create(testEntity);
            expect(result).toBe(testEntity);
            expect(typeormRepository.save).toHaveBeenCalledWith(testEntity);
        });
    });

    describe('findById', () => {
        it('should find an entity by id', async () => {
            jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(testEntity);

            const result = await repository.findById('1');
            expect(result).toBe(testEntity);
            expect(typeormRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('should return null if entity not found', async () => {
            jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(null);

            const result = await repository.findById('nonexistent');
            expect(result).toBeNull();
            expect(typeormRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'nonexistent' }
            });
        });
    });

    describe('update', () => {
        it('should update an existing entity', async () => {
            const updateData = { name: 'Updated Entity' };
            const updatedEntity = { ...testEntity, ...updateData, updatedAt: new Date() };

            jest.spyOn(typeormRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
            jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(updatedEntity);

            const result = await repository.update('1', updateData);
            expect(result).toBe(updatedEntity);
            expect(typeormRepository.update).toHaveBeenCalledWith(
                { id: '1' },
                expect.objectContaining({
                    ...updateData,
                    updatedAt: expect.any(Date)
                })
            );
        });

        it('should return null when updating non-existent entity', async () => {
            jest.spyOn(typeormRepository, 'update').mockResolvedValue({ affected: 0 } as UpdateResult);
            jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(null);

            const result = await repository.update('nonexistent', { name: 'Updated' });
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete an existing entity', async () => {
            jest.spyOn(typeormRepository, 'delete').mockResolvedValue({ affected: 1 } as DeleteResult);

            const result = await repository.delete('1');
            expect(result).toBe(true);
            expect(typeormRepository.delete).toHaveBeenCalledWith({ id: '1' });
        });

        it('should return false when deleting non-existent entity', async () => {
            jest.spyOn(typeormRepository, 'delete').mockResolvedValue({ affected: 0 } as DeleteResult);

            const result = await repository.delete('nonexistent');
            expect(result).toBe(false);
            expect(typeormRepository.delete).toHaveBeenCalledWith({ id: 'nonexistent' });
        });
    });

    describe('findAll', () => {
        it('should find all entities', async () => {
            const entities = [
                new TestEntity('1', 'Entity 1'),
                new TestEntity('2', 'Entity 2')
            ];
            jest.spyOn(typeormRepository, 'find').mockResolvedValue(entities);

            const result = await repository.findAll();
            expect(result).toBe(entities);
            expect(typeormRepository.find).toHaveBeenCalled();
        });

        it('should find all entities with params', async () => {
            const params = { where: { name: 'Test' } };
            const entities = [new TestEntity('1', 'Test')];
            jest.spyOn(typeormRepository, 'find').mockResolvedValue(entities);

            const result = await repository.findAll(params);
            expect(result).toBe(entities);
            expect(typeormRepository.find).toHaveBeenCalledWith(params);
        });
    });
});


