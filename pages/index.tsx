import { Badge, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as multiDownload from 'multi-download';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { indexActionCreators } from '../actions';
import { ConfigCard } from '../components/ConfigCard';
import { ConfigCardForm } from '../components/ConfigCardForm';
import { ConfirmToDeleteTemplateDialog } from '../components/ConfirmToDeleteTemplateDialog';
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
import {
  convertToSJISBlob,
  countFileNum,
  CsvConfig,
  generateCsvStrList
} from '../services/csv';
import {
  exportFileName,
  KotsuhiConfig,
  toExportJson
} from '../services/export';

type Handlers = ReturnType<typeof useHandlers>;
const useHandlers = (
  state: GlobalState,
  componentState: ComponentState,
  refs: Refs
) => {
  const dispatch = useDispatch();

  return {
    appLoaded: () => dispatch(indexActionCreators.appLoaded()),

    clickAddTransportationButton: (templateId: TemplateID) => {
      dispatch(indexActionCreators.addTransportation(templateId));
    },

    beforeUnload: (e: any) => {
      e.preventDefault();
      e.returnValue = '未保存のデータがありますが、本当に閉じますか？';
    },

    cancelTransportationEditing: () => {
      dispatch(indexActionCreators.cancelTransportationEditing());
    },

    clickAddTemplateButton: () => {
      dispatch(indexActionCreators.clickAddTemplateButton(undefined));
    },

    clickDeleteImportURL: (url: string) => {
      dispatch(indexActionCreators.clickDeleteImportURL(url));
    },

    deleteTemplate: (template: TransportationTemplate) => {
      componentState.deleteTemplate(template);
    },

    clickEditConfig: () => {
      dispatch(indexActionCreators.clickEditConfig(true));
    },

    clickEditTransportationButton: (transportation: Transportation) => {
      dispatch(
        indexActionCreators.clickEditTransportationButton(transportation)
      );
    },

    clickTemplate: (template: TransportationTemplate) => {
      dispatch(indexActionCreators.clickTemplate(template.id));
    },

    closeConfirmToDeleteTemplateDialog: () => {
      componentState.deleteTemplate(null);
    },

    confirmToDeleteTemplate: (template: TransportationTemplate) => {
      componentState.deleteTemplate(null);
      dispatch(indexActionCreators.confirmToDeleteTemplate(template.id));
    },

    clickDeleteTransportationButton: (transportation: Transportation) => {
      dispatch(
        indexActionCreators.clickDeleteTransportationButton(transportation)
      );
    },

    clickResetCalendarButton: () => {
      dispatch(indexActionCreators.clickResetCalendarButton())
    },

    updateCalendar: (dates: Date[]) => {
      if (state.selectedTemplate) {
        dispatch(
          indexActionCreators.updateCalendar({
            dates,
            templateId: state.selectedTemplate.id
          })
        );
      }
    },

    clickImportTemplatesButton: () => componentState.setOpenDialog(true),

    closeDialog: () => componentState.setOpenDialog(false),

    importTemplates: (kotsuhiConfig: KotsuhiConfig) => {
      componentState.setOpenDialog(false);
      dispatch(indexActionCreators.importNewTemplates(kotsuhiConfig));
    },

    clickExportTemplatesButton: () => {
      const json = toExportJson(state.config, state.templates);
      const blob = new Blob([json], {
        type: 'application/json'
      });
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, exportFileName);

        // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
        window.navigator.msSaveOrOpenBlob(blob, exportFileName);
      } else {
        if (refs.exportTemplatesButtonEl.current !== null) {
          const url = window.URL.createObjectURL(blob);
          // tslint:disable-next-line
          (refs.exportTemplatesButtonEl.current as any)['href'] = url;
        }
      }
    },

    clickExportCSVButton: () => {
      const [csvStrList, fileNames] = generateCsvStrList(
        state.config,
        state.templates,
        state.selectedDays
      );

      // TODO: support IE11 and Vivaldi
      const urls = csvStrList
        .map(convertToSJISBlob)
        .map(b => window.URL.createObjectURL(b));
      multiDownload(urls, {
        rename: ({ index }: { index: number }) => fileNames[index] + '.csv'
      });
    },

    importDialogErrorOccurred: (e: Error) => {
      componentState.setOpenDialog(false);
      dispatch(indexActionCreators.importDialogErrorOccurred(e));
    },

    closeErrorDialog: () => {
      dispatch(indexActionCreators.closeErrorDialog());
    },

    clickImportFromURLButton: (url: string) => {
      componentState.setOpenDialog(false);
      dispatch(indexActionCreators.importTemplatesFromURL.started(url));
    },

    clickSaveConfig: (config: CsvConfig) => {
      dispatch(indexActionCreators.clickSaveConfig(config));
    },

    updateTemplate: (transportation: Transportation) => {
      if (!state.selectedTemplate) {
        return;
      }
      dispatch(
        indexActionCreators.clickSaveTransportationButton(transportation)
      );
    },

    clickSaveTitleButton: (title: string) => {
      if (state.selectedTemplate) {
        dispatch(
          indexActionCreators.clickSaveTitleButton({
            templateId: state.selectedTemplate.id,
            title
          })
        );
      }
    },

    clickEditTitleButton: () => {
      dispatch(indexActionCreators.clickEditTitleButton());
    }
  };
};

