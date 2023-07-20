import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class BuildingBill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Building)
  buildingId: Building;

  @ManyToOne(() => User)
  userId: User;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  balance: number;

  @Column({ type: 'float' })
  total: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
