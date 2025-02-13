import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/User.entity';
import { IndividualBill } from './IndividualBill.entity';
import { PaymentMethod } from '../../payment-method/entities/PaymentMethod.entity';
import { PaymentInfo } from './payment-info.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => IndividualBill, (individualBill) => individualBill.payment, {
    onDelete: 'CASCADE',
  })
  IndividualBill: IndividualBill;

  @ManyToOne(() => User, (user) => user.payments, {
    nullable: true,
  })
  UserId: User;

  @Column({ type: 'int', default: 0 })
  Status: number;

  @Column({ type: 'boolean', default: false })
  isRemoved: boolean;

  @Column({ type: 'varchar', length: 32, nullable: true })
  PayCode: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  Amount: number;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments, {
    nullable: true,
  })
  Method: PaymentMethod;

  @OneToMany(() => PaymentInfo, (paymentInfo) => paymentInfo.payment)
  paymentInfos: PaymentInfo[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
