import { BuildingBill } from 'src/payments/entities/BuildingBill.entity';
import { Contractor } from 'src/payments/entities/Contractor.entity';
import { Supplier } from 'src/payments/entities/Supplier.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Apartment } from './apartment.entity';

@Entity()
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  uuid: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  country: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  state: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  zone: string;

  @Column({ type: 'int' })
  nApartments: number;

  @Column({ type: 'int' })
  status: number;

  @OneToMany(() => Supplier, (supplier) => supplier.buildings)
  suppliers: Supplier[];

  @OneToMany(() => Contractor, (contractor) => contractor.buildings)
  contractors: Contractor[];

  @OneToMany(() => User, (user) => user.building)
  admins: User[];

  @OneToMany(() => BuildingBill, (buildingBill) => buildingBill.buildingId)
  buildingBills: BuildingBill[];

  @OneToMany(() => Apartment, (apartment) => apartment.buildingId)
  apartments: Apartment[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
