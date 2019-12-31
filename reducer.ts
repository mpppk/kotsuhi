import { reducerWithInitialState } from 'typescript-fsa-reducers';
import uuidv4 from 'uuid/v4';
import { indexActionCreators } from './actions';
import {
  TemplateID,
  Transportation,
  TransportationTemplate
} from './models/model';

const templateId1 = uuidv4();
const templateId2 = uuidv4();

const initialTemplates: TransportationTemplate[] = [
  {
    description: 'test-description',
    id: templateId1,
    title: '東京↔横浜',
    transportations: [
      {
        arrival: '東京',
        departure: '横浜',
        destination: 'どこかビル',
        fare: 525,
        id: uuidv4(),
        line: 'JR',
        purpose: '打ち合わせ',
        templateId: templateId1
      },
      {
        arrival: '横浜',
        departure: '東京',
        destination: '自社',
        fare: 525,
        id: uuidv4(),
        line: 'JR',
        purpose: '帰社',
        templateId: templateId1
      }
    ]
  },
  {
    description: 'test-description',
    id: templateId2,
    title: '新宿↔横浜',
    transportations: [
      {
        arrival: '新宿',
        departure: '横浜',
        destination: 'なにかビル',
        fare: 450,
        id: uuidv4(),
        line: '複数',
        purpose: '打ち合わせ',
        templateId: templateId2
      },
      {
        arrival: '横浜',
        departure: '新宿',
        destination: '自社',
        fare: 525,
        id: uuidv4(),
        line: '複数',
        purpose: '帰社',
        templateId: templateId2
      }
    ]
  }
];

const selectedDays = {} as { [key: string]: Date[] };

export const initialState = {
  code: 'BD01',
  employeeId: 'N00000',
  isEditingTitle: false,
  selectedDays,
  selectedTemplateId: null as string | null,
  templates: initialTemplates,
  version: 'v.1.04'
};

export type State = typeof initialState;

const removeTransportation = (
  templates: TransportationTemplate[],
  transportation: Transportation
) => {
  const template = templates.find(t => t.id === transportation.templateId);
  if (!template) {
    return templates;
  }

  const transportationIndex = template.transportations.findIndex(
    t => t.id === transportation.id
  );
  if (transportationIndex === -1) {
    return templates;
  }

  const newTransportations = [...template.transportations];
  newTransportations.splice(transportationIndex, 1);
  template.transportations = newTransportations;
  return templates;
};

const findTemplateById = (
  templates: TransportationTemplate[],
  id: TemplateID
): TransportationTemplate | null => {
  const template = templates.find(t => t.id === id);
  return template ? template : null;
};

const reducer = reducerWithInitialState(initialState)
  .case(indexActionCreators.deleteTransportation, (state, transportation) => {
    return {
      ...state,
      templates: removeTransportation(state.templates, transportation)
    }; // TODO
  })
  .case(indexActionCreators.updateTitle, (state, payload) => {
    const newTemplates = [...state.templates];
    const template = findTemplateById(newTemplates, payload.templateId);
    if (!template) {
      throw new Error('non exist template id is given: ' + payload.templateId);
    }
    template.title = payload.title;
    return { ...state, templates: newTemplates };
  })
  .case(indexActionCreators.updateTitleEditMode, (state, isEditingTitle) => {
    return { ...state, isEditingTitle };
  })
  .case(
    indexActionCreators.updateDetailTemplateId,
    (state, selectedTemplateId) => {
      return { ...state, selectedTemplateId };
    }
  )
  .case(indexActionCreators.updateDays, (state, payload) => {
    const newSelectedDays = { ...state.selectedDays };
    newSelectedDays[payload.templateId] = payload.dates;
    return { ...state, selectedDays: newSelectedDays };
  });

export default reducer;
