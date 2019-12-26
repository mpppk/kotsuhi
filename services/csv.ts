import chunk from 'lodash/chunk';
import { Transportation, TransportationTemplate } from '../models/model';

type DayOfWeek = '月' | '火' | '水' | '木' | '金' | '土' | '日';

interface Csv extends CsvConfig {
  fareSum: number;
  rows: CsvRow[];
}

interface CsvRow extends Transportation {
  date: string;
  dayOfWeek: DayOfWeek;
}

export interface CsvConfig {
  employeeId: string;
  version: string;
  code: string;
}

const toArrayFromRow = (row: CsvRow): string[] => {
  return [
    row.date,
    row.dayOfWeek,
    row.departure,
    row.arrival,
    row.line,
    String(row.fare),
    row.destination,
    row.purpose
  ];
};

const toStringFromRow = (row: CsvRow): string =>
  toArrayFromRow(row)
    .map(s => `"${s}"`)
    .join(',');

const generateTableHeader = (
  employeeId: string,
  fareSum: number,
  version: string,
  code: string
): string[] => {
  return [employeeId, String(fareSum), version, '立替交通費', code];
};

const toStringFromCsv = (csv: Csv): string => {
  const header = generateTableHeader(
    csv.employeeId,
    calcFareSum(csv.rows),
    csv.version,
    csv.code
  );
  const rowStrList = csv.rows.map(toStringFromRow);
  return (
    header.map(s => `"${s}"`).join(',') +
    '\r\n' +
    rowStrList.join('\r\n') +
    '\r\n'
  );
};

export const generateCsvStrList = (
  config: CsvConfig,
  templates: TransportationTemplate[],
  dateList: Date[][]
): string[] => {
  return generateCsvList(config, templates, dateList).map(csv =>
    toStringFromCsv(csv)
  );
};

const generateCsvList = (
  config: CsvConfig,
  templates: TransportationTemplate[],
  dateList: Date[][]
): Csv[] => {
  const rows = generateTable(templates, dateList);
  return chunk<CsvRow>(rows, 15).map(
    rowChunks =>
      ({
        ...config,
        rows: rowChunks
      } as Csv)
  );
};

const calcFareSum = (rows: CsvRow[]) =>
  rows.reduce((sum, row) => sum + row.fare, 0);

const generateTable = (
  templates: TransportationTemplate[],
  datesList: Date[][]
): CsvRow[] => {
  if (templates.length !== datesList.length) {
    throw new Error(
      `templates(${templates.length}) and dates(${datesList.length}) have different length.`
    );
  }

  const rows: CsvRow[] = [];
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const dates = datesList[i];
    rows.push(...generateRowsFromTemplate(template, dates));
  }
  return rows;
};

const generateRowsFromTemplate = (
  template: TransportationTemplate,
  dates: Date[]
): CsvRow[] => {
  return template.transportations.flatMap(transportation => {
    return dates.map(date => generateRow(transportation, date));
  });
};

const generateRow = (transportation: Transportation, date: Date): CsvRow => {
  return {
    ...transportation,
    date: formatDate(date),
    dayOfWeek: toDayOfWeek(date)
  };
};

const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}/${month}/${d}`;
};

const toDayOfWeek = (date: Date): DayOfWeek => {
  switch (date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6) {
    case 0:
      return '日';
    case 1:
      return '月';
    case 2:
      return '火';
    case 3:
      return '水';
    case 4:
      return '木';
    case 5:
      return '金';
    case 6:
      return '土';
    default:
      const __: never = date as never;
      return __;
  }
};
