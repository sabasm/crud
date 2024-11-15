import { BaseCRUDRepository } from './base.crud.repository';
import { IEntity } from '@smendivil/entity';
import { Repository, FindOptionsWhere, EntityTarget } from 'typeorm';
import { InjectRepository, getRepositoryToken } from '@nestjs/typeorm';
import { Type } from '@nestjs/common';

export class TypeORMCRUDRepository<T extends IEntity> extends BaseCRUDRepository<T> {
    constructor(private readonly repository: Repository<T>) {
        super();
    }

    static forEntity<T extends IEntity>(entity: Type<T>) {
        return {
            provide: 'ICRUDRepository',
            useFactory: (repository: Repository<T>) => {
                return new TypeORMCRUDRepository<T>(repository);
            },
            inject: [getRepositoryToken(entity)],
        };
    }

    async create(entity: T): Promise<T> {
        return this.repository.save(entity);
    }

    async findById(id: string): Promise<T | null> {
        const where = { id } as FindOptionsWhere<T>;
        return this.repository.findOne({ where });
    }

    async update(id: string, entity: Partial<T>): Promise<T | null> {
        const where = { id } as FindOptionsWhere<T>;
        await this.repository.update(where, {
            ...entity,
            updatedAt: new Date(),
        } as any);
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete({ id } as FindOptionsWhere<T>);
        return !!result.affected;
    }

    async findAll(params?: any): Promise<T[]> {
        return this.repository.find(params);
    }
}


