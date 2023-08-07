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
      native: string | null;
      parsed: string | null;
    };
    xHopr: {
      native: string | null;
      parsed: string | null;
    };
    wxHopr: {
      native: string | null;
      parsed: string | null;
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
      native: null,
      parsed: null,
    },
    xHopr: {
      native: null,
      parsed: null,
    },
    wxHopr: {
      native: null,
      parsed: null,
    },
    isFetching: false,
  },
};
