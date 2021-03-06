import { combineReducers } from 'redux';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { v4 as uuidv4 } from 'uuid';
import { indexActionCreators } from './actions';
import {
  Line,
  TemplateID,
  Transportation,
  TransportationTemplate,
} from './models/model';
import {
  addImportHistory,
  deleteImportHistory,
  getImportHistory,
} from './services/importHistory';

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
        line: 'JR' as Line,
        purpose: '打ち合わせ',
        templateId: templateId1,
      },
      {
        arrival: '横浜',
        departure: '東京',
        destination: '自社',
        fare: 525,
        id: uuidv4(),
        line: 'JR' as Line,
        purpose: '帰社',
        templateId: templateId1,
      },
    ],
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
        templateId: templateId2,
      },
      {
        arrival: '横浜',
        departure: '新宿',
        destination: '自社',
        fare: 525,
        id: uuidv4(),
        line: '複数',
        purpose: '帰社',
        templateId: templateId2,
      },
    ],
  },
];

export interface SelectedDays {
  [key: string]: Date[];
}

const selectedDays = {} as SelectedDays;

const initialMainState = {
  code: 'BD01',
  confirmToDeleteTemplate: null as TransportationTemplate | null,
  editingTransportation: null as Transportation | null,
  employeeId: 'N00000',
  error: null as Error | null,
  focusTitle: false,
  importURLHistory: [] as string[],
  isEditingConfig: false,
  isEditingTitle: false,
  selectedDays,
  selectedTemplateId: null as string | null,
  templates: initialTemplates,
  version: 'v.1.04',
};

export const initialState = { main: initialMainState };

export type MainState = typeof initialMainState;
export type State = typeof initialState;

