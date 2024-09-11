import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BuildingBill } from './BuildingBill.entity';
import { Supplier } from './Supplier.entity';
import { Building } from 'src/buildings/entities/building.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Building, (building) => building.products, {
    onDelete: 'CASCADE',
  })
  building: Building;

  @ManyToOne(() => BuildingBill, (bill) => bill.products, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  BuildingBillsID: BuildingBill;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    nullable: true,
  })
  supplierId: Supplier;

  @Column({ type: 'boolean', default: false })
  IsPaid: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
