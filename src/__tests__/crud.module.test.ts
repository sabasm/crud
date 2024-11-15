import { Test } from '@nestjs/testing';
import { CRUDModule } from '../crud.module';
import { IEntity } from '@smendivil/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

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

describe('CRUDModule', () => {
    it('should provide CRUD services', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [TestEntity],
                    synchronize: true,
                }),
                CRUDModule.forRoot(TestEntity),
            ],
        }).compile();

        expect(moduleRef.get('ICRUDService')).toBeDefined();
        expect(moduleRef.get('ICRUDRepository')).toBeDefined();
    });

    it('should export ICRUDService', () => {
        const module = CRUDModule.forRoot(TestEntity);
        expect(module.exports).toContain('ICRUDService');
    });
});


