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
}

export type CustomSafeMultisigTransactionResponse = SafeMultisigTransactionResponse & AdditionalFieldsForPendingActions;

export type CustomSafeMultisigTransactionListResponse =
  | (Omit<SafeMultisigTransactionListResponse, 'results'> & {
      results: CustomSafeMultisigTransactionResponse[];
    })
  | null;


export type CustomSafeModuleTransactionWithTransfersResponse = SafeModuleTransactionWithTransfersResponse  & AdditionalFieldsForHistoryActions

export type CustomSafeMultisigTransactionWithTransfersResponse = SafeMultisigTransactionWithTransfersResponse  & AdditionalFieldsForHistoryActions

export type CustomEthereumTxWithTransfersResponse = EthereumTxWithTransfersResponse  & AdditionalFieldsForHistoryActions

export type CustomAllTransactionsResponse = Array<
  (
    | CustomSafeModuleTransactionWithTransfersResponse
    | CustomSafeMultisigTransactionWithTransfersResponse
    | CustomEthereumTxWithTransfersResponse
  )
>;

export type CustomAllTransactionsListResponse =
  | (Omit<AllTransactionsListResponse, 'results'> & { results: CustomAllTransactionsResponse })
  | null;

type InitialState = {
  selectedSafeAddress: string | null;
  safesByOwner: string[];
  allTransactions: CustomAllTransactionsListResponse | null;
  pendingTransactions: CustomSafeMultisigTransactionListResponse;
  tokenList: TokenInfoListResponse | null;
  info: SafeInfoResponse | null;
  delegates: SafeDelegateListResponse | null;
};

export const initialState: InitialState = {
  selectedSafeAddress: null,
  safesByOwner: [],
  allTransactions: null,
  pendingTransactions: null,
  tokenList: null,
  info: null,
  delegates: null,
};
