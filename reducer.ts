import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { indexActionCreators } from './actions';
import {
  counterActionCreators,
  counterAsyncActionCreators
} from './actions/counter';
import { TransportationTemplate } from './models/model';

const templates: TransportationTemplate[] = [
  {
    description: 'test-description',
    title: '東京↔横浜',
    transportations: [
      {
        arrival: '東京',
        departure: '横浜',
        destination: 'どこかビル',
        fare: 525,
        line: 'JR',
        purpose: '打ち合わせ'
      },
      {
        arrival: '横浜',
        departure: '東京',
        destination: '自社',
        fare: 525,
        line: 'JR',
        purpose: '帰社'
      }
    ]
  },
  {
    description: 'test-description',
    title: '新宿↔横浜',
    transportations: [
      {
        arrival: '新宿',
        departure: '横浜',
        destination: 'なにかビル',
        fare: 450,
        line: '複数',
        purpose: '打ち合わせ'
      },
      {
        arrival: '横浜',
        departure: '新宿',
        destination: '自社',
        fare: 525,
        line: '複数',
        purpose: '帰社'
      }
    ]
  }
];

export const initialState = {
  count: 0,
  templateDetailIndex: 0,
  templates
};

export type State = typeof initialState;

const addCount = (state: State, amount: number) => {
  return { ...state, count: state.count + amount };
};

const reducer = reducerWithInitialState(initialState)
  .case(
    indexActionCreators.updateTemplateDetailIndex,
    (state, templateDetailIndex) => {
      return { ...state, templateDetailIndex };
    }
  )
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
