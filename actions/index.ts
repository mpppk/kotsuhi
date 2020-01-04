import actionCreatorFactory from 'typescript-fsa';
import { TemplateID, Transportation } from '../models/model';
import { CsvConfig } from '../services/csv';
import { KotsuhiConfig } from '../services/export';

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
  appLoaded: indexActionCreatorFactory('APP_LOADED'),
  addTransportation: indexActionCreatorFactory<TemplateID>(
    'ADD_TRANSPORTATION'
  ),
  cancelTransportationEditing: indexActionCreatorFactory(
    'CANCEL_TRANSPORTATION_EDITING'
  ),
  clickAddTemplateButton: indexActionCreatorFactory<undefined>(
    'CLICK_ADD_TEMPLATE_BUTTON'
  ),
  clickDeleteImportURL: indexActionCreatorFactory<string>(
    'CLICK_DELETE_IMPORT_URL'
  ),
  clickEditTransportationButton: indexActionCreatorFactory<Transportation>(
    'CLICK_EDIT_TRANSPORTATION_BUTTON'
  ),
  clickSaveConfig: indexActionCreatorFactory<CsvConfig>('CLICK_SAVE_CONFIG'),
  clickSaveTransportationButton: indexActionCreatorFactory<Transportation>(
    'CLICK_SAVE_TRANSPORTATION_BUTTON'
  ),
  confirmToDeleteTemplate: indexActionCreatorFactory<TemplateID>(
    'CONFIRM_TO_DELETE_TEMPLATE'
  ),
  clickDeleteTransportationButton: indexActionCreatorFactory<Transportation>(
    'CLICK_DELETE_TRANSPORTATION_BUTTON'
  ),
  closeErrorDialog: indexActionCreatorFactory('CLOSE_ERROR_DIALOG'),
  importDialogErrorOccurred: indexActionCreatorFactory<Error>('IMPORT_DIALOG_ERROR_OCCURRED'),
  importNewTemplates: indexActionCreatorFactory<KotsuhiConfig>(
    'IMPORT_NEW_TEMPLATES'
  ),
  importTemplatesFromURL: indexActionCreatorFactory.async<
    string,
    KotsuhiConfig,
    Error
  >('IMPORT_TEMPLATES_FROM_URL'),
  clickEditConfig: indexActionCreatorFactory<boolean>(
    'CLICK_EDIT_CONFIG'
  ),
  updateCalendar: indexActionCreatorFactory<UpdateDaysPayload>('UPDATE_CALENDAR'),
  clickTemplate: indexActionCreatorFactory<TemplateID>(
    'CLICK_TEMPLATE'
  ),
  clickSaveTitleButton: indexActionCreatorFactory<UpdateTitlePayload>('CLICK_SAVE_TITLE_BUTTON'),
  clickEditTitleButton: indexActionCreatorFactory( 'CLICK_EDIT_TITLE_BUTTON')
};
