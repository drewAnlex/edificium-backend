import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Building } from './building.entity';
import { User } from '../../users/entities/User.entity';

@Entity()
export class BuildingAdmins {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Building)
  buildingId: Building;

  @ManyToOne(() => User)
  userId: User;
}
