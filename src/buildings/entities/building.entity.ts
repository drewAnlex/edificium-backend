import { BuildingBill } from '../../payments/entities/BuildingBill.entity';
import { User } from '../../users/entities/User.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Apartment } from './apartment.entity';
import { Expense } from 'src/payments/entities/Expense.entity';
import { currencyList } from 'src/currency/entities/currency-list.entity';
import { Fund } from 'src/fund/entities/Fund.entity';

@Entity()
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  uuid: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: true,
    default: 'J-0000000',
  })
  fiscalId: string;

  @ManyToOne(() => currencyList, { nullable: true })
  @JoinColumn({ name: 'baseCurrencyId' })
  baseCurrency: currencyList;

  @ManyToOne(() => currencyList, { nullable: true })
  @JoinColumn({ name: 'auxiliaryCurrencyId' })
  auxiliaryCurrency: currencyList;

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

  @Column({ type: 'varchar', length: 32, nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  logoImg: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  billTitle: string;

  @ManyToMany(() => User, (user) => user.building)
  admins: User[];

  @OneToMany(() => BuildingBill, (buildingBill) => buildingBill.buildingId)
  buildingBills: BuildingBill[];

  @OneToMany(() => Expense, (expense) => expense.building)
  expenses: Expense[];

  @OneToMany(() => Fund, (fund) => fund.building)
  funds: Fund[];

  @OneToMany(() => Apartment, (apartment) => apartment.buildingId)
  apartments: Apartment[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
