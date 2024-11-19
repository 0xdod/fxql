import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { FXQLStatementRegex } from '../constants/fxql-regex.constant';

export class CreateFXQLStatementDto {
  @IsString()
  @IsNotEmpty()
  @Matches(FXQLStatementRegex)
  @ApiProperty({ example: 'USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}' })
  FXQL: string;
}
