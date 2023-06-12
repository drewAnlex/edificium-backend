import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BuildingBill } from './BuildingBill.entity';
import { Apartment } from '../../buildings/entities/Apartment.entity';

@Entity()
export class IndividualBill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  Name: string;

  @Column({ type: 'varchar', length: 128 })
  Description: string;

  @ManyToOne(() => BuildingBill)
  buildingBillId: BuildingBill;

  @ManyToOne(() => Apartment)
  apartmentId: Apartment;

  @Column({ type: 'float' })
  Total: number;

  @Column({ type: 'float' })
  Balance: number;

  @Column({ type: 'boolean' })
  IsPaid: boolean;
}
