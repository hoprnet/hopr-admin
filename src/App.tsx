import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import WagmiProvider from './providers/Wagmi';
import Watcher from './providers/Watcher';
import router from './router';
import store from './store';
import { ToastContainer } from 'react-toastify';
import theme from './theme';

function App() {
  return (
    <Provider store={store}>
      <WagmiProvider>
        <ThemeProvider theme={theme}>
          <Watcher />
          <ToastContainer
            position="bottom-right"
            limit={10}
          />
          <RouterProvider router={router} />
        </ThemeProvider>
      </WagmiProvider>
    </Provider>
  );
}

export default App;
