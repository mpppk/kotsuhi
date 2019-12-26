import { TransportationTemplate } from '../../models/model';
import { CsvConfig, generateCsvStrList } from '../../services/csv';

describe('generateCsvStrList', () => {
  it('return valid csv string', async () => {
    const config: CsvConfig = {
      code: 'BD01',
      employeeId: 'N00000',
      version: 'v.1.04'
    };

    const template: TransportationTemplate = {
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
        }
      ]
    };

    const dateList = [[new Date('2020-01-01T00:00:00')]];

    const expectedCsvStr =
      'N00000,100,v.1.04,立替交通費,BD01\r\n' +
      '2020/01/01,水,departure,arrival,JR,100,destination,purpose\r\n';

    const csvStrList = generateCsvStrList(config, [template], dateList);
    expect(csvStrList).toHaveLength(1);
    expect(csvStrList[0]).toBe(expectedCsvStr);
  });
});
