import actionCreatorFactory from 'typescript-fsa';
import {
  TemplateID,
  Transportation,
  TransportationTemplate
} from '../models/model';
import { CsvConfig } from '../services/csv';

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
  clickAddTemplateButton: indexActionCreatorFactory<undefined>(
    'CLICK_ADD_TEMPLATE_BUTTON'
  ),
  clickDeleteTemplateButton: indexActionCreatorFactory<TemplateID>(
    'CLICK_DELETE_TEMPLATE_BUTTON'
  ),
  clickEditTransportationButton: indexActionCreatorFactory<Transportation>(
    'CLICK_EDIT_TRANSPORTATION_BUTTON'
  ),
  clickSaveConfig: indexActionCreatorFactory<CsvConfig>('CLICK_SAVE_CONFIG'),
  clickSaveTransportationButton: indexActionCreatorFactory<Transportation>(
    'CLICK_SAVE_TRANSPORTATION_BUTTON'
  ),
  deleteTransportation: indexActionCreatorFactory<Transportation>(
    'DELETE_TRANSPORTATION'
  ),
  importNewTemplates: indexActionCreatorFactory<TransportationTemplate[]>(
    'IMPORT_NEW_TEMPLATES'
  ),
  importTemplatesFromURL: indexActionCreatorFactory.async<
    string,
    TransportationTemplate[],
    Error
  >('IMPORT_TEMPLATES_FROM_URL'),
  updateConfigEditMode: indexActionCreatorFactory<boolean>(
    'UPDATE_CONFIG_EDIT_MODE'
  ),
  updateDays: indexActionCreatorFactory<UpdateDaysPayload>('UPDATE_DAYS'),
  updateDetailTemplateId: indexActionCreatorFactory<TemplateID>(
    'UPDATE_DETAIL_TEMPLATE_ID'
  ),
  updateEmployeeId: indexActionCreatorFactory<string>('UPDATE_EMPLOYEE_ID'),
  updateError: indexActionCreatorFactory<Error | null>('UPDATE_ERROR'),
  updateTitle: indexActionCreatorFactory<UpdateTitlePayload>('UPDATE_TITLE'),
  updateTitleEditMode: indexActionCreatorFactory<boolean>(
    'UPDATE_TITLE_EDIT_MODE'
  )
};
