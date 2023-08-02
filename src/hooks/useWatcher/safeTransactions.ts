import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import ethers from 'ethers';
import { safeActionsAsync } from '../../store/slices/safe';
import { useAppDispatch } from '../../store';
import { sendNotification } from './notifications';
import { observeData } from './observeData';

/**
 * Checks if there's a new pending transaction based on the submission date.
 *
 * @param previousPendingSafeTransaction The previous pending safe transaction.
 * @param newPendingSafeTransaction The new pending safe transaction.
 * @returns A boolean indicating whether there's a new transaction or not.
 */
export const checkIfNewTransaction = (
  previousPendingSafeTransaction: SafeMultisigTransactionResponse | null,
  newPendingSafeTransaction: SafeMultisigTransactionResponse,
) =>
  !previousPendingSafeTransaction ||
  previousPendingSafeTransaction.safe != newPendingSafeTransaction.safe ||
  new Date(newPendingSafeTransaction.submissionDate).getTime() >
    new Date(previousPendingSafeTransaction.submissionDate).getTime();

/**
 * Gets the latest pending safe transaction from a list of pending transactions.
 *
 * @param pendingTransactions A list of pending safe transactions.
 * @returns The latest pending safe transaction, or undefined if no transactions are found.
 */
export const getLatestPendingSafeTransaction = (
  pendingTransactions: SafeMultisigTransactionListResponse | undefined,
) => {
  if (!pendingTransactions?.count) return;

  const sortedPendingTransactions = [...pendingTransactions.results].sort(
    (a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime(),
  );

  return sortedPendingTransactions.at(0);
};

/**
 * Observes the pending transactions in a given Safe and sends a notification
 * if a new pending transaction is detected.
 *
 * @param selectedSafeAddress The address of the selected Safe.
 * @param previousState The last observed state of the pending Safe transactions.
 * @param signer The signer instance to be used for generating transactions.
 * @param updatePreviousData Function to update the previous state of the pending Safe transactions.
 * @param dispatch The dispatch function returned by the useAppDispatch hook.
 */
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
    isDataDifferent: (newPendingSafeTransaction) => checkIfNewTransaction(previousState, newPendingSafeTransaction),
    notificationHandler: (newData) => {
      sendNotification({
        notificationPayload: {
          name: `Pending transaction`,
          source: 'node',
          url: 'hub/safe/actions',
          timeout: null,
        },
        toastPayload: { message: `Pending transaction to ${newData?.to}` },
        dispatch,
      });
    },
    updatePreviousData,
  });
