import { GetChannelsResponseType } from '@hoprnet/hopr-sdk';
import { observeData } from './observeData';
import { sendNotification } from './notifications';
import { useAppDispatch } from '../../store';
import { nodeActionsAsync } from '../../store/slices/node';

export const checkIfChannelsHaveChanged = (
  previousChannels: GetChannelsResponseType | null,
  newChannels: GetChannelsResponseType,
) => !!previousChannels && JSON.stringify(previousChannels) !== JSON.stringify(newChannels);

export const calculateNotificationTextForChannelStatus = (updatedChannel: GetChannelsResponseType['incoming'][0]) => {
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

export const getUpdatedChannels = (
  oldChannels: GetChannelsResponseType | null,
  newChannels: GetChannelsResponseType,
) => {
  // check if channels are exactly the same
  if (JSON.stringify(oldChannels) === JSON.stringify(newChannels)) {
    return [];
  }

  const updatedChannels: GetChannelsResponseType['incoming'] = [];

  // join incoming and outgoing channels into one array
  const allOldChannels = oldChannels?.incoming.concat(oldChannels.outgoing);
  const allNewChannels = newChannels.incoming.concat(newChannels.outgoing);

  // create map of channels to optimize lookup
  const oldChannelsMap = new Map(allOldChannels?.map((channel) => [channel.channelId, channel]));
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

export const observeChannels = ({
  previousState,
  apiEndpoint,
  apiToken,
  updatePreviousData,
  dispatch,
}: {
  previousState: GetChannelsResponseType | null;
  apiToken: string | null;
  apiEndpoint: string | null;
  updatePreviousData: (currentData: GetChannelsResponseType) => void;
  dispatch: ReturnType<typeof useAppDispatch>;
}) =>
  observeData<GetChannelsResponseType>({
    disabled: !apiEndpoint || !apiToken,
    previousData: previousState,
    fetcher: async () => {
      if (!apiEndpoint || !apiToken) return;
      return dispatch(
        nodeActionsAsync.getChannelsThunk({
          apiEndpoint,
          apiToken,
        }),
      ).unwrap();
    },
    isDataDifferent: (newChannels) => checkIfChannelsHaveChanged(previousState, newChannels),
    notificationHandler: (newChannels) => {
      const updatedChannels = getUpdatedChannels(previousState, newChannels);
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
          dispatch,
        });
      }
    },
    updatePreviousData,
  });
