import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { ethers } from 'ethers';
import SafeApiKit, { AllTransactionsOptions } from '@safe-global/api-kit';
import Safe, { EthersAdapter, SafeAccountConfig, SafeFactory, EthersAdapterConfig } from '@safe-global/protocol-kit';
import { SafeMultisigTransactionResponse, SafeTransaction, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'

const SERVICE_URL = 'https://safe-transaction-gnosis-chain.safe.global/';

const createSafeApiService = async (signerOrProvider: EthersAdapterConfig['signerOrProvider']) => {
  const adapter = new EthersAdapter({
    ethers,
    signerOrProvider: signerOrProvider,
  });
  console.log({ adapter });
  const safeService = new SafeApiKit({
    txServiceUrl: SERVICE_URL,
    ethAdapter: adapter,
  });
  console.log({ safeService });
  return safeService;
};

const createSafeFactory = async (signerOrProvider: EthersAdapterConfig['signerOrProvider']) => {
  const adapter = new EthersAdapter({
    ethers,
    signerOrProvider: signerOrProvider,
  });
  console.log({ adapter });

  const safeFactory = await SafeFactory.create({ ethAdapter: adapter });
  console.log({ safeFactory });

  return safeFactory;
};

const createSafeSDK = async (signerOrProvider: EthersAdapterConfig['signerOrProvider'], safeAddress: string) => {
  const adapter = new EthersAdapter({
    ethers,
    signerOrProvider: signerOrProvider,
  });
  const safeAccount = await Safe.create({
    ethAdapter: adapter,
    safeAddress: safeAddress,
  });

  return safeAccount;
};

const createSafeThunk = createAsyncThunk(
  'safe/createSafe',
  async (
    payload: { signerOrProvider: EthersAdapterConfig['signerOrProvider']; signerAddress: string },
    { rejectWithValue },
  ) => {
    try {
      const safeFactory = await createSafeFactory(payload.signerOrProvider);

      const safeAccountConfig: SafeAccountConfig = {
        owners: [payload.signerAddress],
        threshold: 1,
      };
      console.log({ safeAccountConfig });
      const safeAccount = await safeFactory.deploySafe({ safeAccountConfig });
      const safeAddress = await safeAccount.getAddress();
      return safeAddress;
    } catch (e) {
      console.log(e);
      rejectWithValue(e);
    }
  },
);

const createSafeWithConfigThunk = createAsyncThunk(
  'safe/createSafeWithConfig',
  async (
    payload: {
      signerOrProvider: EthersAdapterConfig['signerOrProvider'];
      config: SafeAccountConfig;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeFactory = await createSafeFactory(payload.signerOrProvider);
      const safeAccount = await safeFactory.deploySafe({ safeAccountConfig: payload.config });
      const safeAddress = await safeAccount.getAddress();
      return safeAddress;
    } catch (e) {
      console.error(e);
      rejectWithValue(e);
    }
  },
);

const getSafesByOwnerThunk = createAsyncThunk(
  'safe/getSafesByOwner',
  async (
    payload: {
      signerOrProvider: EthersAdapterConfig['signerOrProvider'];
      ownerAddress: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signerOrProvider);
      const safeAddresses = await safeApi.getSafesByOwner(payload.ownerAddress);
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
      signerOrProvider: EthersAdapterConfig['signerOrProvider'];
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
      const safeSDK = await createSafeSDK(payload.signerOrProvider, payload.safeAddress);
      const addOwnerTx = safeSDK.createAddOwnerTx({
        ownerAddress: payload.ownerAddress,
        threshold: payload.threshold,
      });
      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signerOrProvider: payload.signerOrProvider,
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
      signerOrProvider: EthersAdapterConfig['signerOrProvider'];
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
      const safeSDK = await createSafeSDK(payload.signerOrProvider, payload.safeAddress);
      const removeOwnerTx = safeSDK.createRemoveOwnerTx({
        ownerAddress: payload.ownerAddress,
        threshold: payload.threshold,
      });
      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signerOrProvider: payload.signerOrProvider,
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
      signerOrProvider: EthersAdapterConfig['signerOrProvider'];
      safeAddress: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signerOrProvider);
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
      // create safe transaction
      const safeTransaction = await safeSDK.createTransaction({ safeTransactionData: payload.safeTransactionData });
      const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
      const senderSignature = await safeSDK.signTransactionHash(safeTxHash);
      const senderAddress = await payload.signer.getAddress();
      const safeApi = await createSafeApiService(payload.signer);
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
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signerOrProvider: payload.signer,
        }),
      );
      return true;
    } catch (e) {
      console.log(e);
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
      // create safe rejection transaction
      const safeTransaction = await safeSDK.createRejectionTransaction(payload.nonce);
      const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
      const senderSignature = await safeSDK.signTransactionHash(safeTxHash);
      const senderAddress = await payload.signer.getAddress();
      const safeApi = await createSafeApiService(payload.signer);
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
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signerOrProvider: payload.signer,
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
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signerOrProvider: payload.signer,
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
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signerOrProvider: payload.signer,
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
      signerOrProvider: EthersAdapterConfig['signerOrProvider'];
      safeAddress: string;
      options?: AllTransactionsOptions;
    },
    { rejectWithValue },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signerOrProvider);
      const transactions = await safeApi.getAllTransactions(payload.safeAddress, payload.options);
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
      state.safeTransactions = action.payload;
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
};
