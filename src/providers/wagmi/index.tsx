import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';
import Updater from './updater';

// wagmi
import { gnosis } from '@wagmi/core/chains';
import { publicProvider } from 'wagmi/providers/public';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { createPublicClient, http } from 'viem';

//wagmi connectors
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const {
  chains,
  publicClient,
  webSocketPublicClient,
} = configureChains([gnosis], [publicProvider()], {
  pollingInterval: 30_000,
  stallTimeout: 5_000,
  rank: true,
});

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
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