type GlobalState = ReturnType<typeof selector>;
const selector = (s: State) => {
  const templateBadgeNums = Object.entries(s.main.selectedDays).reduce(
    (acc, [templateId, days]) => {
      acc[templateId] = days.length;
      return acc;
    },
    {} as { [k: string]: number }
  );

  let selectedTemplateDays: Date[] = s.main.selectedTemplateId
    ? s.main.selectedDays[s.main.selectedTemplateId]
    : [];
  if (!selectedTemplateDays) {
    selectedTemplateDays = [];
  }

  const editingTransportationId = s.main.editingTransportation
    ? s.main.editingTransportation.id
    : null;

  const globalState = {
    config: {
      code: s.main.code,
      employeeId: s.main.employeeId,
      version: s.main.version
    } as CsvConfig,
    confirmToDeleteTemplate: s.main.confirmToDeleteTemplate,
    csvFileNum: countFileNum(s.main.templates, s.main.selectedDays),
    editingTransportationId,
    error: s.main.error,
    focusTitle: s.main.focusTitle,
    importURLHistory: s.main.importURLHistory,
    isEditingConfig: s.main.isEditingConfig,
    isEditingTitle: s.main.isEditingTitle,
    selectedDays: s.main.selectedDays,
    selectedTemplate: null as TransportationTemplate | null,
    selectedTemplateDays,
    templateBadgeNums,
    templates: s.main.templates
  };

  if (s.main.selectedTemplateId) {
    const selectedTemplate = globalState.templates.find(
      t => t.id === s.main.selectedTemplateId
    );
    globalState.selectedTemplate = selectedTemplate ? selectedTemplate : null;
  }

  return globalState;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    exportCsvButton: {
      float: 'right'
    },
    resetCalendarButton: {
      marginRight: theme.spacing(1),
    },
    root: {
      flexGrow: 1,
      margin: 10
    }
  })
);

type ComponentState = ReturnType<typeof useComponentState>;
const useComponentState = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [templateForConfirmToDelete, setTemplateForConfirmToDelete] = useState(
    null as TransportationTemplate | null
  );
  return {
    deleteTemplate: setTemplateForConfirmToDelete,
    openDialog,
    setOpenDialog,
    templateForConfirmToDelete
  };
};

type Refs = ReturnType<typeof useRefs>;
const useRefs = () => {
  return {
    exportTemplatesButtonEl: useRef(null as any | null)
  };
};

const useEffects = (handlers: Handlers) => {
  useEffect(() => {
    window.addEventListener('beforeunload', handlers.beforeUnload);
    handlers.appLoaded();
    return () => {
      window.removeEventListener('beforeunload', handlers.beforeUnload);
    };
  }, []);
};

