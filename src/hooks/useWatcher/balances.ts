import { AccountResponseType } from '@hoprnet/hopr-sdk';
import { useAppDispatch } from '../../store';
import { observeData } from './observeData';
import { nodeActionsAsync } from '../../store/slices/node';
import { sendNotification } from './notifications';
import { formatEther } from 'viem';

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

export const observeNodeBalances = ({
  previousState,
  apiEndpoint,
  apiToken,
  updatePreviousData,
  dispatch,
}: {
  previousState: AccountResponseType | null;
  apiToken: string | null;
  apiEndpoint: string | null;
  updatePreviousData: (currentData: AccountResponseType) => void;
  dispatch: ReturnType<typeof useAppDispatch>;
}) =>
  observeData<AccountResponseType | null>({
    disabled: !apiToken || !apiEndpoint,
    previousData: previousState,
    fetcher: async () => {
      if (!apiToken || !apiEndpoint) return;

      return await dispatch(
        nodeActionsAsync.getBalancesThunk({
          apiEndpoint,
          apiToken,
        }),
      ).unwrap();
    },
    isDataDifferent: (newNodeFunds) =>
      !!previousState &&
      (balanceHasIncreased(previousState.native, newNodeFunds.native) ||
        balanceHasIncreased(previousState.hopr, previousState.hopr)),
    notificationHandler: (newNodeBalances) => {
      handleBalanceNotification({
        newNodeBalances,
        prevNodeBalances: previousState,
        sendNewHoprBalanceNotification: (hoprBalanceDifference) => {
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: 'Node received hopr funds',
              url: null,
              timeout: null,
            },
            toastPayload: { message: `Node received ${formatEther(hoprBalanceDifference)} hopr funds` },
            dispatch,
          });
        },
        sendNewNativeBalanceNotification: (nativeBalanceDifference) => {
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: 'Node received native funds',
              url: null,
              timeout: null,
            },
            toastPayload: { message: `Node received ${formatEther(nativeBalanceDifference)} native funds` },
            dispatch,
          });
        },
      });
    },
    updatePreviousData,
  });
