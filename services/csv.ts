import encoding from 'encoding-japanese';
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

export const convertToSJISBlob = (str: string) => {
  const sjisArray = convertToSJIS(str);
  const uint8Array = new Uint8Array(sjisArray as any);
  const type = 'text/csv';
  return new Blob([uint8Array], { type });
};

const convertToSJIS = (str: string) => {
  const unicodeArray = [];
  for (let i = 0; i < str.length; i++) {
    unicodeArray.push(str.charCodeAt(i));
  }
  return encoding.convert(unicodeArray, {
    from: 'UNICODE',
    to: 'SJIS'
  });
};

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

export const countFileNum = (
  templates: TransportationTemplate[],
  dateList: { [k: string]: Date[] }
) => {
  return Math.ceil(countRow(templates, dateList) / 15);
};

const countRow = (
  templates: TransportationTemplate[],
  dateList: { [k: string]: Date[] }
) => {
  return Object.entries(dateList).reduce((cnt, [templateId, dates]) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      return cnt;
    }
    cnt += template.transportations.length * dates.length;
    return cnt;
  }, 0);
};

const genFileName = (csv: Csv): string => {
  const fileName = `立替交通費申請_${csv.employeeId}`;
  if (csv.rows.length === 0) {
    return fileName;
  }
  const startDate = csv.rows[0].date.replace(/\//g, '');
  const endDate = csv.rows[csv.rows.length - 1].date.replace(/\//g, '');
  return startDate === endDate
    ? `${fileName}_${startDate}`
    : `${fileName}_${startDate}_${endDate}`;
};

export const generateCsvStrList = (
  config: CsvConfig,
  templates: TransportationTemplate[],
  dateList: { [k: string]: Date[] }
): [string[], string[]] => {
  const csvList = generateCsvList(config, templates, dateList);
  return [csvList.map(toStringFromCsv), csvList.map(genFileName)];
};

const generateCsvList = (
  config: CsvConfig,
  templates: TransportationTemplate[],
  dateList: { [k: string]: Date[] }
): Csv[] => {
  const rows = generateTable(templates, dateList).sort((a, b) => {
    if (a.date === b.date) {
      return 0;
    }
    return a.date > b.date ? 1 : -1;
  });
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
  datesList: { [k: string]: Date[] }
): CsvRow[] => {
  return templates.reduce((rows, template) => {
    let dates = datesList[template.id];
    if (!dates) {
      dates = [];
    }
    rows.push(...generateRowsFromTemplate(template, dates));
    return rows;
  }, [] as CsvRow[]);
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
