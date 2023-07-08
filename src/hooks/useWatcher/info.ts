import { AccountResponseType } from '@hoprnet/hopr-sdk';

export const balanceHasIncreased = (prevBalance: string, newBalance: string) =>
  BigInt(prevBalance) < BigInt(newBalance);

export const handleBalanceNotification = ({
  newNodeBalances,
  prevNodeBalances,
  sendNewHoprBalanceNotification,
  sendNewNativeBalanceNotification,
}: {
  prevNodeBalances: AccountResponseType | null;
  newNodeBalances: AccountResponseType;
  sendNewNativeBalanceNotification: (nativeBalanceDifference: bigint) => void;
  sendNewHoprBalanceNotification: (hoprBalanceDifference: bigint) => void;
}) => {
  if (!prevNodeBalances) return;
  const nativeBalanceIsLarger = balanceHasIncreased(prevNodeBalances.native, newNodeBalances.native);
  if (nativeBalanceIsLarger) {
    const nativeBalanceDifference = BigInt(newNodeBalances.native) - BigInt(prevNodeBalances.native);
    sendNewNativeBalanceNotification(nativeBalanceDifference);
  }

  const hoprBalanceIsMore = balanceHasIncreased(prevNodeBalances.hopr, newNodeBalances.hopr);
  if (hoprBalanceIsMore) {
    const hoprBalanceDifference = BigInt(newNodeBalances.hopr) - BigInt(prevNodeBalances.hopr);
    sendNewHoprBalanceNotification(hoprBalanceDifference);
  }
};
