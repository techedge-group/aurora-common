import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { NestCommandBus, NestQueryBus } from '@aurora/cqrs';
import { CoreModule as AuroraCoreModule, ICommandBus, ICriteria, IQueryBus, SequelizeCriteria } from 'aurora-ts-core';

@Module({
    imports: [
        AuroraCoreModule,
        CacheModule.register(),
        ConfigModule.forRoot({ isGlobal: true }),
        CqrsModule
    ],
    providers: [
        {
            provide : ICommandBus,
            useClass: NestCommandBus
        },
        {
            provide : IQueryBus,
            useClass: NestQueryBus
        },
        {
            provide : ICriteria,
            useClass: SequelizeCriteria
        }
    ],
    exports: [
        CacheModule,
        ConfigModule,
        CqrsModule,
        {
            provide : ICommandBus,
            useClass: NestCommandBus
        },
        {
            provide : IQueryBus,
            useClass: NestQueryBus
        },
        {
            provide : ICriteria,
            useClass: SequelizeCriteria
        }
    ]
})
export class SharedModule {}
