export const initialState = {
  status: {
    connected: false as boolean,
    loading: false as boolean,
  },
  account: null as string | null,
  wallet: null as string | null,
  chainId: null as string | null,
  chain: null as string | null,
  blockNumber: '',
  balances: {
    xDAI: null,
    xHOPR: null,
  },
};
