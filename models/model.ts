export type Line = 'JR' | '複数';

export interface Transportation {
  arrival: string;
  departure: string;
  destination: string;
  fare: number;
  line: Line;
  purpose: string;
}

export interface TransportationTemplate {
  description: string;
  title: string;
  transportations: Transportation[];
}
