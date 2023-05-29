import { useEffect } from 'react';

// wagmi
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// Redux
import { useAppDispatch, useAppSelector } from '../../store';
import { Store } from '../../types/index';
import { web3Actions } from '../../store/slices/web3';

export default function WagmiProvider() {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    dispatch(web3Actions.setConnected(isConnected));
  }, [isConnected]);

  useEffect(() => {
    dispatch(web3Actions.setAccount(address));
  }, [address]);

  return <></>;
}
