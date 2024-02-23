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
import { IndividualBill } from './IndividualBill.entity';

@Entity()
export class BuildingBill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Building, (building) => building.buildingBills, {
    onDelete: 'CASCADE',
  })
  buildingId: Building;

  @ManyToOne(() => User, {
    nullable: true,
  })
  userId: User;

  @Column({ type: 'varchar', length: 64, nullable: true })
  uuid: string;

  @OneToMany(() => Product, (product) => product.BuildingBillsID, {
    cascade: true,
  })
  products: Product[];

  @OneToMany(() => Service, (service) => service.buildingBillId, {
    cascade: true,
  })
  services: Service[];

  @OneToMany(
    () => IndividualBill,
    (individualBill) => individualBill.buildingBillId,
  )
  individualBills: IndividualBill[];

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ type: 'float', default: 0 })
  total: number;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
