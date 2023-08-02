import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  Name: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
