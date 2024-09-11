import { Building } from './building.entity';
import { User } from '../../users/entities/User.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IndividualBill } from '../../payments/entities/IndividualBill.entity';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  uuid: string;

  @ManyToOne(() => Building, (building) => building.id)
  buildingId: Building;

  @Column({ type: 'varchar', length: 10 })
  identifier: string;

  @Column({ type: 'int' })
  floor: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  userId: User;

  @OneToMany(
    () => IndividualBill,
    (individualBill) => individualBill.apartmentId,
  )
  individualBills: IndividualBill[];

  @Column({ type: 'decimal', precision: 16, scale: 14 })
  share: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  balance: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
