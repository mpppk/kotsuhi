import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { indexActionCreators } from '../actions';
import { counterActionCreators } from '../actions/counter';
import TemplateDetail from '../components/TemplateDetail';
import TemplateList from '../components/TemplateList';
import {
  TemplateID,
  Transportation,
  TransportationTemplate
} from '../models/model';
import { State } from '../reducer';
import { CsvConfig, generateCsvStrList } from '../services/csv';

const useHandlers = (state: GlobalState) => {
  const dispatch = useDispatch();
  return {
    addTransportation: (templateId: TemplateID) => {
      dispatch(indexActionCreators.addTransportation(templateId));
    },
    clickEditTransportationButton: (transportation: Transportation) => {
      dispatch(
        indexActionCreators.clickEditTransportationButton(transportation)
      );
    },
    clickSaveTransportationButton: (transportation: Transportation) => {
      dispatch(
        indexActionCreators.clickSaveTransportationButton(transportation)
      );
    },
    deleteTransportation: (transportation: Transportation) => {
      dispatch(indexActionCreators.deleteTransportation(transportation));
    },
    updateDays: (dates: Date[], templateId: TemplateID) => {
      dispatch(indexActionCreators.updateDays({ dates, templateId }));
    },
    updateDetailTemplateId: (templateId: TemplateID) => {
      dispatch(indexActionCreators.updateDetailTemplateId(templateId));
    },
    updateTitle: (title: string) => {
      dispatch(indexActionCreators.updateTitleEditMode(false));
      if (state.selectedTemplate) {
        dispatch(
          indexActionCreators.updateTitle({
            templateId: state.selectedTemplate.id,
            title
          })
        );
      }
    },
    updateTitleEditMode: () => {
      dispatch(indexActionCreators.updateTitleEditMode(true));
    }
  };
};

type GlobalState = ReturnType<typeof useGlobalState>;
const selector = (s: State) => {
  const templateBadgeNums = Object.entries(s.selectedDays).reduce(
    (acc, [templateId, days]) => {
      acc[templateId] = days.length;
      return acc;
    },
    {} as { [k: string]: number }
  );

  let selectedTemplateDays: Date[] = s.selectedTemplateId
    ? s.selectedDays[s.selectedTemplateId]
    : [];
  if (!selectedTemplateDays) {
    selectedTemplateDays = [];
  }

  const editingTransportationId = s.editingTransportation
    ? s.editingTransportation.id
    : null;

  const globalState = {
    config: {
      code: s.code,
      employeeId: s.employeeId,
      version: s.version
    } as CsvConfig,
    editingTransportationId,
    isEditingTitle: s.isEditingTitle,
    selectedDays: s.selectedDays,
    selectedTemplate: null as TransportationTemplate | null,
    selectedTemplateDays,
    templateBadgeNums,
    templates: s.templates
  };

  if (s.selectedTemplateId) {
    const selectedTemplate = globalState.templates.find(
      t => t.id === s.selectedTemplateId
    );
    globalState.selectedTemplate = selectedTemplate ? selectedTemplate : null;
  }

  return globalState;
};
const useGlobalState = () => useSelector(selector);

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    exportCsvButton: {
      float: 'right'
    },
    root: {
      flexGrow: 1,
      margin: 10
    }
  })
);

// tslint:disable-next-line variable-name
export const Index: React.FC = () => {
  const classes = useStyles(undefined);
  const state = useGlobalState();
  const handlers = useHandlers(state);

  const exportCsvButtonEl = useRef(null as any | null);
  // const exportCsvButtonEl = useRef(null as typeof Button | null);

  const handleTemplateUpdate = (transportation: Transportation) => {
    if (!state.selectedTemplate) {
      return;
    }
    handlers.clickSaveTransportationButton(transportation);
  };

  const handleClickTemplate = (template: TransportationTemplate) => {
    handlers.updateDetailTemplateId(template.id);
  };

  const handleUpdateCalendar = (dates: Date[]) => {
    if (state.selectedTemplate) {
      handlers.updateDays(dates, state.selectedTemplate.id);
    }
  };

  const handleClickExportCSVButton = () => {
    const csvStrList = generateCsvStrList(
      state.config,
      state.templates,
      state.selectedDays
    );
    const blob = new Blob([csvStrList[0]], { type: 'text/csv' });
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, 'test.txt');

      // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
      window.navigator.msSaveOrOpenBlob(blob, 'test.txt');
    } else {
      if (exportCsvButtonEl.current !== null) {
        const url = window.URL.createObjectURL(blob);
        // tslint:disable-next-line
        (exportCsvButtonEl.current as any)['href'] = url;
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>
        <Grid container={true} spacing={2} justify={'flex-end'}>
          <Grid item={true} xs={4}>
            <TemplateList
              badgeNums={state.templateBadgeNums}
              onClick={handleClickTemplate}
              templates={state.templates}
            />
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button>Add</Button>
              <Button>Import</Button>
              <Button>Export</Button>
            </ButtonGroup>
          </Grid>
          <Grid item={true} xs={8}>
            <TemplateDetail
              onUpdate={handleTemplateUpdate}
              onUpdateCalendar={handleUpdateCalendar}
              selectedDays={state.selectedTemplateDays}
              template={state.selectedTemplate}
              isEditingTitle={state.isEditingTitle}
              onClickEditTitleButton={handlers.updateTitleEditMode}
              onClickSaveTitleButton={handlers.updateTitle}
              onClickDeleteTransportationButton={handlers.deleteTransportation}
              onClickAddTransportationButton={handlers.addTransportation}
              editingTransportationId={state.editingTransportationId}
              onClickEditTransportationButton={
                handlers.clickEditTransportationButton
              }
            />
          </Grid>
          <Grid item={true} xs={2}>
            <Button
              download={'test.csv'}
              ref={exportCsvButtonEl}
              href={'!#'}
              variant="outlined"
              color="primary"
              className={classes.exportCsvButton}
              onClick={handleClickExportCSVButton}
            >
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

// FIXME
(Index as any).getInitialProps = (props: any) => {
  const { store, isServer } = props.ctx;
  store.dispatch(counterActionCreators.requestAmountChanging({ amount: 1 }));
  return { isServer };
};

export default Index;
