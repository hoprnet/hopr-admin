import {
  AllTransactionsListResponse,
  SafeDelegateListResponse,
  SafeInfoResponse,
  SafeMultisigTransactionListResponse,
  TokenInfoListResponse
} from '@safe-global/api-kit';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';

export type CustomSafeMultisigTransactionResponse = SafeMultisigTransactionResponse & {
  source?: string;
  request?: string;
};
export type CustomSafeMultisigTransactionListResponse =
  | (SafeMultisigTransactionListResponse & {
      results: CustomSafeMultisigTransactionResponse[];
    })
  | null;

type InitialState = {
  selectedSafeAddress: string | null;
  safesByOwner: string[];
  allTransactions: AllTransactionsListResponse | null;
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
