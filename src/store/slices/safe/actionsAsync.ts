import { ActionReducerMapBuilder, SerializedError, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { ethers } from 'ethers';
import SafeApiKit, {
  AddSafeDelegateProps,
  AllTransactionsOptions,
  DeleteSafeDelegateProps,
  GetSafeDelegateProps,
  OwnerResponse,
  SafeDelegateListResponse,
  SafeDelegateResponse,
  SafeInfoResponse,
  SafeMultisigTransactionListResponse,
  SignatureResponse
} from '@safe-global/api-kit';
import Safe, { EthersAdapter, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import { SafeMultisigTransactionResponse, SafeTransaction, SafeTransactionData, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { RootState } from '../..';
import { AllTransactionsListResponse } from '@safe-global/api-kit';

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
      return rejectWithValue(e);
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

      // The saltNonce is used to calculate a deterministic address for the new Safe contract.
      // This way, even if the same Safe configuration is used multiple times,
      // each deployment will result in a new, unique Safe contract.
      const saltNonce = Date.now().toString();

      const safeAccount = await safeFactory.deploySafe({
        safeAccountConfig: payload.config,
        saltNonce,
      });

      const safeAddress = await safeAccount.getAddress();
      return safeAddress;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

// FIXME: Start using the dispatch to update the isFetching to true from here on out
const getSafesByOwnerThunk = createAsyncThunk<
  OwnerResponse | undefined,
  { signer: ethers.providers.JsonRpcSigner },
  { state: RootState }
>(
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
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.safesByOwner.isFetching;
    console.log('safeByOwner isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling getSafeByOwner request');
      return false;
    }
  } },
);

const addOwnerToSafeThunk = createAsyncThunk<
  SafeTransactionData | undefined,
  {
    signer: ethers.providers.JsonRpcSigner;
    safeAddress: string;
    ownerAddress: string;
    threshold?: number;
  },
  { state: RootState }
>(
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
      const safeApi = await createSafeApiService(payload.signer);

      const addOwnerTx = await safeSDK.createAddOwnerTx({
        ownerAddress: payload.ownerAddress,
        threshold: payload.threshold,
      });
      const safeTxHash = await safeSDK.getTransactionHash(addOwnerTx);
      const signature = await safeSDK.signTypedData(addOwnerTx);
      const senderAddress = await payload.signer.getAddress();
      // propose safe transaction
      await safeApi.proposeTransaction({
        safeAddress: payload.safeAddress,
        safeTransactionData: addOwnerTx.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      });

      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        }),
      );
      return addOwnerTx.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.safesByOwner.isFetching;
    console.log('safeByOwner isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling getSafeByOwner request');
      return false;
    }
  } },
);

const removeOwnerFromSafeThunk = createAsyncThunk<
  SafeTransactionData | undefined,
  {
    signer: ethers.providers.JsonRpcSigner;
    safeAddress: string;
    ownerAddress: string;
    threshold?: number;
  },
  { state: RootState }
>(
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
      const safeApi = await createSafeApiService(payload.signer);

      const removeOwnerTx = await safeSDK.createRemoveOwnerTx({
        ownerAddress: payload.ownerAddress,
        threshold: payload.threshold,
      });
      const safeTxHash = await safeSDK.getTransactionHash(removeOwnerTx);
      const signature = await safeSDK.signTypedData(removeOwnerTx);
      const senderAddress = await payload.signer.getAddress();
      // propose safe transaction
      await safeApi.proposeTransaction({
        safeAddress: payload.safeAddress,
        safeTransactionData: removeOwnerTx.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      });
      // re fetch all txs
      dispatch(
        getAllSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        }),
      );
      return removeOwnerTx.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.safesByOwner.isFetching;
    console.log('safeByOwner isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling removeOwnerFromSafe request');
      return false;
    }
  } },
);

const updateSafeThresholdThunk = createAsyncThunk<
  SafeTransactionData | undefined,
  {
    signer: ethers.providers.JsonRpcSigner;
    safeAddress: string;
    newThreshold: number;
  },
  { state: RootState }
>(
  'safe/updateSafeThreshold',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      newThreshold: number;
    },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      const safeSDK = await createSafeSDK(payload.signer, payload.safeAddress);
      const safeApi = await createSafeApiService(payload.signer);
      // gets next nonce considering pending txs
      const nextSafeNonce = await safeApi.getNextNonce(payload.safeAddress);
      const changeThresholdTx = await safeSDK.createChangeThresholdTx(payload.newThreshold, { nonce: nextSafeNonce });
      const safeTxHash = await safeSDK.getTransactionHash(changeThresholdTx);
      const signature = await safeSDK.signTypedData(changeThresholdTx);
      const senderAddress = await payload.signer.getAddress();
      // propose safe transaction
      await safeApi.proposeTransaction({
        safeAddress: payload.safeAddress,
        safeTransactionData: changeThresholdTx.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      });
      // re fetch all txs
      dispatch(
        getPendingSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        }),
      );
      return changeThresholdTx.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.info.isFetching;
    console.log('info isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling updateSafeThershold request');
      return false;
    }
  } },
);

