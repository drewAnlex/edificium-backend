import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Transaction } from './Transaction.entity';
import { Building } from 'src/buildings/entities/building.entity';

@Entity()
export class Fund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  name: string;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  balance: number;

  @Column({ type: 'boolean', default: false })
  isRemoved: boolean;

  @ManyToOne(() => Building, (building) => building.id)
  building: Building;

  @OneToMany(() => Transaction, (transaction) => transaction.fund)
  transactions: Transaction[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
