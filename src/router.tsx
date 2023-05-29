import { createBrowserRouter, RouteObject, Outlet } from 'react-router-dom';
import Section1 from './sections/selectNode';
import SectionInfo from './sections/info';
import SectionWeb3 from './sections/web3';
import SectionSafe from './sections/safe';

import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Layout from './future-hopr-lib-components/Layout';

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
        name: 'Info',
        path: 'info',
        icon: <MailIcon />,
        element: <h1>Hellllooooo</h1>,
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
      },
    ],
  },
  {
    groupName: 'DEVELOP',
    path: 'networking',
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
      },
    ],
  },
];

var routes = [
  {
    path: '/',
    element: <Layout drawer drawerItems={applicationMap} />,
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
