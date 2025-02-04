import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from '../../payments/entities/Payment.entity';
import { PaymentInfo } from '../../payments/entities/payment-info.entity';
import { PaymentMethodDetails } from './payment-method-details.entity';
import { PaymentMethodFields } from './payment-method-fields.entity';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'int' })
  status: number;

  @OneToMany(() => Payment, (payment) => payment.Method)
  payments: Payment[];

  @OneToMany(() => PaymentInfo, (paymentInfo) => paymentInfo.methodId)
  paymentInfos: PaymentInfo[];

  @OneToMany(
    () => PaymentMethodFields,
    (paymentMethodField) => paymentMethodField.methodId,
  )
  paymentFields: PaymentMethodFields[];

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
