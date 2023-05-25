import { Store } from './types/index'
import { 
  RouterProvider, 
  BrowserRouter, 
  Route,
  createRoutesFromElements,
  createBrowserRouter
} from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux';
import Layout from './future-hopr-lib-components/Layout';

import router, { applicationMap } from './router';

function App() {
  return (
    <Provider
      store={store}
    >
      <RouterProvider
        router={router}
      />
    </Provider>
  );
}

export default App;
