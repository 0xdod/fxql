import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageQueryDto } from 'src/common/dto/page.dto';
import { Repository } from 'typeorm';
import { FXQLStatementRegex } from './constants/fxql-regex.constant';
import { CreateFXQLStatementDto } from './dto/fxql.dto';
import { FXQLStatement } from './entities/fxql_statement.entity';

type ParsedFXQLStatement = {
  sourceCurrency: string;
  destinationCurrency: string;
  buyPrice: number;
  sellPrice: number;
  capAmount: number;
};

@Injectable()
export class FXQLService {
  private readonly logger = new Logger(FXQLService.name);

  constructor(
    @InjectRepository(FXQLStatement)
    private readonly fxqlStatementRepo: Repository<FXQLStatement>,
  ) {}

  async createStatement({
    FXQL,
  }: CreateFXQLStatementDto): Promise<FXQLStatement> {
    const parsedStatement = this.parse(FXQL);

    console.log(parsedStatement);

    const existingStatement = await this.fxqlStatementRepo.findOneBy({
      sourceCurrency: parsedStatement.sourceCurrency,
      destinationCurrency: parsedStatement.destinationCurrency,
    });

    if (existingStatement) {
      return this.fxqlStatementRepo.save({
        ...existingStatement,
        ...parsedStatement,
      });
    }

    return this.fxqlStatementRepo.save(parsedStatement);
  }

  async getStatements(
    pageQuery: PageQueryDto,
  ): Promise<PageDto<FXQLStatement>> {
    const { take, skip } = pageQuery;

    const [result, count] = await this.fxqlStatementRepo.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      take,
      skip,
    });

    return new PageDto(result, count);
  }

  parse(statement: string): ParsedFXQLStatement {
    const match = FXQLStatementRegex.exec(statement);

    if (match && match.groups) {
      const [sourceCurrency, destinationCurrency] =
        match.groups.pair.split('-');

      const parsedData = {
        sourceCurrency,
        destinationCurrency,
        buyPrice: parseFloat(match.groups.buy),
        sellPrice: parseFloat(match.groups.sell),
        capAmount: parseInt(match.groups.cap, 10),
      };

      return parsedData;
    }

    throw new BadRequestException(
      'invalid or malformed request, payload conform to this format: USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}',
    );
  }
}
