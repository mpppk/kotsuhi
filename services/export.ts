import { TransportationTemplate } from '../models/model';
import { CsvConfig } from './csv';

export const exportFileName = 'kotsuhi.json';
export interface KotsuhiConfig {
  config: CsvConfig;
  templates: TransportationTemplate[];
}

export const toExportJson = (
  config: CsvConfig,
  templates: TransportationTemplate[]
) => {
  const kotsuhiConfig: KotsuhiConfig = { config, templates };
  return JSON.stringify(kotsuhiConfig, null, 2);
};
