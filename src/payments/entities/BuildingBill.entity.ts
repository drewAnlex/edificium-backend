import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class BuildingBill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Building)
  buildingId: number;

  @ManyToOne(() => User)
  userId: number;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  balance: number;

  @Column({ type: 'float' })
  total: number;
}
