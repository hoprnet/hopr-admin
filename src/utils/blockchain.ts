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

export function truncateEthereumAddress(address: string) {
  // Captures 0x + 4 characters, then the last 4 characters.
  if (!address) return;

  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}
