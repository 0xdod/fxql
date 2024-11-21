import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageDto, PageQueryDto } from '../../common/dto/page.dto';
import {
  FXQLStatementRegex,
  MaxCurrencyPairRequests,
  SampleFXQLStatement,
} from './constants/fxql.constant';
import { CreateFXQLStatementDto } from './dto/fxql.dto';
import { FXQLStatement } from './entities/fxql_statement.entity';

type ParsedFXQLStatement = {
  sourceCurrency: string;
  destinationCurrency: string;
  buyPrice: number;
  sellPrice: number;
  capAmount: number;
};

type CurrencyPair = `${string}-${string}`;

@Injectable()
export class FXQLService {
  private readonly logger = new Logger(FXQLService.name);

  constructor(
    @InjectRepository(FXQLStatement)
    private readonly fxqlStatementRepo: Repository<FXQLStatement>,
  ) {}

  async createStatements({
    FXQL,
  }: CreateFXQLStatementDto): Promise<FXQLStatement[]> {
    const parsedStatments = this.parse(FXQL);

    const fxqlStatements = [];

    for (const parsedStatement of Object.values(parsedStatments)) {
      const existingStatement = await this.fxqlStatementRepo.findOneBy({
        sourceCurrency: parsedStatement.sourceCurrency,
        destinationCurrency: parsedStatement.destinationCurrency,
      });

      fxqlStatements.push(
        this.fxqlStatementRepo.create({
          ...(existingStatement ?? {}),
          ...parsedStatement,
        }),
      );
    }

    return this.fxqlStatementRepo.save(fxqlStatements);
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

  parse(statement: string): Record<CurrencyPair, ParsedFXQLStatement> {
    let match: RegExpExecArray | null;
    const results = [];

    const currencyPairTokens = statement.split(/[A-Z]{3}-[A-Z]{3}/g).length - 1;

    if (currencyPairTokens > MaxCurrencyPairRequests) {
      throw new BadRequestException('Maximum of 1000 currency pairs allowed');
    }

    const buyTokens = statement.split(/BUY/g).length - 1;
    const sellTokens = statement.split(/SELL/g).length - 1;
    const capTokens = statement.split(/CAP/g).length - 1;

    while ((match = FXQLStatementRegex.exec(statement)) !== null) {
      const [sourceCurrency, destinationCurrency] =
        match.groups.pair.split('-');

      const parsedData = {
        sourceCurrency,
        destinationCurrency,
        buyPrice: parseFloat(match.groups.buy),
        sellPrice: parseFloat(match.groups.sell),
        capAmount: parseInt(match.groups.cap, 10),
      };

      results.push(parsedData);
    }

    const isValidStatement =
      currencyPairTokens === buyTokens &&
      currencyPairTokens === sellTokens &&
      currencyPairTokens === capTokens;

    if (results.length === 0 || !isValidStatement) {
      throw new BadRequestException(
        `invalid FXQL statement. Expected format: ${SampleFXQLStatement}`,
      );
    }

    const parsedStatments: {
      CurrencyPair?: ParsedFXQLStatement;
    } = results.reduce((acc, statement) => {
      const currencyPair: CurrencyPair = `${statement.sourceCurrency}-${statement.destinationCurrency}`;
      acc[currencyPair] = statement;
      return acc;
    }, {});

    return parsedStatments;
  }
}
