import { Store } from './types/index'
import store from './store'
import Section1 from './sections/selectNode';
import { Provider } from 'react-redux';
import Layout from './future-hopr-lib-components/Layout';

import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';

const drawerItems = [
  {
    groupName: 'Node',
    items: [
      {
        name: 'Connect', 
        icon: <MenuIcon />
      },
      {
        name: 'Info',
        icon:  <MailIcon />
      },
      {
        name: 'Configuration',
        icon:  <MailIcon />
      },
      {
        name: 'CLI',
        icon:  <MailIcon />
      },
    ]
  },
  {
    groupName: 'Networking',
    items: [
      {
        name: 'Ping',
        icon:  <MailIcon />
      },
      {
        name: 'Message',
        icon:  <MailIcon />
      },
      {
        name: 'Channels', 
        icon: <InboxIcon />
      },
      {
        name:  'Aliases',
        icon:  <MailIcon />
      },
    ]
  }
]



function App() {
  return (
    <Provider
      store={store}
    >
      <Layout
        drawer
        drawerItems={drawerItems}
      >
        <Section1/>
      </Layout>

    </Provider>
  );
}

export default App;
