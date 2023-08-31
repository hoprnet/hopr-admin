import { useEffect } from 'react';
import { createBrowserRouter, RouteObject, useSearchParams, Navigate } from 'react-router-dom';
import { environment } from '../config';

// Store
import { useAppDispatch, useAppSelector } from './store';
import { authActions, authActionsAsync } from './store/slices/auth';
import { nodeActions, nodeActionsAsync } from './store/slices/node';

// Sections
import NodeLandingPage from './pages/node/landingPage';
import StakingLandingPage from './pages/staking-hub/landingPage';
import SectionLogs from './pages/node/logs';
import SectionWeb3 from './pages/staking-hub/web3';
import SectionSafe from './pages/staking-hub/safe';
import AliasesPage from './pages/node/aliases';
import InfoPage from './pages/node/info';
import MessagesPage from './pages/node/messages';
import PeersPage from './pages/node/peers';
import TicketsPage from './pages/node/tickets';
import ChannelsPageIncoming from './pages/node/channelsIncoming';
import ChannelsPageOutgoing from './pages/node/channelsOutgoing';
import MetricsPage from './pages/node/metrics';
import SafeStakingPage from './pages/staking-hub/safeStaking';
import ConfigurationPage from './pages/node/configuration';
import WrapperPage from './pages/staking-hub/wrapper';
import StakingScreen from './pages/staking-hub/staking-screen';
import SafeWithdraw from './pages/staking-hub/safeWithdraw';
import NodeAdded from './pages/staking-hub/nodeAdded';
import SafeActions from './pages/staking-hub/actions';
import NoNodeAdded from './pages/staking-hub/noNodeAdded';
import Onboarding from './pages/staking-hub/onboarding';
import Dashboard from './pages/staking-hub/dashboard'

// Layout
import Layout from './future-hopr-lib-components/Layout';
import ConnectWeb3 from './components/ConnectWeb3';
import ConnectNode from './components/ConnectNode';
import ConnectSafe from './components/ConnectSafe';
import NotificationBar from './components/NotificationBar';
import InfoBar from './components/InfoBar';

// Icons
import InfoIcon from '@mui/icons-material/Info';
import LanIcon from '@mui/icons-material/Lan';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SettingsIcon from '@mui/icons-material/Settings';
import TerminalIcon from '@mui/icons-material/Terminal';
import MailIcon from '@mui/icons-material/Mail';
import HubIcon from '@mui/icons-material/Hub';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import ContactPhone from '@mui/icons-material/ContactPhone';
import SavingsIcon from '@mui/icons-material/Savings';
import NodeIcon from '@mui/icons-material/Router';
import NetworkingIcon from '@mui/icons-material/Diversity3';
import DevelopIcon from '@mui/icons-material/Code';
import BarChartIcon from '@mui/icons-material/BarChart';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PaidIcon from '@mui/icons-material/Paid';
import WalletIcon from '@mui/icons-material/Wallet';
import IncomingChannelsIcon from './future-hopr-lib-components/Icons/IncomingChannels';
import OutgoingChannelsIcon from './future-hopr-lib-components/Icons/OutgoingChannels';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import TrainIcon from './future-hopr-lib-components/Icons/TrainIcon';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

export type ApplicationMapType = {
  groupName: string;
  path: string;
  icon: JSX.Element;
  items: {
    name: string;
    path: string;
    icon: JSX.Element;
    element?: JSX.Element;
    loginNeeded?: 'node' | 'web3' | 'safe';
  }[];
}[];

