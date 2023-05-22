import { Store } from './types/index'
import store from './store'
import Section1 from './sections/selectNode';
import { Provider } from 'react-redux';
import Layout from './future-hopr-lib-components/Layout';

function App() {
  return (
    <Provider
      store={store}
    >
      <Layout>
        <Section1/>
      </Layout>

    </Provider>
  );
}

export default App;
