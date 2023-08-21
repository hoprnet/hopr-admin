import {
  ActionReducerMapBuilder,
  AnyAction,
  ThunkDispatch,
  createAction,
  createAsyncThunk
} from '@reduxjs/toolkit'
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
  api,
  utils,
  OpenChannelResponseType,
  CreateTokenResponseType
} from '@hoprnet/hopr-sdk';
import { parseMetrics } from '../../../utils/metrics';
import { RootState } from '../..';
import { formatEther } from 'viem';

const { APIError } = utils;
const {
  closeChannel,
  createToken,
  deleteToken,
  // fundChannels,
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
  // getPeerInfo,
  getPeers,
  getSettings,
  getStatistics,
  getTickets,
  getToken,
  getVersion,
  openChannel,
  pingPeer,
  redeemChannelTickets,
  redeemTickets,
  removeAlias,
  sendMessage,
  setAlias,
  setSetting,
  // sign,
  withdraw,
} = api;

const getInfoThunk = createAsyncThunk<GetInfoResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getInfo',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.aliases.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getBalancesThunk = createAsyncThunk<
  { hopr: string; native: string } | undefined,
  BasePayloadType & { force?: boolean },
  { state: RootState; dispatch: ThunkDispatch<RootState, unknown, AnyAction> }
