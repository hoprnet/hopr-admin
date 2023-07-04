import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import WagmiProvider from './providers/Wagmi';
import Watcher from './providers/Watcher';

import store from './store';
import router from './router';
import theme from './theme';

function App() {
  return (
    <Provider store={store}>
      <WagmiProvider>
        <ThemeProvider theme={theme}>
          <Watcher />
          <RouterProvider router={router} />
        </ThemeProvider>
      </WagmiProvider>
    </Provider>
  );
}

export default App;
