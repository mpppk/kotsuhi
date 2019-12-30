import actionCreatorFactory from 'typescript-fsa';
import { Transportation } from '../models/model';

const indexActionCreatorFactory = actionCreatorFactory('INDEX');

export interface UpdateDaysPayload {
  dates: Date[];
  index: number;
}

export interface UpdateTitlePayload {
  title: string;
  index: number;
}

export const indexActionCreators = {
  deleteTransportation: indexActionCreatorFactory<Transportation>(
    'DELETE_TRANSPORTATION'
  ),
  updateDays: indexActionCreatorFactory<UpdateDaysPayload>('UPDATE_DAYS'),
  updateEmployeeId: indexActionCreatorFactory<string>('UPDATE_EMPLOYEE_ID'),
  updateTemplateDetailIndex: indexActionCreatorFactory<number>(
    'UPDATE_TEMPLATE_DETAIL_INDEX'
  ),
  updateTitle: indexActionCreatorFactory<UpdateTitlePayload>('UPDATE_TITLE'),
  updateTitleEditMode: indexActionCreatorFactory<boolean>(
    'UPDATE_TITLE_EDIT_MODE'
  )
};
