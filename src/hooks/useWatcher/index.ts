import { AccountResponseType, GetChannelsResponseType, GetInfoResponseType } from '@hoprnet/hopr-sdk';
import { nanoid } from '@reduxjs/toolkit';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { useEffect, useRef } from 'react';
import { ToastOptions, toast } from 'react-toastify';
import { useEthersSigner } from '..';
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';
import { nodeActionsAsync } from '../../store/slices/node';
import { safeActionsAsync } from '../../store/slices/safe';
import { calculateNotificationTextForChannelStatus, checkIfChannelsHaveChanged, getUpdatedChannels } from './channels';
import { balanceHasIncreased, handleBalanceNotification } from './info';
import { WatcherMessage, checkForNewMessage, getLatestMessage } from './messages';
import { checkIfNewTransaction, getLatestPendingSafeTransaction } from './safeTransactions';
import { useAccount } from 'wagmi';

type WatchDataFunction<T> = {
  fetcher: () => Promise<T | undefined | null>;
  disabled: boolean;
  initialState: T | null;
  isDataDifferent: (currentData: NonNullable<T>) => boolean;
  notificationHandler: (currentData: NonNullable<T>) => void;
  updatePreviousData?: (currentData: NonNullable<T>) => void;
};

/**
 * receives a promise
 */
