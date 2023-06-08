import { SafeTransaction } from '@safe-global/safe-core-sdk-types';

type InitialState = {
  connected: boolean;
  recentlyCreatedSafe: string | null;
  safesByOwner: string[];
  safeTransactions: SafeTransaction[];
};

export const initialState: InitialState = {
  connected: false,
  recentlyCreatedSafe: null,
  safesByOwner: [],
  safeTransactions: [],
};
