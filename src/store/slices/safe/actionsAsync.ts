import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { ethers } from 'ethers';
import SafeApiKit, { AllTransactionsOptions } from '@safe-global/api-kit';
import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from '@safe-global/protocol-kit';
import {
  SafeTransaction,
  SafeTransactionData,
  SafeTransactionDataPartial,
} from '@safe-global/safe-core-sdk-types';

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

const createSafeSDK = async (
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
    { rejectWithValue, dispatch }
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      const addOwnerTx = safeSDK.createAddOwnerTx({
        ownerAddress: payload.ownerAddress,
        threshold: payload.threshold,
      });
      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        })
      );
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
    { rejectWithValue, dispatch }
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      const removeOwnerTx = safeSDK.createRemoveOwnerTx({
        ownerAddress: payload.ownerAddress,
        threshold: payload.threshold,
      });
      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        })
      );
      return removeOwnerTx;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const getSafeInfoThunk = createAsyncThunk(
  'safe/getSafeInfo',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const safeInfo = await safeApi.getSafeInfo(payload.safeAddress);
      return safeInfo;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const createSafeTransactionThunk = createAsyncThunk(
  'safe/createTransaction',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      safeTransactionData: SafeTransactionDataPartial;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      const tx = await safeSDK.createTransaction({
        safeTransactionData: payload.safeTransactionData,
      });
      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        })
      );
      return tx;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const createSafeRejectionTransactionThunk = createAsyncThunk(
  'safe/rejectTransactionProposal',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      nonce: number;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      const tx = safeSDK.createRejectionTransaction(payload.nonce);
      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        })
      );
      return tx;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const confirmTransactionThunk = createAsyncThunk(
  'safe/confirmTransactionProposal',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      safeTransactionHash: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const safeAccount = await createSafeSDK(
        payload.signer,
        payload.safeAddress
      );
      const safeApi = await createSafeApiService(payload.signer);
      const signature = await safeAccount.signTransactionHash(
        payload.safeTransactionHash
      );
      const confirmTransaction = await safeApi.confirmTransaction(
        payload.safeTransactionHash,
        signature.data
      );
      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        })
      );
      return confirmTransaction;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const getAllSafeTransactionsThunk = createAsyncThunk(
  'safe/getAllSafeTransactions',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      options?: AllTransactionsOptions;
    },
    { rejectWithValue }
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const transactions = await safeApi.getAllTransactions(
        payload.safeAddress,
        payload.options
      );
      return transactions;
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
  builder.addCase(getSafeInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safeInfos.push(action.payload);
    }
  });
};

export const actionsAsync = {
  createSafeThunk,
  createSafeWithConfigThunk,
  getSafesByOwnerThunk,
  addOwnerToSafeThunk,
  removeOwnerFromSafeThunk,
  getAllSafeTransactionsThunk,
  confirmTransactionThunk,
  createSafeRejectionTransactionThunk,
  createSafeTransactionThunk,
};
