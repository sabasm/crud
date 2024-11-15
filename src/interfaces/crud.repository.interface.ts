import { IEntity } from '@smendivil/entity';

export interface ICRUDRepository<T extends IEntity> {
    create(entity: T): Promise<T>;
    findById(id: string): Promise<T | null>;
    update(id: string, entity: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findAll(params?: any): Promise<T[]>;
}


