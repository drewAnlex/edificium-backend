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

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.paymentInfos,
    {
      nullable: true,
    },
  )
  methodId: PaymentMethod;

  @ManyToOne(() => Payment, (payment) => payment.paymentInfos, {
    onDelete: 'CASCADE',
  })
  payment: Payment;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 128 })
  value: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
