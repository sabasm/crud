import { IEntity } from '@smendivil/entity';

export interface CRUDModuleOptions<T extends IEntity> {
    entity: new (...args: any[]) => T;
    repositoryImplementation: any;
}