import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Service } from './Service.entity';
import { Building } from '../../buildings/entities/building.entity';

@Entity()
export class Contractor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 32 })
  email: string;

  @Column({ type: 'varchar', length: 32 })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @OneToMany(() => Service, (service) => service.contractorId)
  services: Service[];

  @ManyToOne(() => Building, (building) => building.contractors, {
    onDelete: 'CASCADE',
  })
  building: Building;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
