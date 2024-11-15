import { BaseCRUDRepository } from './base.crud.repository';
import { IEntity } from '@smendivil/entity';
import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class TypeORMCRUDRepository<T extends IEntity> extends BaseCRUDRepository<T> {
    constructor(
        @InjectRepository('entity')
        private readonly repository: Repository<T>,
    ) {
        super();
    }

    async create(entity: T): Promise<T> {
        return this.repository.save(entity as any);
    }

    async findById(id: string): Promise<T | null> {
        const where = { id } as FindOptionsWhere<T>;
        return this.repository.findOne({ where });
    }

    async update(id: string, entity: Partial<T>): Promise<T | null> {
        await this.repository.update(
            id as any,
            { ...entity, updatedAt: new Date() } as any
        );
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id as any);
        return result.affected !== null && result.affected !== undefined && result.affected > 0;
    }

    async findAll(params?: any): Promise<T[]> {
        return this.repository.find(params);
    }
}


