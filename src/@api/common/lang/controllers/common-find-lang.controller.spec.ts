import { Test, TestingModule } from '@nestjs/testing';

// custom items
import { CommonFindLangController } from './common-find-lang.controller';
import { ICommandBus } from '@aurora/cqrs/domain/command-bus';
import { IQueryBus } from '@aurora/cqrs/domain/query-bus';
import { langs } from '@apps/common/lang/infrastructure/seeds/lang.seed';

describe('CommonFindLangController', () =>
{
    let controller: CommonFindLangController;
    let queryBus: IQueryBus;
    let commandBus: ICommandBus;

    beforeAll(async () =>
    {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                CommonFindLangController
            ],
            providers: [
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
            ]
        }).compile();

        controller  = module.get<CommonFindLangController>(CommonFindLangController);
        queryBus    = module.get<IQueryBus>(IQueryBus);
        commandBus  = module.get<ICommandBus>(ICommandBus);
    });

    describe('main', () =>
    {
        test('CommonFindLangController should be defined', () =>
        {
            expect(controller).toBeDefined();
        });

        test('should return a lang', async () =>
        {
            jest.spyOn(queryBus, 'ask').mockImplementation(() => new Promise(resolve => resolve(langs[0])));
            expect(await controller.main()).toBe(langs[0]);
        });
    });
});