import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Fund } from './Fund.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  name: string;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Fund, (fund) => fund.transactions)
  fund: Fund;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
