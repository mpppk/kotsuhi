import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { counterActionCreators } from '../actions/counter';
import TemplateDetail from '../components/TemplateDetail';
import TemplateList from '../components/TemplateList';
import { Transportation, TransportationTemplate } from '../models/model';

// const useHandlers = () => {
//   const dispatch = useDispatch();
//   return {
//     clickAsyncIncrementButton: () => {
//       dispatch(counterActionCreators.clickAsyncIncrementButton(undefined));
//     },
//     clickDecrementButton: () => {
//       dispatch(counterActionCreators.clickDecrementButton(undefined));
//     },
//     clickIncrementButton: () => {
//       dispatch(counterActionCreators.clickIncrementButton(undefined));
//     },
//     empty: () => {} //tslint:disable-line
//   };
// };

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

const transportationTemplates: TransportationTemplate[] = [
  {
    description: 'test-description',
    title: '東京↔横浜',
    transportations: [
      {
        arrival: '東京',
        departure: '横浜',
        destination: 'どこかビル',
        fare: 525,
        line: 'JR',
        purpose: '打ち合わせ'
      },
      {
        arrival: '横浜',
        departure: '東京',
        destination: '自社',
        fare: 525,
        line: 'JR',
        purpose: '帰社'
      }
    ]
  },
  {
    description: 'test-description',
    title: '新宿↔横浜',
    transportations: [
      {
        arrival: '新宿',
        departure: '横浜',
        destination: 'なにかビル',
        fare: 450,
        line: '複数',
        purpose: '打ち合わせ'
      },
      {
        arrival: '横浜',
        departure: '新宿',
        destination: '自社',
        fare: 525,
        line: '複数',
        purpose: '帰社'
      }
    ]
  }
];

let currentIndex = 0;

// tslint:disable-next-line variable-name
export const Index: React.FC = () => {
  // const handlers = useHandlers();
  // const globalState = useSelector((state: State) => ({
  //   count: state.count,
  //   user: state.user
  // }));
  const classes = useStyles(undefined);

  const handleTemplateUpdate = (transportation: Transportation, i: number) => {
    transportationTemplates[0].transportations[i] = transportation;
  };

  const handleClickTemplate = (_t: TransportationTemplate, index: number) => {
    currentIndex = index;
  };

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>
        <Grid container={true} spacing={2} justify={'flex-end'}>
          <Grid item={true} xs={4}>
            <TemplateList
              onClick={handleClickTemplate}
              templates={transportationTemplates}
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
              template={transportationTemplates[currentIndex]}
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
