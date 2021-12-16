/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICommandBus, IQueryBus } from 'aurora-ts-core';

// custom items
import { CommonGetCountriesController } from './common-get-countries.controller';
import { AddI18NConstraintService } from '@apps/common/lang/application/shared/add-i18n-constraint.service';

// sources
import { langs } from '@apps/common/lang/infrastructure/seeds/lang.seed';
import { countries } from '@apps/common/country/infrastructure/seeds/country.seed';

describe('CommonGetCountriesController', () =>
{
    let controller: CommonGetCountriesController;
    let queryBus: IQueryBus;
    let commandBus: ICommandBus;

    beforeAll(async () =>
    {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CacheModule.register(),
            ],
            controllers: [
                CommonGetCountriesController
            ],
            providers: [
                AddI18NConstraintService,
                {
                    provide : ConfigService,
                    useValue: {
                        get: (key: string) => key === 'APP_LANG' ? 'es' : ''
                    }
                },
                {
                    provide : IQueryBus,
                    useValue: {
                        ask: () => { /**/ },
                    }
                },
                {
                    provide : ICommandBus,
                    useValue: {
                        dispatch: () => { /**/ },
                    }
                },
                {
                    provide : CACHE_MANAGER,
                    useValue: {
                        get: (key: string) =>
                        {
                            console.log(key);
                            return key === 'common/lang' ? langs : null;
                        },
                    }
                },
            ]
        }).compile();

        controller  = module.get<CommonGetCountriesController>(CommonGetCountriesController);
        queryBus    = module.get<IQueryBus>(IQueryBus);
        commandBus  = module.get<ICommandBus>(ICommandBus);
    });

    describe('main', () =>
    {
        test('CommonGetCountriesController should be defined', () =>
        {
            expect(controller).toBeDefined();
        });

        test('should return a countries', async () =>
        {
            jest.spyOn(queryBus, 'ask').mockImplementation(() => new Promise(resolve => resolve(countries)));
            expect(await controller.main()).toBe(countries);
        });
    });
});