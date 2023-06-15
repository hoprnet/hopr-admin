import {
  AccountResponseType,
  GetChannelsResponseType,
  GetInfoResponseType,
} from '@hoprnet/hopr-sdk';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';
import { nodeActionsAsync } from '../../store/slices/node';
import { formatEther } from 'viem';

const FETCH_CHANNELS_INTERVAL = 10000;
const FETCH_NODE_INTERVAL = 5000;

const Watcher = () => {
  const dispatch = useAppDispatch();
  const { apiEndpoint, apiToken } = useAppSelector(
    (store) => store.auth.loginData
  );
  const { connected } = useAppSelector((store) => store.auth.status);
  const messages = useAppSelector((store) => store.node.messages);

  // previous states to compare new states with
  let prevChannels: GetChannelsResponseType | null;
  let prevNodeInfo: GetInfoResponseType | null;
  let prevLoginData: {
    apiEndpoint: string;
    apiToken: string;
  } | null;
  let prevNodeFunds: AccountResponseType | null;
  let prevMessages: {
    createdAt: number;
    seen: boolean;
    body: string;
    challenge?: string | undefined;
  }[] = [];
  // booleans to stop interval from running in parallel
  let watchChannelsIntervalIsRunning = false;
  let watchNodeFundsIntervalIsRunning = false;
  let watchNodeInfoIntervalIsRunning = false;

  useEffect(() => {
    // reset state on every change of node
    if (
      prevLoginData?.apiEndpoint !== apiEndpoint ||
      prevLoginData.apiToken !== apiToken
    ) {
      resetPrevStates();
    }

    const watchChannelsInterval = setInterval(
      watchChannels,
      FETCH_CHANNELS_INTERVAL
    );
    const watchNodeInfoInterval = setInterval(
      watchNodeInfo,
      FETCH_NODE_INTERVAL
    );
    const watchNodeFundsInterval = setInterval(
      watchNodeFunds,
      FETCH_NODE_INTERVAL
    );

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
    if (apiEndpoint && apiToken) {
      prevLoginData = { apiEndpoint, apiToken };
    }
  };

  const watchNodeFunds = async () => {
    if (
      apiToken &&
      apiEndpoint &&
      connected &&
      !watchNodeFundsIntervalIsRunning
    ) {
      watchNodeFundsIntervalIsRunning = true;
      const newNodeFunds = await dispatch(
        nodeActionsAsync.getBalancesThunk({ apiEndpoint, apiToken })
      ).unwrap();

      if (!newNodeFunds) return;

      //  check if native balance has increased
      if (prevNodeFunds && prevNodeFunds.native !== newNodeFunds.native) {
        const nativeBalanceIsMore =
          BigInt(prevNodeFunds.native) < BigInt(newNodeFunds.native);
        if (nativeBalanceIsMore) {
          dispatch(
            appActions.addNotification({
              source: 'node',
              name: 'Node received native funds',
              url: null,
              timeout: null,
            })
          );
        }
      }

      //  check if hopr balance has increased
      if (prevNodeFunds && prevNodeFunds.hopr !== newNodeFunds.hopr) {
        const hoprBalanceIsMore =
          BigInt(prevNodeFunds.hopr) < BigInt(newNodeFunds.hopr);

        if (hoprBalanceIsMore) {
          dispatch(
            appActions.addNotification({
              source: 'node',
              name: 'Node received hopr funds',
              url: null,
              timeout: null,
            })
          );
        }
      }

      prevNodeFunds = newNodeFunds;
      watchNodeFundsIntervalIsRunning = false;
    }
  };

  const watchNodeInfo = async () => {
    if (
      apiEndpoint &&
      apiToken &&
      connected &&
      !watchNodeInfoIntervalIsRunning
    ) {
      watchNodeInfoIntervalIsRunning = true;
      const newNodeInfo = await dispatch(
        nodeActionsAsync.getInfoThunk({ apiEndpoint, apiToken })
      ).unwrap();

      if (!newNodeInfo) return;

      //  check if status has changed
      if (
        prevNodeInfo &&
        newNodeInfo.connectivityStatus !== prevNodeInfo.connectivityStatus
      ) {
        dispatch(
          appActions.addNotification({
            timeout: null,
            url: null,
            name: `node connectivity status is now ${newNodeInfo?.connectivityStatus}`,
            source: 'node',
          })
        );
      }

      prevNodeInfo = newNodeInfo;
      watchNodeInfoIntervalIsRunning = false;
    }
  };

  const watchChannels = async () => {
    if (
      apiEndpoint &&
      apiToken &&
      connected &&
      !watchChannelsIntervalIsRunning
    ) {
      watchChannelsIntervalIsRunning = true;
      // fetch channels and update redux state
      const newChannels = await dispatch(
        nodeActionsAsync.getChannelsThunk({
          apiEndpoint,
          apiToken,
        })
      ).unwrap();

      if (!newChannels) return;

      if (prevChannels) {
        // get channels that have been updated
        const updatedChannels = getUpdatedChannels(prevChannels, newChannels);
        for (const updatedChannel of updatedChannels ?? []) {
          // calculate the type of update: OPEN/CLOSE etc.
          const notificationText =
            calculateNotificationTextForChannelStatus(updatedChannel);
          dispatch(
            appActions.addNotification({
              source: 'node',
              name: notificationText,
              timeout: null,
              url: null,
            })
          );
        }
      }

      // update previous channels to newly fetched ones
      prevChannels = newChannels;
      watchChannelsIntervalIsRunning = false;
    }
  };

  const watchMessages = () => {
    if (prevMessages && prevMessages.length < messages.length) {
      dispatch(
        appActions.addNotification({
          source: 'node',
          name: 'Received new message',
          timeout: null,
          url: null,
        })
      );
    }

    prevMessages = messages;
  };

  const calculateNotificationTextForChannelStatus = (
    updatedChannel: GetChannelsResponseType['incoming'][0]
  ) => {
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

  const getUpdatedChannels = (
    oldChannels: GetChannelsResponseType,
    newChannels: GetChannelsResponseType
  ) => {
    // check if channels are exactly the same
    if (JSON.stringify(oldChannels) === JSON.stringify(newChannels)) {
      return;
    }

    const updatedChannels: GetChannelsResponseType['incoming'] = [];

    // join incoming and outgoing channels into one array
    const allOldChannels = oldChannels.incoming.concat(oldChannels.outgoing);
    const allNewChannels = newChannels.incoming.concat(newChannels.outgoing);

    // create map of channels to optimize lookup
    const oldChannelsMap = new Map(
      allOldChannels.map((channel) => [channel.channelId, channel])
    );
    const newChannelsMap = new Map(
      allNewChannels.map((channel) => [channel.channelId, channel])
    );

    // check for updates and new channels
    for (const newChannel of allNewChannels) {
      const tempOldChannel = oldChannelsMap.get(newChannel.channelId);

      // check if new channel is completely new
      // or differs in status
      if (
        !tempOldChannel ||
        !isChannelStatusEqual(tempOldChannel, newChannel)
      ) {
        updatedChannels.push(newChannel);
      }
    }

    // check for deleted channels
    for (const oldChannel of allOldChannels ?? []) {
      const channelWasDeleted = !newChannelsMap.has(oldChannel.channelId);
      if (channelWasDeleted) {
        updatedChannels.push({ ...oldChannel, status: 'Closed' });
      }
    }
    return updatedChannels;
  };

  /**
   * Checks if 2 channels have the same status
   */
  const isChannelStatusEqual = (
    oldChannel: GetChannelsResponseType['incoming'][0],
    newChannel: GetChannelsResponseType['incoming'][0]
  ) => {
    return oldChannel.status === newChannel.status;
  };

  return <></>;
};

export default Watcher;
