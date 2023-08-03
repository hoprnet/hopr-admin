import { AllTransactionsListResponse, SafeDelegateListResponse, SafeMultisigTransactionListResponse, SafeInfoResponse } from '@safe-global/api-kit'

type InitialState = {
  selectedSafeAddress: { data: string | null; isFetching: boolean };
  safesByOwner: { data: string[]; isFetching: boolean };
  allTransactions: { data: AllTransactionsListResponse | null; isFetching: boolean };
  pendingTransactions: { data: SafeMultisigTransactionListResponse | null; isFetching: boolean };
  info: { data: SafeInfoResponse | null; isFetching: boolean };
  delegates: { data: SafeDelegateListResponse | null; isFetching: boolean };
};

export const initialState: InitialState = {
  selectedSafeAddress: {
    data: null,
    isFetching: false,
  },
  safesByOwner: {
    data: [],
    isFetching: false,
  },
  allTransactions: {
    data: null,
    isFetching: false,
  },
  pendingTransactions: {
    data: null,
    isFetching: false,
  },
  info: {
    data: null,
    isFetching: false,
  },
  delegates: {
    data: null,
    isFetching: false,
  },
};
