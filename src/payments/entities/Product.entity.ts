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

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BuildingBill, (bill) => bill.products)
  BuildingBillsID: BuildingBill;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  supplierId: Supplier;

  @Column({ type: 'boolean', default: false })
  IsPaid: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
