import { useEffect } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import WagmiProvider from './providers/wagmi';
import router from './router';
import store from './store';
import { ToastContainer } from 'react-toastify';
import theme from './theme';
import * as Fathom from 'fathom-client';
import { environment } from '../config';
import packageJson from '../package.json';

const VersionComponent = styled.div`
  position: fixed;
  bottom: 4px;
  right: 4px;
  font-size: 10px;
`;

function App() {
  useEffect(() => {
    if (environment === 'node') {
      Fathom.load('MJISRYNH', { url: 'https://cdn-eu.usefathom.com/script.js' });
    }
  }, []);

  return (
    <Provider store={store}>
      <WagmiProvider>
        <ThemeProvider theme={theme}>
          <ToastContainer
            position="bottom-right"
            limit={10}
          />
          <RouterProvider router={router} />
          <VersionComponent>Version: {packageJson.version}</VersionComponent>
        </ThemeProvider>
      </WagmiProvider>
    </Provider>
  );
}

export default App;
