import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dataSource from './common/config/data_source';
import { parseConfig } from './common/config/validation';
import configureWinston from './common/config/winston';
import { FXQLModule } from './modules/fxql/fxql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: parseConfig,
    }),
    WinstonModule.forRoot(configureWinston()),
    TypeOrmModule.forRoot({ ...dataSource.options, autoLoadEntities: true }),
    FXQLModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
