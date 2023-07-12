import { User } from 'src/users/entities/User.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => User, (user) => user.buildingId)
  administatorId: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
