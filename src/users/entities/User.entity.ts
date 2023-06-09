import { Apartment } from 'src/buildings/entities/apartment.entity';
import { Role } from './role.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => Role)
  role: Role;

  @Column({ type: 'varchar', length: 32 })
  phone: string;

  @Column({ type: 'int' })
  status: number;
}

export class CoOwner extends User {
  apartments: Apartment[];
  penaltys: any[];
  payments: any[];
  idNumber: string;
}
