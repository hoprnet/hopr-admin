import { AccountResponseType, GetChannelsResponseType, GetInfoResponseType } from '@hoprnet/hopr-sdk';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';
import { nodeActionsAsync } from '../../store/slices/node';
import { ToastOptions, toast } from 'react-toastify';
import { nanoid } from '@reduxjs/toolkit';

const FETCH_CHANNELS_INTERVAL = 10000;
const FETCH_NODE_INTERVAL = 5000;

// previous states to compare new states with
let prevChannels: GetChannelsResponseType | null;
let prevNodeInfo: GetInfoResponseType | null;
let prevLoginData: {
  apiEndpoint: string;
  apiToken: string;
} | null;
let prevNodeFunds: AccountResponseType | null;
let prevLatestMessageTimestamp: {
  createdAt: number;
  amountOfTimesRepeated: number;
} | null;

const CloseButtonToast = (props: { notificationId: string }) => {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => {
        dispatch(appActions.readNotification(props.notificationId));
      }}
    >
      close
    </button>
  );
};

const Watcher = () => {
  const dispatch = useAppDispatch();
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((store) => store.auth.loginData);
  const { connected } = useAppSelector((store) => store.auth.status);
  const messages = useAppSelector((store) => store.node.messages);

  useEffect(() => {
    // reset state on every change of node
    if (prevLoginData?.apiEndpoint !== apiEndpoint || prevLoginData.apiToken !== apiToken) {
      resetPrevStates();
    }

    const watchChannelsInterval = setInterval(watchChannels, FETCH_CHANNELS_INTERVAL);
    const watchNodeInfoInterval = setInterval(watchNodeInfo, FETCH_NODE_INTERVAL);
    const watchNodeFundsInterval = setInterval(watchNodeFunds, FETCH_NODE_INTERVAL);

    return () => {
      clearInterval(watchChannelsInterval);
      clearInterval(watchNodeInfoInterval);
      clearInterval(watchNodeFundsInterval);
    };
  }, [apiEndpoint, apiToken, connected]);

  // check when redux receives new messages
  useEffect(() => {
    watchMessages();
  }, [messages]);

  const resetPrevStates = () => {
    prevChannels = null;
    prevLoginData = null;
    prevNodeFunds = null;
    prevLatestMessageTimestamp = null;
    if (apiEndpoint && apiToken) {
      prevLoginData = {
        apiEndpoint,
        apiToken,
      };
    }
  };

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
        closeButton: <CloseButtonToast notificationId={notificationId} />,
      });
    }

    dispatch(
      appActions.addNotification({
        ...notificationPayload,
        id: notificationId,
      }),
    );
  };

  const watchNodeFunds = async () => {
    if (apiToken && apiEndpoint && connected) {
      const newNodeFunds = await dispatch(
        nodeActionsAsync.getBalancesThunk({
          apiEndpoint,
          apiToken,
        }),
      ).unwrap();

      if (!newNodeFunds) return;

      //  check if native balance has increased
      if (prevNodeFunds && prevNodeFunds.native !== newNodeFunds.native) {
        const nativeBalanceIsMore = BigInt(prevNodeFunds.native) < BigInt(newNodeFunds.native);
        if (nativeBalanceIsMore) {
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: 'Node received native funds',
              url: null,
              timeout: null,
            },
            toastPayload: { message: 'Node received native funds' },
          });
        }
      }

      //  check if hopr balance has increased
      if (prevNodeFunds && prevNodeFunds.hopr !== newNodeFunds.hopr) {
        const hoprBalanceIsMore = BigInt(prevNodeFunds.hopr) < BigInt(newNodeFunds.hopr);

        if (hoprBalanceIsMore) {
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: 'Node received hopr funds',
              url: null,
              timeout: null,
            },
            toastPayload: { message: 'Node received hopr funds' },
          });
        }
      }

      prevNodeFunds = newNodeFunds;
    }
  };

  const watchNodeInfo = async () => {
    if (apiEndpoint && apiToken && connected) {
      const newNodeInfo = await dispatch(
        nodeActionsAsync.getInfoThunk({
          apiEndpoint,
          apiToken,
        }),
      ).unwrap();

      if (!newNodeInfo) return;

      //  check if status has changed
      if (prevNodeInfo && newNodeInfo.connectivityStatus !== prevNodeInfo.connectivityStatus) {
        sendNotification({
          notificationPayload: {
            name: `node connectivity status is now ${newNodeInfo?.connectivityStatus}`,
            source: 'node',
            url: null,
            timeout: null,
          },
          toastPayload: { message: `node connectivity status is now ${newNodeInfo?.connectivityStatus}` },
        });
      }

      prevNodeInfo = newNodeInfo;
    }
  };

  const watchChannels = async () => {
    if (apiEndpoint && apiToken && connected) {
      // fetch channels and update redux state
      const newChannels = await dispatch(
        nodeActionsAsync.getChannelsThunk({
          apiEndpoint,
          apiToken,
        }),
      ).unwrap();

      if (!newChannels) return;

      if (prevChannels) {
        // get channels that have been updated
        const updatedChannels = getUpdatedChannels(prevChannels, newChannels);
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
            toastPayload: { message: notificationText },
          });
        }
      }

      // update previous channels to newly fetched ones
      prevChannels = newChannels;
    }
  };

  const watchMessages = () => {
    const newMessageTimestamp = getLatestMessageTimestamp(messages);

    if (!newMessageTimestamp) return;

    const newMessageHasArrived = checkForNewMessage(prevLatestMessageTimestamp, newMessageTimestamp);

    if (prevLatestMessageTimestamp && newMessageHasArrived) {
      sendNotification({
        notificationPayload: {
          source: 'node/message',
          name: 'Received new message',
          url: null,
          timeout: null,
        },
        toastPayload: { message: 'new message' },
      });
    }

    prevLatestMessageTimestamp = newMessageTimestamp;
  };

  const calculateNotificationTextForChannelStatus = (updatedChannel: GetChannelsResponseType['incoming'][0]) => {
    if (updatedChannel.status === 'Closed') {
      return 'Channel is closed';
    }

    if (updatedChannel.status === 'Open') {
      return 'Channel is open';
    }

    if (updatedChannel.status === 'PendingToClose') {
      return 'Channel is closing';
    }

    if (updatedChannel.status === 'WaitingForCommitment') {
      return 'Channel is opening';
    }

    return 'Channel has updated status';
  };

  const getUpdatedChannels = (oldChannels: GetChannelsResponseType, newChannels: GetChannelsResponseType) => {
    // check if channels are exactly the same
    if (JSON.stringify(oldChannels) === JSON.stringify(newChannels)) {
      return;
    }

    const updatedChannels: GetChannelsResponseType['incoming'] = [];

    // join incoming and outgoing channels into one array
    const allOldChannels = oldChannels.incoming.concat(oldChannels.outgoing);
    const allNewChannels = newChannels.incoming.concat(newChannels.outgoing);

    // create map of channels to optimize lookup
    const oldChannelsMap = new Map(allOldChannels.map((channel) => [channel.channelId, channel]));
    const newChannelsMap = new Map(allNewChannels.map((channel) => [channel.channelId, channel]));

    // check for updates and new channels
    for (const newChannel of allNewChannels) {
      const tempOldChannel = oldChannelsMap.get(newChannel.channelId);

      // check if new channel is completely new
      // or differs in status
      if (!tempOldChannel || !isChannelStatusEqual(tempOldChannel, newChannel)) {
        updatedChannels.push(newChannel);
      }
    }

    // check for closed channels
    for (const oldChannel of allOldChannels ?? []) {
      const channelWasClosed = !newChannelsMap.has(oldChannel.channelId);
      if (channelWasClosed) {
        updatedChannels.push({
          ...oldChannel,
          status: 'Closed',
        });
      }
    }
    return updatedChannels;
  };

  /**
   * Checks if 2 channels have the same status
   */
  const isChannelStatusEqual = (
    oldChannel: GetChannelsResponseType['incoming'][0],
    newChannel: GetChannelsResponseType['incoming'][0],
  ) => {
    return oldChannel.status === newChannel.status;
  };

  const getLatestMessageTimestamp = (newMessages: { createdAt: number }[]): typeof prevLatestMessageTimestamp => {
    const sortedMessages = [...newMessages].sort((a, b) => b.createdAt - a.createdAt);
    const latestTimestamp = sortedMessages?.[0]?.createdAt ?? 0;
    const amountOfMessagesWithTimestamp = newMessages.filter((msg) => msg.createdAt === latestTimestamp)?.length;

    return {
      createdAt: latestTimestamp,
      amountOfTimesRepeated: amountOfMessagesWithTimestamp,
    };
  };

  const checkForNewMessage = (
    oldMessageTimestamp: {
      createdAt: number;
      amountOfTimesRepeated: number;
    } | null,
    newMessageTimestamp: { createdAt: number; amountOfTimesRepeated: number },
  ) => {
    if (!oldMessageTimestamp) return false;

    if (oldMessageTimestamp.createdAt < newMessageTimestamp.createdAt) {
      return true;
    }

    if (oldMessageTimestamp.createdAt === newMessageTimestamp.createdAt) {
      return oldMessageTimestamp.amountOfTimesRepeated < newMessageTimestamp.amountOfTimesRepeated;
    }

    return false;
  };

  return <></>;
};

export default Watcher;
