export const initialState = {
  status: {
    connected: false as boolean,
    loading: false as boolean,
  },
  account: null as string | null,
  wallet: null as string | null,
  chainId: '',
  blockNumber: '',
  balances: {
    xDAI: null,
    xHOPR: null,
  },
};