>(
  'node/getBalances',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
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

const getChannelsThunk = createAsyncThunk<
  GetChannelsResponseType | undefined,
  GetPeersPayloadType,
  { state: RootState }
>(
  'node/getChannels',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: GetPeersPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.peers.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

// const getPeerInfoThunk = createAsyncThunk<
//   GetPeerInfoResponseType | undefined,
//   GetPeerInfoPayloadType,
//   { state: RootState }
// >(
//   'node/getPeerInfo',
//   async (payload: GetPeerInfoPayloadType, {
//     rejectWithValue,
//     dispatch,
//   }) => {
//     dispatch(setPeerInfoFetching(true));
//     try {
//       const peerInfo = await getPeerInfo(payload);
//       return peerInfo;
//     } catch (e) {
//       if (e instanceof APIError) {
//         return rejectWithValue({
//           status: e.status,
//           error: e.error,
//         });
//       }
//     }
//   },
//   { condition: (_payload, { getState }) => {
//     const isFetching = getState().node.peerInfo.isFetching;
//     if (isFetching) {
//       return false;
//     }
//   } },
// );

const getSettingsThunk = createAsyncThunk<GetSettingsResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getSettings',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.tickets.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getTokenThunk = createAsyncThunk<GetTokenResponseType | undefined, BasePayloadType, { state: RootState }>(
  'node/getToken',
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.version.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const withdrawThunk = createAsyncThunk<string | undefined, WithdrawPayloadType, { state: RootState }>(
  'node/withdraw',
  async (payload: WithdrawPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: AliasPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: SetAliasPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: AliasPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: CloseChannelPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setCloseChannelFetching(true));
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

// const fundChannelsThunk = createAsyncThunk<
//   FundChannelsResponseType | undefined,
//   FundChannelsPayloadType,
//   { state: RootState }
// >(
//   'node/fundChannels',
//   async (payload: FundChannelsPayloadType, {
//     rejectWithValue,
//     dispatch,
//   }) => {
//     dispatch(setChannelsFetching(true));
//     try {
//       const res = await fundChannels(payload);
//       return res;
//     } catch (e) {
//       if (e instanceof APIError) {
//         return rejectWithValue({
//           status: e.status,
//           error: e.error,
//         });
//       }
//     }
//   },
//   { condition: (_payload, { getState }) => {
//     const isFetching = getState().node.channels.isFetching;
//     if (isFetching) {
//       return false;
//     }
//   } },
// );

const getChannelThunk = createAsyncThunk<
  GetChannelResponseType | undefined,
  GetChannelPayloadType,
  { state: RootState }
>(
  'node/getChannel',
  async (payload: GetChannelPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: GetChannelTicketsPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
>(
  'node/openChannel',
  async (payload: OpenChannelPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setChannelsFetching(true));
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.channels.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const redeemChannelTicketsThunk = createAsyncThunk<
  boolean | undefined,
  RedeemChannelTicketsPayloadType,
  { state: RootState }
>(
  'node/redeemChannelTickets',
  async (payload: RedeemChannelTicketsPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setRedeemTicketsFetching(true));
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
  async (payload: SetSettingPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setSettingsFetching(true));
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
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setRedeemTicketsFetching(true));
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
  async (payload: CreateTokenPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setTokensFetching(true));
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
  async (payload: DeleteTokenPayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  async (payload: BasePayloadType, {
    rejectWithValue,
    dispatch,
  }) => {
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
  { condition: (_payload, { getState }) => {
    const isFetching = getState().node.metrics.isFetching;
    if (isFetching) {
      return false;
    }
  } },
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
const setCloseChannelFetching = createAction<boolean>('node/setCloseChannelFetching');
const setRedeemTicketsFetching = createAction<boolean>('node/setRedeemTicketsFetching');

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
      state.balances.data = {
        native: {
          value: action.payload.native,
          formatted: formatEther(BigInt(action.payload.native)),
        },
        hopr: {
          value: action.payload.hopr,
          formatted: formatEther(BigInt(action.payload.hopr)),
        },
      };
      state.balances.isFetching = false;
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
  // builder.addCase(getPeerInfoThunk.fulfilled, (state, action) => {
  //   if (action.payload) {
  //     state.peerInfo.data = action.payload;
  //   }
  //   state.peerInfo.isFetching = false;
  // });
  // builder.addCase(getPeerInfoThunk.rejected, (state, action) => {
  //   state.peerInfo.isFetching = false;
  // });
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
  // setSettings
  builder.addCase(setSettingThunk.fulfilled, (state, action) => {
    state.settings.isFetching = false;
  });
  builder.addCase(setSettingThunk.rejected, (state, action) => {
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
  // redeemTicketsThunk
  builder.addCase(redeemTicketsThunk.fulfilled, (state, action) => {
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
  builder.addCase(getTokenThunk.rejected, (state, action) => {
    state.tokens.isFetching = false;
  });
  // createToken
  builder.addCase(createTokenThunk.fulfilled, (state, action) => {
    state.tokens.isFetching = false;
  });
  builder.addCase(createTokenThunk.rejected, (state, action) => {
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
        id,
        peerId,
        status,
        type,
      } = action.payload[0]; // FIXME: VERIFY THIS IS GOOD
      // find channel if it already exists
      const channelIndex = state.channels.data?.[type].findIndex((channel) => channel.id === id);

      if (state.channels.data) {
        if (channelIndex) {
          // update channel
          state.channels.data[type][channelIndex] = {
            balance,
            id,
            peerId,
            status,
            type,
          };
        } else {
          // add new channel
          state.channels.data[type].push({
            balance,
            id,
            peerId,
            status,
            type,
          });
        }
      } else {
        state.channels.data = {
          incoming: [],
          outgoing: [],
          all: [], // FIXME: Can this be empty if it doesnt have any data before? Should we not index the result of this?
          // overwrite actual type
          [type]: [
            {
              balance,
              id,
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
        const updatedTicketWithChannelId = {
          ...updatedTicket,
          channelId: action.meta.arg.channelId,
        };

        if (existingIndex && existingIndex !== -1 && state.tickets.data) {
          // Update the existing ticket with the new values
          state.tickets.data[existingIndex] = {
            ...state.tickets.data[existingIndex],
            ...updatedTicketWithChannelId,
          };
        } else if (state.tickets.data) {
          // Add the updated ticket as a new object
          state.tickets.data.push(updatedTicketWithChannelId);
        } else {
          // initialize tickets array
          state.tickets.data = [updatedTicketWithChannelId];
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
  // builder.addCase(signThunk.fulfilled, (state, action) => {
  //   if (action.payload) {
  //     state.signedMessages.push({
  //       body: action.payload,
  //       createdAt: Date.now(),
  //     });
  //   }
  // });
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
  // closeChannel
  builder.addCase(closeChannelThunk.fulfilled, (state, action) => {
    state.closeChannel.isFetching = false;
  });
  builder.addCase(closeChannelThunk.rejected, (state, action) => {
    state.closeChannel.isFetching = false;
  });
  // fundChannels
  // builder.addCase(fundChannelsThunk.fulfilled, (state, action) => {
  //   state.channels.isFetching = false;
  // });
  // builder.addCase(fundChannelsThunk.rejected, (state, action) => {
  //   state.channels.isFetching = false;
  // });
  // redeemChannelTickets
  builder.addCase(redeemChannelTicketsThunk.fulfilled, (state, action) => {
    state.redeemTickets.isFetching = false;
  });
  builder.addCase(redeemChannelTicketsThunk.rejected, (state, action) => {
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
  // getPeerInfoThunk,
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
  // fundChannelsThunk,
  getChannelThunk,
  getChannelTicketsThunk,
  openChannelThunk,
  redeemChannelTicketsThunk,
  sendMessageThunk,
  // signThunk,
  pingNodeThunk,
  setSettingThunk,
  redeemTicketsThunk,
  createTokenThunk,
  deleteTokenThunk,
  getPrometheusMetricsThunk,
};
