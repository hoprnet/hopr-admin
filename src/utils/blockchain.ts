import { Address, encodeFunctionData, encodePacked, getAddress } from 'viem';
import { erc20ABI } from 'wagmi';
import { web3 } from '@hoprnet/hopr-sdk';

// Maximum possible value for uint256
export const MAX_UINT256 = BigInt(2 ** 256) - BigInt(1);

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
  return `0x${match[1].substring(2).toUpperCase()}…${match[2].toUpperCase()}`;
}

export const createSendTokensTransactionData = (recipient: Address, amount: bigint) => {
  const transferData = encodeFunctionData({
    abi: erc20ABI,
    functionName: 'transfer',
    args: [recipient, amount],
  });
  return transferData;
};
export const createSendNftTransactionData = (from: Address, to: Address, tokenId: number) => {
  const transferData = encodeFunctionData({
    abi: web3.hoprBoostNFTABI,
    functionName: 'safeTransferFrom',
    args: [from, to, tokenId],
  });
  return transferData;
};

export const createIncludeNodeTransactionData = (nodeAddress: string) => {
  const encodedPermissions: unknown = encodeDefaultPermissions(getAddress(nodeAddress));
  const includeNodeData = encodeFunctionData({
    abi: web3.hoprNodeManagementModuleABI,
    functionName: 'includeNode',
    args: [encodedPermissions as bigint],
  });

  return includeNodeData;
};

export const encodeDefaultPermissions = (nodeAddress: string) => {
  const encodedPermissions = encodePacked(
    [
      'address',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
      'uint8',
    ],
    [nodeAddress as Address, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  );

  return encodedPermissions;
};