export const applicationMapNode: ApplicationMapType = [
  {
    groupName: 'NODE',
    path: 'node',
    icon: <NodeIcon />,
    items: [
      {
        name: 'INFO',
        path: 'info',
        icon: <InfoIcon />,
        element: <InfoPage />,
        loginNeeded: 'node',
      },
      {
        name: 'LOGS',
        path: 'logs',
        icon: <TerminalIcon />,
        element: <SectionLogs />,
        loginNeeded: 'node',
      },
      {
        name: 'TICKETS',
        path: 'tickets',
        icon: <ConfirmationNumberIcon />,
        element: <TicketsPage />,
        loginNeeded: 'node',
      },
      {
        name: 'METRICS',
        path: 'metrics',
        icon: <BarChartIcon />,
        element: <MetricsPage />,
        loginNeeded: 'node',
      },
      {
        name: 'CONFIGURATION',
        path: 'configuration',
        icon: <SettingsIcon />,
        element: <ConfigurationPage />,
        loginNeeded: 'node',
      },
    ],
  },
  {
    groupName: 'NETWORKING',
    path: 'networking',
    icon: <NetworkingIcon />,
    items: [
      {
        name: 'PEERS',
        path: 'peers',
        icon: <LanIcon />,
        element: <PeersPage />,
        loginNeeded: 'node',
      },
      {
        name: 'ALIASES',
        path: 'aliases',
        icon: <ContactPhone />,
        element: <AliasesPage />,
        loginNeeded: 'node',
      },
      {
        name: 'MESSAGES',
        path: 'messages',
        icon: <MailIcon />,
        element: <MessagesPage />,
        loginNeeded: 'node',
      },
      {
        name: 'INCOMING CHANNELS',
        path: 'channels-INCOMING',
        icon: <IncomingChannelsIcon />,
        element: <ChannelsPageIncoming />,
        loginNeeded: 'node',
      },
      {
        name: 'OUTGOING CHANNELS',
        path: 'channels-OUTGOING',
        icon: <OutgoingChannelsIcon />,
        element: <ChannelsPageOutgoing />,
        loginNeeded: 'node',
      },
    ],
  },
];

export const applicationMapStakingHub: ApplicationMapType = [
  {
    groupName: 'Staking Hub',
    path: 'staking',
    icon: <DevelopIcon />,
    items: [
      {
        name: 'Staking Hub',
        path: 'staking-hub-landing',
        icon: <SavingsIcon />,
        element: <StakingLandingPage />,
      },
      {
        name: 'Onboarding',
        path: 'onboarding',
        icon: <TrainIcon />,
        element: <Onboarding />,
        loginNeeded: 'web3',
      },
      {
        name: 'Dashboard',
        path: 'dashboard',
        icon: <SpaceDashboardIcon />,
        element: <Dashboard />,
        loginNeeded: 'safe',
      },
      {
        name: 'Withdraw',
        path: 'withdraw',
        icon: <WalletIcon />,
        element: <SafeWithdraw />,
        loginNeeded: 'safe',
      },
      {
        name: 'Wrapper',
        path: 'wrapper',
        icon: <PaidIcon />,
        element: <WrapperPage />,
      },
    ],
  },
];

export const applicationMapDevWeb3: ApplicationMapType = [
  {
    groupName: 'Dev Pages',
    path: 'dev-pages',
    icon: <DevelopIcon />,
    items: [
      {
        name: 'Web3 Store',
        path: 'web3',
        icon: <AccountBalanceWalletIcon />,
        element: <SectionWeb3 />,
        loginNeeded: 'web3',
      },
      {
        name: 'Safe Store',
        path: 'safe',
        icon: <LockIcon />,
        element: <SectionSafe />,
        loginNeeded: 'web3',
      },
      {
        name: 'Staking screen',
        path: 'staking-screen',
        icon: <SavingsIcon />,
        element: <StakingScreen />,
        loginNeeded: 'web3',
      },
      {
        name: 'No node added',
        path: 'no-node',
        icon: <SavingsIcon />,
        element: <NoNodeAdded />,
        loginNeeded: 'web3',
      },
      {
        name: 'Node added',
        path: 'node-added',
        icon: <SavingsIcon />,
        element: <NodeAdded />,
        loginNeeded: 'web3',
      },
      {
        name: 'Actions',
        path: 'safe/actions',
        icon: <SwapVertIcon />,
        element: <SafeActions />,
        loginNeeded: 'web3',
      },
      {
        name: 'Safe/Staking',
        path: 'safe/staking',
        icon: <SavingsIcon />,
        element: <SafeStakingPage />,
        loginNeeded: 'web3',
      },
    ],
  },
];

