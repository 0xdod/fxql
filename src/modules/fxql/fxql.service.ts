import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FXQLStatement } from './entities/fxql_statement.entity';

@Injectable()
export class FxqlService {
  constructor(
    @InjectRepository(FXQLStatement)
    private readonly fxqlStatementRepo: Repository<FXQLStatement>,
  ) {}
}
