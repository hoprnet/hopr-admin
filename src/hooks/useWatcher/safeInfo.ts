import { observeData } from './observeData';
import { ethers } from 'ethers';
import { sendNotification } from './notifications';
import { useAppDispatch } from '../../store';
import { safeActionsAsync } from '../../store/slices/safe';
import { SafeInfoResponse } from '@safe-global/api-kit';

/**
 * Observes Safe Information for making sure if safe is already indexed by HOPR Safe Infra.
 *
 */
export const observeSafeInfo = ({
  selectedSafeAddress,
  safeIndexed,
  signer,
  active,
  dispatch,
}: {
  selectedSafeAddress: string | null;
  safeIndexed?: boolean | null;
  signer: ethers.providers.JsonRpcSigner | undefined;
  active: boolean;
  dispatch: ReturnType<typeof useAppDispatch>;
}) =>
  observeData<SafeInfoResponse | null>({
    active: active && !!signer && !!selectedSafeAddress && !safeIndexed,
    fetcher: async () => {
      if (!signer || !selectedSafeAddress || safeIndexed) return;
      return dispatch(
        safeActionsAsync.getSafeInfoThunk({
          signer: signer,
          safeAddress: selectedSafeAddress,
        })
      ).unwrap();
    },
    previousData: null,
    isDataDifferent: () => {return false},
    notificationHandler: () => { return },
    updatePreviousData: () => { return },
  });
