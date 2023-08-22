import { useEffect } from 'react';
import Updater from './updater';

// Store
import { useAppDispatch } from '../../store';
import { web3Actions } from '../../store/slices/web3';

// wagmi
import { gnosis } from '@wagmi/core/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

//wagmi connectors
import { createWalletClient, custom, publicActions } from 'viem';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

// No way to tell what the ethereum request can be so has to be any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EthereumProvider = { request(...args: any): Promise<any> };
type WindowWithEthereum = { ethereum: EthereumProvider };

const {
  chains,
  publicClient,
  webSocketPublicClient,
} = configureChains([gnosis], [publicProvider()], {
  pollingInterval: 30_000,
  stallTimeout: 5_000,
  rank: true,
});

const walletIsInBrowser =
  typeof window !== 'undefined' && typeof (window as unknown as WindowWithEthereum).ethereum !== 'undefined';

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: { projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID },
    }),
  ],

  publicClient: (chain) => {
    if (walletIsInBrowser) {
      return createWalletClient({
        chain: gnosis,
        transport: custom((window as unknown as WindowWithEthereum).ethereum),
      }).extend(publicActions);
    }

    // no ethereum found in window
    return publicClient(chain);
  },
  webSocketPublicClient,
});

export default function WagmiProvider(props: React.PropsWithChildren) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(web3Actions.setWalletPresent(walletIsInBrowser));
  }, [walletIsInBrowser]);

  return (
    <WagmiConfig config={config}>
      {props.children}
      {walletIsInBrowser && <Updater />}
    </WagmiConfig>
  );
}
