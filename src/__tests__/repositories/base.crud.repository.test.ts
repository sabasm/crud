import { BaseCRUDRepository } from '../../repositories/base.crud.repository';
import { IEntity } from '@smendivil/entity';

class TestEntity implements IEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(id: string) {
        this.id = id;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

class TestRepository extends BaseCRUDRepository<TestEntity> {
    async create(entity: TestEntity): Promise<TestEntity> {
        return entity;
    }
    async findById(id: string): Promise<TestEntity | null> {
        return new TestEntity(id);
    }
    async update(id: string, entity: Partial<TestEntity>): Promise<TestEntity | null> {
        return { ...new TestEntity(id), ...entity };
    }
    async delete(id: string): Promise<boolean> {
        return true;
    }
    async findAll(): Promise<TestEntity[]> {
        return [new TestEntity('1'), new TestEntity('2')];
    }
}

describe('BaseCRUDRepository', () => {
    let repository: TestRepository;

    beforeEach(() => {
        repository = new TestRepository();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it('should implement all CRUD methods', () => {
        expect(repository.create).toBeDefined();
        expect(repository.findById).toBeDefined();
        expect(repository.update).toBeDefined();
        expect(repository.delete).toBeDefined();
        expect(repository.findAll).toBeDefined();
    });
});


