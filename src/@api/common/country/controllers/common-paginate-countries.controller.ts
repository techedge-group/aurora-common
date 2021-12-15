import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Constraint, ContentLanguage, Pagination, QueryStatement, Timezone } from 'aurora-ts-core';
import { CountryDto } from './../dto/country.dto';

// @apps
import { IQueryBus } from '@aurora/cqrs/domain/query-bus';
import { PaginateCountriesQuery } from '@apps/common/country/application/paginate/paginate-countries.query';
import { AddI18NConstraintService } from '@apps/common/lang/application/shared/add-i18n-constraint.service';

@ApiTags('[common] country')
@Controller('common/countries/paginate')
export class CommonPaginateCountriesController
{
    constructor(
        private readonly queryBus: IQueryBus,
        private readonly addI18NConstraintService: AddI18NConstraintService,
    ) {}

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Paginate countries' })
    @ApiOkResponse({ description: 'The records has been paginated successfully.', type: Pagination })
    @ApiQuery({ name: 'queryStatement', type: QueryStatement })
    @ApiQuery({ name: 'constraint', type: QueryStatement })
    async main(
        @Body('query') queryStatement?: QueryStatement,
        @Constraint() constraint?: QueryStatement,
        @Timezone() timezone?: string,
        @ContentLanguage() contentLanguage?: string,
    )
    {
        constraint = await this.addI18NConstraintService.main(constraint, 'countryI18N', contentLanguage);
        return await this.queryBus.ask(new PaginateCountriesQuery(queryStatement, constraint, { timezone }));
    }
}