export type Line =
  | 'ＪＲ'
  | '私鉄'
  | '地下鉄'
  | 'バス'
  | 'モノレール'
  | '定期船'
  | 'タクシー（業務昼間）'
  | 'タクシー(業務深夜)'
  | 'タクシー(交際費)'
  | 'Suica等Card'
  | '複数'
  | '深夜ホテル';
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
