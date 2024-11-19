import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FXQLStatement } from './entities/fxql_statement.entity';
import { FxqlService } from './fxql.service';

@Module({
  imports: [TypeOrmModule.forFeature([FXQLStatement])],
  providers: [FxqlService],
})
export class FxqlModule {}
