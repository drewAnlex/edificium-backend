import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
