import { IEntity } from '@smendivil/entity';

export interface ICRUDService<T extends IEntity> {
    create(entity: T): Promise<T>;
    getById(id: string): Promise<T | null>;
    update(id: string, entity: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    getAll(params?: any): Promise<T[]>;
}


