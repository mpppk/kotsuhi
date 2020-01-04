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
import { ConfigCard } from '../components/ConfigCard';
import { ConfigCardForm } from '../components/ConfigCardForm';
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
import { ConfirmToDeleteTemplateDialog } from '../components/ConfirmToDeleteTemplateDialog';

const useHandlers = (
  state: GlobalState,
  componentState: ComponentState,
  refs: Refs
) => {
  const dispatch = useDispatch();

  return {
    addTransportation: (templateId: TemplateID) => {
      dispatch(indexActionCreators.addTransportation(templateId));
    },

    cancelTransportationEditing: () => {
      dispatch(indexActionCreators.cancelTransportationEditing());
    },

    clickAddTemplateButton: () => {
      dispatch(indexActionCreators.clickAddTemplateButton(undefined));
    },

    clickDeleteTemplate: (template: TransportationTemplate) => {
      componentState.setTemplateForConfirmToDelete(template);
    },

    clickEditConfig: () => {
      dispatch(indexActionCreators.updateConfigEditMode(true));
    },

    clickEditTransportationButton: (transportation: Transportation) => {
      dispatch(
        indexActionCreators.clickEditTransportationButton(transportation)
      );
    },

    clickTemplate: (template: TransportationTemplate) => {
      dispatch(indexActionCreators.updateDetailTemplateId(template.id));
    },

    closeConfirmToDeleteTemplateDialog: () => {
     componentState.setTemplateForConfirmToDelete(null); 
    },

    confirmToDeleteTemplate: (template: TransportationTemplate) => {
      componentState.setTemplateForConfirmToDelete(null);
      dispatch(indexActionCreators.confirmToDeleteTemplate(template.id));
    },

    deleteTransportation: (transportation: Transportation) => {
      dispatch(indexActionCreators.deleteTransportation(transportation));
    },

    updateCalendar: (dates: Date[]) => {
      if (state.selectedTemplate) {
        dispatch(
          indexActionCreators.updateDays({
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
        rename: ({ index }: { index: number }) => fileNames[index]
      });
    },

    importDialogError: (e: Error) => {
      componentState.setOpenDialog(false);
      dispatch(indexActionCreators.updateError(e));
    },

    closeErrorDialog: () => {
      dispatch(indexActionCreators.updateError(null));
    },

    clickImportFromURLButton: (url: string) => {
      componentState.setOpenDialog(false);
      dispatch(indexActionCreators.importTemplatesFromURL.started(url));
    },

    clickSaveConfig: (config: CsvConfig) => {
      dispatch(indexActionCreators.clickSaveConfig(config));
    },

    templateUpdate: (transportation: Transportation) => {
      if (!state.selectedTemplate) {
        return;
      }
      dispatch(
        indexActionCreators.clickSaveTransportationButton(transportation)
      );
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

type GlobalState = ReturnType<typeof selector>;
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
    confirmToDeleteTemplate: s.confirmToDeleteTemplate,
    csvFileNum: countFileNum(s.templates, s.selectedDays),
    editingTransportationId,
    error: s.error,
    focusTitle: s.focusTitle,
    isEditingConfig: s.isEditingConfig,
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

type ComponentState = ReturnType<typeof useComponentState>;
const useComponentState = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [templateForConfirmToDelete, setTemplateForConfirmToDelete] = useState(
    null as TransportationTemplate | null
  );
  return {
    openDialog,
    templateForConfirmToDelete,
    setOpenDialog,
    setTemplateForConfirmToDelete
  };
};

type Refs = ReturnType<typeof useRefs>;
const useRefs = () => {
  return {
    exportTemplatesButtonEl: useRef(null as any | null)
  };
};

// tslint:disable-next-line variable-name
export const Index: React.FC = () => {
  const classes = useStyles(undefined);
  const state = useSelector(selector);
  const componentState = useComponentState();
  const refs = useRefs();
  const handlers = useHandlers(state, componentState, refs);

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
                onCancelTransportationEditing={handlers.cancelTransportationEditing}
                onUpdate={handlers.templateUpdate}
                onUpdateCalendar={handlers.updateCalendar}
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
            <Badge badgeContent={state.csvFileNum} color="secondary">
              <Button
                variant="outlined"
                color="primary"
                className={classes.exportCsvButton}
                onClick={handlers.clickExportCSVButton}
              >
                Export CSV
              </Button>
            </Badge>
          </Grid>
        </Grid>
      </div>
      <ImportTemplateDialog
        open={componentState.openDialog}
        onClose={handlers.closeDialog}
        onClickCancelButton={handlers.closeDialog}
        onImport={handlers.importTemplates}
        onError={handlers.importDialogError}
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

// FIXME
(Index as any).getInitialProps = (props: any) => {
  const { store, isServer } = props.ctx;
  store.dispatch(counterActionCreators.requestAmountChanging({ amount: 1 }));
  return { isServer };
};

export default Index;
