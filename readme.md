# @smendivil/crud

A flexible CRUD module for NestJS applications supporting both TypeORM and In-Memory implementations.

## Features

- Generic CRUD operations
- Multiple repository implementations (TypeORM, In-Memory)
- Environment-based configuration
- Full TypeScript support
- 100% test coverage
- Easy integration with NestJS
- Type-safe implementations
- Configurable for development and production

## Installation

Install the package and its peer dependencies:

npm install @smendivil/crud @smendivil/entity @nestjs/typeorm typeorm

## Quick Start

### Basic Usage

1. Create your entity:

import { Entity, Column } from 'typeorm';
import { IEntity } from '@smendivil/entity';

@Entity()
export class UserEntity implements IEntity {
    @Column({ primary: true })
    id: string;

    @Column()
    name: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}

2. Import the CRUD module:

import { Module } from '@nestjs/common';
import { CRUDModule } from '@smendivil/crud';
import { UserEntity } from './entities/user.entity';

@Module({
    imports: [
        CRUDModule.forRoot(UserEntity),
    ],
    exports: ['ICRUDService'],
})
export class UserModule {}

3. Use the CRUD service:

import { Controller, Inject } from '@nestjs/common';
import { ICRUDService } from '@smendivil/crud';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UserController {
    constructor(
        @Inject('ICRUDService')
        private readonly userService: ICRUDService<UserEntity>
    ) {}

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.userService.getById(id);
    }
}

## Environment-Based Configuration

### Development Configuration

Use InMemoryCRUDRepository for development:

import { Module } from '@nestjs/common';
import { CRUDModule, InMemoryCRUDRepository } from '@smendivil/crud';
import { UserEntity } from './entities/user.entity';

@Module({
    imports: [
        CRUDModule.forRoot(UserEntity, InMemoryCRUDRepository),
    ],
})
export class UserModule {}

### Production Configuration

Use TypeORMCRUDRepository for production:

import { Module } from '@nestjs/common';
import { CRUDModule, TypeORMCRUDRepository } from '@smendivil/crud';
import { UserEntity } from './entities/user.entity';

@Module({
    imports: [
        CRUDModule.forRoot(UserEntity, TypeORMCRUDRepository),
    ],
})
export class UserModule {}

## Advanced Configuration

### Database Configuration

Create a database configuration file:

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseConfig: { [key: string]: TypeOrmModuleOptions } = {
    development: {
        type: 'sqlite',
        database: ':memory:',
        entities: [/* your entities */],
        synchronize: true,
    },
    production: {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [/* your entities */],
        synchronize: false,
    }
};

export default databaseConfig;

### Dynamic Module Configuration

Configure the module based on environment:

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [() => ({ database: databaseConfig })],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const env = process.env.NODE_ENV || 'development';
                return configService.get(`database.${env}`);
            },
        }),
        // Your other modules
    ],
})
export class AppModule {}

## API Reference

### ICRUDService<T>

Base service interface providing CRUD operations:

- create(entity: T): Promise<T>
- getById(id: string): Promise<T | null>
- update(id: string, entity: Partial<T>): Promise<T | null>
- delete(id: string): Promise<boolean>
- getAll(params?: any): Promise<T[]>

### ICRUDRepository<T>

Base repository interface:

- create(entity: T): Promise<T>
- findById(id: string): Promise<T | null>
- update(id: string, entity: Partial<T>): Promise<T | null>
- delete(id: string): Promise<boolean>
- findAll(params?: any): Promise<T[]>

### Available Implementations

1. InMemoryCRUDRepository:
- Uses Map for in-memory storage
- Perfect for development and testing
- No database required

2. TypeORMCRUDRepository:
- Uses TypeORM for database operations
- Supports multiple databases
- Production-ready implementation

## Testing

### Unit Testing

Example of testing with the InMemoryCRUDRepository:

import { Test } from '@nestjs/testing';
import { InMemoryCRUDRepository } from '@smendivil/crud';
import { UserEntity } from './entities/user.entity';

describe('UserService', () => {
    let repository: InMemoryCRUDRepository<UserEntity>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: 'ICRUDRepository',
                    useClass: InMemoryCRUDRepository,
                },
            ],
        }).compile();

        repository = moduleRef.get('ICRUDRepository');
    });

    it('should create user', async () => {
        const user = new UserEntity();
        user.id = '1';
        const result = await repository.create(user);
        expect(result).toEqual(user);
    });
});

## Best Practices

1. Entity Structure:
- Always implement IEntity interface
- Include id, createdAt, and updatedAt fields
- Use TypeORM decorators when needed

2. Repository Selection:
- Use InMemoryCRUDRepository for development/testing
- Use TypeORMCRUDRepository for production
- Configure based on NODE_ENV

3. Error Handling:
- Handle null returns from getById
- Manage failed operations gracefully
- Implement proper validation

4. Configuration:
- Use environment variables
- Separate development and production configs
- Implement proper type checking

## Environment Variables

Required environment variables for production:

NODE_ENV=production
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase

## Common Issues and Solutions

1. TypeORM Connection:
- Ensure proper database configuration
- Check entity registration
- Verify environment variables

2. Repository Injection:
- Use proper injection token ('ICRUDRepository')
- Check module imports
- Verify provider registration

3. Type Safety:
- Implement IEntity correctly
- Use proper generics
- Check compiler settings

## License

MIT