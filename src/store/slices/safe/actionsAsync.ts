import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { ethers } from 'ethers';
import SafeApiKit from '@safe-global/api-kit';
import Safe, {
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

const connectSignerToSafe = async (
  signer: ethers.providers.JsonRpcSigner,
  safeAddress: string
) => {
  const sdkAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeAccount = await Safe.create({
    ethAdapter: sdkAdapter,
    safeAddress: safeAddress,
  });

  return safeAccount;
};

const createSafeThunk = createAsyncThunk(
  'safe/createSafe',
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
  'safe/createSafeWithConfig',
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

const getSafesByOwnerThunk = createAsyncThunk(
  'safe/getSafesByOwner',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
    },
    { rejectWithValue }
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const signerAddress = await payload.signer.getAddress();
      const safeAddresses = await safeApi.getSafesByOwner(signerAddress);
      return safeAddresses;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const addOwnerToSafeThunk = createAsyncThunk(
  'safe/addOwnerToSafe',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      ownerAddress: string;
      threshold?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const connectedAccount = await connectSignerToSafe(
        payload.signer,
        payload.safeAddress
      );
      const addOwnerTx = connectedAccount.createAddOwnerTx({
        ownerAddress: payload.ownerAddress,
        threshold: payload.threshold,
      });

      return addOwnerTx;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const removeOwnerFromSafeThunk = createAsyncThunk(
  'safe/removeOwnerFromSafe',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      ownerAddress: string;
      threshold?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const connectedAccount = await connectSignerToSafe(
        payload.signer,
        payload.safeAddress
      );
      const removeOwnerTx = connectedAccount.createRemoveOwnerTx({
        ownerAddress: payload.ownerAddress,
        threshold: payload.threshold,
      });

      return removeOwnerTx;
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
  builder.addCase(getSafesByOwnerThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safesByOwner = action.payload.safes;
    }
  });
  builder.addCase(addOwnerToSafeThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safeTransactions.push(action.payload);
    }
  });
  builder.addCase(removeOwnerFromSafeThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safeTransactions.push(action.payload);
    }
  });
};

export const actionsAsync = {
  createSafeThunk,
  createSafeWithConfigThunk,
  getSafesByOwnerThunk,
  addOwnerToSafeThunk,
  removeOwnerFromSafeThunk,
};
