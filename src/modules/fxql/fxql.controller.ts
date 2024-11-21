import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dto/page.dto';
import { CreateFXQLStatementDto } from './dto/fxql.dto';
import { FXQLService } from './fxql.service';

@ApiTags('FXQL Statements API')
@Controller({ version: '1', path: 'fxql-statements' })
export class FXQLController {
  constructor(private readonly fxqlService: FXQLService) {}

  @Post()
  async createStatments(@Body() body: CreateFXQLStatementDto) {
    return this.fxqlService.createStatements(body);
  }

  @Get()
  async getStatements(@Query() query: PageQueryDto) {
    return this.fxqlService.getStatements(query);
  }
}
