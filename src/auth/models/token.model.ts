export interface PayloadToken {
  role: string;
  sub: number;
  building?: number;
  apartments?: number[];
}
