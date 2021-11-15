import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { QueryStatement, Timezone } from 'aurora-ts-core';

// @apps
import { ICommandBus } from '@aurora/cqrs/domain/command-bus';
import { IQueryBus } from '@aurora/cqrs/domain/query-bus';
import { FindLangByIdQuery } from '@apps/common/lang/application/find/find-lang-by-id.query';
import { DeleteLangByIdCommand } from '@apps/common/lang/application/delete/delete-lang-by-id.command';

@Resolver()
export class CommonDeleteLangByIdResolver
{
    constructor(
        private readonly commandBus: ICommandBus,
        private readonly queryBus: IQueryBus,
    ) {}

    @Mutation('commonDeleteLangById')
    async main(
        @Args('id') id: string,
        @Args('constraint') constraint?: QueryStatement,
        @Timezone() timezone?: string,
    )
    {
        const lang = await this.queryBus.ask(new FindLangByIdQuery(id, constraint, { timezone }));

        await this.commandBus.dispatch(new DeleteLangByIdCommand(id, constraint, { timezone }));

        return lang;
    }
}