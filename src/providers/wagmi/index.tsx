import Updater from './updater';

// wagmi
import { gnosis } from '@wagmi/core/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

//wagmi connectors
import { createWalletClient, custom, publicActions } from 'viem';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// No way to tell what the ethereum request can be so has to be any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EthereumProvider = { request(...args: any): Promise<any> }
type WindowWithEthereum = { ethereum: EthereumProvider};



const {
  chains,
  publicClient,
  webSocketPublicClient,
} = configureChains([gnosis], [publicProvider()], {
  pollingInterval: 30_000,
  stallTimeout: 5_000,
  rank: true,
});

// create a special client that sends rpc calls through wallet
const walletClient = createWalletClient({
  chain: gnosis,
  transport: custom((window as unknown as WindowWithEthereum).ethereum),
}).extend(publicActions);

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient: (chain) => {
    if (typeof window !== 'undefined' && typeof (window as unknown as WindowWithEthereum).ethereum !== 'undefined') {  
      return walletClient;
    }

    // no ethereum found in window
    return publicClient(chain);
  },
  webSocketPublicClient,
});

export default function WagmiProvider(props: React.PropsWithChildren) {
  return (
    <WagmiConfig config={config}>
      {props.children}
      <Updater />
    </WagmiConfig>
  );
}
