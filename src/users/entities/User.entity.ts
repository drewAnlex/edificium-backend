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

  @Column({ type: 'varchar', length: 64, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  IdDocument: string;

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpires: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vinculationCode: string;

  @Column({ type: 'timestamp', nullable: true })
  vinculationCodeExpires: Date;

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