export const applicationMapDev: ApplicationMapType = [
  {
    groupName: 'DEVELOP / Steps',
    path: 'steps',
    icon: <DevelopIcon />,
    items: [],
  },
];

function createApplicationMap() {
  const temp: ApplicationMapType = [];
  if (environment === 'dev' || environment === 'node') applicationMapNode.map((elem) => temp.push(elem));
  if (environment === 'dev' || environment === 'web3') applicationMapStakingHub.map((elem) => temp.push(elem));
  if (environment === 'dev' || environment === 'web3') applicationMapDevWeb3.map((elem) => temp.push(elem));
  if (environment === 'dev') applicationMapDev.map((elem) => temp.push(elem));
  return temp;
}

export const applicationMap: ApplicationMapType = createApplicationMap();

const LayoutEnhanced = () => {
  const dispatch = useAppDispatch();
  const nodeConnected = useAppSelector((store) => store.auth.status.connected);
  const web3Connected = useAppSelector((store) => store.web3.status.connected);
  const safeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const isConnected = useAppSelector((store) => store.web3.status.connected);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const [searchParams] = useSearchParams();
  const apiEndpoint = searchParams.get('apiEndpoint');
  const apiToken = searchParams.get('apiToken');

  useEffect(() => {
    if (!apiEndpoint) return;
    if (loginData.apiEndpoint === apiEndpoint && loginData.apiToken === apiToken) return;
    dispatch(
      authActions.useNodeData({
        apiEndpoint,
        apiToken: apiToken ? apiToken : '',
      }),
    );
    if (!apiToken) return;
    const useNode = async () => {
      try {
        const loginInfo = await dispatch(
          authActionsAsync.loginThunk({
            apiEndpoint,
            apiToken,
          }),
        ).unwrap();
        if (loginInfo) {
          dispatch(
            nodeActionsAsync.getInfoThunk({
              apiToken,
              apiEndpoint,
            }),
          );
          dispatch(
            nodeActionsAsync.getAddressesThunk({
              apiToken,
              apiEndpoint,
            }),
          );
          dispatch(
            nodeActionsAsync.getAliasesThunk({
              apiToken,
              apiEndpoint,
            }),
          );
          dispatch(nodeActions.initializeMessagesWebsocket());
          dispatch(nodeActions.initializeLogsWebsocket());
        }
      } catch (e) {
        // error is handled on redux
      }
    };
    useNode();

    return () => {
      dispatch(nodeActions.closeLogsWebsocket());
      dispatch(nodeActions.closeMessagesWebsocket());
    };
  }, [apiEndpoint, apiToken]);

  return (
    <Layout
      drawer
      webapp
      drawerItems={applicationMap}
      drawerLoginState={{
        node: nodeConnected,
        web3: web3Connected,
        safe: !!safeAddress,
      }}
      className={environment}
      drawerType={environment === 'web3' ? 'blue' : undefined}
      itemsNavbarRight={
        <>
          <NotificationBar />
          {(environment === 'dev' || environment === 'web3') && <ConnectSafe />}
          {(environment === 'dev' || environment === 'web3') && <ConnectWeb3 inTheAppBar />}
          {(environment === 'dev' || environment === 'node') && <ConnectNode />}
        </>
      }
      drawerRight={(isConnected || nodeConnected) && <InfoBar />}
    />
  );
};

var routes = [
  {
    path: '/',
    element: <LayoutEnhanced />,
    children: [] as RouteObject[],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
    children: [] as RouteObject[],
  },
];

applicationMap.map((groups) => {
  groups.items.map((item) => {
    if (environment === 'node') {
      routes[0].children.push({
        path: '/',
        element: <NodeLandingPage />,
      });
    } else if (environment === 'web3' || environment === 'dev') {
      routes[0].children.push({
        path: '/',
        element: <StakingLandingPage />,
      });
    }
    if (item.path && item.element) {
      routes[0].children.push({
        path: groups.path + '/' + item.path,
        element: item.element,
      });
    }
  });
});

const router = createBrowserRouter(routes);

export default router;
