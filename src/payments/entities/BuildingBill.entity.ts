import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from './Product.entity';
import { Service } from './Service.entity';

@Entity()
export class BuildingBill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Building)
  buildingId: Building;

  @ManyToOne(() => User)
  userId: User;

  @OneToMany(() => Product, (product) => product.BuildingBillsID)
  products: Product[];

  @OneToMany(() => Service, (service) => service.buildingBillId)
  services: Service[];

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