const getSafeInfoThunk = createAsyncThunk<
  SafeInfoResponse,
  {
    signer: ethers.providers.JsonRpcSigner;
    safeAddress: string;
  },
  { state: RootState }
>(
  'safe/getSafeInfo',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
    },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      dispatch(setInfoFetching(true));
      const safeApi = await createSafeApiService(payload.signer);
      const info = await safeApi.getSafeInfo(payload.safeAddress);
      return info;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.info.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const createSafeTransactionThunk = createAsyncThunk<
  string | undefined,
  { signer: ethers.providers.JsonRpcSigner; safeAddress: string; safeTransactionData: SafeTransactionDataPartial },
  { state: RootState }
>(
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
      // gets next nonce considering pending txs
      const nextSafeNonce = await safeApi.getNextNonce(payload.safeAddress);
      // create safe transaction
      const safeTransaction = await safeSDK.createTransaction({ safeTransactionData: {
        ...payload.safeTransactionData,
        nonce: nextSafeNonce,
      } });
      const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
      const signature = await safeSDK.signTypedData(safeTransaction);
      const senderAddress = await payload.signer.getAddress();
      // propose safe transaction
      await safeApi.proposeTransaction({
        safeAddress: payload.safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
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
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.safesByOwner.isFetching;
    console.log('safeByOwner isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling getSafeByOwner request');
      return false;
    }
  } },
);

const createSafeContractTransaction = createAsyncThunk<
  string | undefined,
  { signer: ethers.providers.JsonRpcSigner; safeAddress: string; smartContractAddress: string; data: string },
  { state: RootState }
>(
  'safe/createContractTransaction',
  async (
    payload: {
      signer: ethers.providers.JsonRpcSigner;
      safeAddress: string;
      smartContractAddress: string;
      data: string;
    },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      const {
        smartContractAddress,
        data,
        signer,
        safeAddress,
      } = payload;

      const safeTransactionData: SafeTransactionDataPartial = {
        to: smartContractAddress,
        data,
        value: '0',
      };
      const safeTxHash = await dispatch(
        createSafeTransactionThunk({
          signer,
          safeAddress: safeAddress,
          safeTransactionData,
        }),
      ).unwrap();

      return safeTxHash;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.allTransactions.isFetching;
    console.log('allTransactions isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling createSafeContractTransaction request');
      return false;
    }
  } },
);

const createSafeRejectionTransactionThunk = createAsyncThunk<
  boolean | undefined,
  { signer: ethers.providers.JsonRpcSigner; safeAddress: string; nonce: number },
  { state: RootState }
>(
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
      const signature = await safeSDK.signTypedData(rejectTransaction);
      const senderAddress = await payload.signer.getAddress();
      // propose safe transaction
      await safeApi.proposeTransaction({
        safeAddress: payload.safeAddress,
        safeTransactionData: rejectTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
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
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.pendingTransactions.isFetching;
    console.log('pendingTransactions isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling createSafeRejectTransaction request');
      return false;
    }
  } },
);

const confirmTransactionThunk = createAsyncThunk<
  SignatureResponse | undefined,
  { signer: ethers.providers.JsonRpcSigner; safeAddress: string; safeTransactionHash: string },
  { state: RootState }
>(
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
      // FIXME: This dispatch should be outside the asyncThunk
      dispatch(
        getPendingSafeTransactionsThunk({
          safeAddress: payload.safeAddress,
          signer: payload.signer,
        }),
      );
      return confirmTransaction;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.pendingTransactions.isFetching;
    console.log('pendingTransactions isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling confirmTransaction request');
      return false;
    }
  } },
);

const executeTransactionThunk = createAsyncThunk<
  boolean | undefined,
  {
    signer: ethers.providers.JsonRpcSigner;
    safeAddress: string;
    safeTransaction: SafeMultisigTransactionResponse | SafeTransaction;
  },
  { state: RootState }
>(
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
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.allTransactions.isFetching;
    console.log('allTransaction isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling executeTransaction request');
      return false;
    }
  } },
);

const getAllSafeTransactionsThunk = createAsyncThunk<
  AllTransactionsListResponse | undefined,
  {
    signer: ethers.providers.JsonRpcSigner;
    safeAddress: string;
    options?: AllTransactionsOptions;
  },
  { state: RootState }
>(
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
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.allTransactions.isFetching;
    console.log('allTransactions isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling getAllSafeTransactions request');
      return false;
    }
  } },
);

const getPendingSafeTransactionsThunk = createAsyncThunk<
  SafeMultisigTransactionListResponse,
  {
    signer: ethers.providers.JsonRpcSigner;
    safeAddress: string;
  },
  { state: RootState }
>(
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
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.pendingTransactions.isFetching;
    console.log('pendingTransactions isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling getPendingTransactions request');
      return false;
    }
  } },
);

const addSafeDelegateThunk = createAsyncThunk<
  SafeDelegateResponse | undefined,
  {
    options: Omit<AddSafeDelegateProps, 'signer'>;
    signer: ethers.providers.JsonRpcSigner;
  },
  { state: RootState }
