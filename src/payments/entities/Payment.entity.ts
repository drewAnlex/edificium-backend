import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/User.entity';
import { IndividualBill } from './IndividualBill.entity';
import { PaymentMethod } from '../../payment-method/entities/PaymentMethod.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => IndividualBill, (individualBill) => individualBill.payment)
  IndividualBill: IndividualBill;

  @ManyToOne(() => User)
  UserId: User;

  @Column({ type: 'int' })
  Status: number;

  @Column({ type: 'varchar', length: 32 })
  PayCode: string;

  @Column({ type: 'float' })
  Amount: number;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  @JoinColumn()
  Method: PaymentMethod;
}
