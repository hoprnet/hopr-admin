import { RouterProvider } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import router from './router';
import WagmiProvider from './providers/Wagmi';
import Watcher from './providers/Watcher';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={store}>
      <WagmiProvider>
        <Watcher />
        <ToastContainer position="bottom-right" />
        <RouterProvider router={router} />
      </WagmiProvider>
    </Provider>
  );
}

export default App;
