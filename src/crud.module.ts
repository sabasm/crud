import { Module, DynamicModule, Type } from '@nestjs/common';
import { BaseCRUDService } from './services/base.crud.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IEntity } from '@smendivil/entity';
import { TypeORMCRUDRepository } from './repositories/typeorm.crud.repository';
import { ICRUDService } from './interfaces/crud.service.interface';

@Module({})
export class CRUDModule {
    static forRoot<T extends IEntity>(entity: Type<T>): DynamicModule {
        return {
            module: CRUDModule,
            imports: [TypeOrmModule.forFeature([entity])],
            providers: [
                TypeORMCRUDRepository.forEntity(entity),
                {
                    provide: 'ICRUDService',
                    useClass: class extends BaseCRUDService<T> {
                        constructor(repository: TypeORMCRUDRepository<T>) {
                            super(repository);
                        }
                    }
                },
            ],
            exports: ['ICRUDService'],
        };
    }

    static forFeature<T extends IEntity>(entity: Type<T>): DynamicModule {
        return {
            module: CRUDModule,
            imports: [TypeOrmModule.forFeature([entity])],
            providers: [TypeORMCRUDRepository.forEntity(entity)],
            exports: ['ICRUDRepository'],
        };
    }
}
