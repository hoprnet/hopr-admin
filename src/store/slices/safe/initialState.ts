type InitialState = {
  connected: boolean;
  recentlyCreatedSafe: string | null;
  safesByOwner: unknown[];
  transactions: unknown[];
};

export const initialState: InitialState = {
  connected: false,
  recentlyCreatedSafe: null,
  safesByOwner: [],
  transactions: [],
};
