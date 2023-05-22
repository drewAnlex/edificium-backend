export class CreateBuildingDto {
  readonly name: string;
  readonly country: string;
  readonly state: string;
  readonly city: string;
  readonly zone: string;
  readonly nApartments: number;
  readonly status: number;
}
export class UpdateBuildingDto {
  readonly name?: string;
  readonly country?: string;
  readonly state?: string;
  readonly city?: string;
  readonly zone?: string;
  readonly nApartments?: number;
  readonly apartments?: any[];
  readonly administrators?: any[];
  readonly coOwners?: any[];
  readonly bills?: any[];
  readonly news?: any[];
  readonly status?: number;
}
