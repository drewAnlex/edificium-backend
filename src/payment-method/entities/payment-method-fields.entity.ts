import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PaymentMethod } from './PaymentMethod.entity';

@Entity()
export class PaymentMethodFields {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.paymentFields,
  )
  methodId: PaymentMethod;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 128 })
  description: string;

  @Column({ type: 'varchar', length: 16 })
  type: string;
}
