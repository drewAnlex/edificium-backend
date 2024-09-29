import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PaymentMethod } from './PaymentMethod.entity';

@Entity()
export class PaymentMethodDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.paymentDetails,
  )
  MethodId: PaymentMethod;

  @Column({ type: 'varchar', length: 32 })
  Name: string;

  @Column({ type: 'varchar', length: 128 })
  description: string;
}
