import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod } from '../../payment-method/entities/PaymentMethod.entity';
import { Payment } from './Payment.entity';

@Entity()
export class PaymentInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.paymentInfos)
  methodId: PaymentMethod;

  @ManyToOne(() => Payment, (payment) => payment.paymentInfos)
  payment: Payment;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 32 })
  value: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
