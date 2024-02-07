export const initialState = {
  status: {
    connected: false as boolean,
    connecting: false as boolean,
    disconnecting: false as boolean,
    loading: true as boolean,
    walletPresent: false as boolean,
  },
  account: null as string | null,
  communityNftId: null as number | null,
  communityNftTransferring: false as boolean,
  chainId: null as string | null,
  chain: null as string | null,
  blockNumber: '',
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
