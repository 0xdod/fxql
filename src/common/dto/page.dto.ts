import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PageQueryDto {
  @ApiProperty({ type: Number, required: false, default: 25 })
  @Type(() => Number)
  take = 25;

  @ApiProperty({ type: Number, required: false, default: 1 })
  @Type(() => Number)
  page = 1;

  get skip() {
    return (+this.page - 1) * +this.take;
  }
}

export class PageDto<T> {
  data: T[];
  total: number;

  constructor(data: T[], total: number) {
    this.data = data;
    this.total = total;
  }
}
