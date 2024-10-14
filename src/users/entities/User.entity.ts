import { Apartment } from '../../buildings/entities/apartment.entity';
import { Role } from './Role.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { Payment } from '../../payments/entities/Payment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => Role)
  role: Role;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @ManyToMany(() => Building, (building) => building.admins)
  @JoinTable()
  building: Building[];

  @OneToMany(() => Apartment, (apartment) => apartment.userId)
  apartments: Apartment[];

  @OneToMany(() => Payment, (payment) => payment.UserId)
  payments: Payment[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

export class CoOwner extends User {
  apartments: Apartment[];
  penaltys: any[];
  payments: any[];
  idNumber: string;
}
