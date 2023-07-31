import { Apartment } from 'src/buildings/entities/apartment.entity';
import { Role } from './role.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Building } from 'src/buildings/entities/building.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => Role)
  role: Role;

  @Column({ type: 'varchar', length: 32 })
  phone: string;

  @Column({ type: 'int' })
  status: number;

  @ManyToOne(() => Building, (building) => building.id, { nullable: true })
  building: Building;

  @OneToMany(() => Apartment, (apartment) => apartment.userId)
  apartments: Apartment[];

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
