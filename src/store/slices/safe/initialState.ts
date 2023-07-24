import {
  AllTransactionsListResponse,
  SafeDelegateListResponse,
  SafeMultisigTransactionListResponse,
  SafeInfoResponse,
} from '@safe-global/api-kit';

type InitialState = {
  selectedSafeAddress: string | null;
  safesByOwner: string[];
  allTransactions: AllTransactionsListResponse | null;
  pendingTransactions: SafeMultisigTransactionListResponse | null;
  safeInfo: SafeInfoResponse | null;
  safeDelegates: SafeDelegateListResponse | null;
};

export const initialState: InitialState = {
  selectedSafeAddress: null,
  safesByOwner: [],
  allTransactions: null,
  pendingTransactions: null,
  safeInfo: null,
  safeDelegates: null,
};
