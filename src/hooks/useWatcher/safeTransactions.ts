import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';

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
