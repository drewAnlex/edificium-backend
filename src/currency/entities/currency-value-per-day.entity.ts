import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { currencyList } from './currency-list.entity';

@Entity()
export class currencyValuePerDay {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => currencyList, (currency) => currency.values)
  currency: currencyList;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  value: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
