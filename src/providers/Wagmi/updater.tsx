import { useEffect } from 'react';

// wagmi
import { useNetwork, useAccount, useConnect, useDisconnect } from 'wagmi';

// Redux
import { useAppDispatch, useAppSelector } from '../../store';
import { Store } from '../../types/index';
import { web3Actions } from '../../store/slices/web3';

export default function WagmiUpdater() {
  const dispatch = useAppDispatch();
  const {
    address,
    isConnected,
  } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    dispatch(web3Actions.setConnected(isConnected));
  }, [isConnected]);

  useEffect(() => {
    dispatch(web3Actions.setAccount(address));
  }, [isConnected, address]);

  useEffect(() => {
    if (chain) {
      dispatch(web3Actions.setChain(chain.name));
      dispatch(web3Actions.setChainId(chain.id));
    }
  }, [isConnected, chain]);

  return <></>;
}
