import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { BuildingBill } from './BuildingBill.entity';
import { Apartment } from '../../buildings/entities/Apartment.entity';
import { Payment } from './Payment.entity';

@Entity()
export class IndividualBill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  Name: string;

  @Column({ type: 'varchar', length: 128 })
  Description: string;

  @ManyToOne(() => BuildingBill)
  buildingBillId: BuildingBill;

  @ManyToOne(() => Apartment)
  apartmentId: Apartment;

  @Column({ type: 'float' })
  Total: number;

  @Column({ type: 'float' })
  Balance: number;

  @Column({ type: 'boolean' })
  IsPaid: boolean;

  @OneToOne(() => Payment, (payment) => payment.IndividualBill)
  @JoinColumn()
  payment: Payment;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
