import { ICRUDRepository } from '../interfaces/crud.repository.interface';
import { IEntity } from '@smendivil/entity';

export abstract class BaseCRUDRepository<T extends IEntity> implements ICRUDRepository<T> {
    abstract create(entity: T): Promise<T>;
    abstract findById(id: string): Promise<T | null>;
    abstract update(id: string, entity: Partial<T>): Promise<T | null>;
    abstract delete(id: string): Promise<boolean>;
    abstract findAll(params?: any): Promise<T[]>;
}


