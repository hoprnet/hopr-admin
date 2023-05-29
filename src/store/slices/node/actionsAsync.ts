import { createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import {
  getInfo,
  getAddresses,
  getAliases,
  getBalances,
  getChannels,
  getPeers,
  getPeerInfo,
  getSettings,
  getStatistics,
  getTickets,
  getToken,
  getEntryNodes,
  getVersion,
  getAlias,
  setAlias,
  removeAlias,
  withdraw,
} from 'hopr-sdk/api';
import { APIError } from 'hopr-sdk/utils';
import {
  AliasPayloadType,
  BasePayloadType,
  GetPeerInfoPayloadType,
  GetPeersPayloadType,
  SetAliasPayloadType,
  WithdrawPayloadType,
} from 'hopr-sdk/types';

const getInfoThunk = createAsyncThunk(
  'node/getInfo',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const info = await getInfo(payload);
      return info;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getAddressesThunk = createAsyncThunk(
  'node/getAccount',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const addresses = await getAddresses(payload);
      return addresses;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getAliasesThunk = createAsyncThunk(
  'node/getAliases',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const aliases = await getAliases(payload);
      return aliases;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getBalancesThunk = createAsyncThunk(
  'node/getBalances',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const balances = await getBalances(payload);
      return balances;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getChannelsThunk = createAsyncThunk(
  'node/getChannels',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const channels = await getChannels(payload);
      return channels;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getPeersThunk = createAsyncThunk(
  'node/getPeers',
  async (payload: GetPeersPayloadType, { rejectWithValue }) => {
    try {
      const peers = await getPeers(payload);
      return peers;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getPeerInfoThunk = createAsyncThunk(
  'node/getPeerInfo',
  async (payload: GetPeerInfoPayloadType, { rejectWithValue }) => {
    try {
      const peerInfo = await getPeerInfo(payload);
      return peerInfo;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getSettingsThunk = createAsyncThunk(
  'node/getSettings',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const settings = await getSettings(payload);
      return settings;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getStatisticsThunk = createAsyncThunk(
  'node/getStatistics',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const statistics = await getStatistics(payload);
      return statistics;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getTicketsThunk = createAsyncThunk(
  'node/getTickets',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const tickets = await getTickets(payload);
      return tickets;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getTokenThunk = createAsyncThunk(
  'node/getToken',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const token = await getToken(payload);
      return token;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getEntryNodesThunk = createAsyncThunk(
  'node/getEntryNodes',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const entryNodes = await getEntryNodes(payload);
      return entryNodes;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getVersionThunk = createAsyncThunk(
  'node/getVersion',
  async (payload: BasePayloadType, { rejectWithValue }) => {
    try {
      const version = await getVersion(payload);
      return version;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const withdrawThunk = createAsyncThunk(
  'node/withdraw',
  async (payload: WithdrawPayloadType, { rejectWithValue }) => {
    try {
      const res = await withdraw(payload);
      return res;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const getAliasThunk = createAsyncThunk(
  'node/getAlias',
  async (payload: AliasPayloadType, { rejectWithValue }) => {
    try {
      const res = await getAlias(payload);
      return { peerId: res, alias: payload.alias };
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const setAliasThunk = createAsyncThunk(
  'node/setAlias',
  async (payload: SetAliasPayloadType, { rejectWithValue }) => {
    try {
      const res = await setAlias(payload);
      if (res) {
        return { peerId: payload.peerId, alias: payload.alias };
      }
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

const removeAliasThunk = createAsyncThunk(
  'node/setAlias',
  async (payload: AliasPayloadType, { rejectWithValue }) => {
    try {
      const res = await removeAlias(payload);
      if (res) {
        return { alias: payload.alias };
      }
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

export const createExtraReducers = (
  builder: ActionReducerMapBuilder<typeof initialState>
) => {
  builder.addCase(getInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.info = action.payload;
    }
  });
  builder.addCase(getAddressesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.addresses = action.payload;
    }
  });
  builder.addCase(getAliasesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.aliases = action.payload;
    }
  });
  builder.addCase(getBalancesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.balances = action.payload;
    }
  });
  builder.addCase(getChannelsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.channels = action.payload;
    }
  });
  builder.addCase(getPeersThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.peers = action.payload;
    }
  });
  builder.addCase(getPeerInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.peerInfo = action.payload;
    }
  });
  builder.addCase(getSettingsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.settings = action.payload;
    }
  });
  builder.addCase(getStatisticsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.statistics = action.payload;
    }
  });
  builder.addCase(getTicketsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.tickets = action.payload;
    }
  });
  builder.addCase(getTokenThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.token = action.payload;
    }
  });
  builder.addCase(getEntryNodesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.entryNodes = action.payload;
    }
  });
  builder.addCase(getVersionThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.version = action.payload;
    }
  });
  builder.addCase(getAliasThunk.fulfilled, (state, action) => {
    if (action.payload && state.aliases) {
      if (state.aliases) {
        state.aliases[action.payload.alias] = action.payload.peerId;
      } else {
        state.aliases = { [action.payload.alias]: action.payload.peerId };
      }
    }
  });
  builder.addCase(setAliasThunk.fulfilled, (state, action) => {
    if (action.payload && state.aliases) {
      if (state.aliases) {
        state.aliases[action.payload.alias] = action.payload.peerId;
      } else {
        state.aliases = { [action.payload.alias]: action.payload.peerId };
      }
    }
  });
  builder.addCase(removeAliasThunk.fulfilled, (state, action) => {
    if (action.payload && state.aliases) {
      if (state.aliases) {
        delete state.aliases[action.payload.alias];
      }
    }
  });
  builder.addCase(withdrawThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.transactions.push(action.payload);
    }
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
};
