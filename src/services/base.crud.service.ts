import { ICRUDService } from '../interfaces/crud.service.interface';
import { ICRUDRepository } from '../interfaces/crud.repository.interface';
import { IEntity } from '@smendivil/entity';

export abstract class BaseCRUDService<T extends IEntity> implements ICRUDService<T> {
    constructor(private readonly repository: ICRUDRepository<T>) {}

    async create(entity: T): Promise<T> {
        return this.repository.create(entity);
    }

    async getById(id: string): Promise<T | null> {
        return this.repository.findById(id);
    }

    async update(id: string, entity: Partial<T>): Promise<T | null> {
        return this.repository.update(id, entity);
    }

    async delete(id: string): Promise<boolean> {
        return this.repository.delete(id);
    }

    async getAll(params?: any): Promise<T[]> {
        return this.repository.findAll(params);
    }
}


