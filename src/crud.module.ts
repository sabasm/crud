import { Module, DynamicModule } from '@nestjs/common';
import { BaseCRUDService } from './services/base.crud.service';
import { BaseCRUDRepository } from './repositories/base.crud.repository';

@Module({})
export class CRUDModule {
    static forRoot<T>(entity: any, repositoryImplementation: any): DynamicModule {
        return {
            module: CRUDModule,
            providers: [
                {
                    provide: 'ICRUDRepository',
                    useClass: repositoryImplementation,
                },
                {
                    provide: 'ICRUDService',
                    useClass: BaseCRUDService,
                },
            ],
            exports: ['ICRUDService'],
        };
    }
}


