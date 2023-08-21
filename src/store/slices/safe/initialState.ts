import {
  AllTransactionsListResponse,
  EthereumTxWithTransfersResponse,
  SafeDelegateListResponse,
  SafeInfoResponse,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionListResponse,
  SafeMultisigTransactionWithTransfersResponse,
  TokenInfoListResponse
} from '@safe-global/api-kit';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';

type AdditionalFieldsForPendingActions = {
  source: string;
  request: string;
};

/**
 * History actions do no require a async call to get the currency and value
 */
type AdditionalFieldsForHistoryActions = AdditionalFieldsForPendingActions & {
  currency: string;
  value: string;
};

export type CustomSafeMultisigTransactionResponse = SafeMultisigTransactionResponse & AdditionalFieldsForPendingActions;

export type CustomSafeMultisigTransactionListResponse =
  | (Omit<SafeMultisigTransactionListResponse, 'results'> & {
      results: CustomSafeMultisigTransactionResponse[];
    })
  | null;

export type CustomSafeModuleTransactionWithTransfersResponse = SafeModuleTransactionWithTransfersResponse &
  AdditionalFieldsForHistoryActions;

export type CustomSafeMultisigTransactionWithTransfersResponse = SafeMultisigTransactionWithTransfersResponse &
  AdditionalFieldsForHistoryActions;

export type CustomEthereumTxWithTransfersResponse = EthereumTxWithTransfersResponse & AdditionalFieldsForHistoryActions;

export type CustomAllTransactionsResponse = Array<
  | CustomSafeModuleTransactionWithTransfersResponse
  | CustomSafeMultisigTransactionWithTransfersResponse
  | CustomEthereumTxWithTransfersResponse
>;

export type CustomAllTransactionsListResponse =
  | (Omit<AllTransactionsListResponse, 'results'> & { results: CustomAllTransactionsResponse })
  | null;

type InitialState = {
  selectedSafeAddress: { data: string | null; isFetching: boolean };
  safesByOwner: { data: string[]; isFetching: boolean };
  allTransactions: { data: CustomAllTransactionsListResponse | null; isFetching: boolean };
  pendingTransactions: { data: CustomSafeMultisigTransactionListResponse | null; isFetching: boolean };
  info: { data: SafeInfoResponse | null; isFetching: boolean };
  delegates: { data: SafeDelegateListResponse | null; isFetching: boolean };
  createTransaction: { isFetching: boolean };
  confirmTransaction: { isFetching: boolean };
  rejectTransaction: { isFetching: boolean };
  executeTransaction: { isFetching: boolean };
  addDelegate: { isFetching: boolean };
  removeDelegate: { isFetching: boolean };
  tokenList: { data: TokenInfoListResponse | null; isFetching: boolean };
  token: { isFetching: boolean };
  balance: {
    data: {
      xDai: {
        value: string | null;
        formatted: string | null;
      };
      xHopr: {
        value: string | null;
        formatted: string | null;
      };
      wxHopr: {
        value: string | null;
        formatted: string | null;
      };
    };
    isFetching: boolean;
  };
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
  createTransaction: { isFetching: false },
  confirmTransaction: { isFetching: false },
  rejectTransaction: { isFetching: false },
  executeTransaction: { isFetching: false },
  addDelegate: { isFetching: false },
  removeDelegate: { isFetching: false },
  tokenList: {
    data: null,
    isFetching: false,
  },
  token: { isFetching: false },
  balance: {
    data: {
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
    },
    isFetching: false,
  },
};