// tslint:disable-next-line variable-name
export const Index: React.FC = () => {
  const classes = useStyles(undefined);
  const state = useSelector(selector);
  const componentState = useComponentState();
  const refs = useRefs();
  const handlers = useHandlers(state, componentState, refs);
  useEffects(handlers);

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>
        <Grid container={true} spacing={2} justify={'flex-end'}>
          <Grid item={true} xs={4}>
            {state.isEditingConfig ? (
              <ConfigCardForm
                config={state.config}
                onClickSave={handlers.clickSaveConfig}
              />
            ) : (
              <ConfigCard
                config={state.config}
                onClickEdit={handlers.clickEditConfig}
              />
            )}
            <TemplateList
              badgeNums={state.templateBadgeNums}
              onClick={handlers.clickTemplate}
              templates={state.templates}
              onDelete={handlers.deleteTemplate}
              selectedTemplateId={
                state.selectedTemplate ? state.selectedTemplate.id : null
              }
            />
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button onClick={handlers.clickAddTemplateButton}>Add</Button>
              <Button onClick={handlers.clickImportTemplatesButton}>
                Import
              </Button>
              <Button
                download={exportFileName}
                ref={refs.exportTemplatesButtonEl}
                href={'!#'}
                onClick={handlers.clickExportTemplatesButton}
              >
                Export
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item={true} xs={8}>
            {state.selectedTemplate ? (
              <TemplateDetail
                focusTitle={state.focusTitle}
                onCancelTransportationEditing={
                  handlers.cancelTransportationEditing
                }
                onUpdate={handlers.updateTemplate}
                onUpdateCalendar={handlers.updateCalendar}
                selectedDays={state.selectedTemplateDays}
                template={state.selectedTemplate}
                isEditingTitle={state.isEditingTitle}
                onClickEditTitleButton={handlers.clickEditTitleButton}
                onClickSaveTitleButton={handlers.clickSaveTitleButton}
                onClickDeleteTransportationButton={
                  handlers.clickDeleteTransportationButton
                }
                onClickAddTransportationButton={
                  handlers.clickAddTransportationButton
                }
                editingTransportationId={state.editingTransportationId}
                onClickEditTransportationButton={
                  handlers.clickEditTransportationButton
                }
              />
            ) : (
              <EmptyTemplateDetail />
            )}
          </Grid>
          {/*<Grid container={true} alignItems={"flex-end"}>*/}
            <Grid item={true} xs={8} justify={"flex-end"}>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.resetCalendarButton}
                onClick={handlers.clickResetCalendarButton}
                data-cy="export-csv-button"
              >
                Reset Calendar
              </Button>
              <Badge badgeContent={state.csvFileNum} color="secondary">
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.exportCsvButton}
                  onClick={handlers.clickExportCSVButton}
                  data-cy="export-csv-button"
                >
                  Export CSV
                </Button>
              </Badge>
            </Grid>
          {/*</Grid>*/}
        </Grid>
      </div>
      <ImportTemplateDialog
        importURLHistory={state.importURLHistory}
        open={componentState.openDialog}
        onClose={handlers.closeDialog}
        onClickCancelButton={handlers.closeDialog}
        onClickDeleteImportURL={handlers.clickDeleteImportURL}
        onImport={handlers.importTemplates}
        onError={handlers.importDialogErrorOccurred}
        onClickImportFromURLButton={handlers.clickImportFromURLButton}
      />
      <ErrorDialog
        error={state.error}
        onClose={handlers.closeErrorDialog}
        open={!!state.error}
      />
      <ConfirmToDeleteTemplateDialog
        template={componentState.templateForConfirmToDelete}
        onClose={handlers.closeConfirmToDeleteTemplateDialog}
        onConfirm={handlers.confirmToDeleteTemplate}
        open={!!componentState.templateForConfirmToDelete}
      />
    </Container>
  );
};

export default Index;
