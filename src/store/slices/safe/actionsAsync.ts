import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import SafeApiKit, {
  AddSafeDelegateProps,
  AllTransactionsListResponse,
  AllTransactionsOptions,
  DeleteSafeDelegateProps,
  EthereumTxWithTransfersResponse,
  GetSafeDelegateProps,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionWithTransfersResponse
} from '@safe-global/api-kit';
import Safe, { EthersAdapter, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import { SafeMultisigTransactionResponse, SafeTransaction, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers';
import { Address, decodeFunctionData, formatEther, formatUnits } from 'viem';
import { erc20ABI, erc4626ABI, erc721ABI } from 'wagmi';
import safeABI from '../../../abi/safeAbi.json';
import { truncateEthereumAddress } from '../../../utils/helpers';
import { initialState } from './initialState';

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

const getRequestOfMultisigTransaction = (transaction: SafeMultisigTransactionResponse) => {
  if (transaction.data) {
    try {
      const decodedData = decodeFunctionData({
        data: transaction.data as Address,
        // could be any sc so not sure on the abi
        abi: [...erc20ABI, ...erc4626ABI, ...erc721ABI, ...safeABI],
      });
      return decodedData.functionName;
    } catch (e) {
      // if the function is not from an abi stated above
      // the data may not decode
      return 'Could not decode';
    }
  } else if (BigInt(transaction.value)) {
    return 'Sent';
  } else {
    // this should be a rejection tx if there is no value and no call data
    return 'Rejection';
  }
};

const getSourceOfMultisigTransaction = (transaction: SafeMultisigTransactionResponse) => {
  // if there are no signatures this is from a delegate
  if (!transaction.confirmations?.length) {
    return '-';
  }

  return truncateEthereumAddress(transaction.confirmations.at(0)?.owner ?? '');
};

const getValueFromHistoryEthereumTransaction = (transaction: EthereumTxWithTransfersResponse) => {
  if (!transaction.transfers.at(0)?.tokenAddress) {
    // native transfer
    return formatEther(BigInt(transaction.transfers.at(0)?.value ?? 0));
  }

  const units = transaction.transfers.at(0)?.tokenInfo?.decimals ?? 18;
  const value = formatUnits(BigInt(transaction.transfers.at(0)?.value ?? 0), units);
  return value;
};

const getCurrencyFromHistoryEthereumTransaction = (transaction: EthereumTxWithTransfersResponse) => {
  if (!transaction.transfers.at(0)?.tokenAddress) {
    // native transfer
    return 'xDai';
  }
  const currency = transaction.transfers.at(0)?.tokenInfo?.symbol;
  return currency;
};

const getSourceFromHistoryEthereumTransaction = (transaction: EthereumTxWithTransfersResponse) => {
  const source = transaction.from;
  return source;
};

const getValueFromHistoryModuleTransaction = (transaction: SafeModuleTransactionWithTransfersResponse) => {
  const units = transaction.transfers.at(0)?.tokenInfo.decimals ?? 18;
  const value = formatUnits(BigInt(transaction.transfers.at(0)?.value ?? 0), units);
  return value;
};

const getCurrencyFromHistoryModuleTransaction = (transaction: SafeModuleTransactionWithTransfersResponse) => {
  const currency = transaction.transfers.at(0)?.tokenInfo.symbol;
  return currency;
};

const getValueFromHistoryMultisigTransaction = (transaction: SafeMultisigTransactionWithTransfersResponse) => {
  const value = formatEther(BigInt(transaction.transfers.at(0)?.value ?? 0));
  return value;
};

const getCurrencyFromHistoryMultisigTransaction = (transaction: SafeMultisigTransactionWithTransfersResponse) => {
  if (!transaction.transfers.at(0)?.tokenAddress) {
    return 'xDai';
  }

  const currency = transaction.transfers.at(0)?.tokenInfo.symbol;
  return currency;
};

const getSourceFromHistoryMultisigTransaction = (transaction: SafeMultisigTransactionWithTransfersResponse) => {
  const source = transaction.confirmations?.at(0)?.owner;
  return source;
};

const getRequestFromHistoryMultisigTransaction = (transaction: SafeMultisigTransactionResponse) => {
  if (transaction.data) {
    try {
      const decodedData = decodeFunctionData({
        data: transaction.data as Address,
        // could be any sc so not sure on the abi
        abi: [...erc20ABI, ...erc4626ABI, ...erc721ABI, ...safeABI],
      });
      return decodedData.functionName;
    } catch (e) {
      // if the function is not from an abi stated above
      // the data may not decode
      return 'Could not decode';
    }
  } else if (BigInt(transaction.value)) {
    return 'Sent';
  } else {
    // if a multisig transaction has no data or value it is probably a rejection
    return 'Rejection';
  }
};

const getSourceFromHistoryTransaction = (transaction: AllTransactionsListResponse['results']['0']) => {
  if (transaction.txType === 'ETHEREUM_TRANSACTION') {
    return getSourceFromHistoryEthereumTransaction(transaction);
  } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
    return getSourceFromHistoryMultisigTransaction(transaction);
  } else if (transaction.txType === 'MODULE_TRANSACTION') {
    return '-';
  }
};

const getCurrencyFromHistoryTransaction = (transaction: AllTransactionsListResponse['results']['0']) => {
  if (transaction.txType === 'ETHEREUM_TRANSACTION') {
    return getCurrencyFromHistoryEthereumTransaction(transaction);
  } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
    return getCurrencyFromHistoryMultisigTransaction(transaction);
  } else if (transaction.txType === 'MODULE_TRANSACTION') {
    return getCurrencyFromHistoryModuleTransaction(transaction);
  }
};

