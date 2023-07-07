import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { ethers } from 'ethers';
import SafeApiKit, { AllTransactionsOptions } from '@safe-global/api-kit';
import Safe, { EthersAdapter, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import { SafeMultisigTransactionResponse, SafeTransaction, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'

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

  const safeFactory = await SafeFactory.create({ ethAdapter: adapter });

  return safeFactory;
};

const createSafeSDK = async (signer: ethers.providers.JsonRpcSigner, safeAddress: string) => {
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
  async (payload: { signer: ethers.providers.JsonRpcSigner }, { rejectWithValue }) => {
    try {
      const safeFactory = await createSafeFactory(payload.signer);
      const signerAddress = await payload.signer.getAddress();
      const safeAccountConfig: SafeAccountConfig = {
        owners: [signerAddress],
        threshold: 1,
      };
      const safeAccount = await safeFactory.deploySafe({ safeAccountConfig });
      const safeAddress = await safeAccount.getAddress();
      return safeAddress;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const createSafeWithConfigThunk = createAsyncThunk(
  'safe/createSafeWithConfig',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      config: SafeAccountConfig;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeFactory = await createSafeFactory(payload.signer);
      const safeAccount = await safeFactory.deploySafe({ safeAccountConfig: payload.config });
      const safeAddress = await safeAccount.getAddress();
      return safeAddress;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const getSafesByOwnerThunk = createAsyncThunk(
  'safe/getSafesByOwner',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const signerAddress = await payload.signer.getAddress();
      const safeAddresses = await safeApi.getSafesByOwner(signerAddress);
      return safeAddresses;
    } catch (e) {
      rejectWithValue(e);
    }
  },
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
    {
      rejectWithValue,
      dispatch,
    },
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
        }),
      );
      return addOwnerTx;
    } catch (e) {
      rejectWithValue(e);
    }
  },
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
    {
      rejectWithValue,
      dispatch,
    },
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
        }),
      );
      return removeOwnerTx;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const getSafeInfoThunk = createAsyncThunk(
  'safe/getSafeInfo',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const safeInfo = await safeApi.getSafeInfo(payload.safeAddress);
      return safeInfo;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const createSafeTransactionThunk = createAsyncThunk(
  'safe/createTransaction',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      safeTransactionData: SafeTransactionDataPartial;
    },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      const safeApi = await createSafeApiService(payload.signer);
      // create safe transaction
      const safeTransaction = await safeSDK.createTransaction({ safeTransactionData: payload.safeTransactionData });
      const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
      const senderSignature = await safeSDK.signTransactionHash(safeTxHash);
      const senderAddress = await payload.signer.getAddress();
      // propose safe transaction
      await safeApi.proposeTransaction({
        safeAddress: payload.safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: senderSignature.data,
      });
      // re fetch all txs
      dispatch(
        getPendingSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        }),
      );
      return safeTxHash;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const createSafeRejectionTransactionThunk = createAsyncThunk(
  'safe/rejectTransactionProposal',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      nonce: number;
    },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      const safeApi = await createSafeApiService(payload.signer);
      // create safe rejection transaction
      const rejectTransaction = await safeSDK.createRejectionTransaction(payload.nonce);
      const safeTxHash = await safeSDK.getTransactionHash(rejectTransaction);
      const senderSignature = await safeSDK.signTransactionHash(safeTxHash);
      const senderAddress = await payload.signer.getAddress();
      // propose safe transaction
      await safeApi.proposeTransaction({
        safeAddress: payload.safeAddress,
        safeTransactionData: rejectTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: senderSignature.data,
      });
      // re fetch all txs
      dispatch(
        getPendingSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        }),
      );
      return true;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const confirmTransactionThunk = createAsyncThunk(
  'safe/confirmTransactionProposal',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      safeTransactionHash: string;
    },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      const safeApi = await createSafeApiService(payload.signer);
      const signature = await safeSDK.signTransactionHash(payload.safeTransactionHash);
      const confirmTransaction = await safeApi.confirmTransaction(payload.safeTransactionHash, signature.data);
      // re fetch all txs
      dispatch(
        getPendingSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        }),
      );
      return confirmTransaction;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const executeTransactionThunk = createAsyncThunk(
  'safe/executeTransactionProposal',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      safeTransaction: SafeMultisigTransactionResponse | SafeTransaction;
    },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      await safeSDK.executeTransaction(payload.safeTransaction);
      // re fetch all txs
      dispatch(
        getPendingSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        }),
      );
      return true;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const getAllSafeTransactionsThunk = createAsyncThunk(
  'safe/getAllSafeTransactions',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      options?: AllTransactionsOptions;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const transactions = await safeApi.getAllTransactions(payload.safeAddress, payload.options);
      return transactions;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

const getPendingSafeTransactionsThunk = createAsyncThunk(
  'safe/getPendingSafeTransactions',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const transactions = await safeApi.getPendingTransactions(payload.safeAddress);
      return transactions;
    } catch (e) {
      rejectWithValue(e);
    }
  },
);

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(createSafeThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.selectedSafeAddress = action.payload;
      state.recentlyCreatedSafe = action.payload;
    }
  });
  builder.addCase(createSafeWithConfigThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.selectedSafeAddress = action.payload;
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
      state.selectedSafeAddress = action.payload.address;
      const existingSafe = state.safeInfos.findIndex((info) => info.address === action.payload?.address);
      // safe exists
      if (existingSafe !== -1) {
        state.safeInfos[existingSafe] = action.payload;
      } else {
        state.safeInfos.push(action.payload);
      }
    }
  });
  builder.addCase(getAllSafeTransactionsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.allTransactions = action.payload;
    }
  });
  builder.addCase(getPendingSafeTransactionsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.pendingTransactions = action.payload;
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
  getSafeInfoThunk,
  executeTransactionThunk,
  getPendingSafeTransactionsThunk,
};
