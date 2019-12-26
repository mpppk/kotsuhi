import actionCreatorFactory from 'typescript-fsa';

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
  updateDays: indexActionCreatorFactory<UpdateDaysPayload>('UPDATE_DAYS'),
  updateTemplateDetailIndex: indexActionCreatorFactory<number>(
    'UPDATE_TEMPLATE_DETAIL_INDEX'
  ),
  updateTitle: indexActionCreatorFactory<UpdateTitlePayload>('UPDATE_TITLE'),
  updateTitleEditMode: indexActionCreatorFactory<boolean>(
    'UPDATE_TITLE_EDIT_MODE'
  )
};
