import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BuildingBill } from './BuildingBill.entity';
import { Contractor } from './Contractor.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BuildingBill)
  buildingBillId: BuildingBill;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Contractor, (contractor) => contractor.services)
  contractorId: Contractor;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'boolean' })
  isPaid: boolean;
}
