import { AllTransactionsListResponse, SafeDelegateListResponse, SafeInfoResponse } from '@safe-global/api-kit';

type InitialState = {
  selectedSafeAddress: string | null;
  safesByOwner: string[];
  safeTransactions: AllTransactionsListResponse | null;
  safeInfos: SafeInfoResponse[];
  safeDelegates: SafeDelegateListResponse | null;
};

export const initialState: InitialState = {
  selectedSafeAddress: null,
  safesByOwner: [],
  safeTransactions: null,
  safeInfos: [],
  safeDelegates: null,
};
