export const initialState = {
  status: {
    connected: false as boolean,
    loading: false as boolean,
    
  },
  account: '',
  chainId: '',
  blockNumber: '',
  balances: {
    xDAI: null,
    xHOPR: null,
  }
};
