import { Building } from './building';
import { User } from '../../users/entities/user';

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
