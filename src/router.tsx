import { createBrowserRouter, RouteObject, useSearchParams, useLocation } from 'react-router-dom';

// Store
import { useAppDispatch, useAppSelector } from './store';
import { authActions, authActionsAsync } from './store/slices/auth';
import { nodeActions, nodeActionsAsync } from './store/slices/node';

// Sections
import Section1 from './sections/selectNode';
import SectionWeb3 from './sections/web3';
import SectionSafe from './sections/safe';
import AliasesPage from './sections/aliases';
import InfoPage from './sections/info';

// Layout
import Layout from './future-hopr-lib-components/Layout';
import ConnectWeb3 from './components/ConnectWeb3';
import ConnectNode from './components/ConnectNode';

// Icons
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';

// Types
import { Store } from './types/index';
import { useEffect } from 'react';

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
        element: <InfoPage />,
        loginNeeded: 'node',
      },
      {
        name: 'Configuration',
        path: 'configuration',
        icon: <MailIcon />,
        loginNeeded: 'node',
      },
      {
        name: 'CLI',
        path: 'cli',
        icon: <MailIcon />,
        loginNeeded: 'node',
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
        loginNeeded: 'node',
      },
      {
        name: 'Message',
        path: 'message',
        icon: <MailIcon />,
        loginNeeded: 'node',
      },
      {
        name: 'Channels',
        path: 'channels',
        icon: <InboxIcon />,
        loginNeeded: 'node',
      },
      {
        name: 'Aliases',
        path: 'aliases',
        icon: <MailIcon />,
        element: <AliasesPage />,
        loginNeeded: 'node',
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
        loginNeeded: 'web3',
      },
      {
        name: 'Safe',
        path: 'safe',
        icon: <MailIcon />,
        element: <SectionSafe />,
        loginNeeded: 'web3',
      }
    ],
  },
];

const LayoutEnhanced = () => {
  const dispatch = useAppDispatch();
  const nodeConnected = useAppSelector((store: Store) => store.auth.status.connected);
  const [searchParams, setSearchParams] = useSearchParams();
  const apiEndpoint = searchParams.get('apiEndpoint');
  const apiToken = searchParams.get('apiToken');

  useEffect(()=>{
    if(!(apiEndpoint && apiToken)) return;
    dispatch(authActions.useNodeData({ apiEndpoint, apiToken, localName: '' }));
    dispatch(authActionsAsync.loginThunk({ apiEndpoint, apiToken }));
    dispatch(nodeActionsAsync.getInfoThunk({ apiToken, apiEndpoint }));
    dispatch(nodeActionsAsync.getAddressesThunk({ apiToken, apiEndpoint }));
  }, [apiEndpoint, apiToken])

  return (
    <Layout
      drawer
      webapp
      drawerItems={applicationMap}
      drawerLoginState={{
        node: nodeConnected,
        web3: true,
      }}
      itemsNavbarRight={
        <>
          <ConnectWeb3 />
          <ConnectNode />
        </>
      }
    />
  )
}

var routes = [
  {
    path: '/',
    element: <LayoutEnhanced />,
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
export type ApplicationMapType = typeof applicationMap;
