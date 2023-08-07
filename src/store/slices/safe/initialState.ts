import { AllTransactionsListResponse, SafeDelegateListResponse, SafeMultisigTransactionListResponse, SafeInfoResponse } from '@safe-global/api-kit'

type InitialState = {
  selectedSafeAddress: string | null;
  safesByOwner: string[];
  allTransactions: AllTransactionsListResponse | null;
  pendingTransactions: SafeMultisigTransactionListResponse | null;
  info: SafeInfoResponse | null;
  delegates: SafeDelegateListResponse | null;
  balance: {
    xDai: {
      value: string | null;
      formatted: string | null;
    };
    xHopr: {
      value:  string | null;
      formatted: string | null;
    };
    wxHopr: {
      value: string | null;
      formatted: string | null;
    };
    isFetching: boolean;
  };
};

export const initialState: InitialState = {
  selectedSafeAddress: null,
  safesByOwner: [],
  allTransactions: null,
  pendingTransactions: null,
  info: null,
  delegates: null,
  balance: {
    xDai: {
      value: null,
      formatted: null,
    },
    xHopr: {
      value: null,
      formatted: null,
    },
    wxHopr: {
      value: null,
      formatted: null,
    },
    isFetching: false,
  },
};
