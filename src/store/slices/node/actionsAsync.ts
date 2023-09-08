import { ActionReducerMapBuilder, AnyAction, ThunkDispatch, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import {
  type AliasPayloadType,
  type BasePayloadType,
  type CloseChannelPayloadType,
  type CreateTokenPayloadType,
  type DeleteTokenPayloadType,
  type GetChannelPayloadType,
  type GetPeersPayloadType,
  type OpenChannelPayloadType,
  type PingPeerPayloadType,
  type SendMessagePayloadType,
  type SetAliasPayloadType,
  type SetSettingPayloadType,
  type GetChannelTicketsPayloadType,
  type WithdrawPayloadType,
  type RedeemChannelTicketsPayloadType,
  type GetPeerPayloadType,
  GetChannelResponseType,
  GetPeersResponseType,
  GetSettingsResponseType,
  GetAliasesResponseType,
  GetInfoResponseType,
  GetStatisticsResponseType,
  GetTicketsResponseType,
  GetTokenResponseType,
  GetEntryNodesResponseType,
  GetChannelTicketsResponseType,
  GetChannelsResponseType,
  flows,
  api,
  utils,
  OpenChannelResponseType,
  CreateTokenResponseType,
  GetPeerResponseType,
  GetBalancesResponseType
} from '@hoprnet/hopr-sdk';
import { parseMetrics } from '../../../utils/metrics';
import { RootState } from '../..';
import { formatEther } from 'viem';
import { nodeActionsFetching } from './actionsFetching';
const { APIError } = utils;
const {
  closeChannel,
  createToken,
  deleteToken,
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
  getPeers,
  getSettings,
  getStatistics,
  getTickets,
  getToken,
  getVersion,
  openChannel,
  pingPeer,
  getPeer, // old getPeerInfo
  redeemChannelTickets,
  redeemTickets,
  removeAlias,
  sendMessage,
  setAlias,
  setSetting,
  withdraw,
} = api;
const { openMultipleChannels } = flows;

const getInfoThunk = createAsyncThunk<GetInfoResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getInfo',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setInfoFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.info.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getAddressesThunk = createAsyncThunk<
  | {
      hopr: string;
      native: string;
    }
  | undefined,
  BasePayloadType & { force?: boolean },
  { state: RootState }
>(
  'node/getAccount',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setAddressesFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    if (_payload.force) {
      return true;
    }

    const isFetching = getState().node.addresses.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getAliasesThunk = createAsyncThunk<GetAliasesResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getAliases',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setAliasesFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.aliases.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getBalancesThunk = createAsyncThunk<
  GetBalancesResponseType | undefined,
  BasePayloadType & { force?: boolean },
  { state: RootState; dispatch: ThunkDispatch<RootState, unknown, AnyAction> }
>(
  'node/getBalances',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setBalancesFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    if (_payload.force) {
      return true;
    }

    const isFetching = getState().node.balances.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getChannelsThunk = createAsyncThunk<GetChannelsResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getChannels',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setChannelsFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.channels.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getPeersThunk = createAsyncThunk<GetPeersResponseType | undefined, GetPeersPayloadType, { state: RootState }>(
  'node/getPeers',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setPeersFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.peers.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getPeerInfoThunk = createAsyncThunk<GetPeerResponseType | undefined, GetPeerPayloadType, { state: RootState }>(
  'node/getPeerInfo',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setPeerInfoFetching(true));
    try {
      const peerInfo = await getPeer(payload);
      return peerInfo;
    } catch (e) {
      if (e instanceof APIError) {
        return rejectWithValue({
          status: e.status,
          error: e.error,
        });
      }
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.peerInfo.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getSettingsThunk = createAsyncThunk<GetSettingsResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getSettings',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setSettingsFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.settings.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getStatisticsThunk = createAsyncThunk<
  GetStatisticsResponseType | undefined,
  BasePayloadType,
  { state: RootState }
>(
  'node/getStatistics',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setStatisticsFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.statistics.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getTicketsThunk = createAsyncThunk<GetTicketsResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getTickets',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setTicketsFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.tickets.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getTokenThunk = createAsyncThunk<GetTokenResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getToken',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setTokensFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.tokens.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getEntryNodesThunk = createAsyncThunk<
  GetEntryNodesResponseType | undefined,
  BasePayloadType,
  { state: RootState }
>(
  'node/getEntryNodes',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setEntryNodesFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.entryNodes.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getVersionThunk = createAsyncThunk<string | undefined, BasePayloadType, { state: RootState }>(
  'node/getVersion',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setVersionFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.version.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const withdrawThunk = createAsyncThunk<string | undefined, WithdrawPayloadType, { state: RootState }>(
  'node/withdraw',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setTransactionsFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.transactions.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getAliasThunk = createAsyncThunk<
  | {
      peerId: string;
      alias: string;
    }
  | undefined,
  AliasPayloadType,
  { state: RootState }
>(
  'node/getAlias',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setAliasesFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.aliases.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const setAliasThunk = createAsyncThunk<
  { peerId: string; alias: string } | undefined,
  SetAliasPayloadType,
  { state: RootState }
>(
  'node/setAlias',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setAliasesFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.aliases.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const removeAliasThunk = createAsyncThunk<{ alias: string } | undefined, AliasPayloadType, { state: RootState }>(
  'node/removeAlias',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setAliasesFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.aliases.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const closeChannelThunk = createAsyncThunk<
  | {
      channelStatus: string;
      receipt?: string | undefined;
    }
  | undefined,
  CloseChannelPayloadType,
  { state: RootState }
>(
  'node/closeChannel',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setCloseChannelFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.closeChannel.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getChannelThunk = createAsyncThunk<
  GetChannelResponseType | undefined,
  GetChannelPayloadType,
  { state: RootState }
>(
  'node/getChannel',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setChannelsFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.channels.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getChannelTicketsThunk = createAsyncThunk<
  GetChannelTicketsResponseType | undefined,
  GetChannelTicketsPayloadType,
  { state: RootState }
>(
  'node/getChannelTickets',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setTicketsFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.tickets.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const openChannelThunk = createAsyncThunk<
  OpenChannelResponseType | undefined,
  OpenChannelPayloadType,
  { state: RootState }
>('node/openChannel', async (payload, { rejectWithValue }) => {
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
});

// will not be used for now, as it doesn't give good errors
const openMultipleChannelsThunk = createAsyncThunk(
  'node/openMultipleChannels',
  async (
    payload: {
      apiEndpoint: string;
      apiToken: string;
      peerIds: string[];
      amount: string;
      timeout?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await openMultipleChannels({
        apiEndpoint: payload.apiEndpoint,
        apiToken: payload.apiToken,
        timeout: payload.timeout,
        peerAddresses: payload.peerIds,
        amount: payload.amount,
      });
      if (typeof res === 'undefined')
        throw new APIError({
          status: '400',
          error: 'Node does not have enough balance to fund channels',
        });
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

const redeemChannelTicketsThunk = createAsyncThunk<
  boolean | undefined,
  RedeemChannelTicketsPayloadType,
  { state: RootState }
>(
  'node/redeemChannelTickets',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setRedeemTicketsFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.redeemTickets.isFetching;
    if (isFetching) {
      return false;
    }
  } },
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

//
// const signThunk = createAsyncThunk('node/sign', async (payload: SignPayloadType, { rejectWithValue }) => {
//   try {
//     const res = await sign(payload);
//     return res;
//   } catch (e) {
//     if (e instanceof APIError) {
//       return rejectWithValue({
//         status: e.status,
//         error: e.error,
//       });
//     }
//   }
// });

const pingNodeThunk = createAsyncThunk('node/pingNode', async (payload: PingPeerPayloadType, { rejectWithValue }) => {
  try {
    const res = await pingPeer(payload);
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

const setSettingThunk = createAsyncThunk<boolean | undefined, SetSettingPayloadType, { state: RootState }>(
  'node/setSetting',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setSettingsFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.settings.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const redeemTicketsThunk = createAsyncThunk<boolean | undefined, BasePayloadType, { state: RootState }>(
  'node/redeemTickets',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setRedeemTicketsFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.redeemTickets.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const createTokenThunk = createAsyncThunk<
  CreateTokenResponseType | undefined,
  CreateTokenPayloadType,
  { state: RootState }
>(
  'node/createToken',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setTokensFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.tokens.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const deleteTokenThunk = createAsyncThunk<
  { deleted: boolean; id: string } | undefined,
  DeleteTokenPayloadType,
  { state: RootState }
>(
  'node/deleteToken',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setTokensFetching(true));
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
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.tokens.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getPrometheusMetricsThunk = createAsyncThunk<string | undefined, BasePayloadType, { state: RootState }>(
  'node/getPrometheusMetrics',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(nodeActionsFetching.setMetricsFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.metrics.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

export const createAsyncReducer = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  // getInfo
  builder.addCase(getInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.info.data = action.payload;
    }
    state.info.isFetching = false;
  });
  builder.addCase(getInfoThunk.rejected, (state) => {
    state.info.isFetching = false;
  });
  // getAddresses
  builder.addCase(getAddressesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.addresses.data = action.payload;
    }
    state.addresses.isFetching = false;
  });
  builder.addCase(getAddressesThunk.rejected, (state) => {
    state.addresses.isFetching = false;
  });
  // getAliases
  builder.addCase(getAliasesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.aliases.data = action.payload;
    }
    state.aliases.isFetching = false;
  });
  builder.addCase(getAliasesThunk.rejected, (state) => {
    state.aliases.isFetching = false;
  });
  // getBalances
  builder.addCase(getBalancesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.balances.data = {
        native: {
          value: action.payload.native,
          formatted: formatEther(BigInt(action.payload.native)),
        },
        hopr: {
          value: action.payload.hopr,
          formatted: formatEther(BigInt(action.payload.hopr)),
        },
        safeHopr: {
          value: action.payload.safeHopr,
          formatted: formatEther(BigInt(action.payload.safeHopr)),
        },
        safeNative: {
          value: action.payload.safeNative,
          formatted: formatEther(BigInt(action.payload.safeNative)),
        },
      };
      state.balances.isFetching = false;
    }
  });
  builder.addCase(getBalancesThunk.rejected, (state) => {
    state.balances.isFetching = false;
  });
  // getChannels
  builder.addCase(getChannelsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.channels.data = action.payload;
    }
    state.channels.isFetching = false;
  });
  builder.addCase(getChannelsThunk.rejected, (state) => {
    state.channels.isFetching = false;
  });
  // getPeers
  builder.addCase(getPeersThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.peers.data = {
        announced: [],
        connected: [],
      };
      state.peers.data = action.payload;
    }
    state.peers.isFetching = false;
  });
  builder.addCase(getPeersThunk.rejected, (state) => {
    state.peers.isFetching = false;
  });
  // getPeer
  builder.addCase(getPeerInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.peerInfo.data = action.payload;
    }
    state.peerInfo.isFetching = false;
  });
  builder.addCase(getPeerInfoThunk.rejected, (state) => {
    state.peerInfo.isFetching = false;
  });
  // getSettings
  builder.addCase(getSettingsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.settings.data = action.payload;
    }
    state.settings.isFetching = false;
  });
  builder.addCase(getSettingsThunk.rejected, (state) => {
    state.settings.isFetching = false;
  });
  // setSettings
  builder.addCase(setSettingThunk.fulfilled, (state) => {
    state.settings.isFetching = false;
  });
  builder.addCase(setSettingThunk.rejected, (state) => {
    state.settings.isFetching = false;
  });
  // getStatistics
  builder.addCase(getStatisticsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.statistics.data = action.payload;
    }
    state.statistics.isFetching = false;
  });
  builder.addCase(getStatisticsThunk.rejected, (state) => {
    state.statistics.isFetching = false;
  });
  // getTickets
  builder.addCase(getTicketsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.tickets.data = action.payload;
    }
    state.tickets.isFetching = false;
  });
  builder.addCase(getTicketsThunk.rejected, (state) => {
    state.tickets.isFetching = false;
  });
  // redeemTicketsThunk
  builder.addCase(redeemTicketsThunk.fulfilled, (state) => {
    state.redeemTickets.isFetching = false;
    state.redeemTickets.error = undefined;
  });
  builder.addCase(redeemTicketsThunk.rejected, (state, action) => {
    state.redeemTickets.isFetching = false;
    // Assign the error to the errors state
    state.redeemTickets.error = (
      action.payload as {
        status: string | undefined;
        error: string | undefined;
      }
    ).error;
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
  builder.addCase(getTokenThunk.rejected, (state) => {
    state.tokens.isFetching = false;
  });
  // createToken
  builder.addCase(createTokenThunk.fulfilled, (state) => {
    state.tokens.isFetching = false;
  });
  builder.addCase(createTokenThunk.rejected, (state) => {
    state.tokens.isFetching = false;
  });
  // getEntryNodes
  builder.addCase(getEntryNodesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.entryNodes.data = action.payload;
    }
    state.entryNodes.isFetching = false;
  });
  builder.addCase(getEntryNodesThunk.rejected, (state) => {
    state.entryNodes.isFetching = false;
  });
  // getVersion
  builder.addCase(getVersionThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.version.data = action.payload;
    }
    state.version.isFetching = false;
  });
  builder.addCase(getVersionThunk.rejected, (state) => {
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
  builder.addCase(getAliasThunk.rejected, (state) => {
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
  builder.addCase(setAliasThunk.rejected, (state) => {
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
  builder.addCase(removeAliasThunk.rejected, (state) => {
    state.aliases.isFetching = false;
  });
  // withdraw
  builder.addCase(withdrawThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.transactions.data.push(action.payload);
    }
    state.transactions.isFetching = false;
  });
  builder.addCase(withdrawThunk.rejected, (state) => {
    state.transactions.isFetching = false;
  });
  // getChannels
  builder.addCase(getChannelThunk.fulfilled, (state, action) => {
    if (action.payload) {
      const {
        balance,
        channelId,
        destinationAddress,
        status,
        sourcePeerId,
      } = action.payload[0];

      const personalPeerId = state.addresses.data.hopr;

      // Check if it's incoming or outgoing depending on the local peer id and the source peer id of the channel
      const type = personalPeerId === sourcePeerId ? 'outgoing' : 'incoming';

      // find channel if it already exists
      const channelIndex = state.channels.data?.[type].findIndex((channel) => channel.id === channelId);

      if (state.channels.data) {
        if (channelIndex) {
          // update channel
          state.channels.data[type][channelIndex] = {
            balance,
            id: channelId,
            peerAddress: destinationAddress,
            status,
            type,
          };
        } else {
          // add new channel
          state.channels.data[type].push({
            balance,
            id: channelId,
            peerAddress: destinationAddress,
            status,
            type,
          });
        }
      } else {
        state.channels.data = {
          incoming: [],
          outgoing: [],
          all: [],
          // overwrite actual type
          [type]: [
            {
              balance,
              id: channelId,
              peerId: destinationAddress,
              status,
              type,
            },
          ],
        };
      }
    }
    state.channels.isFetching = false;
  });
  builder.addCase(getChannelThunk.rejected, (state) => {
    state.channels.isFetching = false;
  });
  // getChannelTickets
  builder.addCase(getChannelTicketsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      for (const updatedTicket of action.payload) {
        // using challenge as an id between tickets
        const uniqueIdentifier = updatedTicket.index;
        const existingIndex = state.tickets.data?.findIndex((ticket) => ticket.index === uniqueIdentifier);
  
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
  builder.addCase(getChannelTicketsThunk.rejected, (state) => {
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
    const index = state.messagesSent.findIndex((msg) => msg.id === action.meta.requestId);
    if (index !== -1) {
      state.messagesSent[index].status = 'error';
      // make sure it is not null
      if (!action.payload) return;
      // since action payload is unknown we have to check if it an object
      if (typeof action.payload !== 'object') return;
      // make sure status is part of payload
      if (!('status' in action.payload)) return;

      if (typeof action.payload.status === 'string') {
        state.messagesSent[index].error = action.payload.status;
      }
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
          reportedVersion: action.payload.reportedVersion,
        };
      } else {
        state.pings.push({
          latency: action.payload.latency,
          peerId: action.payload.peerId,
          reportedVersion: action.payload.reportedVersion,
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
  builder.addCase(deleteTokenThunk.rejected, (state) => {
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
  builder.addCase(getPrometheusMetricsThunk.rejected, (state) => {
    state.metrics.isFetching = false;
  });
  // closeChannel
  builder.addCase(closeChannelThunk.fulfilled, (state) => {
    state.closeChannel.isFetching = false;
  });
  builder.addCase(closeChannelThunk.rejected, (state) => {
    state.closeChannel.isFetching = false;
  });
  // redeemChannelTickets
  builder.addCase(redeemChannelTicketsThunk.fulfilled, (state) => {
    state.redeemTickets.isFetching = false;
  });
  builder.addCase(redeemChannelTicketsThunk.rejected, (state) => {
    state.redeemTickets.isFetching = false;
  });
};

export const actionsAsync = {
  getInfoThunk,
  getAddressesThunk,
  getAliasesThunk,
  getBalancesThunk,
  getChannelsThunk,
  getPeersThunk,
  getPeerInfoThunk,
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
  getChannelThunk,
  getChannelTicketsThunk,
  openChannelThunk,
  openMultipleChannelsThunk,
  redeemChannelTicketsThunk,
  sendMessageThunk,
  pingNodeThunk,
  setSettingThunk,
  redeemTicketsThunk,
  createTokenThunk,
  deleteTokenThunk,
  getPrometheusMetricsThunk,
};
