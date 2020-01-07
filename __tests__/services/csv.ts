import { Line, TransportationTemplate } from '../../models/model';
import { CsvConfig, generateCsvStrList } from '../../services/csv';

describe('generateCsvStrList', () => {
  const config: CsvConfig = {
    code: 'BD01',
    employeeId: 'N00000',
    version: 'v.1.04'
  };

  const generateTemplates = (): TransportationTemplate[] => [
    {
      description: 'desc',
      id: 'template-id-1',
      title: 'title',
      transportations: [
        {
          arrival: 'arrival',
          departure: 'departure',
          destination: 'destination',
          fare: 100,
          id: 'transportation-id-1',
          line: 'JR' as Line,
          purpose: 'purpose',
          templateId: 'template-id-1'
        },
        {
          arrival: 'arrival2',
          departure: 'departure2',
          destination: 'destination2',
          fare: 150,
          id: 'transportation-id-2',
          line: '複数',
          purpose: 'purpose2',
          templateId: 'template-id-1'
        }
      ]
    },
    {
      description: 'desc2',
      id: 'template-id-2',
      title: 'title2',
      transportations: [
        {
          arrival: 'arrival3',
          departure: 'departure3',
          destination: 'destination3',
          fare: 175,
          id: 'transportation-id-3',
          line: 'JR' as Line,
          purpose: 'purpose3',
          templateId: 'template-id-2'
        }
      ]
    }
  ];

  it('return valid csv string', async () => {
    const templates = generateTemplates();
    const dateList = {
      'template-id-1': [new Date('2020-01-01T00:00:00')],
      'template-id-2': [
        new Date('2020-01-02T00:00:00'),
        new Date('2020-01-03T00:00:00')
      ]
    };

    const expectedCsvStr =
      '"N00000","600","v.1.04","立替交通費","BD01"\r\n' +
      '"2020/01/01","水","departure","arrival","JR","100","destination","purpose"\r\n' +
      '"2020/01/01","水","departure2","arrival2","複数","150","destination2","purpose2"\r\n' +
      '"2020/01/02","木","departure3","arrival3","JR","175","destination3","purpose3"\r\n' +
      '"2020/01/03","金","departure3","arrival3","JR","175","destination3","purpose3"\r\n';

    const [csvStrList] = generateCsvStrList(config, templates, dateList);
    expect(csvStrList).toHaveLength(1);
    expect(csvStrList[0]).toBe(expectedCsvStr);
  });

  it('divide csv per 15 lines', async () => {
    const dateList = { 'template-id-2': [new Date('2020-01-01T00:00:00')] };
    const templates = [generateTemplates()[1]];
    const transportation = templates[0].transportations[0];
    templates[0].transportations = [];

    for (let i = 0; i < 20; i++) {
      const t = { ...transportation };
      t.fare = i;
      templates[0].transportations.push(t);
    }

    const [csvStrList] = generateCsvStrList(config, templates, dateList);
    expect(csvStrList).toHaveLength(2);

    let expectedCsvStr1 = '"N00000","105","v.1.04","立替交通費","BD01"\r\n';
    for (let i = 0; i < 15; i++) {
      expectedCsvStr1 += `"2020/01/01","水","departure3","arrival3","JR","${i}","destination3","purpose3"\r\n`;
    }

    let expectedCsvStr2 = '"N00000","85","v.1.04","立替交通費","BD01"\r\n';
    for (let i = 15; i < 20; i++) {
      expectedCsvStr2 += `"2020/01/01","水","departure3","arrival3","JR","${i}","destination3","purpose3"\r\n`;
    }

    expect(csvStrList[0]).toBe(expectedCsvStr1);
    expect(csvStrList[1]).toBe(expectedCsvStr2);
  });
});
