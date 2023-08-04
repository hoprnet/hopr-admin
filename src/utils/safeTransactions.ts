import { AllTransactionsListResponse, EthereumTxWithTransfersResponse, SafeModuleTransactionWithTransfersResponse, SafeMultisigTransactionWithTransfersResponse } from '@safe-global/api-kit'
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { Address, decodeFunctionData, formatEther, formatUnits } from 'viem';
import { erc20ABI, erc4626ABI, erc721ABI } from 'wagmi';
import safeABI from '../abi/safeAbi.json';
import { truncateEthereumAddress } from './blockchain';

export const getRequestOfPendingTransaction = (transaction: SafeMultisigTransactionResponse) => {
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
  }
  if (transaction.safe === transaction.to && !BigInt(transaction.value)) {
    // this should be a rejection tx if there is no value
    // and no call data and the destination is the same address
    return 'Rejection';
  } else {
    // unknown request
    ('-');
  }
};

export const getSourceOfPendingTransaction = (transaction: SafeMultisigTransactionResponse) => {
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

export const getSourceFromHistoryTransaction = (transaction: AllTransactionsListResponse['results']['0']) => {
  if (transaction.txType === 'ETHEREUM_TRANSACTION') {
    return getSourceFromHistoryEthereumTransaction(transaction);
  } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
    return getSourceFromHistoryMultisigTransaction(transaction);
  } else if (transaction.txType === 'MODULE_TRANSACTION') {
    return '-';
  }
};

export const getCurrencyFromHistoryTransaction = (transaction: AllTransactionsListResponse['results']['0']) => {
  if (transaction.txType === 'ETHEREUM_TRANSACTION') {
    return getCurrencyFromHistoryEthereumTransaction(transaction);
  } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
    return getCurrencyFromHistoryMultisigTransaction(transaction);
  } else if (transaction.txType === 'MODULE_TRANSACTION') {
    return getCurrencyFromHistoryModuleTransaction(transaction);
  }
};

export const getValueFromHistoryTransaction = (transaction: AllTransactionsListResponse['results']['0']) => {
  if (transaction.txType === 'ETHEREUM_TRANSACTION') {
    return getValueFromHistoryEthereumTransaction(transaction);
  } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
    return getValueFromHistoryMultisigTransaction(transaction);
  } else if (transaction.txType === 'MODULE_TRANSACTION') {
    return getValueFromHistoryModuleTransaction(transaction);
  }
};

export const getRequestFromHistoryTransaction = (transaction: AllTransactionsListResponse['results']['0']) => {
  if (transaction.txType === 'ETHEREUM_TRANSACTION') {
    return 'Received';
  } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
    return getRequestFromHistoryMultisigTransaction(transaction);
  } else if (transaction.txType === 'MODULE_TRANSACTION') {
    return transaction.module;
  }
};
