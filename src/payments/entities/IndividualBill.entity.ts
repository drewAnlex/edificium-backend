import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BuildingBill } from './BuildingBill.entity';
import { Apartment } from '../../buildings/entities/apartment.entity';
import { Payment } from './Payment.entity';

@Entity()
export class IndividualBill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  Name: string;

  @Column({ type: 'varchar', length: 128 })
  Description: string;

  @ManyToOne(
    () => BuildingBill,
    (buildingBill) => buildingBill.individualBills,
    {
      onDelete: 'CASCADE',
    },
  )
  buildingBillId: BuildingBill;

  @ManyToOne(() => Apartment, (apartment) => apartment.individualBills, {
    onDelete: 'CASCADE',
  })
  apartmentId: Apartment;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  Total: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  Balance: number;

  @Column({ type: 'boolean' })
  IsPaid: boolean;

  @OneToMany(() => Payment, (payment) => payment.IndividualBill)
  payment: Payment;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
