import { BaseCRUDService } from '../../services/base.crud.service';
import { ICRUDRepository } from '../../interfaces/crud.repository.interface';
import { IEntity } from '@smendivil/entity';

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

class TestService extends BaseCRUDService<TestEntity> {
    constructor(repository: ICRUDRepository<TestEntity>) {
        super(repository);
    }
}

describe('BaseCRUDService', () => {
    let service: TestService;
    let repository: ICRUDRepository<TestEntity>;
    let testEntity: TestEntity;

    beforeEach(() => {
        testEntity = new TestEntity('1', 'Test Entity');
        repository = {
            create: jest.fn().mockResolvedValue(testEntity),
            findById: jest.fn().mockResolvedValue(testEntity),
            update: jest.fn().mockResolvedValue(testEntity),
            delete: jest.fn().mockResolvedValue(true),
            findAll: jest.fn().mockResolvedValue([testEntity])
        };
        service = new TestService(repository);
    });

    describe('create', () => {
        it('should create an entity', async () => {
            const result = await service.create(testEntity);
            expect(repository.create).toHaveBeenCalledWith(testEntity);
            expect(result).toEqual(testEntity);
        });
    });

    describe('getById', () => {
        it('should get an entity by id', async () => {
            const result = await service.getById('1');
            expect(repository.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(testEntity);
        });

        it('should return null for non-existent entity', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(null);
            const result = await service.getById('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update an entity', async () => {
            const updateData = { name: 'Updated Entity' };
            const result = await service.update('1', updateData);
            expect(repository.update).toHaveBeenCalledWith('1', updateData);
            expect(result).toEqual(testEntity);
        });

        it('should return null when updating non-existent entity', async () => {
            jest.spyOn(repository, 'update').mockResolvedValue(null);
            const result = await service.update('nonexistent', { name: 'Updated' });
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete an entity', async () => {
            const result = await service.delete('1');
            expect(repository.delete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });

        it('should return false when deleting non-existent entity', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue(false);
            const result = await service.delete('nonexistent');
            expect(result).toBe(false);
        });
    });

    describe('getAll', () => {
        it('should get all entities', async () => {
            const result = await service.getAll();
            expect(repository.findAll).toHaveBeenCalled();
            expect(result).toEqual([testEntity]);
        });

        it('should pass params to repository', async () => {
            const params = { filter: 'test' };
            await service.getAll(params);
            expect(repository.findAll).toHaveBeenCalledWith(params);
        });
    });
});


