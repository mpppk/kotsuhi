import actionCreatorFactory from 'typescript-fsa';
import { TemplateID, Transportation } from '../models/model';

const indexActionCreatorFactory = actionCreatorFactory('INDEX');

export interface UpdateDaysPayload {
  dates: Date[];
  templateId: TemplateID;
}

export interface UpdateTitlePayload {
  title: string;
  templateId: TemplateID;
}

export const indexActionCreators = {
  addTransportation: indexActionCreatorFactory<TemplateID>(
    'ADD_TRANSPORTATION'
  ),
  deleteTransportation: indexActionCreatorFactory<Transportation>(
    'DELETE_TRANSPORTATION'
  ),
  updateDays: indexActionCreatorFactory<UpdateDaysPayload>('UPDATE_DAYS'),
  updateDetailTemplateId: indexActionCreatorFactory<TemplateID>(
    'UPDATE_DETAIL_TEMPLATE_ID'
  ),
  updateEmployeeId: indexActionCreatorFactory<string>('UPDATE_EMPLOYEE_ID'),
  updateTitle: indexActionCreatorFactory<UpdateTitlePayload>('UPDATE_TITLE'),
  updateTitleEditMode: indexActionCreatorFactory<boolean>(
    'UPDATE_TITLE_EDIT_MODE'
  )
};
