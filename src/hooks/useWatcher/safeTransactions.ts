import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import ethers from 'ethers';
import { safeActionsAsync } from '../../store/slices/safe';
import { useAppDispatch } from '../../store';
import { sendNotification } from './notifications';
import { observeData } from './observeData';

export const checkIfNewTransaction = (
  previousPendingSafeTransaction: SafeMultisigTransactionResponse | null,
  newPendingSafeTransaction: SafeMultisigTransactionResponse,
) =>
  !previousPendingSafeTransaction ||
  new Date(newPendingSafeTransaction.submissionDate).getTime() >
    new Date(previousPendingSafeTransaction.submissionDate).getTime();

export const getLatestPendingSafeTransaction = (
  pendingTransactions: SafeMultisigTransactionListResponse | undefined,
) => {
  if (!pendingTransactions?.count) return;

  const sortedPendingTransactions = [...pendingTransactions.results].sort(
    (a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime(),
  );

  return sortedPendingTransactions.at(0);
};

export const observePendingSafeTransactions = ({
  selectedSafeAddress,
  previousState,
  signer,
  updatePreviousData,
  dispatch,
}: {
  selectedSafeAddress: string | null;
  previousState: SafeMultisigTransactionResponse | null;
  signer: ethers.providers.JsonRpcSigner | undefined;
  updatePreviousData: (currentData: SafeMultisigTransactionResponse) => void;
  dispatch: ReturnType<typeof useAppDispatch>;
}) =>
  observeData<SafeMultisigTransactionResponse | null | undefined>({
    disabled: !selectedSafeAddress || !signer,
    previousData: previousState,
    fetcher: async () => {
      if (!signer || !selectedSafeAddress) return;

      const pendingTransactions = await dispatch(
        safeActionsAsync.getPendingSafeTransactionsThunk({
          signer,
          safeAddress: selectedSafeAddress,
        }),
      ).unwrap();

      return getLatestPendingSafeTransaction(pendingTransactions);
    },
    isDataDifferent: (newPendingSafeTransaction) => {
      return checkIfNewTransaction(previousState, newPendingSafeTransaction);
    },
    notificationHandler: (newData) => {
      sendNotification({
        notificationPayload: {
          name: `Pending transaction`,
          source: 'node',
          url: 'develop/safe/pending-transactions',
          timeout: null,
        },
        toastPayload: { message: `Pending transaction to ${newData?.to}` },
        dispatch,
      });
    },
    updatePreviousData,
  });
