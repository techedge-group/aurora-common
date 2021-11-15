import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { QueryStatement, Timezone } from 'aurora-ts-core';

// @apps
import { ICommandBus } from '@aurora/cqrs/domain/command-bus';
import { IQueryBus } from '@aurora/cqrs/domain/query-bus';
import { DeleteLangsCommand } from '@apps/common/lang/application/delete/delete-langs.command';
import { GetLangsQuery } from '@apps/common/lang/application/get/get-langs.query';

@Resolver()
export class CommonDeleteLangsResolver
{
    constructor(
        private readonly commandBus: ICommandBus,
        private readonly queryBus: IQueryBus,
    ) {}

    @Mutation('commonDeleteLangs')
    async main(
        @Args('query') queryStatement?: QueryStatement,
        @Args('constraint') constraint?: QueryStatement,
        @Timezone() timezone?: string,
    )
    {
        const langs = await this.queryBus.ask(new GetLangsQuery(queryStatement, constraint, { timezone }));

        await this.commandBus.dispatch(new DeleteLangsCommand(queryStatement, constraint, { timezone }));

        return langs;
    }
}