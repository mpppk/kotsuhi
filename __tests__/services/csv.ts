import { TransportationTemplate } from '../../models/model';
import { CsvConfig, generateCsvStrList } from '../../services/csv';

describe('generateCsvStrList', () => {
  it('return valid csv string', async () => {
    const config: CsvConfig = {
      code: 'BD01',
      employeeId: 'N00000',
      version: 'v.1.04'
    };

    const templates: TransportationTemplate[] = [
      {
        description: 'desc',
        title: 'title',
        transportations: [
          {
            arrival: 'arrival',
            departure: 'departure',
            destination: 'destination',
            fare: 100,
            line: 'JR',
            purpose: 'purpose'
          },
          {
            arrival: 'arrival2',
            departure: 'departure2',
            destination: 'destination2',
            fare: 150,
            line: '複数',
            purpose: 'purpose2'
          }
        ]
      },
      {
        description: 'desc2',
        title: 'title2',
        transportations: [
          {
            arrival: 'arrival3',
            departure: 'departure3',
            destination: 'destination3',
            fare: 175,
            line: 'JR',
            purpose: 'purpose3'
          }
        ]
      }
    ];

    const dateList = [
      [new Date('2020-01-01T00:00:00')],
      [new Date('2020-01-02T00:00:00'), new Date('2020-01-03T00:00:00')]
    ];

    const expectedCsvStr =
      '"N00000","600","v.1.04","立替交通費","BD01"\r\n' +
      '"2020/01/01","水","departure","arrival","JR","100","destination","purpose"\r\n' +
      '"2020/01/01","水","departure2","arrival2","複数","150","destination2","purpose2"\r\n' +
      '"2020/01/02","木","departure3","arrival3","JR","175","destination3","purpose3"\r\n' +
      '"2020/01/03","金","departure3","arrival3","JR","175","destination3","purpose3"\r\n';

    const csvStrList = generateCsvStrList(config, templates, dateList);
    expect(csvStrList).toHaveLength(1);
    expect(csvStrList[0]).toBe(expectedCsvStr);
  });
});