const removeTransportation = (
  templates: TransportationTemplate[],
  transportation: Transportation
) => {
  const template = templates.find((t) => t.id === transportation.templateId);
  if (!template) {
    return templates;
  }

  const transportationIndex = template.transportations.findIndex(
    (t) => t.id === transportation.id
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
  const template = templates.find((t) => t.id === id);
  return template ? template : null;
};

const newEmptyTemplate = (): TransportationTemplate => {
  const id = uuidv4();
  return {
    description: '',
    id,
    title: '',
    transportations: [],
  };
};

const newEmptyTransportation = (templateId: TemplateID): Transportation => ({
  arrival: '',
  departure: '',
  destination: '',
  fare: 0,
  id: uuidv4(),
  line: 'JR' as Line,
  purpose: '',
  templateId,
});

const mainReducer = reducerWithInitialState(initialMainState)
  .case(indexActionCreators.appLoaded, (state) => {
    return {
      ...state,
      importURLHistory: getImportHistory(),
    };
  })
  .case(indexActionCreators.clickDeleteImportURL, (state, url) => {
    return {
      ...state,
      importURLHistory: deleteImportHistory(url),
    };
  })
  .case(indexActionCreators.cancelTransportationEditing, (state) => {
    return {
      ...state,
      editingTransportation: null,
    };
  })
  .case(indexActionCreators.clickSaveConfig, (state, config) => {
    return {
      ...state,
      code: config.code,
      employeeId: config.employeeId,
      isEditingConfig: false,
      version: config.version,
    };
  })
  .case(indexActionCreators.clickEditConfig, (state, isEditingConfig) => {
    return {
      ...state,
      isEditingConfig,
    };
  })
  .case(indexActionCreators.importDialogErrorOccurred, (state, error) => {
    return {
      ...state,
      error,
    };
  })
  .case(indexActionCreators.closeErrorDialog, (state) => {
    return {
      ...state,
      error: null,
    };
  })
  .case(indexActionCreators.importTemplatesFromURL.started, (state, url) => {
    return {
      ...state,
      importURLHistory: addImportHistory(url),
    };
  })
  .case(indexActionCreators.importTemplatesFromURL.failed, (state) => {
    return {
      ...state,
      error: new Error('Template importing from URL is failed'),
      focusTitle: false,
      isEditingTitle: false,
      selectedTemplateId: null,
    };
  })
  .case(indexActionCreators.importTemplatesFromURL.done, (state, payload) => {
    const { config, templates } = payload.result;
    return {
      ...state,
      code: config.code,
      employeeId: config.employeeId,
      focusTitle: false,
      isEditingTitle: false,
      selectedTemplateId: null,
      templates,
      version: config.version,
    };
  })
  .case(
    indexActionCreators.importNewTemplates,
    (state, { config, templates }) => {
      return {
        ...state,
        code: config.code,
        employeeId: config.employeeId,
        focusTitle: false,
        isEditingTitle: false,
        selectedTemplateId: null,
        templates,
        version: config.version,
      };
    }
  )
  .case(indexActionCreators.confirmToDeleteTemplate, (state, templateId) => {
    const selectedTemplateId =
      state.selectedTemplateId === templateId ? null : state.selectedTemplateId;
    const isEditingTitle = selectedTemplateId ? state.isEditingTitle : false;
    const focusTitle = selectedTemplateId ? state.focusTitle : false;
    const newTemplates = state.templates.filter((t) => t.id !== templateId);

    return {
      ...state,
      focusTitle,
      isEditingTitle,
      selectedTemplateId,
      templates: newTemplates,
    };
  })
  .case(indexActionCreators.clickAddTemplateButton, (state) => {
    const newTemplate = newEmptyTemplate();
    return {
      ...state,
      focusTitle: true,
      isEditingTitle: true,
      selectedTemplateId: newTemplate.id,
      templates: [...state.templates, newTemplate],
    };
  })
  .case(
    indexActionCreators.clickEditTransportationButton,
    (state, transportation) => {
      return {
        ...state,
        editingTransportation: transportation,
      };
    }
  )
  .case(indexActionCreators.addTransportation, (state, templateId) => {
    const newTemplates = [...state.templates];
    const template = findTemplateById(newTemplates, templateId);
    if (!template) {
      throw new Error('non exist template id is given: ' + templateId);
    }

    const newTransportations = [...template.transportations];
    const newTransportation = newEmptyTransportation(templateId);
    newTransportations.push(newTransportation);
    template.transportations = newTransportations;
    return {
      ...state,
      editingTransportation: newTransportation,
      templates: newTemplates,
    };
  })
  .case(
    indexActionCreators.clickDeleteTransportationButton,
    (state, transportation) => {
      return {
        ...state,
        templates: removeTransportation(state.templates, transportation),
      }; // TODO
    }
  )
  .case(indexActionCreators.clickSaveTitleButton, (state, payload) => {
    const newTemplates = [...state.templates];
    const template = findTemplateById(newTemplates, payload.templateId);
    if (!template) {
      throw new Error('non exist template id is given: ' + payload.templateId);
    }
    template.title = payload.title;
    return {
      ...state,
      focusTitle: false,
      isEditingTitle: false,
      templates: newTemplates,
    };
  })
  .case(indexActionCreators.clickEditTitleButton, (state) => {
    return { ...state, isEditingTitle: true };
  })
  .case(indexActionCreators.clickTemplate, (state, selectedTemplateId) => {
    return {
      ...state,
      editingTransportation: null,
      selectedTemplateId,
    };
  })
  .case(indexActionCreators.updateCalendar, (state, payload) => {
    const newSelectedDays = { ...state.selectedDays };
    newSelectedDays[payload.templateId] = payload.dates;
    return { ...state, selectedDays: newSelectedDays };
  })
  .case(indexActionCreators.clickResetCalendarButton, (state) => {
    return { ...state, selectedDays: {} };
  })
  .case(
    indexActionCreators.clickSaveTransportationButton,
    (state, transportation) => {
      const newTemplates = [...state.templates];
      const template = findTemplateById(
        newTemplates,
        transportation.templateId
      );
      if (!template) {
        throw new Error(
          'non exist template id is given: ' + transportation.templateId
        );
      }

      const newTransportations = [...template.transportations];
      const index = newTransportations.findIndex(
        (t) => t.id === transportation.id
      );
      if (index === -1) {
        throw new Error(
          'non exist transportation id is given: ' + transportation.id
        );
      }
      newTransportations.splice(index, 1, transportation);
      template.transportations = newTransportations;

      return {
        ...state,
        editingTransportation: null,
        templates: newTemplates,
      };
    }
  );

const reducer = combineReducers({
  main: mainReducer,
});

export default reducer;
