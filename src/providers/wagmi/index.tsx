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
import { createWalletClient, custom, http, publicActions } from 'viem';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// No way to tell what the ethereum request can be so has to be any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EthereumProvider = { request(...args: any): Promise<any> };
type WindowWithEthereum = { ethereum: EthereumProvider };

const { chains } = configureChains([gnosis], [publicProvider()]);

const walletIsInBrowser =
  typeof window !== 'undefined' && typeof (window as unknown as WindowWithEthereum).ethereum !== 'undefined';

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient: () => {
    // wallet is in browser at this point
    return createWalletClient({
      chain: gnosis,
      transport: walletIsInBrowser
        ? custom((window as unknown as WindowWithEthereum).ethereum)
        : http('https://derp.hoprnet.org/rpc/xdai/mainnet'),
    }).extend(publicActions);
  },
});

export default function WagmiProvider(props: React.PropsWithChildren) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(web3Actions.setWalletPresent(walletIsInBrowser));
  }, [walletIsInBrowser]);

  if (!walletIsInBrowser) {
    return props.children;
  }

  return (
    <WagmiConfig config={config}>
      {props.children}
      {walletIsInBrowser && <Updater />}
    </WagmiConfig>
  );
}
