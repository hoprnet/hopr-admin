import { useEffect } from 'react';
import { createBrowserRouter, RouteObject, useSearchParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { environment } from '../config';
import { useDisconnect } from 'wagmi';

// Store
import { useAppDispatch, useAppSelector } from './store';
import { authActions, authActionsAsync } from './store/slices/auth';
import { nodeActions, nodeActionsAsync } from './store/slices/node';
import { web3Actions } from './store/slices/web3';
import { appActions } from './store/slices/app';
import { safeActions } from './store/slices/safe';

// Sections
import NodeLandingPage from './pages/node/landingPage';
import StakingLandingPage from './pages/staking-hub/landingPage';
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
import ConfigurationPage from './pages/node/configuration';
import WrapperPage from './pages/staking-hub/wrapper';
import StakingScreen from './pages/staking-hub/dashboard/staking';
import SafeWithdraw from './pages/staking-hub/safeWithdraw';
import NodeAdded from './pages/staking-hub/dashboard/node';
import SafeActions from './pages/staking-hub/dashboard/transactions';
import NoNodeAdded from './pages/staking-hub/dashboard/noNodeAdded';
import Onboarding from './pages/staking-hub/onboarding';
import OnboardingNextNode from './pages/staking-hub/onboarding/nextNode';
import Dashboard from './pages/staking-hub/dashboard';
import StakewxHOPR from './pages/staking-hub/stakewxHOPR';
import StakexDAI from './pages/staking-hub/stakexDai';
import SetAllowance from './pages/staking-hub/setAllowance';
import FundNode from './pages/staking-hub/fundNode';
import EditOwners from './pages/staking-hub/editOwners';

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
import MailIcon from '@mui/icons-material/Mail';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import ContactPhone from '@mui/icons-material/ContactPhone';
import SavingsIcon from '@mui/icons-material/Savings';
import NodeIcon from '@mui/icons-material/Router';
import NetworkingIcon from '@mui/icons-material/Diversity3';
import DevelopIcon from '@mui/icons-material/Code';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PaidIcon from '@mui/icons-material/Paid';
import WalletIcon from '@mui/icons-material/Wallet';
import LinkIcon from '@mui/icons-material/Link';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import TelegramIcon from '@mui/icons-material/Telegram';
import IncomingChannelsIcon from './future-hopr-lib-components/Icons/channelsIn';
import OutgoingChannelsIcon from './future-hopr-lib-components/Icons/channelsOut';
import TrainIcon from './future-hopr-lib-components/Icons/TrainIcon';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { stakingHubActions } from './store/slices/stakingHub';
import TermsOfService from './pages/TermsOfService';
import PrivacyNotice from './pages/PrivacyNotice';
import MetaMaskFox from './future-hopr-lib-components/Icons/MetaMaskFox';
import { trackGoal } from 'fathom-client';

export type ApplicationMapType = {
  groupName: string;
  path: string;
  icon: JSX.Element;
  mobileOnly?: boolean | null;
  items: {
    name?: string;
    path: string;
    overwritePath?: string;
    icon?: JSX.Element;
    element?: JSX.Element;
    inDrawer?: boolean | null;
    loginNeeded?: 'node' | 'web3' | 'safe';
    onClick?: () => void;
    mobileOnly?: boolean | null;
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
      // {
      //   name: 'LOGS',
      //   path: 'logs',
      //   icon: <TerminalIcon />,
      //   element: <SectionLogs />,
      //   loginNeeded: 'node',
      // },
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
        name: 'CHANNELS: IN',
        path: 'channels-INCOMING',
        icon: <IncomingChannelsIcon />,
        element: <ChannelsPageIncoming />,
        loginNeeded: 'node',
      },
      {
        name: 'CHANNELS: OUT',
        path: 'channels-OUTGOING',
        icon: <OutgoingChannelsIcon />,
        element: <ChannelsPageOutgoing />,
        loginNeeded: 'node',
      },
    ],
  },
  {
    groupName: 'LINKS',
    path: 'links',
    icon: <LinkIcon />,
    items: [
      {
        name: 'Staking Hub',
        path: 'https://hub.hoprnet.org/',
        icon: <SavingsIcon />,
      },
      {
        name: 'Docs',
        path: 'https://docs.hoprnet.org/',
        icon: <LibraryBooksIcon />,
      },
      {
        name: 'Telegram',
        path: 'https://t.me/hoprnet',
        icon: <TelegramIcon />,
      },
    ],
  },
];

