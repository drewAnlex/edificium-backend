import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  Name: string;
}
