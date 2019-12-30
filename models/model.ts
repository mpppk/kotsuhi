export type Line = 'JR' | '複数';
export type TemplateID = string;
export type TransportationID = string;

export interface Transportation {
  id: TransportationID;
  templateId: TemplateID;
  arrival: string;
  departure: string;
  destination: string;
  fare: number;
  line: Line;
  purpose: string;
}

export interface TransportationTemplate {
  id: TemplateID;
  description: string;
  title: string;
  transportations: Transportation[];
}