export const applicationMapStakingHub: ApplicationMapType = [
  {
    groupName: 'STAKING HUB',
    path: 'staking',
    icon: <DevelopIcon />,
    items: [
      {
        name: 'Staking Hub',
        path: 'staking-hub-landing',
        overwritePath: '/',
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
        name: 'Onboarding',
        path: 'onboarding/nextNode',
        icon: <TrainIcon />,
        element: <OnboardingNextNode />,
        loginNeeded: 'web3',
        inDrawer: false,
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
        loginNeeded: 'web3',
      },
      {
        path: 'edit-owners',
        element: <EditOwners />,
        loginNeeded: 'safe',
        inDrawer: false,
      },
      {
        path: 'stake-wxHOPR',
        element: <StakewxHOPR />,
        loginNeeded: 'safe',
        inDrawer: false,
      },
      {
        path: 'stake-xDAI',
        element: <StakexDAI />,
        loginNeeded: 'safe',
        inDrawer: false,
      },
      {
        path: 'set-allowance',
        element: <SetAllowance />,
        loginNeeded: 'safe',
        inDrawer: false,
      },
      {
        path: 'fund-node',
        element: <FundNode />,
        loginNeeded: 'safe',
        inDrawer: false,
      },
      {
        path: 'dev',
        element: <SectionSafe />,
        loginNeeded: 'web3',
        inDrawer: false,
      },
    ],
  },
  {
    groupName: 'RESOURCES',
    path: 'networking',
    icon: <DevelopIcon />,
    items: [
      {
        name: 'Docs',
        path: 'https://docs.hoprnet.org/',
        icon: <DescriptionOutlinedIcon />,
        // element: <span/>,
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
  if (environment === 'dev') applicationMapDevWeb3.map((elem) => temp.push(elem));
  if (environment === 'dev') applicationMapDev.map((elem) => temp.push(elem));
  return temp;
}

export const applicationMap: ApplicationMapType = createApplicationMap();

const LayoutEnhanced = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { disconnect } = useDisconnect();
  const nodeConnected = useAppSelector((store) => store.auth.status.connected);
  const web3Connected = useAppSelector((store) => store.web3.status.connected);
  const safeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress);
  const isConnected = useAppSelector((store) => store.web3.status.connected);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const [searchParams] = useSearchParams();
  const apiEndpoint = searchParams.get('apiEndpoint');
  const apiToken = searchParams.get('apiToken');
  const HOPRdNodeAddressForOnboarding = searchParams.get('HOPRdNodeAddressForOnboarding'); //Address given in HOPRd: https://hub.hoprnet.org/staking/onboarding?HOPRdNodeAddressForOnboarding={my_address}

  useEffect(() => {
    if (environment === 'web3') {
      document.title = 'HOPR | Staking Hub';
    } else if (environment === 'node') {
      document.title = 'HOPR | Node Admin';
    }
  }, []);

  useEffect(() => {
    if (!apiEndpoint) return;
    if (loginData.apiEndpoint === apiEndpoint && loginData.apiToken === apiToken) return;
    dispatch(
      authActions.useNodeData({
        apiEndpoint,
        apiToken: apiToken ? apiToken : '',
      })
    );
    if (!apiToken) return;
    const useNode = async () => {
      try {
        const loginInfo = await dispatch(
          authActionsAsync.loginThunk({
            apiEndpoint,
            apiToken,
          })
        ).unwrap();
        if (loginInfo) {
          // We do this after the loginInfo to make sure the login from url was successful
          trackGoal('Y641EPNA', 1) // LOGIN_TO_NODE_BY_URL
          dispatch(
            nodeActionsAsync.getInfoThunk({
              apiToken,
              apiEndpoint,
            })
          );
          dispatch(
            nodeActionsAsync.getAddressesThunk({
              apiToken,
              apiEndpoint,
            })
          );
          dispatch(
            nodeActionsAsync.getAliasesThunk({
              apiToken,
              apiEndpoint,
            })
          );
          dispatch(
            nodeActionsAsync.getPeersThunk({
              apiToken,
              apiEndpoint,
            })
          );
          dispatch(
            nodeActionsAsync.getBalancesThunk({
              apiToken,
              apiEndpoint,
            })
          );
          dispatch(
            nodeActionsAsync.getMessagesThunk({
              apiToken,
              apiEndpoint,
              firstLoad: true,
            })
          );
          dispatch(
            nodeActionsAsync.getChannelsThunk({
              apiToken,
              apiEndpoint,
            })
          );
          dispatch(
            nodeActionsAsync.getTicketStatisticsThunk({
              apiToken,
              apiEndpoint,
            })
          );
          dispatch(
            nodeActionsAsync.getPrometheusMetricsThunk({
              apiToken,
              apiEndpoint,
            })
          );
          dispatch(nodeActions.initializeMessagesWebsocket());
        }
      } catch (e) {
        trackGoal('ZUIBL4M8', 1) // FAILED_CONNECT_TO_NODE_BY_URL
        // error is handled on redux
      }
    };
    useNode();

    return () => {
      dispatch(nodeActions.closeMessagesWebsocket());
    };
  }, [apiEndpoint, apiToken]);

  useEffect(() => {
    if (!HOPRdNodeAddressForOnboarding) return;
    dispatch(stakingHubActions.setNodeAddressProvidedByMagicLink(HOPRdNodeAddressForOnboarding));
  }, [HOPRdNodeAddressForOnboarding]);

  const showInfoBar = () => {
    if (
      environment === 'web3' &&
      (location.pathname === '/' || location.pathname === '/privacy-notice' || location.pathname === '/tos')
    )
      return false;
    if (isConnected || nodeConnected) return true;
    return false;
  };

  const handleDisconnectMM = () => {
    disconnect();
    dispatch(appActions.resetState());
    dispatch(web3Actions.resetState());
    dispatch(safeActions.resetState());
    dispatch(stakingHubActions.resetState());
    navigate('/');
  };

  const drawerFunctionItems: ApplicationMapType = [
    {
      groupName: 'CONNECTION',
      path: 'function',
      icon: <DevelopIcon />,
      mobileOnly: true,
      items: [
        {
          name: web3Connected ? 'Disconnect' : 'Connect Wallet',
          path: 'function',
          icon: <MetaMaskFox />,
          onClick: () => {
            if (web3Connected) handleDisconnectMM();
            else dispatch(web3Actions.setModalOpen(true));
          },
          mobileOnly: true,
        },
      ],
    },
  ];

  return (
    <Layout
      drawer
      webapp
      drawerItems={applicationMap}
      drawerFunctionItems={environment === 'web3' ? drawerFunctionItems : undefined}
      drawerLoginState={{
        node: nodeConnected,
        web3: web3Connected,
        safe: !!safeAddress && web3Connected,
      }}
      className={environment}
      drawerType={environment === 'web3' ? 'blue' : undefined}
      itemsNavbarRight={
        <>
          {(environment === 'dev' || environment === 'node') && <NotificationBar />}
          {(environment === 'dev' || environment === 'web3') && <ConnectSafe />}
          {(environment === 'dev' || environment === 'web3') && <ConnectWeb3 inTheAppBar />}
          {(environment === 'dev' || environment === 'node') && <ConnectNode />}
        </>
      }
      drawerRight={showInfoBar() && <InfoBar />}
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
    element: (
      <Navigate
        to="/"
        replace
      />
    ),
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
        path: item.overwritePath ? item.overwritePath : groups.path + '/' + item.path,
        element: item.element,
      });
    }
  });
});

routes[0].children.push({
  path: '/tos',
  element: <TermsOfService />,
});
routes[0].children.push({
  path: '/privacy-notice',
  element: <PrivacyNotice />,
});

const router = createBrowserRouter(routes);

export default router;
