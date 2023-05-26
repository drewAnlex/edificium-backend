import { Apartment } from 'src/buildings/entities/apartment';
import { Building } from 'src/buildings/entities/building';

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  status: number;
}

export class CoOwner extends User {
  apartments: Apartment[];
  penaltys: any[];
  payments: any[];
  idNumber: string;
}
