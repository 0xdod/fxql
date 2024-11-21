import { Column, Entity, Unique } from 'typeorm';
import { Base } from '../../../common/entities/base.entity';

@Entity({ name: 'fxql_statements' })
@Unique(['sourceCurrency', 'destinationCurrency'])
export class FXQLStatement extends Base {
  @Column({ type: 'varchar', length: 3 })
  sourceCurrency: string;

  @Column({ type: 'varchar', length: 3 })
  destinationCurrency: string;

  @Column('decimal', {
    precision: 19,
    scale: 8,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  sellPrice: number;

  @Column('decimal', {
    precision: 19,
    scale: 8,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  buyPrice: number;

  @Column('int')
  capAmount: number;
}
