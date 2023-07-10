import { Building } from './building.entity';
import { User } from '../../users/entities/User.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Building)
  buildingId: Building;

  @Column({ type: 'varchar', length: 10 })
  identifier: string;

  @Column({ type: 'int' })
  floor: number;

  @ManyToOne(() => User)
  userId: User;

  @Column({ type: 'float' })
  share: number;

  @Column({ type: 'float' })
  balance: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
