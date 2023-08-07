import { useEffect } from 'react';
import { xHOPR_TOKEN_SMART_CONTRACT_ADDRESS, wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS } from '../../../config';

// wagmi
import {
  useNetwork,
  useAccount,
  useConnect,
  useDisconnect,
  useBalance
} from 'wagmi'

// Redux
import { useAppDispatch, useAppSelector } from '../../store';
import { web3Actions, web3ActionsAsync } from '../../store/slices/web3';

export default function WagmiUpdater() {
  const dispatch = useAppDispatch();

  // Wallet Account
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
    if (address) {
      dispatch(web3ActionsAsync.getCommunityNftsOwnedByAccount({ account: address }));
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (chain) {
      dispatch(web3Actions.setChain(chain.name));
      dispatch(web3Actions.setChainId(chain.id));
    }
  }, [isConnected, chain]);

  // Balances
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress);
  const account = useAppSelector((selector) => selector.web3.account) as `0x${string}`;

  const { data: xDAI_balance } = useBalance({
    address: account,
    watch: true,
  });
  const { data: wxHOPR_balance } = useBalance({
    address: account,
    token: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  });
  const { data: xHOPR_balance } = useBalance({
    address: account,
    token: xHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  });

  const safeXdaiBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    watch: true,
  }).data?.formatted;
  const safeWxHoprBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  }).data?.formatted;
  const safexHoprBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: xHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  }).data?.formatted;

  return <></>;
}
