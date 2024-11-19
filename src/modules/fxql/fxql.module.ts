import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FXQLStatement } from './entities/fxql_statement.entity';
import { FXQLController } from './fxql.controller';
import { FXQLService } from './fxql.service';

@Module({
  imports: [TypeOrmModule.forFeature([FXQLStatement])],
  providers: [FXQLService],
  controllers: [FXQLController],
})
export class FXQLModule {}
