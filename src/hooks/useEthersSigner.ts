import * as React from 'react';
import { type WalletClient, useWalletClient } from 'wagmi';
import { providers } from 'ethers';

function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new providers.Web3Provider(
    transport as providers.ExternalProvider | providers.JsonRpcFetchFunc,
    network
  );
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
/*   https://1.x.wagmi.sh/react/ethers-adapters#usage-1
    TODO: https://github.com/wevm/wagmi/issues/2784    */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient]);
}
