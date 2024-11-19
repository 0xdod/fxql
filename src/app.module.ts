import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dataSource from './config/datasource';
import { FxqlModule } from './fxql/fxql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSource.options),
    FxqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
