import { Test, TestingModule } from '@nestjs/testing';
import { FXQLController } from './fxql.controller';

describe('FXQLController', () => {
  let controller: FXQLController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FXQLController],
    }).compile();

    controller = module.get<FXQLController>(FXQLController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