const watchData = <T>({
  fetcher,
  disabled,
  isDataDifferent,
  notificationHandler,
  updatePreviousData,
  initialState,
}: WatchDataFunction<T>) => {
  const fetchAndCompareData = async () => {
    console.log('is this disabled', disabled);
    if (disabled) return;

    try {
      const currentData = await fetcher();
      if (!currentData) return;

      if (isDataDifferent(currentData)) {
        notificationHandler(currentData);
        updatePreviousData?.(currentData);
      }

      // only update if there is no previous state, w
      if (!initialState) {
        updatePreviousData?.(currentData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call right away
  return fetchAndCompareData();
};

export const useWatcher = ({
  watch = true,
  intervalDuration = 10000,
}: {
  intervalDuration?: number;
  watch?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((store) => store.auth.loginData);
  const messages = useAppSelector((store) => store.node.messages);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress);
  const signer = useEthersSigner();
  // redux previous states, this can be updated from anywhere in the app
  const prevChannels = useAppSelector((store) => store.app.previousStates.prevChannels);
  const prevMessage = useAppSelector((store) => store.app.previousStates.prevMessage);
  const prevNodeBalances = useAppSelector((store) => store.app.previousStates.prevNodeBalances);
  const prevNodeInfo = useAppSelector((store) => store.app.previousStates.prevNodeInfo);
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);
  // ref of previous states so the intervals can get the most recent info and not cause re renders
  const prevNodeBalancesRef = useRef(prevNodeBalances);
  const prevChannelsRef = useRef(prevChannels);
  const prevNodeInfoRef = useRef(prevNodeInfo);
  const prevPendingSafeTransactionRef = useRef(prevPendingSafeTransaction);

  // node watchers
  useEffect(() => {
    // reset state on log out
    if (!apiEndpoint || !apiToken) {
      dispatch(appActions.setPrevMessage(null));
      dispatch(appActions.setPrevChannels(null));
      dispatch(appActions.setPrevNodeBalances(null));
      dispatch(appActions.setPrevNodeInfo(null));
    }

    if (!watch) return;

    const watchChannelsInterval = setInterval(watchChannels, intervalDuration);
    const watchNodeInfoInterval = setInterval(watchNodeInfo, intervalDuration);
    const watchNodeFundsInterval = setInterval(watchNodeFunds, intervalDuration);

    return () => {
      clearInterval(watchChannelsInterval);
      clearInterval(watchNodeInfoInterval);
      clearInterval(watchNodeFundsInterval);
    };
  }, [apiEndpoint, apiToken, watch]);

  // safe watchers
  useEffect(() => {
    // reset state on log out
    if (!selectedSafeAddress || !signer) {
      dispatch(appActions.setPrevPendingSafeTransaction(null));
    }

    if (!watch) return;

    const watchPendingSafeTransactionsInterval = setInterval(watchPendingSafeTransactions, intervalDuration);

    return () => {
      clearInterval(watchPendingSafeTransactionsInterval);
    };
  }, [selectedSafeAddress, signer]);

  // check when redux receives new messages
  useEffect(() => {
    if (!watch) return;

    watchMessages();
  }, [messages]);

  const sendNotification = ({
    notificationPayload,
    toastPayload,
  }: {
    // notification payload without id
    notificationPayload: Omit<Parameters<typeof appActions.addNotification>[0], 'id'>;
    toastPayload?: { message: string; type?: ToastOptions['type'] };
  }) => {
    const notificationId = nanoid();
    if (toastPayload) {
      toast(toastPayload.message, {
        type: toastPayload.type,
        // when a user presses cancel button it is not considered as an interaction
        onClick: () => dispatch(appActions.interactedWithNotification(notificationId)),
      });
    }

    dispatch(
      appActions.addNotification({
        ...notificationPayload,
        id: notificationId,
      }),
    );
  };

  const watchNodeFunds = () =>
    watchData<AccountResponseType | null>({
      disabled: !apiToken || !apiEndpoint,
      initialState: prevNodeBalancesRef.current,
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
        !!prevNodeBalancesRef.current &&
        (balanceHasIncreased(prevNodeBalancesRef.current.native, newNodeFunds.native) ||
          balanceHasIncreased(prevNodeBalancesRef.current.hopr, prevNodeBalancesRef.current.hopr)),
      notificationHandler: (newNodeBalances) => {
        handleBalanceNotification({
          newNodeBalances,
          prevNodeBalances,
          sendNewHoprBalanceNotification: (hoprBalanceDifference) => {
            sendNotification({
              notificationPayload: {
                source: 'node',
                name: 'Node received hopr funds',
                url: null,
                timeout: null,
              },
              toastPayload: { message: `Node received ${hoprBalanceDifference} hopr funds` },
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
              toastPayload: { message: `Node received ${nativeBalanceDifference} native funds` },
            });
          },
        });
      },
      updatePreviousData: (newNodeBalances) => {
        dispatch(appActions.setPrevNodeBalances(newNodeBalances));
        prevNodeBalancesRef.current = newNodeBalances;
      },
    });

  const watchNodeInfo = () =>
    watchData<GetInfoResponseType | null>({
      disabled: !apiEndpoint || !apiToken,
      fetcher: async () => {
        if (!apiEndpoint || !apiToken) return;
        return dispatch(
          nodeActionsAsync.getInfoThunk({
            apiEndpoint,
            apiToken,
          }),
        ).unwrap();
      },
      initialState: prevNodeInfoRef.current,
      isDataDifferent: (newNodeInfo) =>
        !!prevNodeInfoRef.current && newNodeInfo.connectivityStatus !== prevNodeInfoRef.current.connectivityStatus,
      notificationHandler: (newNodeInfo) => {
        sendNotification({
          notificationPayload: {
            name: `node connectivity status is now ${newNodeInfo?.connectivityStatus}`,
            source: 'node',
            url: null,
            timeout: null,
          },
          toastPayload: { message: `node connectivity status updated from ${prevNodeInfoRef.current?.connectivityStatus} to ${newNodeInfo?.connectivityStatus}` },
        });
      },
      updatePreviousData: (newNodeInfo) => {
        dispatch(appActions.setPrevNodeInfo(newNodeInfo));
        prevNodeInfoRef.current = newNodeInfo;
      },
    });

  const watchChannels = () =>
    watchData<GetChannelsResponseType>({
      disabled: !apiEndpoint || !apiToken,
      initialState: prevChannelsRef.current,
      fetcher: async () => {
        if (!apiEndpoint || !apiToken) return;
        return dispatch(
          nodeActionsAsync.getChannelsThunk({
            apiEndpoint,
            apiToken,
          }),
        ).unwrap();
      },
      isDataDifferent: (newChannels) => checkIfChannelsHaveChanged(prevChannelsRef.current, newChannels),
      notificationHandler: (newChannels) => {
        const updatedChannels = getUpdatedChannels(prevChannelsRef.current, newChannels);
        for (const updatedChannel of updatedChannels ?? []) {
          // calculate the type of update: OPEN/CLOSE etc.
          const notificationText = calculateNotificationTextForChannelStatus(updatedChannel);
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: notificationText,
              url: null,
              timeout: null,
            },
            toastPayload: { message: `${updatedChannel.channelId}: ${notificationText}` },
          });
        }
      },
      updatePreviousData: (newChannels) => {
        dispatch(appActions.setPrevChannels(newChannels));
        prevChannelsRef.current = newChannels;
      },
    });

  const watchPendingSafeTransactions = () =>
    watchData<SafeMultisigTransactionResponse | null | undefined>({
      disabled: !selectedSafeAddress || !signer,
      initialState: prevPendingSafeTransactionRef.current,
      fetcher: async () => {
        if (!signer || !selectedSafeAddress) return;

        const pendingTransactions = await dispatch(
          safeActionsAsync.getPendingSafeTransactionsThunk({
            signer,
            safeAddress: selectedSafeAddress,
          }),
        ).unwrap();
        console.log({ pendingTransactions });
        return getLatestPendingSafeTransaction(pendingTransactions);
      },
      isDataDifferent: (newPendingSafeTransaction) => {
        console.log('trying to see if data is diff', prevPendingSafeTransactionRef.current, newPendingSafeTransaction);
        return checkIfNewTransaction(prevPendingSafeTransactionRef.current, newPendingSafeTransaction);
      },
      notificationHandler: (newData) => {
        sendNotification({
          notificationPayload: {
            name: `Pending transaction`,
            source: 'node',
            url: 'develop/safe/pending-transactions',
            timeout: null,
          },
          toastPayload: { message: `Pending transaction to ${newData?.to}` },
        });
      },
      updatePreviousData: (newPendingSafeTransaction) => {
        dispatch(appActions.setPrevPendingSafeTransaction(newPendingSafeTransaction));
        prevPendingSafeTransactionRef.current = newPendingSafeTransaction;
      },
    });

  const watchMessages = () =>
    watchData<WatcherMessage>({
      disabled: !getLatestMessage(messages),
      initialState: prevMessage,
      fetcher: async () => getLatestMessage(messages),
      isDataDifferent: (newData) => checkForNewMessage(prevMessage, newData),
      notificationHandler: (newData) => {
        sendNotification({
          notificationPayload: {
            source: 'node',
            name: 'Received new message',
            url: 'networking/messages',
            timeout: null,
          },
          toastPayload: { message: `received message: ${newData.message?.body}` },
        });
      },
      updatePreviousData: (newMessage) => {
        dispatch(appActions.setPrevMessage(newMessage));
      },
    });

  return {
    watchChannels,
    watchPendingSafeTransactions,
    watchNodeFunds,
    watchNodeInfo,
    watchMessages,
  };
};
