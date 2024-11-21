import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  FXQLStatementRegex,
  SampleFXQLStatement,
} from '../constants/fxql.constant';

export class CreateFXQLStatementDto {
  @IsString()
  @IsNotEmpty()
  @Matches(FXQLStatementRegex)
  @ApiProperty({ example: SampleFXQLStatement })
  FXQL: string;
}
