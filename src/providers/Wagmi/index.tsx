import {
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from 'react';

// wagmi
import { WagmiConfig, createConfig } from 'wagmi';
import { gnosis } from '@wagmi/core/chains';
import { createPublicClient, http } from 'viem';

import Updater from './updater';

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: gnosis,
    transport: http(),
  }),
});

export default function WagmiProvider(props: {
  children:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) {
  return (
    <WagmiConfig config={config}>
      {props.children}
      <Updater />
    </WagmiConfig>
  );
}
