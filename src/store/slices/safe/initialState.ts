import { AllTransactionsListResponse, SafeInfoResponse, SafeMultisigTransactionListResponse } from '@safe-global/api-kit';

type InitialState = {
  selectedSafeAddress: string | null;
  recentlyCreatedSafe: string | null;
  safesByOwner: string[];
  allTransactions: AllTransactionsListResponse | null;
  pendingTransactions: SafeMultisigTransactionListResponse | null;
  safeInfos: SafeInfoResponse[];
};

export const initialState: InitialState = {
  selectedSafeAddress: null,
  recentlyCreatedSafe: null,
  safesByOwner: [],
  allTransactions: null,
  pendingTransactions: null,
  safeInfos: [],
};
