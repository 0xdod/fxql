import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FXQLStatement } from './entities/fxql_statement.entity';
import { FXQLService } from './fxql.service';

describe('FXQLService', () => {
  let service: FXQLService;
  let fxqlStatementRepo: Repository<FXQLStatement>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FXQLService,
        {
          provide: getRepositoryToken(FXQLStatement),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn().mockImplementation((statement) => {
              if (statement.id) {
                return statement;
              }
              const now = new Date();
              return {
                ...statement,
                id: faker.string.uuid(),
                createdAt: now,
                updatedAt: now,
              };
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FXQLService>(FXQLService);
    fxqlStatementRepo = module.get<Repository<FXQLStatement>>(
      getRepositoryToken(FXQLStatement),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new FXQL statement', async () => {
      const statement = 'USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}';

      const expectedParsedStatement = {
        sourceCurrency: 'USD',
        destinationCurrency: 'GBP',
        buyPrice: 100,
        sellPrice: 200,
        capAmount: 93800,
      };

      jest.spyOn(fxqlStatementRepo, 'findOneBy').mockResolvedValue(null);

      const result = await service.createStatement({ FXQL: statement });

      expect(result.buyPrice).toBe(expectedParsedStatement.buyPrice);
      expect(result.sellPrice).toBe(expectedParsedStatement.sellPrice);
      expect(result.capAmount).toBe(expectedParsedStatement.capAmount);
      expect(result.sourceCurrency).toBe(
        expectedParsedStatement.sourceCurrency,
      );
      expect(result.destinationCurrency).toBe(
        expectedParsedStatement.destinationCurrency,
      );
    });
  });
});
