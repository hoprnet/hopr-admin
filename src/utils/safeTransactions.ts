import {
  AllTransactionsListResponse,
  EthereumTxWithTransfersResponse,
  SafeInfoResponse,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionWithTransfersResponse
} from '@safe-global/api-kit';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { Address, decodeFunctionData, formatEther, formatUnits } from 'viem';
import { erc20ABI, erc4626ABI, erc721ABI } from 'wagmi';
import { truncateEthereumAddress } from './blockchain';
import { web3 } from '@hoprnet/hopr-sdk';

/**
 * Pending transactions
 */

/** Human readable explanation of what the transaction is going to do */
export const getRequestOfPendingTransaction = (transaction: SafeMultisigTransactionResponse) => {
  if (transaction.data) {
    try {
      const decodedData = decodeFunctionData({
        data: transaction.data as Address,
        // could be any sc so not sure on the abi
        abi: [...erc20ABI, ...erc4626ABI, ...erc721ABI, ...web3.hoprSafeABI],
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

export const getUserActionForPendingTransaction = (
  transaction: SafeMultisigTransactionResponse,
  ownerAddress: string,
): 'EXECUTE' | 'SIGN' | null => {
  if (!ownerAddress) return null;
  const transactionHasEnoughSignatures = (transaction.confirmations?.length ?? 0) >= transaction.confirmationsRequired;

  if (transactionHasEnoughSignatures) {
    return 'EXECUTE';
  }

  console.log('getUserActionForPendingTransaction', transaction)

  const ownerHasSignedTransaction = transaction?.confirmations?.find(
    (confirmation) => confirmation.owner === ownerAddress,
  );

  if (ownerHasSignedTransaction) {
    // transaction does not have enough signatures and owner has already signed
    // can only wait for more signatures
    return null;
  }

  const oneSignaturePending = transaction.confirmationsRequired - (transaction.confirmations?.length ?? 0) === 1;

  if (oneSignaturePending) {
    return 'EXECUTE';
  }

  // more than 1 signature is pending and owner has not signed
  return 'SIGN';
};

export const getUserCanSkipProposal = (safeInfo: SafeInfoResponse | null) => {
  if (!safeInfo) {
    return false;
  }

  if (safeInfo.threshold === 1) {
    return true;
  }

  return false;
};

/**
 * Ethereum transactions
 */

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

/**
 * Module transactions
 */

const getValueFromHistoryModuleTransaction = (transaction: SafeModuleTransactionWithTransfersResponse) => {
  const units = transaction.transfers.at(0)?.tokenInfo.decimals ?? 18;
  const value = formatUnits(BigInt(transaction.transfers.at(0)?.value ?? 0), units);
  return value;
};

const getCurrencyFromHistoryModuleTransaction = (transaction: SafeModuleTransactionWithTransfersResponse) => {
  const currency = transaction.transfers.at(0)?.tokenInfo.symbol;
  return currency;
};

/**
 * Multisig transactions
 */

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
        abi: [...erc20ABI, ...erc4626ABI, ...erc721ABI, ...web3.hoprSafeABI],
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

/**
 * History transactions (MULTISIG/MODULE/ETHEREUM)
 */

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
