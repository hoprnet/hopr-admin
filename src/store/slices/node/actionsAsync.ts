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
} from 'hopr-sdk/api';
import { APIError } from 'hopr-sdk/utils';

const getInfoThunk = createAsyncThunk(
  'node/getInfo',
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const info = await getInfo({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const addresses = await getAddresses({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const aliases = await getAliases({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const balances = await getBalances({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const channels = await getChannels({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const peers = await getPeers({ url, apiKey });
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
  async (
    { url, apiKey, peerId }: { url: string; apiKey: string; peerId: string },
    { rejectWithValue }
  ) => {
    try {
      const peerInfo = await getPeerInfo({ url, apiKey, peerId });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const settings = await getSettings({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const statistics = await getStatistics({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const tickets = await getTickets({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const token = await getToken({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const entryNodes = await getEntryNodes({ url, apiKey });
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
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const version = await getVersion({ url, apiKey });
      return version;
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
};
