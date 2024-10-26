import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { currencyValuePerDay } from './currency-value-per-day.entity';

@Entity()
export class currencyList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  short: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  simbol: string;

  @OneToMany(() => currencyValuePerDay, (value) => value.currency)
  values: currencyValuePerDay[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
