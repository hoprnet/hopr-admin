import { Address, encodeFunctionData } from 'viem';
import { erc20ABI } from 'wagmi';

export const createApproveTransactionData = (spender: Address, value: bigint) => {
  const approveData = encodeFunctionData({
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender, value],
  });
  return approveData;
};

export const createSendTokensTransactionData = (recipient: Address, amount: bigint) => {
  const approveData = encodeFunctionData({
    abi: erc20ABI,
    functionName: 'transfer',
    args: [recipient, amount],
  });
  return approveData;
};