>(
  'safe/addDelegate',
  async (
    payload: { options: Omit<AddSafeDelegateProps, 'signer'>; signer: ethers.providers.JsonRpcSigner },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const response = await safeApi.addSafeDelegate({
        ...payload.options,
        signer: payload.signer,
      });

      // update delegate list
      dispatch(
        getSafeDelegatesThunk({
          signer: payload.signer,
          options: { ...payload.options },
        }),
      );

      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.delegates.isFetching;
    console.log('delegates isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling addSafeDelegates request');
      return false;
    }
  } },
);

const removeSafeDelegateThunk = createAsyncThunk<
  void | undefined,
  { options: Omit<DeleteSafeDelegateProps, 'signer'>; signer: ethers.providers.JsonRpcSigner },
  { state: RootState }
>(
  'safe/removeDelegate',
  async (
    payload: { options: Omit<DeleteSafeDelegateProps, 'signer'>; signer: ethers.providers.JsonRpcSigner },
    {
      rejectWithValue,
      dispatch,
    },
  ) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const response = await safeApi.removeSafeDelegate({
        ...payload.options,
        signer: payload.signer,
      });

      // update delegate list
      dispatch(
        getSafeDelegatesThunk({
          signer: payload.signer,
          options: { ...payload.options },
        }),
      );

      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.delegates.isFetching;
    console.log('delegates isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling removeSafeDelegate request');
      return false;
    }
  } },
);

const getSafeDelegatesThunk = createAsyncThunk<
  SafeDelegateListResponse | undefined,
  { options: GetSafeDelegateProps; signer: ethers.providers.JsonRpcSigner },
  { state: RootState }
>(
  'safe/getDelegates',
  async (payload: { options: GetSafeDelegateProps; signer: ethers.providers.JsonRpcSigner }, { rejectWithValue }) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const response = await safeApi.getSafeDelegates(payload.options);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().safe.delegates.isFetching;
    console.log('delegates isFetching:', isFetching);
    if (isFetching) {
      console.log('Cancelling getSafeDelegates request');
      return false;
    }
  } },
);

// Helper actions to update the isFetching state
const setInfoFetching = createAction<boolean>('node/setSafeInfoFetching');
const setSelectedSafeFetching = createAction<boolean>('node/setSelectedSafeFetching');
const setSafeByOwnerFetching = createAction<boolean>('node/setSafeByOwnerFetching');
const setSafeTransactionsFetching = createAction<boolean>('node/setSafeTransactionsFetching');
const setSafePendingTransactionsFetching = createAction<boolean>('node/setSafePendingTransactionsFetching');
const setSafeDelegatesFetching = createAction<boolean>('node/setSafeDelegatesFetching');

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(createSafeThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.selectedSafeAddress.data = action.payload;
    }
    state.selectedSafeAddress.isFetching = false;
  });
  builder.addCase(createSafeWithConfigThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.selectedSafeAddress.data = action.payload;
    }
    state.selectedSafeAddress.isFetching = false;
  });
  builder.addCase(getSafesByOwnerThunk.pending, (state, action) => {
    state.safesByOwner.isFetching = true;
  });
  builder.addCase(getSafesByOwnerThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safesByOwner.data = action.payload.safes;
    }
    state.safesByOwner.isFetching = false;
  });
  builder.addCase(getSafesByOwnerThunk.rejected, (state, action) => {
    state.safesByOwner.isFetching = false;
  });

  builder.addCase(getSafeInfoThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.selectedSafeAddress.data = action.payload.address;
      state.info.data = action.payload;
    }
    state.selectedSafeAddress.isFetching = false;
  });
  builder.addCase(getSafeInfoThunk.rejected, (state, action) => {
    state.selectedSafeAddress.isFetching = false;
  });
  builder.addCase(getAllSafeTransactionsThunk.pending, (state, action) => {
    state.allTransactions.isFetching = true;
  });
  builder.addCase(getAllSafeTransactionsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.allTransactions.data = action.payload;
    }
    state.allTransactions.isFetching = false;
  });
  builder.addCase(getAllSafeTransactionsThunk.rejected, (state, action) => {
    state.allTransactions.isFetching = false;
  });
  builder.addCase(getPendingSafeTransactionsThunk.pending, (state, action) => {
    state.pendingTransactions.isFetching = true;
  });
  builder.addCase(getPendingSafeTransactionsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.pendingTransactions.data = action.payload;
    }
    state.pendingTransactions.isFetching = false;
  });
  builder.addCase(getPendingSafeTransactionsThunk.rejected, (state, action) => {
    state.pendingTransactions.isFetching = false;
  });
  builder.addCase(getSafeDelegatesThunk.pending, (state, action) => {
    state.delegates.isFetching = true;
  });
  builder.addCase(getSafeDelegatesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.delegates.data = action.payload;
    }
    state.delegates.isFetching = false;
  });
  builder.addCase(getSafeDelegatesThunk.rejected, (state, action) => {
    state.delegates.isFetching = false;
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
  addSafeDelegateThunk,
  removeSafeDelegateThunk,
  getSafeDelegatesThunk,
  updateSafeThresholdThunk,
  createSafeContractTransaction,
};
