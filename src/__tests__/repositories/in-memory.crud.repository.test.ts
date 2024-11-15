import { InMemoryCRUDRepository } from '../../repositories/in-memory.crud.repository';
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

describe('InMemoryCRUDRepository', () => {
    let repository: InMemoryCRUDRepository<TestEntity>;
    let testEntity: TestEntity;

    beforeEach(() => {
        repository = new InMemoryCRUDRepository<TestEntity>();
        testEntity = new TestEntity('1', 'Test Entity');
    });

    describe('create', () => {
        it('should create and store an entity', async () => {
            const created = await repository.create(testEntity);
            expect(created).toEqual(testEntity);
            const found = await repository.findById('1');
            expect(found).toEqual(testEntity);
        });
    });

    describe('findById', () => {
        it('should find an entity by id', async () => {
            await repository.create(testEntity);
            const found = await repository.findById('1');
            expect(found).toEqual(testEntity);
        });

        it('should return null if entity not found', async () => {
            const found = await repository.findById('nonexistent');
            expect(found).toBeNull();
        });
    });

    describe('update', () => {
        it('should update an existing entity', async () => {
            await repository.create(testEntity);
            const initialUpdatedAt = testEntity.updatedAt;
            
            // Wait a small amount of time to ensure the timestamps are different
            await new Promise(resolve => setTimeout(resolve, 1));
            
            const updateData = { name: 'Updated Entity' };
            const updated = await repository.update('1', updateData);
            expect(updated?.name).toBe('Updated Entity');
            expect(updated?.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
        });

        it('should return null when updating non-existent entity', async () => {
            const updated = await repository.update('nonexistent', { name: 'Updated' });
            expect(updated).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete an existing entity', async () => {
            await repository.create(testEntity);
            const deleted = await repository.delete('1');
            expect(deleted).toBe(true);
            const found = await repository.findById('1');
            expect(found).toBeNull();
        });

        it('should return false when deleting non-existent entity', async () => {
            const deleted = await repository.delete('nonexistent');
            expect(deleted).toBe(false);
        });
    });

    describe('findAll', () => {
        it('should return all stored entities', async () => {
            const entity1 = new TestEntity('1', 'Entity 1');
            const entity2 = new TestEntity('2', 'Entity 2');
            await repository.create(entity1);
            await repository.create(entity2);
            const all = await repository.findAll();
            expect(all).toHaveLength(2);
            expect(all).toEqual(expect.arrayContaining([entity1, entity2]));
        });

        it('should return empty array when no entities exist', async () => {
            const all = await repository.findAll();
            expect(all).toHaveLength(0);
        });
    });
});


