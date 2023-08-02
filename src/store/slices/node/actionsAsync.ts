import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
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
  api,
  utils
} from '@hoprnet/hopr-sdk';
import { parseMetrics } from '../../../utils/metrics';

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

const getInfoThunk = createAsyncThunk('node/getInfo', async (payload: BasePayloadType, { rejectWithValue }) => {
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
});

const getAddressesThunk = createAsyncThunk('node/getAccount', async (payload: BasePayloadType, { rejectWithValue }) => {
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

const getAliasesThunk = createAsyncThunk('node/getAliases', async (payload: BasePayloadType, { rejectWithValue }) => {
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
});

const getBalancesThunk = createAsyncThunk('node/getBalances', async (payload: BasePayloadType, { rejectWithValue }) => {
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

const getChannelsThunk = createAsyncThunk('node/getChannels', async (payload: BasePayloadType, { rejectWithValue }) => {
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

const getPeersThunk = createAsyncThunk('node/getPeers', async (payload: GetPeersPayloadType, { rejectWithValue }) => {
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
});

const getPeerInfoThunk = createAsyncThunk(
  'node/getPeerInfo',
  async (payload: GetPeerInfoPayloadType, { rejectWithValue }) => {
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
  },
);

const getSettingsThunk = createAsyncThunk('node/getSettings', async (payload: BasePayloadType, { rejectWithValue }) => {
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
});

const getStatisticsThunk = createAsyncThunk(
  'node/getStatistics',
  async (payload: BasePayloadType, { rejectWithValue }) => {
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
);

const getTicketsThunk = createAsyncThunk('node/getTickets', async (payload: BasePayloadType, { rejectWithValue }) => {
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
});

const getTokenThunk = createAsyncThunk('node/getToken', async (payload: BasePayloadType, { rejectWithValue }) => {
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
});

const getEntryNodesThunk = createAsyncThunk(
  'node/getEntryNodes',
  async (payload: BasePayloadType, { rejectWithValue }) => {
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
);

const getVersionThunk = createAsyncThunk('node/getVersion', async (payload: BasePayloadType, { rejectWithValue }) => {
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
});

const withdrawThunk = createAsyncThunk('node/withdraw', async (payload: WithdrawPayloadType, { rejectWithValue }) => {
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
});

const getAliasThunk = createAsyncThunk('node/getAlias', async (payload: AliasPayloadType, { rejectWithValue }) => {
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

const setAliasThunk = createAsyncThunk('node/setAlias', async (payload: SetAliasPayloadType, { rejectWithValue }) => {
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

const removeAliasThunk = createAsyncThunk(
  'node/removeAlias',
  async (payload: AliasPayloadType, { rejectWithValue }) => {
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

const getChannelThunk = createAsyncThunk(
  'node/getChannel',
  async (payload: GetChannelPayloadType, { rejectWithValue }) => {
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
);

const getChannelTicketsThunk = createAsyncThunk(
  'node/getChannelTickets',
  async (payload: PeerIdPayloadType, { rejectWithValue }) => {
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
);

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

const deleteTokenThunk = createAsyncThunk(
  'node/deleteToken',
  async (payload: DeleteTokenPayloadType, { rejectWithValue }) => {
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
);

const getPrometheusMetricsThunk = createAsyncThunk(
  'node/getPrometheusMetrics',
  async (payload: BasePayloadType, { rejectWithValue }) => {
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

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(getInfoThunk.pending, (state, action) => {
    state.info.isFetching = true;
  });
  builder.addCase(getInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.info.data = action.payload;
    }
    state.info.isFetching = false;
  });
  builder.addCase(getInfoThunk.rejected, (state, action) => {
    state.info.isFetching = false;
  });
  builder.addCase(getAddressesThunk.pending, (state, action) => {
    state.addresses.isFetching = true;
  });
  builder.addCase(getAddressesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.addresses.data = action.payload;
    }
    state.addresses.isFetching = false;
  });
  builder.addCase(getAddressesThunk.rejected, (state, action) => {
    state.addresses.isFetching = false;
  });
  builder.addCase(getAliasesThunk.pending, (state, action) => {
    state.aliases.isFetching = true;
  });
  builder.addCase(getAliasesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.aliases.data = action.payload;
    }
    state.aliases.isFetching = false;
  });
  builder.addCase(getAliasesThunk.rejected, (state, action) => {
    state.aliases.isFetching = false;
  });
  builder.addCase(getBalancesThunk.pending, (state, action) => {
    state.balances.isFetching = true;
  });
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
  builder.addCase(getChannelsThunk.pending, (state, action) => {
    state.channels.isFetching = true;
  });
  builder.addCase(getChannelsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.channels.data = action.payload;
    }
    state.channels.isFetching = false;
  });
  builder.addCase(getChannelsThunk.rejected, (state, action) => {
    state.channels.isFetching = false;
  });
  builder.addCase(getPeersThunk.pending, (state, action) => {
    state.peers.isFetching = true;
  });
  builder.addCase(getPeersThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.peers.data = action.payload;
    }
    state.peers.isFetching = false;
  });
  builder.addCase(getPeersThunk.rejected, (state, action) => {
    state.peers.isFetching = false;
  });
  builder.addCase(getPeerInfoThunk.pending, (state, action) => {
    state.peerInfo.isFetching = true;
  });
  builder.addCase(getPeerInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.peerInfo.data = action.payload;
    }
    state.peerInfo.isFetching = false;
  });
  builder.addCase(getPeerInfoThunk.rejected, (state, action) => {
    state.peerInfo.isFetching = false;
  });
  builder.addCase(getSettingsThunk.pending, (state, action) => {
    state.settings.isFetching = true;
  });
  builder.addCase(getSettingsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.settings.data = action.payload;
    }
    state.settings.isFetching = false;
  });
  builder.addCase(getSettingsThunk.rejected, (state, action) => {
    state.settings.isFetching = false;
  });
  builder.addCase(getStatisticsThunk.pending, (state, action) => {
    state.statistics.isFetching = true;
  });
  builder.addCase(getStatisticsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.statistics.data = action.payload;
    }
    state.statistics.isFetching = false;
  });
  builder.addCase(getStatisticsThunk.rejected, (state, action) => {
    state.statistics.isFetching = false;
  });
  builder.addCase(getTicketsThunk.pending, (state, action) => {
    state.tickets.isFetching = true;
  });
  builder.addCase(getTicketsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.tickets.data = action.payload;
    }
    state.tickets.isFetching = false;
  });
  builder.addCase(getTicketsThunk.rejected, (state, action) => {
    state.tickets.isFetching = false;
  });
  builder.addCase(getTokenThunk.pending, (state, action) => {
    state.tokens.isFetching = true;
  });
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
  builder.addCase(getEntryNodesThunk.pending, (state, action) => {
    state.entryNodes.isFetching = true;
  });
  builder.addCase(getEntryNodesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.entryNodes.data = action.payload;
    }
    state.entryNodes.isFetching = false;
  });
  builder.addCase(getEntryNodesThunk.rejected, (state, action) => {
    state.entryNodes.isFetching = false;
  });
  builder.addCase(getVersionThunk.pending, (state, action) => {
    state.version.isFetching = true;
  });
  builder.addCase(getVersionThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.version.data = action.payload;
    }
    state.version.isFetching = false;
  });
  builder.addCase(getVersionThunk.rejected, (state, action) => {
    state.version.isFetching = false;
  });
  builder.addCase(getAliasThunk.pending, (state, action) => {
    state.aliases.isFetching = true;
  });
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
  builder.addCase(setAliasThunk.fulfilled, (state, action) => {
    if (action.payload) {
      if (state.aliases.data) {
        state.aliases.data[action.payload.alias] = action.payload.peerId;
      } else {
        state.aliases.data = { [action.payload.alias]: action.payload.peerId };
      }
    }
  });
  builder.addCase(removeAliasThunk.fulfilled, (state, action) => {
    if (action.payload && state.aliases.data) {
      if (state.aliases.data) {
        delete state.aliases.data[action.payload.alias];
      }
    }
  });
  builder.addCase(withdrawThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.transactions.push(action.payload);
    }
  });
  builder.addCase(getChannelThunk.pending, (state, action) => {
    state.channels.isFetching = true;
  });
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
  builder.addCase(getChannelTicketsThunk.pending, (state, action) => {
    state.tickets.isFetching = true;
  });
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
  builder.addCase(signThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.signedMessages.push({
        body: action.payload,
        createdAt: Date.now(),
      });
    }
  });
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
  builder.addCase(deleteTokenThunk.pending, (state, action) => {
    state.tokens.isFetching = true;
  });
  builder.addCase(deleteTokenThunk.fulfilled, (state, action) => {
    if (action.payload?.deleted) {
      state.tokens.data = state.tokens.data.filter((token) => token.id !== action.payload?.id);
    }
    state.tokens.isFetching = false;
  });
  builder.addCase(deleteTokenThunk.rejected, (state, action) => {
    state.tokens.isFetching = false;
  });
  builder.addCase(getPrometheusMetricsThunk.pending, (state, action) => {
    state.metrics.isFetching = true;
  });
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
