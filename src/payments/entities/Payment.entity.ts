import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/User.entity';
import { IndividualBill } from './IndividualBill.entity';
import { PaymentMethod } from '../../payment-method/entities/PaymentMethod.entity';
import { PaymentInfo } from './payment-info.entity';

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
  Method: PaymentMethod;

  @OneToMany(() => PaymentInfo, (paymentInfo) => paymentInfo.payment)
  paymentInfos: PaymentInfo[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
