import { Building } from './building.entity';
import { User } from '../../users/entities/User.entity';

export class Apartment {
  id: number;
  building: Building;
  identifier: string;
  floor: number;
  owner: User;
  share: number;
  bills: any[];
  balance: number;
}
