import { AllTransactionsListResponse, SafeInfoResponse } from '@safe-global/api-kit';

type InitialState = {
  selectedSafeAddress: string | null;
  recentlyCreatedSafe: string | null;
  safesByOwner: string[];
  safeTransactions: AllTransactionsListResponse | null;
  safeInfos: SafeInfoResponse[];
};

export const initialState: InitialState = {
  selectedSafeAddress: null,
  recentlyCreatedSafe: null,
  safesByOwner: [],
  safeTransactions: null,
  safeInfos: [],
};
