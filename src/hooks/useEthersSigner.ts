import * as React from 'react';
import { type WalletClient, useWalletClient, PublicClient, usePublicClient } from 'wagmi';
import { providers} from 'ethers';
import { HttpTransport } from 'viem';

type Window = {
  ethereum: providers.ExternalProvider;
};


 

export function walletClientToSigner(walletClient: WalletClient) {
  const {
    account,
    chain,
    transport,
  } = walletClient;

  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  };

  const provider = chain
    ? new providers.Web3Provider(transport as providers.ExternalProvider, network)
    : new providers.Web3Provider((window as unknown as Window).ethereum);

  const signer = provider.getSigner(account.address);
  return signer;
}


/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId = 100 }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient]);
}
