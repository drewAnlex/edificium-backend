import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PaymentMethod } from './PaymentMethod.entity';
import { Building } from 'src/buildings/entities/building.entity';

@Entity()
export class PaymentMethodList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PaymentMethod)
  MethodId: PaymentMethod;

  @ManyToOne(() => Building)
  BuildingId: Building;

  @Column({ type: 'int' })
  Status: number;
}
