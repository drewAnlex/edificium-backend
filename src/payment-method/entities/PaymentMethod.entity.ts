import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  name: string;

  @Column({ type: 'int' })
  status: number;
}
