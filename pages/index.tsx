import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { indexActionCreators } from '../actions';
import { counterActionCreators } from '../actions/counter';
import TemplateDetail from '../components/TemplateDetail';
import TemplateList from '../components/TemplateList';
import { Transportation, TransportationTemplate } from '../models/model';
import { State } from '../reducer';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    updateDays: (dates: Date[], index: number) => {
      dispatch(indexActionCreators.updateDays({ dates, index }));
    },
    updateTemplateDetailIndex: (index: number) => {
      dispatch(indexActionCreators.updateTemplateDetailIndex(index));
    }
  };
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
  const handlers = useHandlers();
  const classes = useStyles(undefined);
  const state = useSelector((s: State) => ({
    selectedDays: s.selectedDays,
    templateDetailIndex: s.templateDetailIndex,
    templates: s.templates
  }));

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
            />
          </Grid>
          <Grid item={true} xs={2}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.exportCsvButton}
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
