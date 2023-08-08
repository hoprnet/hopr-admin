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
import { safeActions } from '../../store/slices/safe';

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
  const { data: wxHopr_balance } = useBalance({
    address: account,
    token: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  });
  const { data: xHopr_balance } = useBalance({
    address: account,
    token: xHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  });

  const safe_xDAI_balance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    watch: true,
  }).data;
  const safe_wxHopr_balance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  }).data;
  const safe_xHopr_balance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: xHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  }).data;

  useEffect(() => {
    if (xDAI_balance)
      dispatch(
        web3Actions.setWalletBalance_xDai({
          ...xDAI_balance,
          value: xDAI_balance.value.toString(),
        }),
      );
  }, [xDAI_balance]);

  useEffect(() => {
    if (wxHopr_balance)
      dispatch(
        web3Actions.setWalletBalance_wxHopr({
          ...wxHopr_balance,
          value: wxHopr_balance.value.toString(),
        }),
      );
  }, [wxHopr_balance]);

  useEffect(() => {
    if (xHopr_balance)
      dispatch(
        web3Actions.setWalletBalance_xHopr({
          ...xHopr_balance,
          value: xHopr_balance.value.toString(),
        }),
      );
  }, [xHopr_balance]);

  useEffect(() => {
    if (safe_xDAI_balance)
      dispatch(
        safeActions.setSafeBalance_xDai({
          ...safe_xDAI_balance,
          value: safe_xDAI_balance.value.toString(),
        }),
      );
  }, [safe_xDAI_balance]);

  useEffect(() => {
    if (safe_wxHopr_balance)
      dispatch(
        safeActions.setSafeBalance_wxHopr({
          ...safe_wxHopr_balance,
          value: safe_wxHopr_balance.value.toString(),
        }),
      );
  }, [safe_wxHopr_balance]);

  useEffect(() => {
    if (safe_xHopr_balance)
      dispatch(
        safeActions.setSafeBalance_xHopr({
          ...safe_xHopr_balance,
          value: safe_xHopr_balance.value.toString(),
        }),
      );
  }, [safe_xHopr_balance]);

  return <></>;
}
