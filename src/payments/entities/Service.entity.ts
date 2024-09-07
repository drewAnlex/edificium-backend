import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BuildingBill } from './BuildingBill.entity';
import { Contractor } from './Contractor.entity';
import { Building } from 'src/buildings/entities/building.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Building, (building) => building.services, {
    onDelete: 'CASCADE',
  })
  building: Building;

  @ManyToOne(() => BuildingBill, (bill) => bill.services, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  buildingBillId: BuildingBill;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Contractor, (contractor) => contractor.services, {
    nullable: true,
  })
  contractorId: Contractor;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'boolean', default: false })
  monthly: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
