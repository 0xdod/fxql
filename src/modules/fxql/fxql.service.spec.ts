import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
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
            create: jest.fn().mockImplementation((statement) => statement),
            save: jest.fn().mockImplementation((statement) => {
              const statements = Array.isArray(statement)
                ? statement
                : [statement];

              statements.map((statement) => {
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
              });

              return Array.isArray(statement) ? statements : statements[0];
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
      const testCases: {
        input: { FXQL: string };
        output: {
          sourceCurrency: string;
          destinationCurrency: string;
          buyPrice: number;
          sellPrice: number;
          capAmount: number;
        }[];
      }[] = [
        {
          input: { FXQL: 'USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}' },
          output: [
            {
              sourceCurrency: 'USD',
              destinationCurrency: 'GBP',
              buyPrice: 100,
              sellPrice: 200,
              capAmount: 93800,
            },
          ],
        },
        {
          input: { FXQL: 'USD-GBP {\\n BUY 1\\n SELL 0.04590\\n CAP 0\\n}' },
          output: [
            {
              sourceCurrency: 'USD',
              destinationCurrency: 'GBP',
              buyPrice: 1,
              sellPrice: 0.0459,
              capAmount: 0,
            },
          ],
        },

        {
          input: {
            FXQL: 'USD-GBP {\\n  BUY 0.85\\n  SELL 0.90\\n  CAP 10000\\n}\\n\\nEUR-JPY {\\n  BUY 145.20\\n  SELL 146.50\\n  CAP 50000\\n}\\n\\nNGN-USD {\\n  BUY 0.0022\\n  SELL 0.0023\\n  CAP 2000000\\n}',
          },
          output: [
            {
              sourceCurrency: 'USD',
              destinationCurrency: 'GBP',
              buyPrice: 0.85,
              sellPrice: 0.9,
              capAmount: 10000,
            },
            {
              sourceCurrency: 'EUR',
              destinationCurrency: 'JPY',
              buyPrice: 145.2,
              sellPrice: 146.5,
              capAmount: 50000,
            },
            {
              sourceCurrency: 'NGN',
              destinationCurrency: 'USD',
              buyPrice: 0.0022,
              sellPrice: 0.0023,
              capAmount: 2000000,
            },
          ],
        },
      ];

      for (const tc of testCases) {
        jest.spyOn(fxqlStatementRepo, 'findOneBy').mockResolvedValue(null);

        const results = await service.createStatements(tc.input);

        expect(results).toBeDefined();

        for (const [i, result] of results.entries()) {
          expect(result).toMatchObject(tc.output[i]);
        }
      }
    });

    it('should not create a new FXQL statement', async () => {
      const testCases: {
        input: { FXQL: string };
      }[] = [
        {
          input: {
            FXQL: 'USDT-ALGO {\\n BUY 100.100\\n SELL 200\\n CAP 93800.11\\n}',
          },
        },
        {
          input: {
            FXQL: 'usd-gbp {\\n  BUY 0.85\\n  SELL 0.90\\n  CAP 1000\\n}\\n\\nEUR-JPY {\\n  BUY 145.20\\n  SELL 146.50\\n  CAP 50000\\n}\\n\\nNGN-USD {\\n  BUY 0.0022\\n  SELL 0.0023\\n  CAP 2000000\\n}',
          },
        },
      ];

      expect.assertions(testCases.length);

      for (const tc of testCases) {
        jest.spyOn(fxqlStatementRepo, 'findOneBy').mockResolvedValue(null);

        await expect(service.createStatements(tc.input)).rejects.toThrow(
          BadRequestException,
        );
      }
    });
  });
});
