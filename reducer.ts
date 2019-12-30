import { reducerWithInitialState } from 'typescript-fsa-reducers';
import uuidv4 from 'uuid/v4';
import { indexActionCreators } from './actions';
import {
  counterActionCreators,
  counterAsyncActionCreators
} from './actions/counter';
import { TransportationTemplate } from './models/model';

const templateId1 = uuidv4();
const templateId2 = uuidv4();

const templates: TransportationTemplate[] = [
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

const selectedDays = [[], []] as Date[][];

export const initialState = {
  code: 'BD01',
  count: 0,
  employeeId: 'N00000',
  isEditingTitle: false,
  selectedDays,
  templateDetailIndex: 0,
  templates,
  version: 'v.1.04'
};

export type State = typeof initialState;

const addCount = (state: State, amount: number) => {
  return { ...state, count: state.count + amount };
};

const reducer = reducerWithInitialState(initialState)
  .case(indexActionCreators.deleteTransportation, (state, _transportation) => {
    console.log(_transportation);
    return { ...state }; // TODO
  })
  .case(indexActionCreators.updateTitle, (state, payload) => {
    const newTemplates = [...state.templates];
    newTemplates[payload.index].title = payload.title;
    return { ...state, templates: newTemplates };
  })
  .case(indexActionCreators.updateTitleEditMode, (state, isEditingTitle) => {
    return { ...state, isEditingTitle };
  })
  .case(
    indexActionCreators.updateTemplateDetailIndex,
    (state, templateDetailIndex) => {
      return { ...state, templateDetailIndex };
    }
  )
  .case(indexActionCreators.updateDays, (state, payload) => {
    const newSelectedDays = [...state.selectedDays];
    newSelectedDays.splice(payload.index, 1, payload.dates);
    return { ...state, selectedDays: newSelectedDays };
  })
  .case(counterActionCreators.clickIncrementButton, state => {
    return addCount(state, 1);
  })
  .case(counterActionCreators.clickDecrementButton, state => {
    return addCount(state, -1);
  })
  .case(
    counterAsyncActionCreators.changeAmountWithSleep.done,
    (state, payload) => {
      return addCount(state, payload.result.amount);
    }
  );

export default reducer;
