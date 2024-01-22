import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS, xHOPR_TOKEN_SMART_CONTRACT_ADDRESS } from '../../../config';

// wagmi
import { useAccount, useBalance, useNetwork } from 'wagmi';

// Redux
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActions } from '../../store/slices/safe';
import { appActions } from '../../store/slices/app';
import { web3Actions, web3ActionsAsync } from '../../store/slices/web3';
import { stakingHubActions, stakingHubActionsAsync } from '../../store/slices/stakingHub';

export default function WagmiUpdater() {
 // const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const nodeHoprAddress = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress); // Staking Hub
  const addressInStore = useAppSelector((store) => store.web3.account);

  // Wallet Account
  const {
    address,
    isConnected,
  } = useAccount();

  const { chain } = useNetwork();

  // Account change in Wallet
  useEffect(() => {
    if(addressInStore === address) return;

    if (isConnected && address) {
      //reset whole app
      dispatch(appActions.resetState());
      dispatch(web3Actions.resetState());
      dispatch(safeActions.resetState());
      dispatch(stakingHubActions.resetStateWithoutMagicLinkForOnboarding());

      //fill the store
      dispatch(web3Actions.setAccount(address));
      dispatch(web3Actions.setConnected(isConnected));
      dispatch(web3ActionsAsync.getCommunityNftsOwnedByWallet({ account: address }));
      dispatch(stakingHubActionsAsync.getHubSafesByOwnerThunk(address));

      if(chain){
        dispatch(web3Actions.setChain(chain.name));
        dispatch(web3Actions.setChainId(chain.id));
      }
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && chain) {
      dispatch(web3Actions.setChain(chain.name));
      dispatch(web3Actions.setChainId(chain.id));
    }
  }, [isConnected, chain]);

  // Balances
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const account = useAppSelector((store) => store.web3.account) as `0x${string}`;

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

  const nodeLinkedToSafe_xDai_balance = useBalance({
    address: nodeHoprAddress as `0x${string}`,
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


  useEffect(() => {
    if (nodeLinkedToSafe_xDai_balance)
      dispatch(
        stakingHubActions.setNodeLinkedToSafeBalance_xDai({
          ...nodeLinkedToSafe_xDai_balance,
          value: nodeLinkedToSafe_xDai_balance.value.toString(),
        }),
      );
  }, [nodeLinkedToSafe_xDai_balance]);

  return <></>;
}
