import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { ethers } from 'ethers';
import SafeApiKit from '@safe-global/api-kit';
import {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from '@safe-global/protocol-kit';

const SERVICE_URL = 'https://safe-transaction-gnosis-chain.safe.global/';

const createSafeApiService = async (signer: ethers.providers.JsonRpcSigner) => {
  const adapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });
  const safeService = new SafeApiKit({
    txServiceUrl: SERVICE_URL,
    ethAdapter: adapter,
  });
  const safeFactory = await SafeFactory.create({
    ethAdapter: adapter,
  });

  return safeService;
};

const createSafeFactory = async (signer: ethers.providers.JsonRpcSigner) => {
  const adapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeFactory = await SafeFactory.create({
    ethAdapter: adapter,
  });

  return safeFactory;
};

const createSafeThunk = createAsyncThunk(
  'node/getInfo',
  async (
    payload: { signer: ethers.providers.JsonRpcSigner },
    { rejectWithValue }
  ) => {
    try {
      const safeFactory = await createSafeFactory(payload.signer);
      const signerAddress = await payload.signer.getAddress();
      const safeAccountConfig: SafeAccountConfig = {
        owners: [signerAddress],
        threshold: 1,
      };
      const safeAccount = await safeFactory.deploySafe({
        safeAccountConfig,
      });
      const safeAddress = await safeAccount.getAddress();
      return safeAddress;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const createSafeWithConfigThunk = createAsyncThunk(
  'node/getInfo',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      config: SafeAccountConfig;
    },
    { rejectWithValue }
  ) => {
    try {
      const safeFactory = await createSafeFactory(payload.signer);
      const safeAccount = await safeFactory.deploySafe({
        safeAccountConfig: payload.config,
      });
      const safeAddress = await safeAccount.getAddress();
      return safeAddress;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

export const createExtraReducers = (
  builder: ActionReducerMapBuilder<typeof initialState>
) => {
  builder.addCase(createSafeThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.connected = true;
      state.recentlyCreatedSafe = action.payload;
    }
  });
  builder.addCase(createSafeWithConfigThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.connected = true;
      state.recentlyCreatedSafe = action.payload;
    }
  });
};

export const actionsAsync = {
  createSafeThunk,
  createSafeWithConfigThunk,
};
