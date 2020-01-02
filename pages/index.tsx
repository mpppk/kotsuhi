import { Badge, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as multiDownload from 'multi-download';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { indexActionCreators } from '../actions';
import { counterActionCreators } from '../actions/counter';
import { EmptyTemplateDetail } from '../components/EmptyTemplateDetail';
import { ErrorDialog } from '../components/ErrorDialog';
import { ImportTemplateDialog } from '../components/ImportTemplateDialog';
import TemplateDetail from '../components/TemplateDetail';
import TemplateList from '../components/TemplateList';
import {
  TemplateID,
  Transportation,
  TransportationTemplate
} from '../models/model';
import { State } from '../reducer';
import { countFileNum, CsvConfig, generateCsvStrList } from '../services/csv';

const useHandlers = (state: GlobalState) => {
  const dispatch = useDispatch();
  return {
    addTransportation: (templateId: TemplateID) => {
      dispatch(indexActionCreators.addTransportation(templateId));
    },
    clickAddTemplateButton: () => {
      dispatch(indexActionCreators.clickAddTemplateButton(undefined));
    },
    clickDeleteTemplate: (template: TransportationTemplate) => {
      dispatch(indexActionCreators.clickDeleteTemplateButton(template.id));
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
    importNewTemplates: (templates: TransportationTemplate[]) => {
      dispatch(indexActionCreators.importNewTemplates(templates));
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
    focusTitle: s.focusTitle,
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

  const exportTemplatesButtonEl = useRef(null as any | null); // FIXME

  const [openDialog, setOpenDialog] = useState(false);
  const [currentOccurredError, setCurrentOccurredError] = useState(
    null as Error | null
  );

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

  const handleClickImportTemplatesButton = () => setOpenDialog(true);

  const handleCloseDialog = () => setOpenDialog(false);

  const handleImportTemplates = (templates: TransportationTemplate[]) => {
    setOpenDialog(false);
    handlers.importNewTemplates(templates);
  };

  const handleClickExportTemplatesButton = () => {
    const blob = new Blob([JSON.stringify(state.templates, null, 2)], {
      type: 'application/json'
    });
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, 'kotsuhi_templates.json');

      // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
      window.navigator.msSaveOrOpenBlob(blob, 'kotsuhi_templates.json');
    } else {
      if (exportTemplatesButtonEl.current !== null) {
        const url = window.URL.createObjectURL(blob);
        // tslint:disable-next-line
        (exportTemplatesButtonEl.current as any)['href'] = url;
      }
    }
  };

  const handleClickExportCSVButton = () => {
    const [csvStrList, fileNames] = generateCsvStrList(
      state.config,
      state.templates,
      state.selectedDays
    );

    // TODO: support IE11 and Vivaldi
    const urls = csvStrList
      .map(s => new Blob([s], { type: 'text/csv' }))
      .map(b => window.URL.createObjectURL(b));
    multiDownload(urls, {
      rename: ({ index }: { index: number }) => fileNames[index]
    });
  };

  const handleImportDialogError = (e: Error) => {
    setOpenDialog(false);
    setCurrentOccurredError(e);
  };

  const handleCloseErrorDialog = () => {
    setCurrentOccurredError(null);
  };

  const csvFileNum = countFileNum(state.templates, state.selectedDays);

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>
        <Grid container={true} spacing={2} justify={'flex-end'}>
          <Grid item={true} xs={4}>
            <TemplateList
              badgeNums={state.templateBadgeNums}
              onClick={handleClickTemplate}
              templates={state.templates}
              onDelete={handlers.clickDeleteTemplate}
              selectedTemplateId={
                state.selectedTemplate ? state.selectedTemplate.id : null
              }
            />
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button onClick={handlers.clickAddTemplateButton}>Add</Button>
              <Button onClick={handleClickImportTemplatesButton}>Import</Button>
              <Button
                download={'kotsuhi_templates.json'}
                ref={exportTemplatesButtonEl}
                href={'!#'}
                onClick={handleClickExportTemplatesButton}
              >
                Export
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item={true} xs={8}>
            {state.selectedTemplate ? (
              <TemplateDetail
                focusTitle={state.focusTitle}
                onUpdate={handleTemplateUpdate}
                onUpdateCalendar={handleUpdateCalendar}
                selectedDays={state.selectedTemplateDays}
                template={state.selectedTemplate}
                isEditingTitle={state.isEditingTitle}
                onClickEditTitleButton={handlers.updateTitleEditMode}
                onClickSaveTitleButton={handlers.updateTitle}
                onClickDeleteTransportationButton={
                  handlers.deleteTransportation
                }
                onClickAddTransportationButton={handlers.addTransportation}
                editingTransportationId={state.editingTransportationId}
                onClickEditTransportationButton={
                  handlers.clickEditTransportationButton
                }
              />
            ) : (
              <EmptyTemplateDetail />
            )}
          </Grid>
          <Grid item={true} xs={2}>
            <Badge badgeContent={csvFileNum} color="secondary">
              <Button
                variant="outlined"
                color="primary"
                className={classes.exportCsvButton}
                onClick={handleClickExportCSVButton}
              >
                Export CSV
              </Button>
            </Badge>
          </Grid>
        </Grid>
      </div>
      <ImportTemplateDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onClickCancelButton={handleCloseDialog}
        onImport={handleImportTemplates}
        onError={handleImportDialogError}
      />
      <ErrorDialog
        error={currentOccurredError}
        onClose={handleCloseErrorDialog}
        open={!!currentOccurredError}
      />
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
