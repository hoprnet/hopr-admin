import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';
import Updater from './updater';

// wagmi
import { gnosis } from '@wagmi/core/chains';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { ethers } from 'ethers';
import { Chain, WagmiConfig, configureChains, createConfig } from 'wagmi';

//wagmi connectors
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { createWalletClient, custom, publicActions } from 'viem';

type WindowWithWallet = { ethereum: ethers.providers.ExternalProvider };

const walletProvider = (chain: Chain) => {
  if (typeof window !== 'undefined' && typeof (window as unknown as WindowWithWallet).ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider((window as unknown as WindowWithWallet).ethereum, {
      chainId: chain.id,
      name: chain.network,
      ensAddress: chain.contracts?.ensRegistry?.address,
    }); 

    return provider
  }

  // no web3 found in window
  return null;
};

const client = createWalletClient({
  chain: gnosis,
  transport: custom((window as unknown as WindowWithWallet).ethereum as any),
}).extend(publicActions)

const {
  chains,
  webSocketPublicClient,
} = configureChains(
  [gnosis],
  [publicProvider()],
  {
    pollingInterval: 30_000,
    stallTimeout: 5_000,
    rank: true,
  },
);

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient: client,
  webSocketPublicClient,
});

export default function WagmiProvider(props: {
  children: ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined;
}) {
  return (
    <WagmiConfig config={config}>
      {props.children}
      <Updater />
    </WagmiConfig>
  );
}
