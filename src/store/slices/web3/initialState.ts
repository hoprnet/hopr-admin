export const initialState = {
  status: {
    connected: false as boolean,
    loading: false as boolean,
  },
  account: null as string | null,
  wallet: null as string | null,
  walletConnect: false as boolean,
  communityNftId: null as number | null,
  communityNftTransferring: false as boolean,
  chainId: null as string | null,
  chain: null as string | null,
  blockNumber: '',
  walletPresent: false as boolean,
  modalOpen: false as boolean,
  balance: {
    xDai: {
      value: null as string | null,
      formatted: null as string | null,
    },
    xHopr: {
      value: null as string | null,
      formatted: null as string | null,
    },
    wxHopr: {
      value: null as string | null,
      formatted: null as string | null,
    },
    isFetching: false,
  },
};
