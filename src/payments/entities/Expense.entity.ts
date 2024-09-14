import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { BuildingBill } from './BuildingBill.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => BuildingBill, (buildingBill) => buildingBill.expenses, {
    onDelete: 'CASCADE',
  })
  buildingBill: BuildingBill;

  @ManyToOne(() => Building, (building) => building.expenses, {
    onDelete: 'CASCADE',
  })
  building: Building;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
