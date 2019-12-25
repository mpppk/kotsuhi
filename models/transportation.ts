export type Line = 'JR' | '複数';

export interface Transportation {
  arrival: string;
  departure: string;
  destination: string;
  fare: number;
  purpose: string;
  line: Line;
}
