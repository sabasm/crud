import { Test } from '@nestjs/testing';
import { CRUDModule } from '../crud.module';
import { IEntity } from '@smendivil/entity';
import { BaseCRUDRepository } from '../repositories/base.crud.repository';

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
        return [new TestEntity('1')];
    }
}

describe('CRUDModule', () => {
    it('should provide CRUD services', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CRUDModule.forRoot(TestEntity, TestRepository)],
        }).compile();

        expect(moduleRef.get('ICRUDService')).toBeDefined();
        expect(moduleRef.get('ICRUDRepository')).toBeDefined();
    });

    it('should export ICRUDService', async () => {
        const module = CRUDModule.forRoot(TestEntity, TestRepository);
        expect(module.exports).toContain('ICRUDService');
    });
})
