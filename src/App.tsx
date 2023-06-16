import { Store } from './types/index';
import {
  RouterProvider,
  BrowserRouter,
  Route,
  createRoutesFromElements,
  createBrowserRouter
} from 'react-router-dom'
import store from './store';
import { Provider } from 'react-redux';
import Layout from './future-hopr-lib-components/Layout';

import router, { applicationMap } from './router';
import WagmiProvider from './providers/Wagmi';

function App() {
  return (
    <Provider store={store}>
      <WagmiProvider>
        <RouterProvider router={router} />
      </WagmiProvider>
    </Provider>
  );
}

export default App;
