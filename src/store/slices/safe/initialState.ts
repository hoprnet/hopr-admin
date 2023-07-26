import {
  AllTransactionsListResponse,
  SafeDelegateListResponse,
  SafeMultisigTransactionListResponse,
  SafeInfoResponse,
  TokenInfoListResponse
} from '@safe-global/api-kit';

type InitialState = {
  selectedSafeAddress: string | null;
  safesByOwner: string[];
  allTransactions: AllTransactionsListResponse | null;
  pendingTransactions: SafeMultisigTransactionListResponse | null;
  tokenList: TokenInfoListResponse | null;
  safeInfo: SafeInfoResponse | null;
  safeDelegates: SafeDelegateListResponse | null;
};

export const initialState: InitialState = {
  selectedSafeAddress: null,
  safesByOwner: [],
  allTransactions: null,
  pendingTransactions: null,
  tokenList: null,
  safeInfo: null,
  safeDelegates: null,
};
