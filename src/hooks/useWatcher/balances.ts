import { AccountResponseType } from '@hoprnet/hopr-sdk';
import { useAppDispatch } from '../../store';
import { observeData } from './observeData';
import { nodeActionsAsync } from '../../store/slices/node';
import { sendNotification } from './notifications';
import { formatEther } from 'viem';

/**
 * Checks if the new balance is greater than the previous balance.
 *
 * @param prevBalance The previous balance as a string.
 * @param newBalance The new balance as a string.
 * @returns A boolean indicating whether the new balance is greater than the previous balance.
 */
export const balanceHasIncreased = (prevBalance: string, newBalance: string) =>
  BigInt(prevBalance) < BigInt(newBalance);

/**
 * Handles balance notifications.
 *
 * @param newNodeBalances The new node balances of type AccountResponseType.
 * @param prevNodeBalances The previous node balances of type AccountResponseType, or null.
 * @param sendNewNativeBalanceNotification A function that handles new native balance notifications.
 * @param sendNewHoprBalanceNotification A function that handles new HOPR balance notifications.
 */
export const handleBalanceNotification = ({
  newNodeBalances,
  prevNodeBalances,
  minimumNodeBalances,
  sendNewHoprBalanceNotification,
  sendNewNativeBalanceNotification,
  sendNativeBalanceTooLowNotification,
}: {
  prevNodeBalances: AccountResponseType | null;
  newNodeBalances: AccountResponseType;
  minimumNodeBalances: AccountResponseType;
  sendNewNativeBalanceNotification: (nativeBalanceDifference: bigint) => void;
  sendNewHoprBalanceNotification: (hoprBalanceDifference: bigint) => void;
  sendNativeBalanceTooLowNotification: (newNativeBalance: bigint) => void;
}) => {
  if (BigInt(newNodeBalances.native) < BigInt(minimumNodeBalances.native)) {
    return sendNativeBalanceTooLowNotification(BigInt(newNodeBalances.native));
  }

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

/**
 * Observes node balances and handles notifications when changes are detected.
 *
 * @param previousState The previous state of type AccountResponseType, or null.
 * @param apiToken The API token as a string, or null.
 * @param apiEndpoint The API endpoint as a string, or null.
 * @param updatePreviousData A function that updates the previous data with the current data.
 * @param dispatch The dispatch function returned by the useAppDispatch hook.
 */
export const observeNodeBalances = ({
  previousState,
  apiEndpoint,
  apiToken,
  minimumNodeBalances,
  updatePreviousData,
  dispatch,
}: {
  previousState: AccountResponseType | null;
  apiToken: string | null;
  apiEndpoint: string | null;
  minimumNodeBalances: AccountResponseType;
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
    isDataDifferent: (newNodeBalances) => JSON.stringify(previousState) !== JSON.stringify(newNodeBalances),
    notificationHandler: (newNodeBalances) => {
      handleBalanceNotification({
        newNodeBalances,
        prevNodeBalances: previousState,
        minimumNodeBalances,
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
        sendNativeBalanceTooLowNotification: (newNativeBalance) => {
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: 'Your xDai level is low, HOPRd node might stop working soon. Top up xDai',
              url: null,
              timeout: null,
            },
            toastPayload: { message: `Node xDai level is low, node has ${formatEther(
              BigInt(newNativeBalance),
            )} and should have ${formatEther(BigInt(minimumNodeBalances.native))}` },
            dispatch,
          });
        },
      });
    },
    updatePreviousData,
  });
