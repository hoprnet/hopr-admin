import { useEffect } from 'react';
import Updater from './updater';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { web3Actions } from '../../store/slices/web3';

// wagmi
import { gnosis, localhost } from '@wagmi/core/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

//wagmi connectors
import { createWalletClient, custom, publicActions } from 'viem';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { VITE_WALLET_CONNECT_PROJECT_ID, environment } from '../../../config';

// No way to tell what the ethereum request can be so has to be any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EthereumProvider = { request(...args: any): Promise<any> };
type WindowWithEthereum = { ethereum: EthereumProvider };

const {
  chains,
  publicClient,
} = configureChains(
  [gnosis],
  [publicProvider()],
  {
    pollingInterval: 30_000,
    stallTimeout: 5_000,
    rank: true,
  },
);

const walletIsInBrowser =
  typeof window !== 'undefined' && typeof (window as unknown as WindowWithEthereum).ethereum !== 'undefined';

export const browserClient = walletIsInBrowser
  ? createWalletClient({
    chain: gnosis,
    transport: custom((window as unknown as WindowWithEthereum).ethereum),
  }).extend(publicActions)
  : null;

export default function WagmiProvider(props: React.PropsWithChildren) {
  const dispatch = useAppDispatch();
  const walletConnect = useAppSelector((store)=>store.web3.walletConnect);

  useEffect(() => {
    dispatch(web3Actions.setWalletPresent(walletIsInBrowser));
  }, [walletIsInBrowser]);
  
  const createConnectors = (walletConnect: boolean) => {
    // TODO: name this function work off the walletConnect redux function
    // There will be a need to change ConnectWeb3 to change walletConnect variable to true on click
    // and then use the new  connect({ connector });
    if(environment !== 'node'){
    // if(walletConnect){
      return [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
          chains,
          options: { projectId: VITE_WALLET_CONNECT_PROJECT_ID },
        }),
        // add localhost only to injected connector
        // because wallet connect fails with it
        new InjectedConnector({ chains: [localhost, ...chains] }),
      ];
    } else {
      return [
        // TODO: 
        // new MetaMaskConnector({ chains }),
        // new WalletConnectConnector({
        //   chains,
        //   options: { projectId: VITE_WALLET_CONNECT_PROJECT_ID },
        // }),
        // {
        //   chains, 
        //   id: 'walletConnect', 
        //   name: "WalletConnect",
        //   setStorage: ()=>{},
        //   onAccountsChanged: ()=>{},
        //   onChainChanged: ()=>{},
        //   onConnect: ()=>{},
        //   onDisconnect: ()=>{},
        //   onDisplayUri: ()=>{},
        //   options: {isNewChainsStale: true, projectId: ""},
        //   ready: true,
        //   storage: undefined,
        //   _events: {},
        //   _eventsCount: 0,
        // },
        // new InjectedConnector({ chains: [localhost, ...chains] }),
      ];
    }
  }

  let config = createConfig({
    autoConnect: true,
    //@ts-ignore
    connectors: createConnectors(walletConnect),
  
    publicClient: (chain) => {
      // this means even if connected through wallet connect
      // the requests will go through the wallet client
      if (walletIsInBrowser) {
        // enforce this type because
        // it is checked before
        return browserClient!;
      }
  
      // no ethereum found in window
      return publicClient(chain);
    },
  });

  return (
    <WagmiConfig config={config}>
      {props.children}
      <Updater />
    </WagmiConfig>
  );
}
