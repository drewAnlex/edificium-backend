import { Apartment } from 'src/buildings/entities/apartment.entity';

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
