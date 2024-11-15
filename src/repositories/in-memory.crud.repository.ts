import { BaseCRUDRepository } from './base.crud.repository';
import { IEntity } from '@smendivil/entity';

export class InMemoryCRUDRepository<T extends IEntity> extends BaseCRUDRepository<T> {
    private entities: Map<string, T> = new Map();

    async create(entity: T): Promise<T> {
        this.entities.set(entity.id, entity);
        return entity;
    }

    async findById(id: string): Promise<T | null> {
        return this.entities.get(id) || null;
    }

    async update(id: string, entity: Partial<T>): Promise<T | null> {
        const existing = this.entities.get(id);
        if (!existing) return null;
        const updated = { ...existing, ...entity, updatedAt: new Date() };
        this.entities.set(id, updated as T);
        return updated as T;
    }

    async delete(id: string): Promise<boolean> {
        return this.entities.delete(id);
    }

    async findAll(params?: any): Promise<T[]> {
        return Array.from(this.entities.values());
    }
}


