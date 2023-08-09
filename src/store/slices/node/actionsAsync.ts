import { ActionReducerMapBuilder, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import {
  type AliasPayloadType,
  type BasePayloadType,
  type CloseChannelPayloadType,
  type CreateTokenPayloadType,
  type DeleteTokenPayloadType,
  type FundChannelsPayloadType,
  type GetChannelPayloadType,
  type GetPeerInfoPayloadType,
  type GetPeersPayloadType,
  type OpenChannelPayloadType,
  type PeerIdPayloadType,
  type PingNodePayloadType,
  type SendMessagePayloadType,
  type SetAliasPayloadType,
  type SetSettingPayloadType,
  type SignPayloadType,
  type WithdrawPayloadType,
  GetChannelResponseType,
  GetPeersResponseType,
  GetPeerInfoResponseType,
  GetSettingsResponseType,
  GetAliasesResponseType,
  GetInfoResponseType,
  GetStatisticsResponseType,
  GetTicketsResponseType,
  GetTokenResponseType,
  GetEntryNodesResponseType,
  GetChannelTicketsResponseType,
  GetChannelsResponseType,
  api,
  utils
} from '@hoprnet/hopr-sdk';
import { parseMetrics } from '../../../utils/metrics';
import { RootState } from '../..';

const { APIError } = utils;
const {
  closeChannel,
  createToken,
  deleteToken,
  fundChannels,
  getAddresses,
  getAlias,
  getAliases,
  getBalances,
  getChannel,
  getChannelTickets,
  getChannels,
  getEntryNodes,
  getInfo,
  getMetrics,
  getPeerInfo,
  getPeers,
  getSettings,
  getStatistics,
  getTickets,
  getToken,
  getVersion,
  openChannel,
  pingNode,
  redeemChannelTickets,
  redeemTickets,
  removeAlias,
  sendMessage,
  setAlias,
  setSetting,
  sign,
  withdraw,
} = api;

const getInfoThunk = createAsyncThunk<GetInfoResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getInfo',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.info.isFetching;
    if (isFetching) {
      throw new Error('Already fetching info');
    }
    dispatch(setInfoFetching(true));
    try {
      const info = await getInfo(payload);
      return info;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const getAddressesThunk = createAsyncThunk<
  | {
      hopr: string;
      native: string;
    }
  | undefined,
  BasePayloadType,
  { state: RootState }
>('node/getAccount', async (payload: BasePayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.addresses.isFetching;
  if (isFetching) {
    throw new Error('Already fetching addresses');
  }
  dispatch(setAddressesFetching(true));
  try {
    const addresses = await getAddresses(payload);
    return addresses;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const getAliasesThunk = createAsyncThunk<GetAliasesResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getAliases',
  async (payload: BasePayloadType, {
    rejectWithValue,
    getState,
    dispatch,
  }) => {
    const isFetching = getState().node.aliases.isFetching;
    if (isFetching) {
      throw new Error('Already fetching aliases');
    }
    dispatch(setAliasesFetching(true));
    try {
      const aliases = await getAliases(payload);
      return aliases;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const getBalancesThunk = createAsyncThunk<
  { hopr: string; native: string } | undefined,
  BasePayloadType,
  { state: RootState }
>('node/getBalances', async (payload: BasePayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.balances.isFetching;
  if (isFetching) {
    throw new Error('Already fetching balances');
  }
  dispatch(setBalancesFetching(true));
  try {
    const balances = await getBalances(payload);
    return balances;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const getChannelsThunk = createAsyncThunk<
  GetChannelsResponseType | undefined,
  GetPeersPayloadType,
  { state: RootState }
>('node/getChannels', async (payload: BasePayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.channels.isFetching;
  if (isFetching) {
    throw new Error('Already fetching channels');
  }
  dispatch(setChannelsFetching(true));
  try {
    const channels = await getChannels(payload);
    return channels;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const getPeersThunk = createAsyncThunk<GetPeersResponseType | undefined, GetPeersPayloadType, { state: RootState }>(
  'node/getPeers',
  async (payload: GetPeersPayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.peers.isFetching;
    if (isFetching) {
      throw new Error('Already fetching peers');
    }
    dispatch(setPeersFetching(true));
    try {
      const peers = await getPeers(payload);
      return peers;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const getPeerInfoThunk = createAsyncThunk<
  GetPeerInfoResponseType | undefined,
  GetPeerInfoPayloadType,
  { state: RootState }
>('node/getPeerInfo', async (payload: GetPeerInfoPayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.peerInfo.isFetching;
  if (isFetching) {
    throw new Error('Already fetching peerInfo');
  }
  dispatch(setPeerInfoFetching(true));
  try {
    const peerInfo = await getPeerInfo(payload);
    return peerInfo;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const getSettingsThunk = createAsyncThunk<GetSettingsResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getSettings',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.settings.isFetching;
    if (isFetching) {
      throw new Error('Already fetching balances');
    }
    dispatch(setSettingsFetching(true));
    try {
      const settings = await getSettings(payload);
      return settings;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const getStatisticsThunk = createAsyncThunk<
  GetStatisticsResponseType | undefined,
  BasePayloadType,
  { state: RootState }
>('node/getStatistics', async (payload: BasePayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.statistics.isFetching;
  if (isFetching) {
    throw new Error('Already fetching statistics');
  }
  dispatch(setStatisticsFetching(true));
  try {
    const statistics = await getStatistics(payload);
    return statistics;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const getTicketsThunk = createAsyncThunk<GetTicketsResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getTickets',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.tickets.isFetching;
    if (isFetching) {
      throw new Error('Already fetching tickets');
    }
    dispatch(setTicketsFetching(true));
    try {
      const tickets = await getTickets(payload);
      return tickets;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const getTokenThunk = createAsyncThunk<GetTokenResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getToken',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.tokens.isFetching;
    if (isFetching) {
      throw new Error('Already fetching tokens');
    }
    dispatch(setTokensFetching(true));
    try {
      const token = await getToken(payload);
      return token;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const getEntryNodesThunk = createAsyncThunk<
  GetEntryNodesResponseType | undefined,
  BasePayloadType,
  { state: RootState }
>('node/getEntryNodes', async (payload: BasePayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.entryNodes.isFetching;
  if (isFetching) {
    throw new Error('Already fetching entry nodes');
  }
  dispatch(setEntryNodesFetching(true));
  try {
    const entryNodes = await getEntryNodes(payload);
    return entryNodes;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const getVersionThunk = createAsyncThunk<string | undefined, BasePayloadType, { state: RootState }>(
  'node/getVersion',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.version.isFetching;
    if (isFetching) {
      throw new Error('Already fetching version');
    }
    dispatch(setVersionFetching(true));
    try {
      const version = await getVersion(payload);
      return version;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const withdrawThunk = createAsyncThunk<string | undefined, WithdrawPayloadType, { state: RootState }>(
  'node/withdraw',
  async (payload: WithdrawPayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.transactions.isFetching;
    if (isFetching) {
      throw new Error('Already fetching transactions');
    }
    dispatch(setTransactionsFetching(true));
    try {
      const res = await withdraw(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const getAliasThunk = createAsyncThunk<
  | {
      peerId: string;
      alias: string;
    }
  | undefined,
  AliasPayloadType,
  { state: RootState }
>('node/getAlias', async (payload: AliasPayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.aliases.isFetching;
  if (isFetching) {
    throw new Error('Already fetching aliases');
  }
  dispatch(setAliasesFetching(true));
  try {
    const res = await getAlias(payload);
    return {
      peerId: res,
      alias: payload.alias,
    };
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});
// FIXME: If this request is called and right after (but before finishing) the refresh aliases is triggered, it wont load the new Alias
const setAliasThunk = createAsyncThunk<
  { peerId: string; alias: string } | undefined,
  SetAliasPayloadType,
  { state: RootState }
>('node/setAlias', async (payload: SetAliasPayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.aliases.isFetching;
  if (isFetching) {
    throw new Error('Already fetching aliases');
  }
  dispatch(setAliasesFetching(true));
  try {
    const res = await setAlias(payload);
    if (res) {
      return {
        peerId: payload.peerId,
        alias: payload.alias,
      };
    }
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const removeAliasThunk = createAsyncThunk<{ alias: string } | undefined, AliasPayloadType, { state: RootState }>(
  'node/removeAlias',
  async (payload: AliasPayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.aliases.isFetching;
    if (isFetching) {
      throw new Error('Already fetching aliases');
    }
    dispatch(setAliasesFetching(true));
    try {
      const res = await removeAlias(payload);
      if (res) {
        return { alias: payload.alias };
      }
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const closeChannelThunk = createAsyncThunk(
  'node/closeChannel',
  async (payload: CloseChannelPayloadType, { rejectWithValue }) => {
    try {
      const res = await closeChannel(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const fundChannelsThunk = createAsyncThunk(
  'node/fundChannels',
  async (payload: FundChannelsPayloadType, { rejectWithValue }) => {
    try {
      const res = await fundChannels(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const getChannelThunk = createAsyncThunk<
  GetChannelResponseType | undefined,
  GetChannelPayloadType,
  { state: RootState }
>('node/getChannel', async (payload: GetChannelPayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.channels.isFetching;
  if (isFetching) {
    throw new Error('Already fetching channels');
  }
  dispatch(setChannelsFetching(true));
  try {
    const res = await getChannel(payload);
    return res;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const getChannelTicketsThunk = createAsyncThunk<
  GetChannelTicketsResponseType | undefined,
  PeerIdPayloadType,
  { state: RootState }
>('node/getChannelTickets', async (payload: PeerIdPayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.tickets.isFetching;
  if (isFetching) {
    throw new Error('Already fetching tickets');
  }
  dispatch(setTicketsFetching(true));
  try {
    const res = await getChannelTickets(payload);
    return res;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const openChannelThunk = createAsyncThunk(
  'node/openChannel',
  async (payload: OpenChannelPayloadType, { rejectWithValue }) => {
    try {
      const res = await openChannel(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const redeemChannelTicketsThunk = createAsyncThunk(
  'node/redeemChannelTickets',
  async (payload: PeerIdPayloadType, { rejectWithValue }) => {
    try {
      const res = await redeemChannelTickets(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const sendMessageThunk = createAsyncThunk(
  'node/sendMessage',
  async (payload: SendMessagePayloadType, { rejectWithValue }) => {
    try {
      const res = await sendMessage(payload);
      return {
        challenge: res,
        body: payload.body,
      };
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const signThunk = createAsyncThunk('node/sign', async (payload: SignPayloadType, { rejectWithValue }) => {
  try {
    const res = await sign(payload);
    return res;
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const pingNodeThunk = createAsyncThunk('node/pingNode', async (payload: PingNodePayloadType, { rejectWithValue }) => {
  try {
    const res = await pingNode(payload);
    return {
      ...res,
      peerId: payload.peerId,
    };
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const setSettingThunk = createAsyncThunk(
  'node/setSetting',
  async (payload: SetSettingPayloadType, { rejectWithValue }) => {
    try {
      const res = await setSetting(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

// FIXME: Should this have cases to handle fulfilled or rejected state of thunk?
const redeemTicketsThunk = createAsyncThunk(
  'node/redeemTickets',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const res = await redeemTickets(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

// FIXME: Same?
const createTokenThunk = createAsyncThunk(
  'node/createToken',
  async (payload: CreateTokenPayloadType, { rejectWithValue }) => {
    try {
      const res = await createToken(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

const deleteTokenThunk = createAsyncThunk<
  { deleted: boolean; id: string } | undefined,
  DeleteTokenPayloadType,
  { state: RootState }
>('node/deleteToken', async (payload: DeleteTokenPayloadType, {
  rejectWithValue,
  dispatch,
  getState,
}) => {
  const isFetching = getState().node.tokens.isFetching;
  if (isFetching) {
    throw new Error('Already fetching tokens');
  }
  dispatch(setTokensFetching(true));
  try {
    const res = await deleteToken(payload);
    return {
      deleted: res,
      id: payload.id,
    };
  } catch (e) {
    if (e instanceof APIError) {
      return rejectWithValue({
        status: e.status,
        error: e.error,
      });
    }
  }
});

const getPrometheusMetricsThunk = createAsyncThunk<string | undefined, BasePayloadType, { state: RootState }>(
  'node/getPrometheusMetrics',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
    getState,
  }) => {
    const isFetching = getState().node.metrics.isFetching;
    if (isFetching) {
      throw new Error('Already fetching metrics');
    }
    dispatch(setMetricsFetching(true));
    try {
      const res = await getMetrics(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
);

// Helper action to update the isFetching state
const setAliasesFetching = createAction<boolean>('node/setAliasesFetching');
const setInfoFetching = createAction<boolean>('node/setInfoFetching');
const setMetricsFetching = createAction<boolean>('node/setMetricsFetching');
const setAddressesFetching = createAction<boolean>('node/setAddressesFetching');
const setBalancesFetching = createAction<boolean>('node/setBalancesFetching');
const setChannelsFetching = createAction<boolean>('node/setChannelsFetching');
const setPeersFetching = createAction<boolean>('node/setPeersFetching');
const setPeerInfoFetching = createAction<boolean>('node/setPeerInfoFetching');
const setEntryNodesFetching = createAction<boolean>('node/setEntryNodesFetching');
const setSettingsFetching = createAction<boolean>('node/setSettingsFetching');
const setStatisticsFetching = createAction<boolean>('node/setStatisticsFetching');
const setTicketsFetching = createAction<boolean>('node/setTicketsFetching');
const setTokensFetching = createAction<boolean>('node/setTokensFetching');
const setVersionFetching = createAction<boolean>('node/setVersionFetching');
const setTransactionsFetching = createAction<boolean>('node/setTransactionsFetching');

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  // getInfo
  builder.addCase(getInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.info.data = action.payload;
    }
    state.info.isFetching = false;
  });
  builder.addCase(getInfoThunk.rejected, (state, action) => {
    state.info.isFetching = false;
  });
  // getAddresses
  builder.addCase(getAddressesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.addresses.data = action.payload;
    }
    state.addresses.isFetching = false;
  });
  builder.addCase(getAddressesThunk.rejected, (state, action) => {
    state.addresses.isFetching = false;
  });
  // getAliases
  builder.addCase(getAliasesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.aliases.data = action.payload;
    }
    state.aliases.isFetching = false;
  });
  builder.addCase(getAliasesThunk.rejected, (state, action) => {
    state.aliases.isFetching = false;
  });
  // getBalances
  builder.addCase(getBalancesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.balances = {
        data: {
          native: action.payload.native,
          hopr: action.payload.hopr,
        },
        isFetching: false,
      };
    }
  });
  builder.addCase(getBalancesThunk.rejected, (state, action) => {
    state.balances.isFetching = false;
  });
  // getChannels
  builder.addCase(getChannelsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.channels.data = action.payload;
    }
    state.channels.isFetching = false;
  });
  builder.addCase(getChannelsThunk.rejected, (state, action) => {
    state.channels.isFetching = false;
  });
  // getPeers
  builder.addCase(getPeersThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.peers.data = action.payload;
    }
    state.peers.isFetching = false;
  });
  builder.addCase(getPeersThunk.rejected, (state, action) => {
    state.peers.isFetching = false;
  });
  // getPeerInfo
  builder.addCase(getPeerInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.peerInfo.data = action.payload;
    }
    state.peerInfo.isFetching = false;
  });
  builder.addCase(getPeerInfoThunk.rejected, (state, action) => {
    state.peerInfo.isFetching = false;
  });
  // getSettings
  builder.addCase(getSettingsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.settings.data = action.payload;
    }
    state.settings.isFetching = false;
  });
  builder.addCase(getSettingsThunk.rejected, (state, action) => {
    state.settings.isFetching = false;
  });
  // getStatistics
  builder.addCase(getStatisticsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.statistics.data = action.payload;
    }
    state.statistics.isFetching = false;
  });
  builder.addCase(getStatisticsThunk.rejected, (state, action) => {
    state.statistics.isFetching = false;
  });
  // getTickets
  builder.addCase(getTicketsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.tickets.data = action.payload;
    }
    state.tickets.isFetching = false;
  });
  builder.addCase(getTicketsThunk.rejected, (state, action) => {
    state.tickets.isFetching = false;
  });
  // getTokenThunk
  builder.addCase(getTokenThunk.fulfilled, (state, action) => {
    if (action.payload) {
      const tokenExists = state.tokens.data?.findIndex((token) => token.id === action.payload?.id);

      if (tokenExists) {
        state.tokens.data[tokenExists] = action.payload;
      } else {
        state.tokens.data.push(action.payload);
      }
    }
    state.tokens.isFetching = false;
  });
  builder.addCase(getTokenThunk.rejected, (state, action) => {
    state.tokens.isFetching = false;
  });
  // getEntryNodes
  builder.addCase(getEntryNodesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.entryNodes.data = action.payload;
    }
    state.entryNodes.isFetching = false;
  });
  builder.addCase(getEntryNodesThunk.rejected, (state, action) => {
    state.entryNodes.isFetching = false;
  });
  // getVersion
  builder.addCase(getVersionThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.version.data = action.payload;
    }
    state.version.isFetching = false;
  });
  builder.addCase(getVersionThunk.rejected, (state, action) => {
    state.version.isFetching = false;
  });
  // getAlias
  builder.addCase(getAliasThunk.fulfilled, (state, action) => {
    if (action.payload) {
      if (state.aliases.data) {
        state.aliases.data[action.payload.alias] = action.payload.peerId;
      } else {
        state.aliases.data = { [action.payload.alias]: action.payload.peerId };
      }
    }
    state.aliases.isFetching = false;
  });
  builder.addCase(getAliasThunk.rejected, (state, action) => {
    state.aliases.isFetching = false;
  });
  // setAlias
  builder.addCase(setAliasThunk.fulfilled, (state, action) => {
    if (action.payload) {
      if (state.aliases.data) {
        state.aliases.data[action.payload.alias] = action.payload.peerId;
      } else {
        state.aliases.data = { [action.payload.alias]: action.payload.peerId };
      }
    }
    state.aliases.isFetching = false;
  });
  builder.addCase(setAliasThunk.rejected, (state, action) => {
    state.aliases.isFetching = false;
  });
  // removeAlias
  builder.addCase(removeAliasThunk.fulfilled, (state, action) => {
    if (action.payload && state.aliases.data) {
      if (state.aliases.data) {
        delete state.aliases.data[action.payload.alias];
      }
    }
    state.aliases.isFetching = false;
  });
  builder.addCase(removeAliasThunk.rejected, (state, action) => {
    state.aliases.isFetching = false;
  });
  // withdraw
  builder.addCase(withdrawThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.transactions.data.push(action.payload);
    }
    state.transactions.isFetching = false;
  });
  builder.addCase(withdrawThunk.rejected, (state, action) => {
    state.transactions.isFetching = false;
  });
  // getChannels
  builder.addCase(getChannelThunk.fulfilled, (state, action) => {
    if (action.payload) {
      const {
        balance,
        channelId,
        peerId,
        status,
        type,
      } = action.payload;
      // find channel if it already exists
      const channelIndex = state.channels.data?.[type].findIndex((channel) => channel.channelId === channelId);

      if (state.channels.data) {
        if (channelIndex) {
          // update channel
          state.channels.data[type][channelIndex] = {
            balance,
            channelId,
            peerId,
            status,
            type,
          };
        } else {
          // add new channel
          state.channels.data[type].push({
            balance,
            channelId,
            peerId,
            status,
            type,
          });
        }
      } else {
        state.channels.data = {
          incoming: [],
          outgoing: [],
          // overwrite actual type
          [type]: [
            {
              balance,
              channelId,
              peerId,
              status,
              type,
            },
          ],
        };
      }
    }
    state.channels.isFetching = false;
  });
  builder.addCase(getChannelThunk.rejected, (state, action) => {
    state.channels.isFetching = false;
  });
  // getChannelTickets
  builder.addCase(getChannelTicketsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      for (const updatedTicket of action.payload) {
        // using challenge as an id between tickets
        const uniqueIdentifier = updatedTicket.challenge;
        const existingIndex = state.tickets.data?.findIndex((ticket) => ticket.challenge === uniqueIdentifier);

        if (existingIndex && existingIndex !== -1 && state.tickets.data) {
          // Update the existing ticket with the new values
          state.tickets.data[existingIndex] = {
            ...state.tickets.data[existingIndex],
            ...updatedTicket,
          };
        } else if (state.tickets.data) {
          // Add the updated ticket as a new object
          state.tickets.data.push(updatedTicket);
        } else {
          // initialize tickets array
          state.tickets.data = [updatedTicket];
        }
      }
    }
    state.tickets.isFetching = false;
  });
  builder.addCase(getChannelTicketsThunk.rejected, (state, action) => {
    state.tickets.isFetching = false;
  });
  // sendMessage
  builder.addCase(sendMessageThunk.pending, (state, action) => {
    if (action.meta) {
      state.messagesSent.push({
        id: action.meta.requestId,
        body: action.meta.arg.body,
        createdAt: Date.now(),
        status: 'sending',
      });
    }
  });
  builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
    const index = state.messagesSent.findIndex((msg) => msg.id === action.meta.requestId);
    if (action.payload && index !== -1) {
      state.messagesSent[index].status = 'sent';
      state.messagesSent[index].challenge = action.payload.challenge;
      state.messagesSent[index].createdAt = Date.now();
    }
  });
  builder.addCase(sendMessageThunk.rejected, (state, action) => {
    console.log('rejected', action);
    const index = state.messagesSent.findIndex((msg) => msg.id === action.meta.requestId);
    if (index !== -1) {
      state.messagesSent[index].status = 'error';
      // prettier-ignore
      { /*   @ts-ignore */ }
      if (typeof action.payload.status === 'string') {
        // prettier-ignore
        { /* @ts-ignore */ }
        state.messagesSent[index].error = action.payload.status;
      }
    }
  });
  // signedMessages
  builder.addCase(signThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.signedMessages.push({
        body: action.payload,
        createdAt: Date.now(),
      });
    }
  });
  // pingNode
  builder.addCase(pingNodeThunk.fulfilled, (state, action) => {
    if (action.payload) {
      const pingExists = state.pings.findIndex((ping) => ping.peerId === action.payload?.peerId);

      if (pingExists) {
        state.pings[pingExists] = {
          latency: action.payload.latency,
          peerId: action.payload.peerId,
        };
      } else {
        state.pings.push({
          latency: action.payload.latency,
          peerId: action.payload.peerId,
        });
      }
    }
  });
  // deleteToken
  builder.addCase(deleteTokenThunk.fulfilled, (state, action) => {
    if (action.payload?.deleted) {
      state.tokens.data = state.tokens.data.filter((token) => token.id !== action.payload?.id);
    }
    state.tokens.isFetching = false;
  });
  builder.addCase(deleteTokenThunk.rejected, (state, action) => {
    state.tokens.isFetching = false;
  });
  // getPrometheusMetrics
  builder.addCase(getPrometheusMetricsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.metrics.data.raw = action.payload;
      state.metrics.data.parsed = parseMetrics(action.payload);
    }
    state.metrics.isFetching = false;
  });
  builder.addCase(getPrometheusMetricsThunk.rejected, (state, action) => {
    state.metrics.isFetching = false;
  });
};

export const actionsAsync = {
  getInfoThunk,
  getAddressesThunk,
  getAliasesThunk,
  getBalancesThunk,
  getChannelsThunk,
  getPeersThunk,
  getSettingsThunk,
  getStatisticsThunk,
  getTicketsThunk,
  getTokenThunk,
  getEntryNodesThunk,
  getVersionThunk,
  getAliasThunk,
  setAliasThunk,
  removeAliasThunk,
  withdrawThunk,
  closeChannelThunk,
  fundChannelsThunk,
  getChannelThunk,
  getChannelTicketsThunk,
  openChannelThunk,
  redeemChannelTicketsThunk,
  sendMessageThunk,
  signThunk,
  pingNodeThunk,
  setSettingThunk,
  redeemTicketsThunk,
  createTokenThunk,
  deleteTokenThunk,
  getPrometheusMetricsThunk,
};
