import {
  AllTransactionsListResponse,
  SafeInfoResponse,
} from '@safe-global/api-kit';
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';

type InitialState = {
  connected: boolean;
  recentlyCreatedSafe: string | null;
  safesByOwner: string[];
  safeTransactions: AllTransactionsListResponse | null;
  safeInfos: SafeInfoResponse[];
};

export const initialState: InitialState = {
  connected: false,
  recentlyCreatedSafe: null,
  safesByOwner: [],
  safeTransactions: null,
  safeInfos: [],
};
