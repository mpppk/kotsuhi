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
import { Transportation, TransportationTemplate } from '../models/model';
import { State } from '../reducer';
import { CsvConfig, generateCsvStrList } from '../services/csv';

const useHandlers = (state: GlobalState) => {
  const dispatch = useDispatch();
  return {
    updateDays: (dates: Date[], index: number) => {
      dispatch(indexActionCreators.updateDays({ dates, index }));
    },
    updateTemplateDetailIndex: (index: number) => {
      dispatch(indexActionCreators.updateTemplateDetailIndex(index));
    },
    updateTitle: (title: string) => {
      dispatch(indexActionCreators.updateTitleEditMode(false));
      dispatch(
        indexActionCreators.updateTitle({
          index: state.templateDetailIndex,
          title
        })
      );
    },
    updateTitleEditMode: () => {
      dispatch(indexActionCreators.updateTitleEditMode(true));
    }
  };
};

type GlobalState = ReturnType<typeof useGlobalState>;
const useGlobalState = () => {
  return useSelector((s: State) => ({
    config: {
      code: s.code,
      employeeId: s.employeeId,
      version: s.version
    } as CsvConfig,
    isEditingTitle: s.isEditingTitle,
    selectedDays: s.selectedDays,
    templateDetailIndex: s.templateDetailIndex,
    templates: s.templates
  }));
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

// tslint:disable-next-line variable-name
export const Index: React.FC = () => {
  const classes = useStyles(undefined);
  const state = useGlobalState();
  const handlers = useHandlers(state);

  const exportCsvButtonEl = useRef(null as any | null);
  // const exportCsvButtonEl = useRef(null as typeof Button | null);

  const handleTemplateUpdate = (
    transportation: Transportation,
    transportationIndex: number
  ) => {
    state.templates[state.templateDetailIndex].transportations[
      transportationIndex
    ] = transportation;
  };

  const handleClickTemplate = (_t: TransportationTemplate, index: number) => {
    handlers.updateTemplateDetailIndex(index);
  };

  const genUpdateCalendarHandler = (templateIndex: number) => {
    return (dates: Date[]) => {
      handlers.updateDays(dates, templateIndex);
    };
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
              badgeNums={state.selectedDays.map(d => d.length)}
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
              onUpdateCalendar={genUpdateCalendarHandler(
                state.templateDetailIndex
              )}
              selectedDays={state.selectedDays[state.templateDetailIndex]}
              template={state.templates[state.templateDetailIndex]}
              isEditingTitle={state.isEditingTitle}
              onClickEditTitleButton={handlers.updateTitleEditMode}
              onClickSaveTitleButton={handlers.updateTitle}
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
