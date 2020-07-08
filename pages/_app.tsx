import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { AppProps } from 'next/app';
import React from 'react';
import {useStore} from "react-redux";
// @ts-ignore
import {PersistGate} from "redux-persist/integration/react" // FIXME
import theme from '../src/theme';
import { wrapper } from '../store';

// tslint:disable-next-line variable-name
const WrappedApp: React.FC<AppProps> = ({Component, pageProps}) => {
  const store = useStore();
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <PersistGate persistor={(store as any).__persistor} loading={<div>Loading</div>}>
        <Component {...pageProps} />
      </PersistGate>
    </ThemeProvider>
  );
}
export default wrapper.withRedux(WrappedApp);