const getValueFromHistoryTransaction = (transaction: AllTransactionsListResponse['results']['0']) => {
  if (transaction.txType === 'ETHEREUM_TRANSACTION') {
    return getValueFromHistoryEthereumTransaction(transaction);
  } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
    return getValueFromHistoryMultisigTransaction(transaction);
  } else if (transaction.txType === 'MODULE_TRANSACTION') {
    return getValueFromHistoryModuleTransaction(transaction);
  }
};

const getRequestFromHistoryTransaction = (transaction: AllTransactionsListResponse['results']['0']) => {
  if (transaction.txType === 'ETHEREUM_TRANSACTION') {
    return 'Received';
  } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
    return getRequestFromHistoryMultisigTransaction(transaction);
  } else if (transaction.txType === 'MODULE_TRANSACTION') {
    return transaction.module;
  }
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
      return rejectWithValue(e);
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
);

const updateSafeThresholdThunk = createAsyncThunk(
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
      const info = await safeApi.getSafeInfo(payload.safeAddress);
      return info;
    } catch (e) {
      return rejectWithValue(e);
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
);

const createSafeContractTransaction = createAsyncThunk(
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
      return rejectWithValue(e);
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
      return rejectWithValue(e);
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
      const transactions = await safeApi.getAllTransactions(payload.safeAddress, {
        ...payload.options,
        executed: true,
      });
      return transactions;
    } catch (e) {
      return rejectWithValue(e);
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
      return rejectWithValue(e);
    }
  },
);

const addSafeDelegateThunk = createAsyncThunk(
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
);

const removeSafeDelegateThunk = createAsyncThunk(
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
);

const getSafeDelegatesThunk = createAsyncThunk(
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
);

const getToken = createAsyncThunk(
  'safe/getToken',
  async (payload: { tokenAddress: string; signer: ethers.providers.JsonRpcSigner }, { rejectWithValue }) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const token = await safeApi.getToken(payload.tokenAddress);
      return token;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const getTokenList = createAsyncThunk(
  'safe/getTokenList',
  async (payload: { signer: ethers.providers.JsonRpcSigner }, { rejectWithValue }) => {
    try {
      const safeApi = await createSafeApiService(payload.signer);
      const tokenList = await safeApi.getTokenList();
      return tokenList;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(createSafeThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.selectedSafeAddress = action.payload;
    }
  });
  builder.addCase(createSafeWithConfigThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.selectedSafeAddress = action.payload;
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
      state.info = action.payload;
    }
  });
  builder.addCase(getAllSafeTransactionsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.allTransactions = {
        ...action.payload,
        results: action.payload.results.map((result) => ({
          ...result,
          source: getSourceFromHistoryTransaction(result) ?? '',
          request: getRequestFromHistoryTransaction(result) ?? '',
          currency: getCurrencyFromHistoryTransaction(result) ?? '',
          value: getValueFromHistoryTransaction(result) ?? '',
        })),
      };
    }
  });
  builder.addCase(getPendingSafeTransactionsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      // add business logic: source, request
      state.pendingTransactions = {
        ...action.payload,
        results: action.payload.results.map((result) => ({
          ...result,
          source: getSourceOfMultisigTransaction(result) ?? '',
          request: getRequestOfMultisigTransaction(result),
        })),
      };
    }
  });
  builder.addCase(getSafeDelegatesThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.delegates = action.payload;
    }
  });
  builder.addCase(getTokenList.fulfilled, (state, action) => {
    if (action.payload) {
      state.tokenList = action.payload;
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
  addSafeDelegateThunk,
  removeSafeDelegateThunk,
  getSafeDelegatesThunk,
  getToken,
  getTokenList,
  updateSafeThresholdThunk,
  createSafeContractTransaction,
};
