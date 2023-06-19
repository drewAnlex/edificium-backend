import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BuildingBill } from './BuildingBill.entity';
import { Supplier } from './Supplier.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BuildingBill)
  BuildingBillsID: BuildingBill;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    nullable: true,
  })
  suplierId: Supplier;

  @Column({ type: 'boolean' })
  IsPaid: boolean;
}
