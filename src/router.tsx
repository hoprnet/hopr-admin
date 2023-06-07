import { createBrowserRouter, RouteObject, Outlet } from 'react-router-dom';
import ConnectWeb3 from './components/ConnectWeb3';

//Sections
import Section1 from './sections/selectNode';
import SectionLogs from './sections/logs';
import SectionWeb3 from './sections/web3';
import SectionSafe from './sections/safe';

import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Layout from './future-hopr-lib-components/Layout';
import AliasesPage from './sections/aliases';
import InfoPage from './sections/info';

export const applicationMap = [
  // {
  //   path: '/',
  //   element: <SectionInfo/>,
  //   drawer: false,
  // },
  {
    groupName: 'Node',
    path: 'node',
    items: [
      {
        name: 'Connect',
        path: 'connect',
        icon: <MenuIcon />,
        element: <Section1 />,
      },
      {
        name: 'Logs',
        path: 'logs',
        icon: <MailIcon />,
        element: <SectionLogs />,
      },
      {
        name: 'Info',
        path: 'info',
        icon: <MailIcon />,
        element: <InfoPage />,
      },
      {
        name: 'Configuration',
        path: 'configuration',
        icon: <MailIcon />,
      },
      {
        name: 'CLI',
        path: 'cli',
        icon: <MailIcon />,
      },
    ],
  },
  {
    groupName: 'Networking',
    path: 'networking',
    items: [
      {
        name: 'Ping',
        path: 'ping',
        icon: <MailIcon />,
      },
      {
        name: 'Message',
        path: 'message',
        icon: <MailIcon />,
      },
      {
        name: 'Channels',
        path: 'channels',
        icon: <InboxIcon />,
      },
      {
        name: 'Aliases',
        path: 'aliases',
        icon: <MailIcon />,
        element: <AliasesPage />,
      },
    ],
  },
  {
    groupName: 'DEVELOP',
    path: 'develop',
    items: [
      {
        name: 'Web3',
        path: 'web3',
        icon: <MailIcon />,
        element: <SectionWeb3 />,
      },
      {
        name: 'Safe',
        path: 'safe',
        icon: <MailIcon />,
        element: <SectionSafe />,
      },
      {
        name: 'Channels',
        path: 'channels',
        icon: <InboxIcon />,
      },
      {
        name: 'Aliases',
        path: 'aliases',
        icon: <MailIcon />,
        element: <AliasesPage />,
      },
    ],
  },
];

var routes = [
  {
    path: '/',
    element: (
      <Layout
        drawer
        drawerItems={applicationMap}
        itemsNavbarRight={<ConnectWeb3 />}
      />
    ),
    children: [] as RouteObject[],
  },
];

applicationMap.map((groups) => {
  // if(!groups.items) {
  //   routes[0].children.push({ path: groups.path, element: groups.element});
  // } else {
  groups.items.map((item) => {
    if (item.path && item.element)
      routes[0].children.push({
        path: groups.path + '/' + item.path,
        element: item.element,
      });
  });
  //  }
});

console.log('routes', routes);
const router = createBrowserRouter(routes);

export default router;
