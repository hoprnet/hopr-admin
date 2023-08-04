export const initialState = {
  status: {
    connected: false as boolean,
    loading: false as boolean,
  },
  account: null as string | null,
  wallet: null as string | null,
  hasCommunityNFT: false,
  chainId: null as string | null,
  chain: null as string | null,
  blockNumber: '',
  balance: {
    xDai: {
      native: null,
      parsed: null
    },
    xHopr: {
      native: null,
      parsed: null
    },
    wxHopr: {
      native: null,
      parsed: null
    },
    isFetching: false,
  },
};
