import { Grid } from '@material-ui/core';
import React from 'react';
import { counterActionCreators } from '../actions/counter';
import TemplateDetail from '../components/TemplateDetail';
import TemplateList from '../components/TemplateList';

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

// tslint:disable-next-line variable-name
export const Index: React.FC = () => {
  // const handlers = useHandlers();
  // const globalState = useSelector((state: State) => ({
  //   count: state.count,
  //   user: state.user
  // }));

  return (
    <Grid container={true} spacing={2}>
      <Grid item={true} xs={4}>
        <TemplateList />
      </Grid>
      <Grid item={true} xs={8}>
        <TemplateDetail />
      </Grid>
    </Grid>
  );
};

// FIXME
(Index as any).getInitialProps = (props: any) => {
  const { store, isServer } = props.ctx;
  store.dispatch(counterActionCreators.requestAmountChanging({ amount: 1 }));
  return { isServer };
};

export default Index;
