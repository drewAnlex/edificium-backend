import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from '../../payments/entities/Payment.entity';
import { PaymentInfo } from 'src/payments/entities/payment-info.entity';
import { PaymentMethodDetails } from './payment-method-details.entity';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  name: string;

  @Column({ type: 'int' })
  status: number;

  @OneToMany(() => Payment, (payment) => payment.Method)
  payments: Payment[];

  @OneToMany(() => PaymentInfo, (paymentInfo) => paymentInfo.methodId)
  paymentInfos: PaymentInfo[];

  @OneToMany(
    () => PaymentMethodDetails,
    (paymentMethodDetails) => paymentMethodDetails.MethodId,
  )
  paymentDetails: PaymentMethodDetails[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
