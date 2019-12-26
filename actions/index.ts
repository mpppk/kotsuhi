import actionCreatorFactory from 'typescript-fsa';

const indexActionCreatorFactory = actionCreatorFactory('INDEX');

export const indexActionCreators = {
  updateTemplateDetailIndex: indexActionCreatorFactory<number>(
    'UPDATE_TEMPLATE_DETAIL_INDEX'
  )
};
